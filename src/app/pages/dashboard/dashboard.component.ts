import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiResponse, ApiResponsePaginado } from 'src/app/models/generics/api-response';
import { ContratoVigencia } from 'src/app/models/generics/contratoVigencia';
import { Dashboard, NumerosRapidosExecContratual } from 'src/app/models/generics/dashboard';
import { ApiService } from 'src/app/shared/services/api.service';
import {
  ActionPolicies,
  ModuleEnum,
  PerfisEnum,
  TokenStorageService,
} from 'src/app/shared/services/token-storage.service';
import { Endpoints } from 'src/app/models/enums/endpoints';
import { ContratoVigenciaComponent } from './contrato-vigencia/contrato-vigencia.component';
import { ValoresRubricaComponent } from './valores-rubrica/valores-rubrica.component';
import { ModalRedirectComponent } from './modal-redirect/modal-redirect.component';
import { ContratoApiResponse, ContratoItem } from 'src/app/models/generics/Gcptb001ContratoResponse';
import { NovosContratosComponent } from './novos-contratos/novos-contratos.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  permissions: ActionPolicies;
  tabs: string[] = ['Execução Contratual', 'Orçamento']
  tabsCapexOpex: string[] = ['Investimento (CAPEX)', 'Custeio (OPEX)']
  dashboard: Dashboard;
  orcamentos: any = [];
  execucao: any = [];
  anos: number[] = [];
  anoSelected: number = new Date().getFullYear();
  loading: boolean = true;
  modalRef: any
  listaContratosVigencia: ContratoVigencia[];
  titleContratosVigencia: string;
  filial1885Data: any = null;
  ultimaAtualizacao: string = '';
  currentProfile: PerfisEnum;
  numerosRapidosExecContratual: NumerosRapidosExecContratual;
  contratosOrigem: ContratoItem[];
  contratos: ContratoItem[];
  filtroRegistros: any = {
    pageNumber: 1,
    pageSize: 4,
    Contrato: null,
    Fornecedor: null,
    Tipo: null,
    Gestor: null,
    Status: null,
    NoTipoArp: null
  };

  quantidadeTotal: number = 0;

  closeResult: string = '';
  exibeResultado = false;
  constructor(
    private apiService: ApiService,
    private modalService: NgbModal,
    public token: TokenStorageService
  ) {
    this.obterPermissoes();
  }

  obterPermissoes() {
    this.currentProfile = this.token.getUserPerfil();
    this.permissions = this.token.getActionPolicies(ModuleEnum.Dashboard);
  }

  ngOnInit() {
    this.obterDashboard();
    this.obterContratos();
  }

  // openModalRedirect(url: string) {
  //   this.modalRef = this.modalService.open(ModalRedirectComponent, {
  //     ariaLabelledBy: 'modal-basic-title',
  //     windowClass: 'modal-dialog-custom-redirect-width',
  //   });
  //   this.modalRef.componentInstance.url = url;
  //   this.modalRef.componentInstance.contratos = this.contratosOrigem;
  //   this.modalRef.componentInstance.quantidadeTotal = this.quantidadeTotal;
  // }

  public async obterDashboard() {
    try {
      this.getExecucao();
      this.getAtualizacao();
      this.getNumerosRapidosExecContratual();
      this.loading = false;
    } catch (error) {
      console.error(error);
      this.loading = false;
    }
  }
  filterGerencias(gerencias) {
    return gerencias
      .map((gerencia) => {
        if (gerencia.filhos) {
          gerencia.filhos = this.filterGerencias(gerencia.filhos);
        }
        const allZeros =
          gerencia.qT_CONTRATO_ATIVO === 0 &&
          gerencia.qT_ACIMA_ESTIMADO === 0 &&
          gerencia.qT_ABAIXO_ESTIMADO === 0 &&
          gerencia.qT_SALDO_ESGOTADO === 0 &&
          gerencia.qT_PROXIMO30 === 0 &&
          gerencia.qT_PROXIMO90 === 0 &&
          gerencia.qT_PROXIMO180 === 0 &&
          gerencia.qT_CONTRATO_INATIVO === 0;
        const hasNonZeroChild = gerencia.filhos && gerencia.filhos.length > 0;
        return !allZeros || hasNonZeroChild ? gerencia : null;
      })
      .filter((gerencia) => gerencia !== null);
  }

  async getOrcamento() {
    const responseOrcamento = await this.apiService.get<ApiResponse<any>>(
      `${Endpoints.URL_DASHBOARD_ORCAMENTO}`
    );
    let data: any = responseOrcamento.data;

    data = data.map(item => {
      if (item.iC_UNIDADE_PAI) {
        const pertencentes = data.filter(i => i.nU_FILIAL_PAI == item.nU_FILIAL);

        item = {
          ...item,
          filhos: pertencentes
        }

      }
      return item
    });
    data = data.filter(item => item.iC_UNIDADE_PAI == true);


    this.filial1885Data = data.find(item => item.sG_FILIAL === "GERAL");

    this.orcamentos = data.filter(item => item.sG_FILIAL !== "GERAL");
  }
  async getExecucao() {
    const response = await this.apiService.get<ApiResponse<Dashboard>>(
      `${Endpoints.URL_DASHBOARD_EXECUCAO}`
    );

    let data: any = response.data;

    data = data.map(item => {
      if (item.iC_UNIDADE_PAI) {
        const pertencentes = data.filter(i => i.nU_FILIAL_PAI == item.nU_FILIAL);

        item = {
          ...item,
          filhos: pertencentes
        }

      }
      return item
    });
    this.execucao = this.filterGerencias(data);
  }

  async getAtualizacao() {
    const response = await this.apiService.get<ApiResponse<string>>(
      `${Endpoints.URL_DASHBOARD}/dt-ultima-atualizacao`
    );

    this.ultimaAtualizacao = response.data;

  }

  async getNumerosRapidosExecContratual() {
    const response = await this.apiService.get<ApiResponse<NumerosRapidosExecContratual>>(
      `${Endpoints.URL_DASHBOARD}/numeros-rapidos-exec-contratual`
    );
    this.numerosRapidosExecContratual = response.data;
  }

  public async obterContratosVigencias(
    nuFilial: number | null,
    nuDiasInicio: number | null,
    nuDiasFim: number | null
  ): Promise<void> {
    try {
      this.listaContratosVigencia = null;

      const response = await this.apiService.get<
        ApiResponse<ContratoVigencia[]>
      >(
        `${Endpoints.URL_CONTRATOS_VIGENCIAS}/${nuFilial}/${nuDiasInicio}/${nuDiasFim}`
      );
      this.listaContratosVigencia = response.data;
      this.loading = false;
    } catch (error) {
      this.loading = true;
    }
  }

  openModalRubrica(nuRubricaTipo: number, nuFilial: number, noFilial: string) {
    const modalRef = this.modalService.open(ValoresRubricaComponent, {
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'custom-class',
    });

    modalRef.componentInstance.nuRubricaTipo = nuRubricaTipo;
    modalRef.componentInstance.nuFilial = nuFilial;
    modalRef.componentInstance.noFilial = noFilial;
    modalRef.componentInstance.nuAno = this.anoSelected;
  }

  openModalContratoVigencia(
    noFilial: string,
    nuFilial: number | null,
    nuDiasInicio: number | null,
    nuDiasFim: number | null,
    icSemSaldo: boolean | null,
    tipo?: string,
    coContrato?: string
  ) {
    const modalRef = this.modalService.open(ContratoVigenciaComponent, {
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'modal-dialog-full-width',
    });

    modalRef.componentInstance.nuFilial = nuFilial;
    modalRef.componentInstance.noFilial = noFilial;
    modalRef.componentInstance.nuDiasInicio = nuDiasInicio;
    modalRef.componentInstance.nuDiasFim = nuDiasFim;
    modalRef.componentInstance.icSemSaldo = icSemSaldo;
    modalRef.componentInstance.tipo = tipo;
    modalRef.componentInstance.coContrato = coContrato;
  }

  exibeDetalhes(aba: number) {

    if (aba == 1) {
      if (this.orcamentos.length === 0) {
        this.getOrcamento();
      }

    } else {
      if (this.execucao.length === 0) {
        this.getExecucao();
      }
    }
  }

  public async obterContratos(): Promise<void> {
    const url = window.location.hostname;
    this.loading = true;
    try {
      const filtrosLimpos = this.limparFiltrosNulos(this.filtroRegistros);

      const response = await this.apiService.get<ApiResponse<ContratoApiResponse>>
        (`${Endpoints.URL_CONTRATOS}/novos-contratos`, filtrosLimpos);

      this.contratosOrigem = response?.data?.contratos;
      this.quantidadeTotal = response.data.totalRecords;
      // this.openModalRedirect(url);
      this.openModalNovosContratos();
      this.assignCopy();
      this.loading = false;
    } catch (error) {
      this.loading = false;
      console.error('Erro ao obter contratos', error);
    }
  }

  openModalNovosContratos() {
    if(this.currentProfile === PerfisEnum.Pagadoria || this.currentProfile === PerfisEnum.Administrador){
      const modalRef = this.modalService.open(NovosContratosComponent, {
        ariaLabelledBy: 'modal-basic-title',
        windowClass: 'modal-dialog-medium-width',
      });
      modalRef.componentInstance.contratos = this.contratosOrigem;
      modalRef.componentInstance.quantidadeTotal = this.quantidadeTotal;
    }
  }

  assignCopy() {
    this.contratos = Object.assign([], this.contratosOrigem);
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

}
