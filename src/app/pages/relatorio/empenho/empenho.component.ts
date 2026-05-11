import { Component, OnInit } from '@angular/core';
import { ApiResponse, ApiResponsePaginado } from 'src/app/models/generics/api-response';
import { Gcptb001ContratoResponse } from 'src/app/models/generics/Gcptb001ContratoResponse';
import { Filial } from 'src/app/models/generics/filial';
import { RelatorioEmpenho } from 'src/app/models/generics/relatorio-empenho';
import { RelatorioPagamento } from 'src/app/models/generics/relatorio-pagamento';
import { Rubrica } from 'src/app/models/generics/rubrica';
import { ApiService } from 'src/app/shared/services/api.service';
import { Endpoints } from 'src/app/models/enums/endpoints';
import { Select2Data, Select2Option, Select2Group } from 'ng-select2-component';
import {
  ActionPolicies,
  ModuleEnum,
  TokenStorageService,
} from 'src/app/shared/services/token-storage.service';

@Component({
  selector: 'app-empenho',
  templateUrl: './empenho.component.html',
  styleUrls: ['./empenho.component.scss'],
})
export class EmpenhoComponent implements OnInit {
  permissions: ActionPolicies;

  listaEmpenho: RelatorioEmpenho[];
  listaAnos: string[];
  listaContratos: Gcptb001ContratoResponse[];
  listaFiliais: Filial[];

  selectAnos: Select2Data;
  selectContratos: Select2Data;
  selectFiliais: Select2Data;

  selectedAno: string = null;
  selectedContrato: string = null;
  selectedFilial: string = null;

  quantidadeTotal: number = 0;
  loading: boolean = true;
  previousPage: any;

  public filtroRegistros: any = {
    pageNumber: 1,
    pageSize: 12,
    nuAno: null,
    nuFilial: null,
    nuContrato: null,
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
    await this.obterEmpenhos();

    this.obterFiliais();
    this.obterAnosOrcamentarios();
    this.obterContratos();
  }

  public async obterAnosOrcamentarios(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<string[]>>(
        `${Endpoints.URL_PAGAMENTO}/anos-orcamentarios`
      );

      this.listaAnos = response.data;

      this.selectAnos = this.listaAnos.map(
        (m) => ({ value: m, label: String(m) } as Select2Option)
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

  public downloadEmpenho() {
    return this.apiService.downloadfile(
      `${Endpoints.URL_EMPENHO}/excel`,
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
        this.filtroRegistros.nuContrato = e.value;
        break;
      }
      default: {
        this.filtroRegistros.nuAno = e.value;
        break;
      }
    }

    await this.obterEmpenhos();
  }

  loadPage(event: any) {
    const page = (event.pageIndex ?? 0) + 1;
    const pageSize = event.pageSize ?? this.filtroRegistros.pageSize;
    if (page !== this.previousPage || pageSize !== this.filtroRegistros.pageSize) {
      this.previousPage = page;
      this.filtroRegistros.pageNumber = page;
      this.filtroRegistros.pageSize = pageSize;
      this.obterEmpenhos();
    }
  }

  public async obterEmpenhos(): Promise<void> {
    try {
      const response = await this.apiService.get<
        ApiResponsePaginado<RelatorioEmpenho>
      >(`${Endpoints.URL_EMPENHO_PAGINADO}`, this.filtroRegistros);

      this.listaEmpenho = response.data.results;
      this.quantidadeTotal = response.data.totalRecords;

      this.loading = false;
      //this.assignCopy();
    } catch (error) {
      //console.error(error,"aquirsd");
      //this.loading = true;
    }
  }
}
