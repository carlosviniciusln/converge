import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/shared/services/api.service';
import { Endpoints } from 'src/app/models/enums/endpoints';
import { ActionPolicies, ModuleEnum, TokenStorageService } from 'src/app/shared/services/token-storage.service';
import { ToastrService } from 'ngx-toastr';
import { PlanejamentoCadastroComponent } from './planejamento-cadastro/planejamento-cadastro.component';
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
import Swal from 'sweetalert2';

@Component({
  selector: 'app-planejamento',
  templateUrl: './planejamento.component.html',
  styleUrls: ['./planejamento.component.scss'],
})
export class PlanejamentoComponent implements OnInit {
  title: string = 'Planejamento Orçamentário';

  planejamentos: PlanejamentoOrcamentarioResponse[];
  listaAnos: string[];
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
  selectStatusPlanejamento: Select2Data;
  selectTiposPlanejamento: Select2Data;
  selectTiposDemanda: Select2Data;
  selectOpcoesIsDigital: Select2Data;
  selectObjeto: Select2Data;

  selectedAno: string = null;
  selectedContrato: string = null;
  selectedFilial: string = null;
  selectedStatusPlanejamento: string = null;
  selectedTipoPlanejamento: string = null;
  selectedTipoDemanda: string = null;
  selectedOpcaoIsDigital: string = null;
  selectedObjeto: string = null;

  quantidadeTotal: number = 0;
  loading: boolean = true;
  previousPage: any;

  permissions: ActionPolicies;

  public filtroRegistros: any = {
    pageNumber: 1,
    pageSize: 12,
    NuAno: null,
    NuFilial: null,
    NuContrato: null,
    NuPlanejamentoStatus: null,
    NuPlanejamentoTipo: null,
    NuDemandaTipo: null,
    IsDigital: null,
    DeObjeto: '',
  };

  constructor(
    private apiService: ApiService,
    private modalService: NgbModal,
    public token: TokenStorageService,
    private toastr: ToastrService
  ) {
    this.obterPermissoes();
  }

  async ngOnInit(): Promise<void> {
    await this.obterDados();
  }

  obterPermissoes() {
    this.permissions = this.token.getActionPolicies(ModuleEnum.Planejamento);
  }

  async obterDados(op?: number) {
    let list = [8, 7, 6, 5, 4, 3, 2, 1, 0];

    if (op != null) {
      list = list.filter((x) => x !== op);
    }

    list.forEach((element) => {
      switch (element) {
        case 0:
          this.obterPlanejamentos();
          break;
        case 1:
          this.obterAnosOrcamentarios();
          break;
        case 2:
          this.obterFiliais();
          break;
        case 3:
          this.obterContratos();
          break;
        case 4:
          this.obterStatusPlanejamento();
          break;
        case 5:
          this.obterTiposPlanejamento();
          break;
        case 6:
          this.obterTiposDemanda();
          break;
        case 7:
          this.obterClassificacoesPlanejamento();
          break;
        case 8:
          this.obterObjetos();
          break;
        default:
          break;
      }
    });
  }

  public async obterAnosOrcamentarios(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<string[]>>(
        `${Endpoints.URL_ORCAMENTO}/filtro/anos-orcamentarios`,
        this.filtroRegistros
      );

      this.listaAnos = response.data;
      this.selectAnos = this.listaAnos.map(
        (m) => ({ value: m, label: m } as Select2Option)
      );
    } catch (error) { }
  }

  public async obterFiliais(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<Filial[]>>(
        `${Endpoints.URL_ORCAMENTO}/filtro/gerencias-nacionais`,
        this.filtroRegistros
      );

      this.listaFiliais = response.data;

      this.selectFiliais = this.listaFiliais
        .filter((f) => f.nuFilialPai != null)
        .map(
          (m) => ({ value: m.nuFilial, label: m.sgFilial } as Select2Option)
        );
    } catch (error) { }
  }

  public async obterContratos(): Promise<void> {
    try {
      const response = await this.apiService.get<
        ApiResponse<ContratoResponse[]>
      >(`${Endpoints.URL_ORCAMENTO}/filtro/contratos`, this.filtroRegistros);

      this.listaContratos = response.data;

      this.selectContratos = this.listaContratos.map(
        (m) =>
        ({
          value: m.nuContrato,
          label: m.coContrato + ' - ' + m.noEmpresa,
        } as Select2Option)
      );
    } catch (error) { }
  }

  public async obterStatusPlanejamento(): Promise<void> {
    try {
      const response = await this.apiService.get<
        ApiResponse<PlanejamentoStatusResponse[]>
      >(
        `${Endpoints.URL_ORCAMENTO}/filtro/status-planejamento`,
        this.filtroRegistros
      );

      this.listaStatusPlanejamento = response.data;

      this.selectStatusPlanejamento = this.listaStatusPlanejamento.map(
        (m) =>
        ({
          value: m.nuPlanejamentoStatus,
          label: m.noPlanejamentoStatus,
        } as Select2Option)
      );
    } catch (error) { }
  }

  public async obterTiposPlanejamento(): Promise<void> {
    try {
      const response = await this.apiService.get<
        ApiResponse<PlanejamentoTipoResponse[]>
      >(
        `${Endpoints.URL_ORCAMENTO}/filtro/tipos-planejamento`,
        this.filtroRegistros
      );

      this.listaTiposPlanejamento = response.data;

      this.selectTiposPlanejamento = this.listaTiposPlanejamento.map(
        (m) =>
        ({
          value: m.nuPlanejamentoTipo,
          label: m.dePlanejamentoTipo,
        } as Select2Option)
      );
    } catch (error) { }
  }

  public async obterTiposDemanda(): Promise<void> {
    try {
      const response = await this.apiService.get<
        ApiResponse<DemandaTipoResponse[]>
      >(
        `${Endpoints.URL_ORCAMENTO}/filtro/tipos-demanda`,
        this.filtroRegistros
      );

      this.listaTiposDemanda = response.data;

      this.selectTiposDemanda = this.listaTiposDemanda.map(
        (m) => ({ value: m.nuDemanda, label: m.deDemanda } as Select2Option)
      );
    } catch (error) { }
  }

  public async obterObjetos(): Promise<void> {
    try {
      const response = await this.apiService.get<
        ApiResponse<PlanejamentoObjetoResponse[]>
      >(
        `${Endpoints.URL_ORCAMENTO}/objetos`,
      );

      this.listaObjetoPlanejamento = response.data;

      this.selectObjeto = this.listaObjetoPlanejamento.map(
        (m) =>
        ({
          value: m.deObjeto,
          label: m.deObjeto,
        } as Select2Option)
      );
    } catch (error) { }
  }

  public async obterClassificacoesPlanejamento(): Promise<void> {
    try {
      this.selectOpcoesIsDigital = this.listaOpcoesIsDigital.map(
        (m) =>
        ({
          value: m.value,
          label: m.label,
        } as Select2Option)
      );
    } catch (error) { }
  }

  async updateRelatorio(e, op: number): Promise<void> {
    this.loading = true;
    switch (op) {
      case 1: {
        this.filtroRegistros.NuAno = e.value;
        if (e.value == null || this.selectAnos.length > 1) {
          await this.obterDados(op);
        }
        break;
      }
      case 2: {
        this.filtroRegistros.NuFilial = e.value;
        if (e.value == null || this.selectFiliais.length > 1) {
          await this.obterDados(op);
        }
        break;
      }
      case 3: {
        this.filtroRegistros.NuContrato = e.value;
        if (e.value == null || this.selectContratos.length > 1) {
          await this.obterDados(op);
        }
        break;
      }
      case 4: {
        this.filtroRegistros.NuPlanejamentoStatus = e.value;
        if (e.value == null || this.selectStatusPlanejamento.length > 1) {
          await this.obterDados(op);
        }
        break;
      }
      case 5: {
        this.filtroRegistros.NuPlanejamentoTipo = e.value;
        if (e.value == null || this.selectTiposPlanejamento.length > 1) {
          await this.obterDados(op);
        }
        break;
      }
      case 6: {
        this.filtroRegistros.NuDemandaTipo = e.value;
        if (e.value == null || this.selectTiposDemanda.length > 1) {
          await this.obterDados(op);
        }
        break;
      }
      case 7: {
        this.filtroRegistros.IsDigital = e.value;
        await this.obterDados(op);
        break;
      }
      case 8: {
        this.filtroRegistros.DeObjeto = e.value;
        if (e.value == null || this.selectObjeto.length > 1) {
          await this.obterDados(op);
        }
        break;
      }
      // {
      //   this.filtroRegistros.DeObjeto = e.value;
      //   await this.obterDados(op);
      //   break;
      // }
      default: {
        await this.obterDados();
        break;
      }
    }

    this.loading = false;
  }

  loadPage(page: number) {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.filtroRegistros.pageNumber = page;
      this.obterPlanejamentos();
    }
  }

  openModalPlanejamento(tipoModal: string, isEditable: boolean, nuPlanejamento?: number) {
    const modalRef = this.modalService.open(PlanejamentoCadastroComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      windowClass: 'custom-class',
      backdrop: 'static',
      keyboard: false,
    });

    modalRef.componentInstance.nuPlanejamento = nuPlanejamento;
    modalRef.componentInstance.modeloAntigo = true;
    modalRef.componentInstance.isEditable = isEditable;
    modalRef.componentInstance.tipoModal = tipoModal;
    modalRef.componentInstance.atualizarPagina.subscribe((data: boolean) => {
      if (data) {
        this.obterPlanejamentos();
      }
    });
  }

  public async obterPlanejamentos(): Promise<void> {
    try {
      const response = await this.apiService.get<
        ApiResponsePaginado<PlanejamentoOrcamentarioResponse>
      >(`${Endpoints.URL_ORCAMENTO}/paginado`, this.filtroRegistros);

      this.planejamentos = response.data.results;
      this.quantidadeTotal = response.data.totalRecords;

      this.planejamentos.forEach((element) => {
        var vrTotalOrcamentoPlanejamento = 0;
        element.gcptb027PrevisoesDesembolso.forEach((subelement) => {
          vrTotalOrcamentoPlanejamento +=
            subelement.vrJaneiro +
            subelement.vrFevereiro +
            subelement.vrMarco +
            subelement.vrAbril +
            subelement.vrMaio +
            subelement.vrJunho +
            subelement.vrJulho +
            subelement.vrAgosto +
            subelement.vrSetembro +
            subelement.vrOutubro +
            subelement.vrNovembro +
            subelement.vrDezembro;
        });
        element.vrTotalOrcamentoPlanejamento = vrTotalOrcamentoPlanejamento;
      });

      this.loading = false;
    } catch (error) { }
  }

  public downloadPlanejamentoDesembolso() {
    return this.apiService.downloadfile(
      `${Endpoints.URL_ORCAMENTO}/excel`,
      this.filtroRegistros
    );
  }

  limparFiltros(): void {
    this.selectedTipoPlanejamento = null;
    this.selectedAno = null;
    this.selectedFilial = null;
    this.selectedContrato = null;
    this.selectedTipoDemanda = null;
    this.selectedOpcaoIsDigital = null;
    this.selectedStatusPlanejamento = null;
    this.selectedObjeto = null;

    this.filtroRegistros = {
      pageNumber: 1,
      pageSize: this.filtroRegistros.pageSize ?? 12,
      NuAno: null,
      NuFilial: null,
      NuContrato: null,
      NuPlanejamentoStatus: null,
      NuPlanejamentoTipo: null,
      NuDemandaTipo: null,
      IsDigital: null,
      DeObjeto: ''
    };

    this.loading = true;
    this.obterPlanejamentos();
  }
}
