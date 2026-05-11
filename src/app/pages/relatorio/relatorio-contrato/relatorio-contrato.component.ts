import { Component, OnInit } from '@angular/core';
import { Select2Data } from 'ng-select2-component';
import { TableLazyLoadEvent } from 'primeng/table';
import { ApiResponse } from 'src/app/models/generics/api-response';
import { ContratoItem, Gcptb001ContratoResponse, ContratoApiResponse } from 'src/app/models/generics/Gcptb001ContratoResponse';
import { ApiService } from 'src/app/shared/services/api.service';
import { ActionPolicies, TokenStorageService, ModuleEnum } from 'src/app/shared/services/token-storage.service';
import { Endpoints } from 'src/app/models/enums/endpoints';

@Component({
  selector: 'app-relatorio-contrato',
  templateUrl: './relatorio-contrato.component.html',
  styleUrls: ['./relatorio-contrato.component.scss']
})
export class RelatorioContratoComponent implements OnInit {

  permissions: ActionPolicies;

  contratosOrigem: ContratoItem[] = [];
  contratos: ContratoItem[] = [];

  selectedContratos: Gcptb001ContratoResponse[] = [];

  loading: boolean = true;
  currentUser: any;
  selectTiposContrato: Select2Data = [];
  selectTiposFornecedor: Select2Data = [];
  selectTiposTpContrato: Select2Data = [];
  selectTiposGestor: Select2Data = [];
  selectTiposStatus: Select2Data = [];
  selectedTipoContrato: string = null;
  selectedTipoFornecedor: string = null;
  selectedTipoTpContrato: string = null;
  selectedTipoGestor: string = null;
  selectedTipoStatus: string = null;

  tituloPage: string = '';
  rota: string = '';

  filtroRegistros: any = {
    PaginaAtual: 1,
    TamanhoPagina: 10,
    Contrato: null,
    Fornecedor: null,
    Tipo: null,
    Gestor: null,
    Status: null,
    NoTipoArp: null
  };

  quantidadeTotal: number = 0;

  constructor(
    private apiService: ApiService,
    private token: TokenStorageService

  ) {
    this.obterPermissoes();
    this.currentUser = this.token.getUser();
  }

  ngOnInit() {
    this.obterContratos();
  }

  obterPermissoes() {
    this.permissions = this.token.getActionPolicies(ModuleEnum.Contratos);
  }


  assignCopy() {
    this.contratos = Object.assign([], this.contratosOrigem);
  }

  public async obterContratos(): Promise<void> {
    this.loading = true;
    try {
      const filtrosLimpos = this.limparFiltrosNulos({
        PaginaAtual: this.filtroRegistros.PaginaAtual,
        TamanhoPagina: this.filtroRegistros.TamanhoPagina,
        contrato: this.filtroRegistros.Contrato,
        empresa: this.filtroRegistros.Fornecedor,
        contratoTipo: this.filtroRegistros.Tipo,
        filial: this.filtroRegistros.Gestor,
        ativo: this.filtroRegistros.Status});

      const response = await this.apiService.get<ApiResponse<ContratoApiResponse>>(
        `v1/relatorio/contratos`,
        filtrosLimpos
      );

      this.contratosOrigem = response?.data?.contratos || [];
      this.selectTiposContrato = response?.data?.listaContrato?.map(c => ({ label: String(c), value: c })) || [];
      this.selectTiposFornecedor = response?.data?.listaFornecedor?.map(f => ({ label: String(f), value: f })) || [];
      this.selectTiposTpContrato = response?.data?.listaTipo?.map(t => ({ label: String(t), value: t })) || [];
      this.selectTiposGestor = response?.data?.listaGestor?.map(g => ({ label: String(g), value: g })) || [];
      this.selectTiposStatus = response?.data?.listaStatus?.map(s => ({ label: String(s), value: s })) || [];
      this.quantidadeTotal = response?.data?.totalRecords || 0;
      this.assignCopy();
    } catch (error) {
      console.error('Erro ao obter contratos', error);
    } finally {
      this.loading = false;
    }
  }

  private limparFiltrosNulos(filtros: any): any {
    const filtrosLimpos: any = {};
    Object.keys(filtros).forEach((key) => {
      if (filtros[key] !== null && filtros[key] !== undefined && filtros[key] !== '') {
        filtrosLimpos[key] = filtros[key];
      }
    });
    return filtrosLimpos;
  }

  async updateRelatorio(e: any, op: number): Promise<void> {
    this.loading = true;
    this.filtroRegistros.PaginaAtual = 1;
    switch (op) {
      case 1:
        this.filtroRegistros.Contrato = e.value;
        break;
      case 2:
        this.filtroRegistros.Fornecedor = e.value;
        break;
      case 3:
        this.filtroRegistros.Tipo = e.value;
        break;
      case 4:
        this.filtroRegistros.Gestor = e.value;
        break;
      case 5:
        this.filtroRegistros.Status = e.value;
        break;
    }

    await this.obterContratos();
    this.loading = false;
  }

  loadPage(event: TableLazyLoadEvent) {
    const page = (event.first || 0) / (event.rows || this.filtroRegistros.TamanhoPagina) + 1;
    const pageSize = event.rows || this.filtroRegistros.TamanhoPagina;

    if (page !== this.filtroRegistros.PaginaAtual || pageSize !== this.filtroRegistros.TamanhoPagina) {
      this.filtroRegistros.PaginaAtual = page;
      this.filtroRegistros.TamanhoPagina = pageSize;
      this.obterContratos();
    }
  }

  async exportExcel(): Promise<void> {
    try {
      const filtrosExcel = this.limparFiltrosNulos({
        PaginaAtual: this.filtroRegistros.PaginaAtual,
        TamanhoPagina: this.filtroRegistros.TamanhoPagina,
        contrato: this.filtroRegistros.Contrato,
        empresa: this.filtroRegistros.Fornecedor,
        contratoTipo: this.filtroRegistros.Tipo,
        filial: this.filtroRegistros.Gestor,
        ativo: this.filtroRegistros.Status
      });

      this.apiService.downloadfile(
        `v1/relatorio/contratos/excel`,
        filtrosExcel
      );

    } catch (error) {
      console.error('Erro ao exportar Excel', error);
    }
  }

  limparFiltros(): void {
    this.selectedTipoContrato = null;
    this.selectedTipoFornecedor = null;
    this.selectedTipoTpContrato = null;
    this.selectedTipoGestor = null;
    this.selectedTipoStatus = null;

    this.filtroRegistros = {
      PaginaAtual: 1,
      TamanhoPagina:  10,
      Contrato: null,
      Fornecedor: null,
      Tipo: null,
      Gestor: null,
      Status: null,

    };

    this.loading = true;
    this.obterContratos();
  }
}

