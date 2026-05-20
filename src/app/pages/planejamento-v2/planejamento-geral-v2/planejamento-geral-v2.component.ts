import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Select2Data } from 'ng-select2-component';
import { ToastrService } from 'ngx-toastr';
import { MenuItem } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';
import { Endpoints } from 'src/app/models/enums/endpoints';
import { ApiResponse } from 'src/app/models/generics/api-response';
import { Gcpvw051VisaoContratosPlanejamentoOrcamentarioResponse } from 'src/app/models/response/Gcpvw051VisaoContratosPlanejamentoOrcamentarioResponse';
import { Gcpvw54VisaoDashboardPlanejamentoOrcamentario } from 'src/app/models/generics/Gcpvw54VisaoDashboardPlanejamentoOrcamentario';
import { PlanejamentoStatusResponse } from 'src/app/models/generics/planejamento-response';
import { AlterarStatusPlanejamento } from 'src/app/models/request/status-planejamento-request';
import { ApiService } from 'src/app/shared/services/api.service';
import {
  ActionPolicies,
  ModuleEnum,
  PerfisEnum,
  TokenStorageService,
} from 'src/app/shared/services/token-storage.service';
import Swal from 'sweetalert2';
import { PlanejamentoCadastroV2Component } from '../planejamento-cadastro-v2/planejamento-cadastro-v2.component';
import { Gcpvw051VisaoContratoPlanejamentoOrcamentario } from 'src/app/models/generics/Gcpvw051VisaoContratoPlanejamentoOrcamentario';
import { Gcptb051AtualizarStatusEmLoteRequest } from 'src/app/models/request/Gcptb051AtualizarStatusEmLoteRequest';
import { IUser } from 'src/app/models/DTOs/IUser';

@Component({
  selector: 'app-planejamento-geral-v2',
  templateUrl: './planejamento-geral-v2.component.html',
  styleUrls: ['./planejamento-geral-v2.component.scss'],
})
export class PlanejamentoGeralV2Component implements OnInit {
  public dadosDashboard: Gcpvw54VisaoDashboardPlanejamentoOrcamentario[] = [];
  public listaStatusPlanejamento: PlanejamentoStatusResponse[];
  public planejamentos = new Gcpvw051VisaoContratosPlanejamentoOrcamentarioResponse();
  public items: MenuItem[];
  public statusSelecionados: number[] = [];

  public selectStatusPlanejamentoCompleto: Select2Data;

  public filtroRegistros: any = {
    paginaAtual: 1,
    tamanhoPagina: 10,
    ud: null,
    nuOrc: 0,
    contrato: null,
    Status: null,
    NuPlanejamentoTipo: null,
    tipo: null,
    // objeto: '',
    noTipoDigital: null,
    nuPlanejamento: 0,
    tipoPlanejamento: '',
    sgDiretoria: null,
    sgSuperintendencia: null,
  };

  public isUltimaReprogramacao: boolean = false;
  public anoExercicio: number;
  public ordemTipoExercicio: string;
  public statusExercio: string;
  public nuPlanejamentoExercicio: number;

  public dadosUsuarioLogado : IUser;
  currentUser: any;
  // currentProfile: PerfisEnum;
  public currentProfile: IUser;
  perfilOrcamento: boolean = false;
  perfilAdm: boolean = false;
  perfilOperacional: boolean = false;
  perfilTorre: boolean = false;
  perfilUnidade: string = '';
  isPerfilPrivilegiado: boolean = false;
  selecionarTodos: boolean = false;
  permissions: ActionPolicies;

  public loading = false;

  constructor(
    private apiService: ApiService,
    private modalService: NgbModal,
    public token: TokenStorageService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe((params) => {
      this.isUltimaReprogramacao = params['isUltimaReprogramacao'] === 'true';
      this.anoExercicio = Number(params['coExercicio']) || 0;
      this.ordemTipoExercicio = params['tipo'];
      this.statusExercio = params['statusPlanejamento'] ?? '';
      this.nuPlanejamentoExercicio = Number(params['nuPlanejamento']) || 0;
    });

     this.obterPermissoes();

    this.filtroRegistros = {
      paginaAtual: 1,
      tamanhoPagina: 10,
      nuPlanejamento: this.nuPlanejamentoExercicio,
      tipoPlanejamento: this.ordemTipoExercicio,
    };
    await this.obterPlanejamentosOrc();
    await this.obterStatusPlanejamento();
    await this.obterdadosDashboard();
    this.items = [
      {
        label: 'Novo Registro',
        icon: 'pi pi-plus',
        disabled: !this.podeCadastrar(),
        command: () => {
          this.openModalAddPlanejamento('adicionar', true, true, this.nuPlanejamentoExercicio, this.anoExercicio);
        },
      },

      {
        label: 'Gerar Excel',
        icon: 'tim-icons icon-cloud-download-93',
        command: () => {
          this.downloadPlanejamentoDesembolso();
        },
      },
      {
        label: 'Gerar Atualização SAP',
        icon: 'tim-icons icon-cloud-download-93',
        command: () => {
          // this.exportarExcelAtualizacaoSAP(this.anoExercicio);
          this.downloadPlanejamentoDesembolso();
        },
      },
      // {
      //   label: 'Upload de Limites',
      //   icon: 'tim-icons icon-upload',
      //   command: () => {
      //     const tipo = this.ordemTipoExercicio.split('-')[1].trim();
      //     if (tipo === 'Programação') {
      //       this.toastr.info(
      //         'Planejamento do tipo Programação não possui limites.',
      //         'Informação',
      //       );
      //     } else {
      //       this.openModalUpload();
      //     }
      //   },
      // },
    ];
  }

  obterPermissoes(){
    this.currentProfile = this.token.obterUsuarioEstruturado() as IUser;
    this.currentUser = this.token.getUser();
    this.perfilUnidade = this.currentUser?.coUnidade;

    const perfil = this.currentProfile.noPerfil;

    this.perfilAdm = perfil === PerfisEnum.Administrador;
    this.perfilOrcamento = perfil === PerfisEnum.Orcamento;
    this.perfilTorre = perfil === PerfisEnum.TorresGEGAT;
    this.perfilOperacional = perfil === PerfisEnum.GestorOperacional;

    const podeAlterarContexto = this.perfilOrcamento || this.perfilAdm || this.perfilTorre || this.perfilOperacional;

    if (!podeAlterarContexto) {
      this.isPerfilPrivilegiado = false;
      return;
    }

    if (this.statusExercio === "Cancelado") {
      this.isPerfilPrivilegiado = false;
      return;
    }

    if (this.statusExercio === "Validado"  && !this.perfilAdm) {
      this.isPerfilPrivilegiado = false;
      return;
    }

    this.isPerfilPrivilegiado = true;




  }

  podeCadastrar(): boolean {
    if (this.statusExercio === 'Cancelado') return false;
    if (this.statusExercio === 'Validado' && !this.perfilAdm) return false;

    return this.perfilOrcamento || this.perfilAdm || this.perfilTorre || this.perfilOperacional;
  }

    podeAlterarStatusEmLote(planejamento : any) {
    if (this.statusExercio === 'Cancelado') return false;
    if (this.statusExercio === 'Validado' && !this.perfilAdm) return false;

    if(this.perfilOperacional){
      return planejamento.coFilial == this.perfilUnidade && planejamento.nuStatusPlanejamento !== 3 && planejamento.nuStatusPlanejamento !== 7;
    }

    if(this.perfilTorre){
      return planejamento.nuStatusPlanejamento !== 3 && planejamento.nuStatusPlanejamento !== 7;
    }

    return this.perfilOrcamento || this.perfilAdm

    }

  async obterStatusPlanejamento(): Promise<void> {
    const response = await this.apiService.get<
      ApiResponse<PlanejamentoStatusResponse[]>
    >(`v1/PlanejamentoOrcamentarioV/status-planejamento`);
    this.listaStatusPlanejamento = response.data;

    if(this.perfilOperacional || this.perfilTorre){
      this.selectStatusPlanejamentoCompleto = this.listaStatusPlanejamento.filter(s => s.nuPlanejamentoStatus !== 5 && s.nuPlanejamentoStatus !== 3).map(
      (status) => ({
        label: status.noPlanejamentoStatus,
        value: status.nuPlanejamentoStatus,
      }),
    );
    }

    else{

      this.selectStatusPlanejamentoCompleto = this.listaStatusPlanejamento.map(
      (status) => ({
        label: status.noPlanejamentoStatus,
        value: status.nuPlanejamentoStatus,
      }),
    );
    }

  }

  public async onSalvarMudancasStatus(): Promise<void> {
    try {
      const idSelecionado = this.statusSelecionados[0];
      const novoStatusObj = this.listaStatusPlanejamento.find(
        (s) => s.nuPlanejamentoStatus === idSelecionado,
      );
      const itensSelecionados =  this.planejamentos.contratos.filter((p) => p.stSelecionado)

      if (itensSelecionados.length === 0) {
        this.toastr.warning('Nenhum item selecionado para alteração.', 'Aviso');
        return;
      }

     if (!this.statusSelecionados || !this.statusSelecionados[0]) {
        this.toastr.warning('Selecione uma opção de status.', 'Aviso');
        return;
      }

      // if (this.statusExercio === 'Encerrado') {
      //   this.toastr.warning(
      //     'Não é permitido alterar status em planejamentos encerrados.',
      //     'Aviso',
      //   );
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

      const statusNovo: Gcptb051AtualizarStatusEmLoteRequest = {
        status: novoStatusObj.nuPlanejamentoStatus,
        nuPlanejamento: this.nuPlanejamentoExercicio,
        nuPlanejamentoItens: itensSelecionados.map((item) => item.nuPlanejamentoItem)
      };


      try {

       const response = await this.apiService.put<ApiResponse<any>>(
          `v1/PlanejamentoOrcamentarioV/alterar-status-lote-planejamento-item`,
          statusNovo,
        );



        if (!response?.succeeded) {
           this.toastr.error('Ocorreu um erro ao salvar', 'Error');
        }

        this.toastr.success('Alterações de status confirmadas.', 'Confirmação');
        await this.obterPlanejamentosOrc();
        this.selecionarTodos = false;
        this.planejamentos.contratos.forEach((p) => (p.stSelecionado = false));
        this.statusSelecionados[0] = null;

      }

      catch (error) {
        console.error(error, 'Erro ao salvar alterações de status');
        this.toastr.error('Ocorreu um erro ao salvar', 'Error');
      }
    }

    catch (error) {
      console.error(error, 'Erro na requisição');
    }
  }

selecionarTodosItens() {
  this.planejamentos.contratos.forEach((p) => {
    if (this.podeAlterarStatusEmLote(p)) {
      p.stSelecionado = this.selecionarTodos;
    } else {
      p.stSelecionado = false;
    }
  });
}
  atualizarStatusSelecionados() {
    const itensNaoSelecionados = this.planejamentos.contratos.filter(
      (p) => p.stSelecionado == false,
    );

    this.planejamentos.contratos.forEach((p1) => {
      const existe = itensNaoSelecionados.some((p2) => p2.nuOrc === p1.nuOrc);
      if (existe) {
        p1.noStatus = p1.noStatusOriginal;
      }
    });
    if (!this.statusSelecionados || this.statusSelecionados.length === 0)
      return;

    const idSelecionado = this.statusSelecionados[0];
    const novoStatus = this.listaStatusPlanejamento.find(
      (s) => s.nuPlanejamentoStatus === idSelecionado,
    );
    if (!novoStatus) return;

    const itensSelecionados = this.planejamentos.contratos.filter((p) => p.stSelecionado)

    if (itensSelecionados.length === 0) return;

    itensSelecionados.forEach((p) => {
      p.noStatus = novoStatus.noPlanejamentoStatus;
    });
  }

  public exportarExcelAtualizacaoSAP(coExercicio: number) {
    const alert = Swal.fire({
      title: 'Aviso',
      text: `Para esta opção nenhum filtro será levado em consideração e o arquivo será gerado com todos os registros que foram atualizados.`,
      icon: 'warning',
      showCancelButton: false,
      confirmButtonText: 'Ok!',
    }).then(() => {
      return this.apiService.downloadfile(
        `v1/PlanejamentoOrcamentario/obter-atualizacao-planejamento-item-excel`,
        { coExercicio: coExercicio },
      );
    });
  }

  openModalEditPlanejamento(
    tipoModal: string,
    isEditable: boolean,
    isCadastro: boolean,
    planejamento?: Gcpvw051VisaoContratoPlanejamentoOrcamentario
  ) {
    const modalRef = this.modalService.open(PlanejamentoCadastroV2Component, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      windowClass: 'custom-class',
      backdrop: 'static',
      keyboard: false,
    });


    modalRef.componentInstance.planejamento = planejamento;
    modalRef.componentInstance.isEditable = isEditable;
    modalRef.componentInstance.statusExercicio = this.statusExercio;
    modalRef.componentInstance.isCadastro = isCadastro;
    modalRef.componentInstance.tipoModal = tipoModal;
    modalRef.componentInstance.nuAno = this.anoExercicio;
    modalRef.componentInstance.tipo = this.ordemTipoExercicio;


    modalRef.componentInstance.atualizarPagina.subscribe((data: boolean) => {
      if (data) {
        this.obterPlanejamentosOrc();
        this.obterdadosDashboard();
      }
    });


  }

    openModalAddPlanejamento(
    tipoModal: string,
    isEditable: boolean,
    isCadastro: boolean,
    nuPlanejamentoExercicio?: any,
    nuAno?: number
  ) {
    const modalRef = this.modalService.open(PlanejamentoCadastroV2Component, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      windowClass: 'custom-class',
      backdrop: 'static',
      keyboard: false,
    });

    modalRef.componentInstance.planejamento = nuPlanejamentoExercicio;
    modalRef.componentInstance.isEditable = isEditable;
    modalRef.componentInstance.isCadastro = isCadastro;
    modalRef.componentInstance.tipoModal = tipoModal;
    modalRef.componentInstance.nuAno = this.anoExercicio;
    modalRef.componentInstance.tipo = this.ordemTipoExercicio;

    modalRef.componentInstance.atualizarPagina.subscribe((data: boolean) => {
      if (data) {
        this.obterPlanejamentosOrc();
        this.obterdadosDashboard();
      }
    });


  }

  public async obterdadosDashboard(): Promise<void> {
    try {

      const params: Record<string, any> = {
        nuPlanejamento: this.nuPlanejamentoExercicio,
        sgUnidade: this.filtroRegistros.Ud ?? '',
        sgDiretoria: this.filtroRegistros.sgDiretoria ?? '',
        sgSuperintendencia: this.filtroRegistros.sgSuperintendencia ?? '',
      };

      const response = await this.apiService.get<
        ApiResponse<Gcpvw54VisaoDashboardPlanejamentoOrcamentario[]>
      >(`v1/PlanejamentoOrcamentarioV/dashboard`, params);
      this.dadosDashboard = response?.data;

      if (!response?.succeeded) {
        console.error('Erro da API:', response?.errors);
        this.dadosDashboard = [];
        return;
      }

      this.dadosDashboard = response.data ?? [];
    } catch (error) {
      console.error('Erro ao consumir API', error);
      this.dadosDashboard = [];
    }
  }

  async updateRelatorio(valor: string | null, op: number): Promise<void> {
    this.loading = true;

    switch (op) {
      case 1: {
        this.filtroRegistros.nuOrc = valor;
        this.filtroRegistros.paginaAtual = 1;
        break;
      }
      case 2: {
        this.filtroRegistros.Ud = valor;
        await this.obterdadosDashboard();
        break;
      }
      case 3: {
        this.filtroRegistros.contrato = valor;
        break;
      }
      case 4: {
        this.filtroRegistros.tipo = valor;
        break;
      }
      case 5: {
        this.filtroRegistros.Status = valor;
        break;
      }
      // case 6: {
      //   this.filtroRegistros.objeto = valor;
      //   break;
      // }
      case 6: {
        this.filtroRegistros.noTipoDigital = valor;
        break;
      }
      case 7: {
        this.filtroRegistros.sgDiretoria = valor;
        await this.obterdadosDashboard();
        break;
      }
      case 8: {
        this.filtroRegistros.sgSuperintendencia = valor;
        await this.obterdadosDashboard();
        break;
      }
    }

    this.obterPlanejamentosOrc();
    this.loading = false;
  }

  public downloadPlanejamentoDesembolso() {
    const filtrosLimpos = this.limparFiltrosNulos(this.filtroRegistros);
    return this.apiService.downloadfile(
      `v1/PlanejamentoOrcamentarioV/listar-itens-planejados-excel`,
      filtrosLimpos,
    );
  }

  public async obterPlanejamentosOrc(): Promise<void> {
    this.loading = true;
    try {

      const filtrosLimpos = this.limparFiltrosNulos(this.filtroRegistros);
      const response = await this.apiService.get<
        ApiResponse<Gcpvw051VisaoContratosPlanejamentoOrcamentarioResponse>
      >(
        `v1/PlanejamentoOrcamentarioV/listar-itens-planejados`,
        filtrosLimpos,
      );

      if (!response?.succeeded) {
        console.error('Erro da API:', response?.errors);
        this.dadosDashboard = [];
        return;
      }

      this.planejamentos.contratos = response?.data?.contratos.map((p) => ({
        ...p,
        stSelecionado: false,
      }));
      this.planejamentos.listaContrato = [
        'SEM CONTRATOS',
        ...(response?.data?.listaContrato ?? []),
      ];
      this.planejamentos.listaUnidadeDemandante =
        response?.data?.listaUnidadeDemandante ?? [];
      this.planejamentos.listaTipo = response?.data?.listaTipo ?? [];
      // this.planejamentos.listaObjeto = response?.data?.listaObjeto ?? [];
      this.planejamentos.listaDigital = ['SEM CLASSIFICAÇÃO', ...(response?.data?.listaDigital ?? [])];
      this.planejamentos.listaStatus = response?.data?.listaStatus ?? [];
      this.planejamentos.listaNuOrc = response?.data?.listaNuOrc ?? [];
      this.planejamentos.listaDiretoria = response?.data?.listaDiretoria ?? [];
      this.planejamentos.listaSuperintendencia = response?.data?.listaSuperintendencia ?? [];
      this.planejamentos.totalRegistros = response.data.totalRegistros;
      this.loading = false;
      this.planejamentos.contratos.forEach((p) => {
        p.noStatusOriginal = p.noStatus;
      });
    } catch (error) {
      this.loading = false;
      console.error('Erro ao obter planejamentos', error);
    }
  }

  private limparFiltrosNulos(filtros: any): any {
    const filtrosLimpos: any = {};
    Object.keys(filtros).forEach((key) => {
      if (
        filtros[key] !== null &&
        filtros[key] !== undefined &&
        filtros[key] !== ''
      ) {
        filtrosLimpos[key] = filtros[key];
      }
    });
    return filtrosLimpos;
  }

  async loadPage(event: TableLazyLoadEvent) {
    const page =
      (event.first || 0) / (event.rows || this.filtroRegistros.tamanhoPagina) +
      1;
    const pageSize = event.rows || this.filtroRegistros.tamanhoPagina;

    if (
      page !== this.filtroRegistros.paginaAtual ||
      pageSize !== this.filtroRegistros.tamanhoPagina
    ) {
      this.filtroRegistros.paginaAtual = page;
      this.filtroRegistros.tamanhoPagina = pageSize;
      await this.obterPlanejamentosOrc();
    }
  }
}
