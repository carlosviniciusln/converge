import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse } from 'src/app/models/generics/api-response';
import {
  Gcptb006Vigencia,
  Gcptb011Pagamento,
  Gcptb017VigenciaRubrica,
} from 'src/app/models/generics/contrato-response';
import { Orcamento } from 'src/app/models/generics/orcamento';
import { PagamentoTipo } from 'src/app/models/generics/pagamento-tipo';
import { ApiService } from 'src/app/shared/services/api.service';
import {
  ActionPolicies,
  ModuleEnum,
  TokenStorageService,
} from 'src/app/shared/services/token-storage.service';
import { Endpoints } from 'src/app/models/enums/endpoints';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-pagamento-cadastro',
  templateUrl: './pagamento-cadastro.component.html',
  styleUrls: ['./pagamento-cadastro.component.scss'],
})
export class PagamentoCadastroComponent implements OnInit {
  @Input() public nuContrato;
  @Input() public nuPagamento;
  @Input() public isConciliacao;
  @Output() atualizarPagina: EventEmitter<boolean> = new EventEmitter();

  permissions: ActionPolicies;
  loading: boolean = true;
  public form: FormGroup;
  public listaRubricas: Gcptb017VigenciaRubrica[] = [];
  public listaTipos: PagamentoTipo[] = [];
  public listaOrcamentos: Orcamento[] = [];
  public listaVigencias: Gcptb006Vigencia[] = [];

  public pagamento: Gcptb011Pagamento;

  public titulo: string = 'Cadastro';
  public subTitulo: string = 'Cadastro de pagamento';

  submitted = false;

  checked1: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    public token: TokenStorageService
  ) {
    this.obterPermissoes();
  }

  obterPermissoes() {
    this.permissions = this.token.getActionPolicies(ModuleEnum.Contratos);
  }

  ngOnInit(): void {
    this.obterTiposPagamentos();
    this.obterOrcamentos();
    this.obterVigencias();

    if (this.nuPagamento) {
      this.form = this.formBuilder.group({
        dePeriodo: new FormControl('', [Validators.required]),
        coNumeroAteste: new FormControl(''),
        nuPagamento: [this.nuPagamento],
        nuPagamentoTipo: [{ value: '' }],
        nuContrato: [{ value: '' }],
        nuVigencia: [{ value: '' }],
        nuVigenciaRubrica: [{ value: '' }],
        nuOrcamento: [{ value: '' }],
        vrCredito: [{ value: 0 }],
        vrGlosa: [{ value: 0 }],
        vrMulta: [{ value: 0 }],
        vrExecutado: [{ value: '' }],
        dtFaturamento: [{ value: '' }],
        dtNotaFiscal: [{ value: '' }],
        dtPagamento: [{ value: '' }],
        dtPagamentoEfetivo: [{ value: '' }],
        qtdItens: [{ value: '' }],
        qtdTradeIn: [{ value: '' }],
        nuSap: [{ value: '' }],
        qtTotalSolicitado: [{ value: '' }],
      });
      this.obterPagamento();
    } else {
      this.form = this.formBuilder.group({
        nuPagamento: [0],
        nuPagamentoTipo: ['', [Validators.required]],
        nuContrato: [this.nuContrato, [Validators.required]],
        nuVigencia: ['', [Validators.required]],
        nuVigenciaRubrica: ['', [Validators.required]],
        nuOrcamento: new FormControl('', [Validators.required]),
        dePeriodo: new FormControl('', [Validators.required]),
        coNumeroAteste: new FormControl(''),
        vrCredito: new FormControl(0, [Validators.required]),
        vrGlosa: new FormControl(0, [Validators.required]),
        vrMulta: new FormControl(0, [Validators.required]),
        vrExecutado: new FormControl('', [Validators.required]),
        dtFaturamento: new FormControl(''),
        dtNotaFiscal: new FormControl(''),
        dtPagamento: new FormControl(''),
        dtPagamentoEfetivo: new FormControl(''),
        qtdItens: new FormControl(''),
        qtdTradeIn: new FormControl(''),
        nuSap: new FormControl('', [Validators.required]),
        qtTotalSolicitado: new FormControl(''),
      });
    }
    this.loading = false;
  }

  get f() {
    return this.form.controls;
  }

  public async obterTiposPagamentos(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<PagamentoTipo[]>>(
        `${Endpoints.URL_PAGAMENTO}/tipos`
      );
      this.listaTipos = response.data;
    } catch (error) {
      console.error(error, 'obterTiposPagamentos')
    }
  }

  public async obterOrcamentos(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<Orcamento[]>>(
        `${Endpoints.URL_PAGAMENTO}/orcamentos`
      );

      this.listaOrcamentos = response.data;
    } catch (error) {
      console.error(error, 'obterOrcamentos')
    }
  }

  public async obterVigencias(): Promise<void> {
    try {
      const response = await this.apiService.get<
        ApiResponse<Gcptb006Vigencia[]>
      >(`${Endpoints.URL_CONTRATOS}/${this.nuContrato}/vigencias`);

      this.listaVigencias = response.data;
      //this.loading = false;
    } catch (error) {
      console.error(error, 'obterVigencias')
    }
  }

  public async obterRubricas(): Promise<void> {
    try {
      this.form.controls['nuVigenciaRubrica'].setValue('');

      const response = await this.apiService.get<
        ApiResponse<Gcptb017VigenciaRubrica[]>
      >(
        `${Endpoints.URL_RUBRICA}/vigencia/${this.form.get('nuVigencia').value}`
      );

      this.listaRubricas = response.data;

    } catch (error) {
      console.error(error, 'obterRubricas')
    }
  }

  public async obterPagamento(): Promise<void> {
    try {
      const response = await this.apiService.get<
        ApiResponse<Gcptb011Pagamento>
      >(`${Endpoints.URL_PAGAMENTO}/` + this.nuPagamento);
      this.pagamento = response.data;
      this.titulo = 'Edição';
      this.subTitulo = 'Edição do pagamento ' + this.pagamento.dePeriodo;

      this.form.controls['nuPagamento'].setValue(response.data.nuPagamento);
      this.form.controls['nuPagamentoTipo'].setValue(response.data.nuPagamentoTipo);
      this.form.controls['nuContrato'].setValue(response.data.nuContrato);
      this.form.controls['nuVigencia'].setValue(response.data.nuVigencia);

      await this.obterRubricas();

      this.form.controls['nuVigenciaRubrica'].setValue(response.data.nuVigenciaRubrica);
      this.form.controls['nuOrcamento'].setValue(response.data.nuOrcamento);
      this.form.controls['dePeriodo'].setValue(response.data.dePeriodo);
      this.form.controls['coNumeroAteste'].setValue(response.data.coNumeroAteste);
      this.form.controls['vrCredito'].setValue(response.data.vrCredito);
      this.form.controls['vrGlosa'].setValue(response.data.vrGlosa);
      this.form.controls['vrMulta'].setValue(response.data.vrMulta);
      this.form.controls['vrExecutado'].setValue(response.data.vrExecutado);
      this.form.controls['dtFaturamento'].setValue(
        response.data.dtFaturamento?.toString().substring(0, 10)
      );
      this.form.controls['dtNotaFiscal'].setValue(
        response.data.dtNotaFiscal?.toString().substring(0, 10)
      );
      this.form.controls['dtPagamento'].setValue(
        response.data.dtPagamento?.toString().substring(0, 10)
      );
      this.form.controls['dtPagamentoEfetivo'].setValue(
        response.data.dtPagamentoEfetivo?.toString().substring(0, 10)
      );

      this.form.controls['qtdItens'].setValue(response.data.qtdItens);
      this.form.controls['qtdTradeIn'].setValue(response.data.qtdTradeIn);
      this.form.controls['nuSap'].setValue(response.data.nuSap);
      this.form.controls['qtTotalSolicitado'].setValue(response.data.qtTotalSolicitado);

      let paymentDateStr = response.data.dtPagamentoEfetivo?.toString().substring(0, 10);
      let paymentDate: Date | null = null;

      if (paymentDateStr) {
        paymentDate = new Date(paymentDateStr);
      }

      // Definir a data de comparação: 01/01/2024
      const comparisonDate = new Date(2024, 0, 1);
      //cenario 1: se a data do pagamento for maior que 2024

      if (paymentDate && paymentDate > comparisonDate) {
        //se for conciliação, permitir edição de campos competencia e ateste
        if(this.isConciliacao){
          Object.keys(this.form.controls).forEach((controlName) => {
              this.form.get(controlName).disable();
            });
            this.form.get('dePeriodo').enable();
            this.form.get('coNumeroAteste').enable();
        } else{
          //cenario 1: o fiscal Converge deve poder alterar somente a competencia.
          Object.keys(this.form.controls).forEach((controlName) => {
            if (controlName !== 'dePeriodo') {
              this.form.get(controlName).disable();
            }
          });
        }
      }
    } catch (error) {
      console.error(error, 'obterPagamento')
    }
  }

  public async onSubmit(): Promise<void> {
    if (this.nuPagamento) {
      this.Alterar();
    } else {
      this.Cadastrar();
    }
  }

  public async Cadastrar(): Promise<void> {
    try {
      this.submitted = true;
      if (this.form.invalid) {
        return;
      }
      await this.apiService.post<any>(
        `${Endpoints.URL_PAGAMENTO}`,
        this.form.value
      );

      this.toastr.success('Cadastro efetuado com sucesso.', 'Sucesso');
      this.atualizarPagina.emit(true);
      this.activeModal.dismiss();
    } catch (error) {
      this.atualizarPagina.emit(false);
      this.activeModal.dismiss();
      console.error(error, 'Cadastrar')
    }
  }

  public async Alterar(): Promise<void> {
    try {
      this.submitted = true;

      if (this.form.invalid) {
        return;
      }

      await this.apiService.put<any>(
        `${Endpoints.URL_PAGAMENTO}/${this.nuPagamento}`,
        this.form.getRawValue()
      );

      this.toastr.success('Alteração efetuada com sucesso.', 'Sucesso');
      this.atualizarPagina.emit(true);
      this.activeModal.dismiss();
    } catch (error) {
      this.atualizarPagina.emit(false);
      this.activeModal.dismiss();
      console.error(error, 'Alterar')
    }
  }

  async excluirPagamento(nuPagamento: number) {
    const alert = await Swal.fire({
      title: '',
      text: 'Deseja realmente excluir este pagamento?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Não, cancelar!',
    }).then((result) => {
      if (result.value) {
        return true;
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        return false;
      }
    });

    if (alert) {
      try {
        const response = await this.apiService.delete<ApiResponse<boolean>>(
          `${Endpoints.URL_PAGAMENTO}/` + nuPagamento
        );

        this.toastr.success('Pagamento excluído com sucesso.', 'Sucesso');
        this.atualizarPagina.emit(true);
        this.activeModal.dismiss();
      } catch (error) {
        console.error(error, 'excluirPagamento');
      }
    }
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }
}
