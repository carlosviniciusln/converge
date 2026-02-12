import { Gcpvw045ListarContratosResponse, Gcpvw045ListarContratosDTO } from './../../models/DTOs/Gcpvw045ListarContratos';
import { Component, OnInit } from '@angular/core';
import { ApiResponse } from 'src/app/models/generics/api-response';
import { Gcptb001ContratoResponse, ContratoApiResponse, ContratoItem } from 'src/app/models/generics/Gcptb001ContratoResponse';
import { ApiService } from 'src/app/shared/services/api.service';
import { Endpoints } from 'src/app/models/enums/endpoints';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Select2Data } from 'ng-select2-component';
import { ContratoCadastroComponent } from './contrato-cadastro/contrato-cadastro.component';
import {
  ActionPolicies,
  ModuleEnum,
  TokenStorageService,
} from 'src/app/shared/services/token-storage.service';
import * as fileSaver from 'file-saver';
import { TableLazyLoadEvent } from 'primeng/table';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contrato',
  templateUrl: './contrato.component.html',
  styleUrls: ['./contrato.component.scss'],
})
export class ContratoComponent implements OnInit {

  permissions: ActionPolicies;
  contratos: Gcpvw045ListarContratosDTO[];

  statuses: any[];

  loading: boolean = true;

  activityValues: number[] = [0, 100];

  currentUser: any;

  selectTiposContrato: Select2Data;
  selectTiposFornecedor: Select2Data;
  selectTiposTpContrato: Select2Data;
  selectTiposGestor: Select2Data;
  selectTiposStatus: Select2Data;

  selectedTipoContrato: string = null;
  selectedTipoFornecedor: string = null;
  selectedTipoTpContrato: string = null;
  selectedTipoGestor: string = null;
  selectedTipoStatus: string = null;

  isRotaAtas: boolean = false;
  tituloPage: string = 'Lista de Contratos';
  rota: string = '';
  filtroRegistros: any = {
    paginaAtual: 1,
    tamanhoPagina: 10,
    Contrato: null,
    Fornecedor: null,
    Tipo: null,
    Gestor: null,
    Status: null
  };

  quantidadeTotal: number = 0;

  constructor(
    private apiService: ApiService,
    private modalService: NgbModal,
    private token: TokenStorageService,
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

  navegarInfoContrato(coContrato: string,nuContrato: number){
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


   public async obterContratos(): Promise<void> {

    this.loading = true;
    try {
      const filtrosLimpos = this.limparFiltrosNulos(this.filtroRegistros);
      if (this.isRotaAtas) {
        filtrosLimpos.Tipo = 'ATA_DE_REGISTRO_DE_PRECOS';
      }
      const response = await this.apiService.get<ApiResponse<Gcpvw045ListarContratosResponse>>
        (`${Endpoints.URL_CONTRATOS}/listar-contratos`, filtrosLimpos);

      this.contratos = response?.data?.contratos;
      this.selectTiposContrato = response?.data?.listaContrato.map(c => ({ label: c, value: c }));
      this.selectTiposFornecedor = response?.data?.listaFornecedor.map(f => ({ label: f, value: f }));
      this.selectTiposTpContrato = response?.data?.listaTipo.map(t => ({ label: t, value: t }));
      this.selectTiposGestor = response?.data?.listaGestor.map(g => ({ label: g, value: g }));
      this.selectTiposStatus = response?.data?.listaStatus.sort((a, b) => Number(b) - Number(a)).map(s => ({ label: s ? 'Ativo' : 'Encerrado', value: s }));
      this.quantidadeTotal = response.data.totalRecords;
      this.loading = false;
    } catch (error) {
      this.loading = false;
      console.error('Erro ao obter contratos', error);
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

  async updateRelatorio(e, op: number): Promise<void> {
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
    const page = (event.first || 0) / (event.rows || this.filtroRegistros.tamanhoPagina) + 1;
    const pageSize = event.rows || this.filtroRegistros.tamanhoPagina;

    if (page !== this.filtroRegistros.paginaAtual || pageSize !== this.filtroRegistros.tamanhoPagina) {
      this.filtroRegistros.paginaAtual = page;
      this.filtroRegistros.tamanhoPagina = pageSize;
      this.obterContratos();
    }
  }


  // mudar export para backend

  exportExcel() {
    const filtrosLimpos = this.limparFiltrosNulos(this.filtroRegistros);
    this.apiService.get<ApiResponse<Gcptb001ContratoResponse[]>>(
      `${Endpoints.URL_CONTRATOS}/filter-excel`,
      filtrosLimpos
    ).then(response => {
      if (response.succeeded) {
        const dadosFiltrados = response.data.map(item => ({
          "Número do Contrato": item.coContrato,
          Empresa: item.noEmpresa,
          "Tipo de Contrato": item.noContratoTipo,
          "Unidade Demandante": item.sgFilial,
          Status: item.icAtivo ? 'Ativo' : 'Encerrado',
          "Data de Início": new Date(item.dtInicioContrato).toLocaleDateString('pt-BR'),
          "Data de Término": new Date(item.dtTerminoContrato).toLocaleDateString('pt-BR'),
          "Valor Global": item.vrGlobal,
          "Valor Executado": item.vrExecutado
        }));

        import("xlsx").then(xlsx => {
          const worksheet = xlsx.utils.json_to_sheet(dadosFiltrados);
          const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
          const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
          this.saveAsExcelFile(excelBuffer, "contratos_filtrados");
        });
      } else {
        console.error('Erro ao exportar dados: ', response.errors);
      }
    }).catch(error => {
      console.error('Erro na requisição de exportação: ', error);
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    fileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  // VERIFICAR SE ESTÁ EM USO

  validarRotaAtas() {
    let rota = this.route.snapshot.url[1]?.path;
    this.rota = rota;
    this.isRotaAtas = (rota && rota == 'atas') ? true : false;
    if (this.isRotaAtas) {
      this.tituloPage = 'Lista de Atas'
    }
  }


  limparFiltros(): void {
    this.selectedTipoContrato = null;
    this.selectedTipoFornecedor = null;
    this.selectedTipoTpContrato = null;
    this.selectedTipoGestor = null;
    this.selectedTipoStatus = null;
    this.filtroRegistros = {
      paginaAtual: 1,
      tamanhoPagina: this.filtroRegistros.tamanhoPagina ?? 10,
      Contrato: null,
      Fornecedor: null,
      Tipo: null,
      Gestor: null,
      Status: null
    };

    this.loading = true;
    this.obterContratos();
  }
}
