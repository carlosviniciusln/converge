import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CheckboxModule } from 'primeng/checkbox';
import { ApiService } from 'src/app/services/api.service';
import { Endpoints } from 'src/app/shared/enums/endpoints';
import { ActionPolicies, ModuleEnum, TokenStorageService } from 'src/app/services/token-storage.service';
import { ToastrService } from 'ngx-toastr';
import {
  DemandaTipoResponse,
  PlanejamentoOrcamentarioResponse,
  PlanejamentoStatusResponse,
  PlanejamentoTipoResponse,
  PlanejamentoObjetoResponse,
} from 'src/app/models/planejamento-response';
import { ApiResponse, ApiResponsePaginado } from 'src/app/models/api-response';
import { Filial } from 'src/app/models/filial';
import { Select2Data, Select2Option } from 'ng-select2-component';
import { ContratoResponse } from 'src/app/models/contrato-response';
import { PlanejamentoCadastroComponent } from '../planejamento-cadastro/planejamento-cadastro.component';
import { ConfirmacaoModalComponent } from 'src/app/components/modal-confirmacao/confirmacao-modal';
import { ActivatedRoute, Router } from '@angular/router';
import { ContratoPlanejamentosOrcamentario, PlanejamentoOrcamentarioModel, PlanejamentosOrcamentariosResponse } from 'src/app/models/planejamento-orcamentario';
import { AlterarStatusPlanejamento } from 'src/app/models/request/status-planejamento-request';

@Component({
  selector: 'app-planejamento-geral',
  templateUrl: './planejamento-geral.component.html',
  styleUrls: ['./planejamento-geral.component.scss']
})

export class PlanejamentoGeralComponent implements OnInit {
  tabs: string[] = ['Contrato', 'Rubrica']
  title: string = 'Planejamento Orçamentário';

  planejamentos: ContratoPlanejamentosOrcamentario[];
  listaAnos: string[];
  listaNuOrc: number[];
  listaContratos: ContratoResponse[];
  listaFiliais: Filial[];
  listaStatusPlanejamento: PlanejamentoStatusResponse[];
  listaObjetoPlanejamento: PlanejamentoObjetoResponse[];
  listaTiposPlanejamento: PlanejamentoTipoResponse[];
  listaTiposDemanda: DemandaTipoResponse[];
  

  listaOpcoesIsDigital: { value: number; label: string }[] = [
    { value: 1, label: 'Digital' },
    { value: 2, label: 'Digital - TD' },
    { value: 3, label: 'Não Digital' },
  ];

  currentUser: any;

  selectAnos: Select2Data;
  selectContratos: Select2Data;
  selectFiliais: Select2Data;
  selectNuOrcs: Select2Data;
  selectStatusPlanejamento: Select2Data;
  selectStatusPlanejamentoCompleto: Select2Data;
  selectTiposPlanejamento: Select2Data;
  selectTiposDemanda: Select2Data;
  selectOpcoesIsDigital: Select2Data;
  selectObjeto: Select2Data;
  anoExercicio: number;
  ordemTipoExercicio: string;
  nuPlanejamentoExercicio?: number;
  statusExercio: string;
  selectedAno: string = null;
  selectedContrato: string = null;
  selectedFilial: string = null;
  selectedNuOrc: number = null;
  selectedStatusPlanejamento: string = null;
  selectedTipoPlanejamento: string = null;
  selectedTipoDemanda: string = null;
  selectedOpcaoIsDigital: string = null;
  selectedObjeto: string = null;

  selecionarTodos: boolean = false;
  statusSelecionados: number[] = [];

  dadosDashboard: PlanejamentoOrcamentarioModel[] = [];
  quantidadeTotal: number = 0;
  loading: boolean = true;
  previousPage: any;
  ultimaAtualizacaoOrcamento : string = '09/06/2025 18:29';

  permissions: ActionPolicies;

  public listaStatusPlanejamentoColapse: PlanejamentoStatusResponse[] = [];
  public labelTeste : string;
  public filtroRegistros: any = {
    pageNumber: 1,
    pageSize: 12,
    NuAno: null,
    ud: null,
    nuOrc: 0,
    contrato: null,
    Status: null,
    NuPlanejamentoTipo: null,
    tipo: null,
    IsDigital: null,
    objeto: '',
    nuPlanejamento: 0
  };

  constructor(
    private apiService: ApiService,
    private modalService: NgbModal,
    private route : ActivatedRoute,
    public token: TokenStorageService,
    private toastr: ToastrService
  ) {
    this.obterPermissoes();
  }

  async ngOnInit(): Promise<void> {

    // queryParams: { cO_EXERCICIO: item.cO_EXERCICIO, tipo: item.tipo, statusPlanejamento: item.statuS_PLANEJAMENTO}
    this.route.queryParams.subscribe(params => {
      this.anoExercicio =params['cO_EXERCICIO'];
      this.ordemTipoExercicio = params['tipo'];
      this.statusExercio = params['statusPlanejamento'];      
      
      const valor = Number(params['nuPlanejamento']);
      this.nuPlanejamentoExercicio = isNaN(valor) ? 0 : valor;

    });

    this.filtroRegistros = {
      pageNumber: 1,
      pageSize: 12,
      nuPlanejamento: this.nuPlanejamentoExercicio
    };
    await this.obterPlanejamentosOrc();
    await this.obterdadosDashboard();
    await this.obterStatusPlanejamento();
  }

  obterPermissoes() {
    this.permissions = this.token.getActionPolicies(ModuleEnum.Planejamento);
  }

  async loadPage(page: number) {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.filtroRegistros.pageNumber = page;
      await this.obterPlanejamentosOrc();
    }
  }

  openModalPlanejamento(tipoModal: string, isEditable: boolean, planejamento?: any, nuPlanejamentoOrcamento?:number) {
    const modalRef = this.modalService.open(PlanejamentoCadastroComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      windowClass: 'custom-class',
      backdrop: 'static',
      keyboard: false,
    });

    modalRef.componentInstance.nuPlanejamento = planejamento;
    modalRef.componentInstance.nuPlanejamentoOrcamento = nuPlanejamentoOrcamento;
    modalRef.componentInstance.isEditable = isEditable;
    modalRef.componentInstance.tipoModal = tipoModal;
    modalRef.componentInstance.atualizarPagina.subscribe((data: boolean) => {
      if (data) {
        this.obterPlanejamentosOrc();
      }
    });
  }

  public async obterPlanejamentos(): Promise<void> {
    // try {
    //   const response = await this.apiService.get<
    //     ApiResponsePaginado<PlanejamentoOrcamentarioResponse>
    //   >(`${Endpoints.URL_PLANEJAMENTO_ORCAMENTARIO_FILTER_PAGINADO}?NuPlanejamento=${this.nuPlanejamentoExercicio}`, this.filtroRegistros);

    //   this.planejamentos = response.data.results;
    //   this.quantidadeTotal = response.data.totalRecords;

    //   this.planejamentos.forEach((element) => {
    //     var vrTotalOrcamentoPlanejamento = 0;
    //     element.gcptb027PrevisoesDesembolso.forEach((subelement) => {
    //       vrTotalOrcamentoPlanejamento +=
    //         subelement.vrJaneiro +
    //         subelement.vrFevereiro +
    //         subelement.vrMarco +
    //         subelement.vrAbril +
    //         subelement.vrMaio +
    //         subelement.vrJunho +
    //         subelement.vrJulho +
    //         subelement.vrAgosto +
    //         subelement.vrSetembro +
    //         subelement.vrOutubro +
    //         subelement.vrNovembro +
    //         subelement.vrDezembro;
    //     });
    //     element.vrTotalOrcamentoPlanejamento = vrTotalOrcamentoPlanejamento;
    //   });

    //   this.loading = false;
    // } catch (error) { }
  }

  
  async obterStatusPlanejamento(): Promise<void> {
    const response = await this.apiService.get<ApiResponse<PlanejamentoStatusResponse[]>>(
      `${Endpoints.URL_ORCAMENTO}/status-planejamento`
    );
    this.listaStatusPlanejamento = response.data;
    this.selectStatusPlanejamentoCompleto = this.listaStatusPlanejamento.map(status => ({
      label: status.noPlanejamentoStatus,
      value: status.nuPlanejamentoStatus
    }));
  }


  async onSalvarMudancasStatus(): Promise<void> {
    try {
      const modalRef = this.modalService.open(ConfirmacaoModalComponent, {
        backdrop: 'static',
        keyboard: false,
        centered: true,
        size: 'md'
      });
  
      modalRef.componentInstance.title = 'Confirmar alterações';
      modalRef.componentInstance.message = 'Tem certeza que deseja salvar as alterações de status dos itens selecionados?';
      modalRef.componentInstance.confirmLabel = 'Sim, salvar';
      modalRef.componentInstance.cancelLabel = 'Não, voltar';
      modalRef.componentInstance.icon = 'pi pi-exclamation-triangle';
      modalRef.componentInstance.iconClass = 'text-warning';
  
      const confirmed = await modalRef.result;
  
      if (confirmed) {
        const idSelecionado = this.statusSelecionados[0];
        const novoStatusObj = this.listaStatusPlanejamento.find(s => s.nuPlanejamentoStatus === idSelecionado);
        if (!novoStatusObj) return;
  
        const itensSelecionados = this.planejamentos.filter(p => p.sT_SELECIONADO);
        if (itensSelecionados.length === 0) {
          this.toastr.warning('Nenhum item selecionado para alteração.', 'Aviso');
          return;
        }

        const statusNovo: AlterarStatusPlanejamento = {
          nuPlanejamento: Number(this.nuPlanejamentoExercicio), 
          status: novoStatusObj.nuPlanejamentoStatus,
          nuPlanejamentoItem: itensSelecionados.map(item => ({
            NuTipoDemanda: item.nU_TIPO_DEMANDA,
            NuContrato: item.nU_CONTRATO
          }))          
        };
        
        await this.apiService.put(`${Endpoints.URL_PLANEJAMENTO_ORCAMENTARIO_ALTERAR_STATUS}`, statusNovo);
        this.toastr.success('Alterações de status confirmadas.', 'Confirmação');
  
        await this.obterPlanejamentosOrc();
        this.selecionarTodos = false;
        this.planejamentos.forEach(p => p.sT_SELECIONADO = false);
      }
    } catch {
      this.toastr.error('Ocorreu um erro ao salvar', 'Error');
    }
  }
  
  atualizarStatusSelecionados() {
    if (!this.statusSelecionados || this.statusSelecionados.length === 0) return;

    const idSelecionado = this.statusSelecionados[0];
    const novoStatus = this.listaStatusPlanejamento.find(s => s.nuPlanejamentoStatus === idSelecionado);
    if (!novoStatus) return;

    const itensSelecionados = this.planejamentos.filter(p => p.sT_SELECIONADO);
    if (itensSelecionados.length === 0) return;

    itensSelecionados.forEach(p => {
      p.nO_STATUS = novoStatus.noPlanejamentoStatus;
    });
  }
  
  selecionarTodosItens() {
    this.planejamentos.forEach(p => {
      p.sT_SELECIONADO = this.selecionarTodos;
    });
  }


  onToggleItemSelecionado(): void {
    this.atualizarStatusSelecionados();
  }


  public downloadPlanejamentoDesembolso() {
    return this.apiService.downloadfile(
      `${Endpoints.URL_ORCAMENTO}/excel`,
      this.filtroRegistros
    );
  }

  public async obterdadosDashboard(): Promise<void>{
    this.loading = true;
    try {
      const response = await this.apiService.get<ApiResponse<PlanejamentoOrcamentarioModel[]>>
        (`${Endpoints.URL_PLANEJAMENTO_ORCAMENTARIO_DASHBOARD}`, this.filtroRegistros);
      this.dadosDashboard = response?.data;
      this.loading = false;
    } catch (error) {
      this.loading = false;
      console.error('Erro ao obter dados do dashboard', error);
    }
  }

  async updateRelatorio(e, op: number): Promise<void> {
    this.loading = true;
    if(e.value == null){
        this.filtroRegistros = {
          pageNumber: 1,
          pageSize: 12,
          nuPlanejamento: this.nuPlanejamentoExercicio
        };
        this.obterPlanejamentosOrc();
    }
    else{
      switch (op) {
        case 2: {
          this.filtroRegistros.nuOrc = e.value;
          if (e.value == null || this.selectNuOrcs.length > 1) {
              await this.obterPlanejamentosOrc();
          }
          break;
        }
        case 3: {
          this.filtroRegistros.Ud = e.value;
          if (e.value == null || this.selectFiliais.length > 1) {
              await this.obterPlanejamentosOrc();
          }
          break;
        }
        case 4: {
          this.filtroRegistros.contrato = e.value;
          if (e.value == null || this.selectContratos.length > 1) {
              await this.obterPlanejamentosOrc();
          }
          break;
        }
        case 5: {
          this.filtroRegistros.tipo = e.value;
          if (e.value == null || this.selectTiposDemanda.length > 1) {
              await this.obterPlanejamentosOrc();
          }
          break;
        }
        case 6: {
          this.filtroRegistros.IsDigital = e.value;
          if (e.value == null || this.selectOpcoesIsDigital.length > 1) {
              await this.obterPlanejamentosOrc();
          }
          break;
        }
        case 7: {
          this.filtroRegistros.Status = e.value;
          if (e.value == null || this.selectedStatusPlanejamento.length > 1) {
              await this.obterPlanejamentosOrc();
          }
          break;
        }
        case 8: {
          this.filtroRegistros.objeto = e.value;
          if (e.value == null || this.selectObjeto.length > 1) {
              await this.obterPlanejamentosOrc();
          }
          break;
        }
        default: {
          this.obterPlanejamentosOrc();
          break;
        }
      }
    }
    this.loading = false;
  }
  
  public async obterPlanejamentosOrc(): Promise<void> {
    this.loading = true;
    try {
      const response = await this.apiService.get<ApiResponse<PlanejamentosOrcamentariosResponse>>
      (`${Endpoints.URL_PLANEJAMENTO_ORCAMENTARIO_FILTER_PAGINADO}`, this.filtroRegistros);
      this.planejamentos = response?.data?.contratos.map(p => ({...p,sT_SELECIONADO: false }));
      this.selectContratos = response?.data?.listaContrato.map(c => ({ label: c, value: c }));
      this.selectFiliais = response?.data?.listaUnidadeDemandante.map(g => ({ label: g, value: g }));
      this.selectTiposDemanda = response?.data?.listaTipo.map(g => ({ label: g, value: g }));
      this.selectObjeto = response?.data?.listaObjeto.map(g => ({ label: g, value: g }));
      this.selectStatusPlanejamento = response?.data?.listaStatus.map(g => ({ label: g, value: g }));
      this.selectNuOrcs = response?.data?.listaNuOrc.map(g => ({ label: g, value: g }));
      this.selectOpcoesIsDigital = this.listaOpcoesIsDigital.map(g => ({ label: g.label, value: g.value }));
      this.quantidadeTotal = response.data.totalRecords;
      this.loading = false;
    } catch (error) {
      this.loading = false;
      console.error('Erro ao obter planejamentos', error);
    }
  }
}
