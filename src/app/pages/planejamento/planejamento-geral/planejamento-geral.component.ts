import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CheckboxModule } from 'primeng/checkbox';
import { ApiService } from 'src/app/shared/services/api.service';
import { Endpoints } from 'src/app/models/enums/endpoints';
import { ActionPolicies, ModuleEnum, PerfisEnum, TokenStorageService } from 'src/app/shared/services/token-storage.service';
import { ToastrService } from 'ngx-toastr';
import {
  DemandaTipoResponse,
  PlanejamentoOrcamentarioResponse,
  PlanejamentoStatusResponse,
  PlanejamentoTipoResponse,
  PlanejamentoObjetoResponse,
} from 'src/app/models/generics/planejamento-response';
import { ApiResponse, ApiResponsePaginado } from 'src/app/models/generics/api-response';
import { Filial } from 'src/app/models/generics/filial';
import { Select2Data, Select2Option } from 'ng-select2-component';
import { ContratoResponse } from 'src/app/models/generics/contrato-response';
import { PlanejamentoCadastroComponent } from '../planejamento-cadastro/planejamento-cadastro.component';
import { ModalUploadComponent } from '../limites/modal-upload/modal-upload.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ContratoPlanejamentosOrcamentario, PlanejamentoOrcamentarioModel, PlanejamentosOrcamentariosResponse } from 'src/app/models/generics/planejamento-orcamentario';
import { TableLazyLoadEvent } from 'primeng/table';
import Swal from 'sweetalert2';
import { AlterarStatusPlanejamento } from 'src/app/models/request/status-planejamento-request';
import { MenuItem } from 'primeng/api';

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

// DEFINIR MELHOR COMO VAI FUNCIONAR (TB51 ARMAZENA STRINGS, TROCAR PARA ENUM NO BACKEND)
  listaOpcoesIsDigital: { value: number; label: string }[] = [
    { value: 1, label: 'Digital' },
    { value: 2, label: 'Digital - TD' },
    { value: 3, label: 'Não Digital' },
  ];

  currentUser: any;
  currentProfile: PerfisEnum;

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
  perfilOrcamento: boolean = false;
  isPerfilPrivilegiado: boolean = false;
  perfilAdm: boolean = false;
  perfilOperacional: boolean = false;
  perfilTorre: boolean = false;
  perfilUnidade: string = '';
  previousPage: any;
  ultimaAtualizacaoOrcamento : string = '09/06/2025 18:29';

  permissions: ActionPolicies;
  public isUltimaReprogramacao: boolean = false
  public listaStatusPlanejamentoColapse: PlanejamentoStatusResponse[] = [];
  public labelTeste : string;
  public filtroRegistros: any = {
    pageNumber: 1,
    pageSize: 10,
    NuAno: null,
    ud: null,
    nuOrc: 0,
    contrato: null,
    Status: null,
    NuPlanejamentoTipo: null,
    tipo: null,
    IsDigital: null,
    objeto: '',
    nuPlanejamento: 0,
    tipoPlanejamento: ''
  };


  items: MenuItem[];

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
    this.route.queryParams.subscribe(params => {
      this.isUltimaReprogramacao = params['isUltimaReprogramacao'] === 'true';
      this.anoExercicio =params['cO_EXERCICIO'];
      this.ordemTipoExercicio = params['tipo'];
      this.statusExercio = params['statusPlanejamento'];

      const valor = Number(params['nuPlanejamento']);
      this.nuPlanejamentoExercicio = isNaN(valor) ? 0 : valor;

    });

    this.filtroRegistros = {
      pageNumber: 1,
      pageSize: 10,
      nuPlanejamento: this.nuPlanejamentoExercicio,
      tipoPlanejamento: this.ordemTipoExercicio
    };
    await this.obterPlanejamentosOrc();
    await this.obterdadosDashboard();
    await this.obterStatusPlanejamento();
    this.currentProfile = this.token.getUserPerfil();
    if(this.currentProfile == 'Administrador') this.perfilAdm = true;
    if(this.currentProfile == 'Orçamento') this.perfilOrcamento = true;
    if(this.currentProfile == 'Gestor Operacional') this.perfilOperacional = true;
    if(this.currentProfile == 'Torres GEGAT') this.perfilTorre = true;

    if(this.statusExercio == "Cancelado"){ //nenhum perfil pode alterar
      this.isPerfilPrivilegiado = false;
    } else if (this.statusExercio == "Encerrado" && !this.perfilOrcamento){ //encerrado so perfil orçamento pode alterar
      this.isPerfilPrivilegiado = false;
    } else {
      this.isPerfilPrivilegiado = true;
    }

    this.currentUser = this.token.getUser();
    this.perfilUnidade = this.currentUser?.coUnidade;

     this.items = [

            {
                label: 'Novo Registro',
                icon: 'pi pi-plus',
                command: () => {
                    this.openModalPlanejamento('adicionar', true, true, null, this.nuPlanejamentoExercicio, this.anoExercicio);
                }
            },
            // {
            //     label: 'Salvar Status',
            //     icon: "pi pi-pencil",
            //     command: () => {
            //         this.onSalvarMudancasStatus();
            //     }
            // },

            {
                label: 'Gerar Excel',
                icon: 'tim-icons icon-cloud-download-93',
                command: () => {
                    this.downloadPlanejamentoDesembolso();
                }
            },
            {
                label: 'Gerar Atualização SAP',
                icon: 'tim-icons icon-cloud-download-93',
                command: () => {
                    this.exportarExcelAtualizacaoSAP(this.anoExercicio);
                }
            },
             {
                label: 'Upload de Limites',
                icon: 'tim-icons icon-upload',
                command: () => {
                    const tipo = this.ordemTipoExercicio.split('-')[1].trim();
                    if(tipo === 'Programação') {
                      this.toastr.info('Planejamento do tipo Programação não possui limites.', 'Informação');
                    }
                    else{
                      this.openModalUpload();
                    }

                }
            }
        ];
  }

  obterPermissoes() {
    this.permissions = this.token.getActionPolicies(ModuleEnum.Planejamento);
  }

  async loadPage(event: TableLazyLoadEvent) {
    const page = (event.first || 0) / (event.rows || this.filtroRegistros.pageSize) + 1;
    const pageSize = event.rows || this.filtroRegistros.pageSize;

    if (page !== this.filtroRegistros.pageNumber || pageSize !== this.filtroRegistros.pageSize) {
      this.filtroRegistros.pageNumber = page;
      this.filtroRegistros.pageSize = pageSize;
     await this.obterPlanejamentosOrc();
    }
  }

  openModalPlanejamento(tipoModal: string, isEditable: boolean, isCadastro : boolean, planejamento?: any, nuPlanejamentoOrcamento?:number, nuAno?:number) {

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
    modalRef.componentInstance.statusExercicio = this.statusExercio;
    modalRef.componentInstance.isCadastro = isCadastro;
    modalRef.componentInstance.tipoModal = tipoModal;
    modalRef.componentInstance.modeloAntigo = false;
    modalRef.componentInstance.nuAno = (planejamento?.nU_EXERCICIO_ORCAMENTO != null? planejamento?.nU_EXERCICIO_ORCAMENTO : nuAno);
    modalRef.componentInstance.atualizarPagina.subscribe((data: boolean) => {
      if (data) {
        this.obterPlanejamentosOrc();
      }
    });

    modalRef.componentInstance.ano = this.anoExercicio;
    modalRef.componentInstance.tipo = this.ordemTipoExercicio;
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

  public  exportarExcelAtualizacaoSAP(coExercicio: number){

      const ex = "2027";

      const alert =  Swal.fire({
        title: 'Aviso',
        text:  `Para esta opção nenhum filtro será levado em consideração e o arquivo será gerado com todos os registros que foram atualizados.`,
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok!',
      }).then(() => {
         return this.apiService.downloadfile(`v1/PlanejamentoOrcamentario/obter-atualizacao-planejamento-item-excel`, { coExercicio: coExercicio });
      });


  }


public async onSalvarMudancasStatus(): Promise<void> {

    try {

      const idSelecionado = this.statusSelecionados[0];
      const novoStatusObj = this.listaStatusPlanejamento.find(s => s.nuPlanejamentoStatus === idSelecionado);
      const itensSelecionados = this.perfilOrcamento || this.perfilAdm ? this.planejamentos.filter(p => p.sT_SELECIONADO): this.planejamentos.filter(p => p.sT_SELECIONADO && this.perfilUnidade == p.cO_FILIAL);

    if (itensSelecionados.length === 0) {
      this.toastr.warning('Nenhum item selecionado para alteração.', 'Aviso');
      return;
    }

    if(this.statusSelecionados.length == 0){
      this.toastr.warning('Selecione uma opção de status.', 'Aviso');
      return;
    }

    if (this.statusExercio === 'Encerrado') {
      this.toastr.warning('Não é permitido alterar status em planejamentos encerrados.', 'Aviso');
      return;
    }

    // const isUltimaReprogramacao = await this.verificarUltimaReprogramacao();
    // if (!isUltimaReprogramacao) {
    //   this.toastr.warning('Não é permitido alterar status em reprogramações que não sejam as últimas.', 'Aviso');
    //   return;
    // }

     const alert = await Swal.fire({
       text: `Deseja realmente alterar o Status de todos os registros selecionados desta página para o Status ${novoStatusObj?.noPlanejamentoStatus} `,
       icon: 'warning',
       showCancelButton: true,
       confirmButtonText: 'Sim, alterar!',
       cancelButtonText: 'Não, cancelar!',
     }).then((result) => {

      if (result.value) {
        return true;
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        return false;
      }

     });

    if (!alert) return;

    if (!novoStatusObj) return;

    const statusNovo: AlterarStatusPlanejamento = {
      nuPlanejamento: Number(this.nuPlanejamentoExercicio),
      status: novoStatusObj.nuPlanejamentoStatus,
      nuPlanejamentoItem: itensSelecionados.map(item => ({
        NuTipoDemanda: item.nU_TIPO_DEMANDA,
        NuContrato: item.nU_CONTRATO,
        NuOrc : item.nU_ORC
      }))
    };

    var response : any;
    try {
      response = await this.apiService.put(`${Endpoints.URL_PLANEJAMENTO_ORCAMENTARIO_ALTERAR_STATUS}`, statusNovo);
    } catch (error: any) {
      setTimeout(() => {
        window.location.reload()
      }, 3000);
    }

    if(response.length > 0){
      this.toastr.success('Alterações de status confirmadas.', 'Confirmação');
      await this.obterPlanejamentosOrc();
      this.selecionarTodos = false;
      this.planejamentos.forEach(p => p.sT_SELECIONADO = false);
      this.statusSelecionados[0] = null;
    }
    else{
      this.toastr.error('Ocorreu um erro ao salvar', "Error");
    };

  } catch (error) {
    console.error(error, "Erro na requisição")
  }
}

  atualizarStatusSelecionados() {
    const itensNaoSelecionados = this.planejamentos.filter(p => p.sT_SELECIONADO == false)

      this.planejamentos.forEach(p1 => {
          const existe = itensNaoSelecionados.some(p2 => p2.nU_ORC === p1.nU_ORC);
          if (existe) {
            p1.nO_STATUS = p1.nO_STATUS_Original;
          }
      });
    if (!this.statusSelecionados || this.statusSelecionados.length === 0) return;

    const idSelecionado = this.statusSelecionados[0];
    const novoStatus = this.listaStatusPlanejamento.find(s => s.nuPlanejamentoStatus === idSelecionado);
    if (!novoStatus) return;

    const itensSelecionados = this.perfilOrcamento || this.perfilAdm ? this.planejamentos.filter(p => p.sT_SELECIONADO)
    : this.planejamentos.filter(p => p.sT_SELECIONADO && this.perfilUnidade == p.cO_FILIAL);
    if (itensSelecionados.length === 0) return;

    itensSelecionados.forEach(p => {
      p.nO_STATUS = novoStatus.noPlanejamentoStatus;
    });
  }

  selecionarTodosItens() {
    this.planejamentos.forEach(p => {
      p.sT_SELECIONADO = this.selecionarTodos;
    });
    this.atualizarStatusSelecionados();
  }




  // onToggleItemSelecionado(): void {
  //   this.atualizarStatusSelecionados();
  // }

 // mudança de endpoint
  public downloadPlanejamentoDesembolso() {
    return this.apiService.downloadfile(
      `${Endpoints.URL_PLANEJAMENTO_ORCAMENTO}/detalhamento-excel`,
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
          pageSize: 10,
          nuPlanejamento: this.nuPlanejamentoExercicio
        };
        this.obterPlanejamentosOrc();
    }
    else{
      switch (op) {
        case 2: {
          this.filtroRegistros.nuOrc = e.value;
          this.filtroRegistros.pageNumber = 1;
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

  // MUDANÇA DE ENDPOINT
  public async obterPlanejamentosOrc(): Promise<void> {
    this.loading = true;
    try {
      const response = await this.apiService.get<ApiResponse<PlanejamentosOrcamentariosResponse>>
      (`${Endpoints.URL_PLANEJAMENTO_ORCAMENTARIO_FILTER_PAGINADO}`, this.filtroRegistros);
      this.planejamentos = response?.data?.contratos.map(p => ({...p,sT_SELECIONADO: false }));
      this.selectContratos = [{label: 'SEM CONTRATOS', value: 0}, ...(response?.data?.listaContrato ?? []).map(c => ({ label: c, value: c }))];
      this.selectFiliais = response?.data?.listaUnidadeDemandante.map(g => ({ label: g, value: g }));
      this.selectTiposDemanda = response?.data?.listaTipo.map(g => ({ label: g, value: g }));
      this.selectObjeto = response?.data?.listaObjeto.map(g => ({ label: g, value: g }));
      this.selectStatusPlanejamento = response?.data?.listaStatus.map(g => ({ label: g, value: g }));
      this.selectNuOrcs = response?.data?.listaNuOrc.map(g => ({ label: g, value: g }));
      this.selectOpcoesIsDigital = this.listaOpcoesIsDigital.map(g => ({ label: g.label, value: g.value }));
      this.quantidadeTotal = response.data.totalRecords;
      this.loading = false;
      this.planejamentos.forEach(p => {
        p.nO_STATUS_Original = p.nO_STATUS; // adiciona propriedade auxiliar
      });
    } catch (error) {
      this.loading = false;
      console.error('Erro ao obter planejamentos', error);
    }
  }
  private async verificarUltimaReprogramacao(): Promise<boolean> {
    const response = await this.apiService.get<ApiResponse<any[]>>('v1/Exercicio/resumo-planejamento');
    const lista = response.data || [];
    const ultimaAberta = lista.filter(p => p.dT_FECHAMENTO === null).sort((a, b) => (b.ordem ?? 0) - (a.ordem ?? 0))[0];
    return ultimaAberta && Number(this.nuPlanejamentoExercicio) === Number(ultimaAberta.nU_PLANEJAMENTO);
  }

  openModalUpload(): void {
    const modalRef = this.modalService.open(ModalUploadComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'md',
      backdrop: 'static',
      keyboard: false,
    });

    modalRef.componentInstance.nuPlanejamento = this.nuPlanejamentoExercicio;
    modalRef.componentInstance.tipoModal = 'planejamento-geral';

    modalRef.componentInstance.atualizarPagina.subscribe(() => {
      this.obterPlanejamentosOrc();
      this.toastr.success('Arquivo carregado com sucesso!', 'Sucesso');
      modalRef.close();
    });
  }
}
