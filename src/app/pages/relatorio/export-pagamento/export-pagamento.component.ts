import { Component, OnInit } from '@angular/core';
import { ApiResponsePaginado } from 'src/app/models/generics/api-response';
import { ApiService } from 'src/app/shared/services/api.service';
import { ActionPolicies, TokenStorageService, ModuleEnum } from 'src/app/shared/services/token-storage.service';
import { Endpoints } from 'src/app/models/enums/endpoints';
import * as fileSaver from 'file-saver';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-export-pagamento',
  templateUrl: './export-pagamento.component.html',
  styleUrls: ['./export-pagamento.component.scss']
})
export class ExportPagamentoComponent implements OnInit {
  permissions: ActionPolicies;
  listaPagamento: any[];
  quantidadeTotal: number = 0;
  loading: boolean = true;
  previousPage: any;
  public filtroRegistros: any = {
    pageNumber: 1,
    pageSize: 10,
    nuAno: null,
    nuRubrica: null,
    nuFilial: null,
    nuContrato: null,
  };
  constructor(
    private apiService: ApiService,
    public token: TokenStorageService,
    public activeModal: NgbActiveModal
  ) {
    this.obterPermissoes();
  }

  async ngOnInit(): Promise<void> {
    await this.obterPagamentos();
  }

  obterPermissoes() {
    this.permissions = this.token.getActionPolicies(ModuleEnum.Relatorios);
  }

  public async obterPagamentos(): Promise<void> {
    try {
      const response = await this.apiService.get<any>(`${Endpoints.URL_CONTRATOS}/relatorio-pagamentos`);

      this.listaPagamento = response.data;

      this.loading = false;
    } catch (error) {
    }
    finally{
      this.loading = false;
    }
  }

  loadPage(page: number) {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.filtroRegistros.pageNumber = page;
      this.obterPagamentos();
    }
  }

  downloadPagamento() {

    const dadosFiltrados = this.listaPagamento.map(item => {
      return {
        'Cod. Contrato': item.cO_CONTRATO,
        'Miro': item.nU_MIRO,
        'Nr. Pedido': item.nU_PEDIDO,
        'Item': item.item,
        'Competência': item.competencia,
        'Cod. Ateste': item.cO_ATESTE,
        'Vr. Executado': item.vR_EXECUTADO
      }
    });

    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(dadosFiltrados);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "Export_Pagamentos");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    fileSaver.saveAs(data, fileName + '_' + this.getCurrentDateTimeFormatted() + EXCEL_EXTENSION);
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
