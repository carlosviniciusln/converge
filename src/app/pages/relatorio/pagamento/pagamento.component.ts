import { Component, OnInit } from '@angular/core';
import { ApiResponse, ApiResponsePaginado } from 'src/app/models/api-response';
import { Gcptb001ContratoResponse } from 'src/app/models/Gcptb001ContratoResponse';
import { Filial } from 'src/app/models/filial';
import { RelatorioPagamento } from 'src/app/models/relatorio-pagamento';
import { Rubrica } from 'src/app/models/rubrica';
import { ApiService } from 'src/app/services/api.service';
import { Endpoints } from 'src/app/shared/enums/endpoints';
import { Select2Data, Select2Option, Select2Group } from 'ng-select2-component';
import {
  ActionPolicies,
  ModuleEnum,
  TokenStorageService,
} from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-pagamento',
  templateUrl: './pagamento.component.html',
  styleUrls: ['./pagamento.component.scss'],
})
export class PagamentoComponent implements OnInit {
  permissions: ActionPolicies;

  listaPagamento: RelatorioPagamento[];
  listaAnos: string[];
  listaRubricas: Rubrica[];
  listaContratos: Gcptb001ContratoResponse[];
  listaFiliais: Filial[];

  selectAnos: Select2Data;
  selectRubricas: Select2Data;
  selectContratos: Select2Data;
  selectVigente: Select2Data;
  selectFiliais: Select2Data;

  selectedAno: string = null;
  selectedRubrica: string = null;
  selectedContrato: string = null;
  selectedVigente: boolean = null;
  selectedFilial: string = null;

  quantidadeTotal: number = 0;
  loading: boolean = true;
  previousPage: any;

  public filtroRegistros: any = {
    pageNumber: 1,
    pageSize: 12,
    nuAno: null,
    nuRubrica: null,
    nuFilial: null,
    nuContrato: null,
    icAtivo: null,
  };

  constructor(
    private apiService: ApiService,
    public token: TokenStorageService
  ) {
    this.obterPermissoes();
  }

  obterPermissoes() {
    this.permissions = this.token.getActionPolicies(ModuleEnum.Relatorios);
  }

  async ngOnInit(): Promise<void> {
    await this.obterPagamentos();

    this.obterFiliais();
    this.obterRubricas();
    this.obterAnosOrcamentarios();
    this.obterContratos();

    this.selectVigente = [{value: true, label: 'Sim'}, {value: false, label: 'Não'}]
  }

  public async obterAnosOrcamentarios(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<string[]>>(
        `${Endpoints.URL_PAGAMENTO}/anos-orcamentarios`
      );

      this.listaAnos = response.data;
      this.selectAnos = this.listaAnos.map(
        (m) => ({ value: m, label: m } as Select2Option)
      );

      this.loading = false;
    } catch (error) {
      //this.loading = true;
    }
  }
  public async obterFiliais(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<Filial[]>>(
        `${Endpoints.URL_FILIAL}/ativos`
      );

      this.listaFiliais = response.data;

      this.selectFiliais = this.listaFiliais
        .filter((f) => f.nuFilialPai != null)
        .map(
          (m) => ({ value: m.nuFilial, label: m.sgFilial } as Select2Option)
        );

      this.loading = false;
    } catch (error) {
      //this.loading = true;
    }
  }
  public async obterRubricas(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<Rubrica[]>>(
        `${Endpoints.URL_RUBRICA}/ativas`
      );

      this.listaRubricas = response.data;

      this.selectRubricas = this.listaRubricas.map(
        (m) =>
          ({
            value: m.nuRubrica,
            label: m.coRubrica + ' - ' + m.deRubrica,
          } as Select2Option)
      );

      this.loading = false;
    } catch (error) {
      //this.loading = true;
    }
  }

  onLazyLoad(event) {
   console.log(event, "TESTE")

    }

  public async obterContratos(): Promise<void> {
    try {
      const response = await this.apiService.get<
        ApiResponse<Gcptb001ContratoResponse[]>
      >(`${Endpoints.URL_CONTRATOS}`);

      this.listaContratos = response.data;

      this.selectContratos = this.listaContratos.map(
        (m) =>
          ({
            value: m.nuContrato,
            label: m.coContrato + ' - ' + m.noEmpresa,
          } as Select2Option)
      );

      this.loading = false;
    } catch (error) {
      //this.loading = true;
    }
  }

  public downloadPagamento() {
    return this.apiService.downloadfile(
      `${Endpoints.URL_PAGAMENTO}/excel`,
      this.filtroRegistros
    );
  }

  async updateRelatorio(e, op: number): Promise<void> {
    this.loading = true;
    console.log(op, 'op');
    console.log(e.value, 'id');
    switch (op) {
      case 1: {
        this.filtroRegistros.nuAno = e.value;
        break;
      }
      case 2: {
        this.filtroRegistros.nuFilial = e.value;
        break;
      }
      case 3: {
        this.filtroRegistros.nuRubrica = e.value;
        break;
      }
      case 4: {
        this.filtroRegistros.nuContrato = e.value;
        break;
      }
      case 5: {
        this.filtroRegistros.icAtivo = e.value;
        break;
      }
      default: {
        this.filtroRegistros.nuAno = e.value;
        break;
      }
    }

    await this.obterPagamentos();
  }

  loadPage(page: number) {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.filtroRegistros.pageNumber = page;
      this.obterPagamentos();
    }
  }

  public async obterPagamentos(): Promise<void> {
    try {
      const response = await this.apiService.get<
        ApiResponsePaginado<RelatorioPagamento>
      >(`${Endpoints.URL_PAGAMENTO_PAGINADO}`, this.filtroRegistros);

      console.log(response, "Pagamentos")

      this.listaPagamento = response.data.results;
      this.quantidadeTotal = response.data.totalRecords;

      this.loading = false;
      //this.assignCopy();
    } catch (error) {
      console.error(error, 'aquirsd');
      //this.loading = true;
    }
  }
}
