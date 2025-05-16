import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LazyLoadEvent } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { ActionPolicies, ModuleEnum, TokenStorageService } from 'src/app/services/token-storage.service';
import { Endpoints } from 'src/app/shared/enums/endpoints';
import * as fileSaver from 'file-saver';

@Component({
  selector: 'app-modal-simulacao',
  templateUrl: './modal-simulacao.component.html',
  styleUrls: ['./modal-simulacao.component.scss']
})
export class ModalSimulacaoComponent implements OnInit {
  public titulo: string = 'Simulação';
  public subTitulo: string = 'Simulação de Revisão de Preços';

  @Input() public nuContrato;
  @Input() public coContrato;
  @Output() atualizarPagina: EventEmitter<boolean> = new EventEmitter();

  permissions: ActionPolicies;
  loading: boolean = true;
  submitted = false;
  showData = false;
  listaSimulacao: any[] = [];
  selectedContratos: any[];
  public form: FormGroup;
  public dtIni;
  public dtFim;
  public percentSimulacao;

  filtroRegistros: any = {
    pageNumber: 1,
    pageSize: 1,
    Contrato: null,
    Fornecedor: null,
    Tipo: null,
    Gestor: null,
    Status: null,
  };

  constructor(
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    public token: TokenStorageService
  ) {
    this.obterPermissoes();
  }

  ngOnInit(): void {
    this.initForm();
  }

  obterPermissoes() {
    this.permissions = this.token.getActionPolicies(ModuleEnum.Contratos);
  }

  get f() {
    return this.form.controls;
  }

  initForm() {
    this.form = this.formBuilder.group({
      nuContrato: new FormControl(this.nuContrato, [Validators.required]),
      dtIni: new FormControl(this.dtIni, [Validators.required]),
      dtFim: new FormControl(this.dtFim, [Validators.required]),
      percentSimulacao: new FormControl(this.percentSimulacao, [Validators.required])
    });
  }

  loadPage(event: LazyLoadEvent) {
    const page = (event.first || 0) / (event.rows || this.filtroRegistros.pageSize) + 1;
    const pageSize = event.rows || this.filtroRegistros.pageSize;

    if (page !== this.filtroRegistros.pageNumber || pageSize !== this.filtroRegistros.pageSize) {
      this.filtroRegistros.pageNumber = page;
      this.filtroRegistros.pageSize = pageSize;
    }
  }

  public async onSubmit(): Promise<void> {
    this.Simular();
  }

  public async Simular(): Promise<void> {
    this.loading = true;
    this.showData = false;
    try {
      this.submitted = true;

      let dtIni = this.form.controls['dtIni'].value
      let dtFim = this.form.controls['dtFim'].value
      const d1 = this.convertToDate(dtIni.slice(0, 2) + '/' + dtIni.slice(2));
      const d2 = this.convertToDate(dtFim.slice(0, 2) + '/' + dtFim.slice(2));

      if (d1.toString() == 'Invalid Date' || d2.toString() == 'Invalid Date') {
        this.toastr.error('Informe datas válidas.', 'Erro');
        return;
      }
      if (d1 > d2) {
        this.toastr.error('A data de início deve ser inferior à data fim.', 'Erro');
        return;
      }

      if (this.form.invalid) {
        if (this.form.controls['dtIni'].value == null) {
          this.toastr.error('O campo Mês/Ano Inicial deve ser preenchido.', 'Erro');
          return;
        }

        if (this.form.controls['dtFim'].value == null) {
          this.toastr.error('O campo Mês/Ano Final deve ser preenchido.', 'Erro');
          return;
        }

        if (this.form.controls['percentSimulacao'].value == null) {
          this.toastr.error('O campo Percentual % deve ser preenchido.', 'Erro');
          return;
        }
        return;
      }

      if (this.form.controls['percentSimulacao'].value == 0) {
        this.toastr.error('O percentual deve ser maior que zero.', 'Erro');
        return;
      }

      //converte o campo percentual
      let percentualValue = this.form.controls['percentSimulacao'].value?.toString().replace(',', '.');
      let backendValue;

      if (percentualValue.length == 1) {
        backendValue = parseFloat(percentualValue);
      } else if (percentualValue.length == 2) {
        backendValue = parseFloat(percentualValue);
      } else if (percentualValue.length == 3) {
        backendValue = parseFloat(percentualValue) / 10;
      } else {
        backendValue = parseFloat(percentualValue) / 100;
      }
      this.form.controls['percentSimulacao'].setValue(backendValue);
      var result = await this.apiService.post<any>(
        `${Endpoints.URL_CONTRATOS}/simular-preco`,
        this.form.value
      );

      this.listaSimulacao = result.data;
      this.showData = true;

    } catch (error) {
      this.atualizarPagina.emit(false);
    } finally {
      this.loading = false;
    }
  }

  convertToDate(dateStr: string): Date {
    const [month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1);
  }

  exportExcel() {
    console.log(this.listaSimulacao)
    const totalDiferenca = this.listaSimulacao.reduce((sum, item) => sum + item.diferenca, 0);
    const dadosFiltrados = this.listaSimulacao.map(item => {
      return {
        'Mês/ Ano': item.dE_PERIODO,
        'Ateste': item.cO_NUMERO_ATESTE,
        'Data Pagamento': item.dT_PAGAMENTO_EFETIVO,
        'Valor Bruto Faturamento': item.vR_BRUTO,
        'Valor Executado': item.vR_PAGAMENTO,
        'Retenção': item.vR_RETENCAO,
        'Valor com Reajuste': item.vR_COM_REAJUSTE,
        'Diferença': item.diferenca,
      }
    });

    let dtIni = this.form.controls['dtIni'].value
    let dtFim = this.form.controls['dtFim'].value

    dadosFiltrados.push({
      'Mês/ Ano': `Total da Simulação da Revisão (${dtIni.slice(0, 2)  + '/' + dtIni.slice(2)} à ${dtFim.slice(0, 2) + '/' + dtFim.slice(2)} – ${this.form.controls['percentSimulacao'].value}%)`,
      'Ateste': null,
      'Data Pagamento': '',
      'Valor Bruto Faturamento': '',
      'Valor Executado': '',
      'Retenção': null,
      'Valor com Reajuste': '',
      'Diferença': totalDiferenca,
    });

    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(dadosFiltrados);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "Revisao");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    fileSaver.saveAs(data, fileName + '_' + this.coContrato.replace('/', '-') + '_' + this.getCurrentDateTimeFormatted() + EXCEL_EXTENSION);
    this.activeModal.dismiss();
  }

  getCurrentDateTimeFormatted(): string {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }

}
