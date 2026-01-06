import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Select2Data } from 'ng-select2-component';
import { TableLazyLoadEvent } from 'primeng/table';
import { ApiResponse } from 'src/app/models/api-response';
import { ContratoItem, Gcptb001ContratoResponse, ContratoApiResponse } from 'src/app/models/Gcptb001ContratoResponse';
import { ApiService } from 'src/app/services/api.service';
import { ActionPolicies, TokenStorageService, ModuleEnum } from 'src/app/services/token-storage.service';
import { Endpoints } from 'src/app/shared/enums/endpoints';
import * as fileSaver from 'file-saver';

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

  isRotaAtas: boolean = false;
  tituloPage: string = 'Relatório de Contratos';
  rota: string = '';

  filtroRegistros: any = {
    pageNumber: 1,
    pageSize: 10,
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
    private modalService: NgbModal,
    private token: TokenStorageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.obterPermissoes();
    this.currentUser = this.token.getUser();
  }

  obterPermissoes() {
    this.permissions = this.token.getActionPolicies(ModuleEnum.Contratos);
  }

  ngOnInit() {
    this.validarRotaAtas();
    this.obterContratos();
  }

  assignCopy() {
    this.contratos = Object.assign([], this.contratosOrigem);
  }

  navegarInfoContrato(coContrato: string, nuContrato: number){
    if(coContrato.startsWith('81000') || this.isRotaAtas){
      this.navegarParaDetalhes(nuContrato)
    }else{
      this.navegarParaEvolucao(nuContrato)
    }
  }

  navegarParaEvolucao(nuContrato: number) {
    const url = `/#/contrato/evolucao-financeira/${nuContrato}`
    window.open(url, '_blank');
  }

  navegarParaDetalhes(nuContrato: number) {
    const url = `/#/contrato/detalhe/v/${nuContrato}`
    window.open(url, '_blank');
  }

  filterItem(value: string) {
    if (!value) {
      this.assignCopy();
      return;
    }
    const v = value.toLowerCase();
    this.contratos = Object.assign([], this.contratosOrigem).filter(
      (item) =>
        item.coContrato.toLowerCase().indexOf(v) > -1 ||
        item.noEmpresa.toLowerCase().includes(v) ||
        (item.noContratoTipo || '').toLowerCase().includes(v) ||
        (item.sgFilial || '').toLowerCase().includes(v)
    );
  }

  public async obterContratos(): Promise<void> {
    this.loading = true;
    try {
      const filtrosLimpos = this.limparFiltrosNulos(this.filtroRegistros);
      if (this.isRotaAtas) {
        filtrosLimpos.NoTipoArp = 'ATA_DE_REGISTRO_DE_PRECOS';
      }

      const response = await this.apiService.get<ApiResponse<ContratoApiResponse>>(
        `${Endpoints.URL_CONTRATOS}/filter-paginado`,
        filtrosLimpos
      );

      this.contratosOrigem = response?.data?.contratos || [];
      this.selectTiposContrato = response?.data?.listaContrato?.map(c => ({ label: c, value: c })) || [];
      this.selectTiposFornecedor = response?.data?.listaFornecedor?.map(f => ({ label: f, value: f })) || [];
      this.selectTiposTpContrato = response?.data?.listaTipo?.map(t => ({ label: t, value: t })) || [];
      this.selectTiposGestor = response?.data?.listaGestor?.map(g => ({ label: g, value: g })) || [];
      this.selectTiposStatus = response?.data?.listaStatus?.map(s => ({ label: s, value: s })) || [];
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
    this.filtroRegistros.pageNumber = 1;

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
    const page = (event.first || 0) / (event.rows || this.filtroRegistros.pageSize) + 1;
    const pageSize = event.rows || this.filtroRegistros.pageSize;

    if (page !== this.filtroRegistros.pageNumber || pageSize !== this.filtroRegistros.pageSize) {
      this.filtroRegistros.pageNumber = page;
      this.filtroRegistros.pageSize = pageSize;
      this.obterContratos();
    }
  }

exportExcel() {
    return this.apiService.downloadfile(
      `${Endpoints.URL_CONTRATOS}/relatorio-contratos`,
      this.filtroRegistros
    );
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    fileSaver.saveAs(data, `${fileName}_export_${new Date().getTime()}${EXCEL_EXTENSION}`);
  }

  private composeUnidadeGestor(item: any): string {
    const unidade = item.sgFilial || '';
    const gestor = item.noGestor || ''; 
    return gestor ? `${unidade} - ${gestor}` : unidade;
  }

  private getValorPago(item: any): number {
    return (item.vrPago ?? item.vrExecutado ?? 0);
  }

  private formatDateExcel(value: string | Date): string {
    if (!value) return '';
    const d = new Date(value);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  }

  private formatCurrencyExcel(value?: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
  }

  validarRotaAtas() {
    const rota = this.route.snapshot.url[1]?.path;
    this.rota = rota;
    this.isRotaAtas = (rota && rota == 'atas') ? true : false;
    if (this.isRotaAtas) {
      this.tituloPage = 'Relatório de Atas';
    }
  }

  limparFiltros(): void {
    this.selectedTipoContrato = null;
    this.selectedTipoFornecedor = null;
    this.selectedTipoTpContrato = null;
    this.selectedTipoGestor = null;
    this.selectedTipoStatus = null;

    this.filtroRegistros = {
      pageNumber: 1,                                   
      pageSize: this.filtroRegistros.pageSize ?? 10,   
      Contrato: null,
      Fornecedor: null,
      Tipo: null,
      Gestor: null,
      Status: null,
      NoTipoArp: this.isRotaAtas ? 'ATA_DE_REGISTRO_DE_PRECOS' : null
    };

    this.loading = true;
    this.obterContratos();
  }
}

