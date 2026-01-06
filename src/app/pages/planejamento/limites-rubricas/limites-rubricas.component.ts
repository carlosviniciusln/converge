import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { LimitesRubricaResponse } from 'src/app/models/limites-rubrica-response';
import {
  ActionPolicies,
  ModuleEnum,
  PerfisEnum,
  TokenStorageService,
} from 'src/app/services/token-storage.service';
import { ApiResponse, ApiResponsePaginado } from 'src/app/models/api-response';
import { Endpoints } from 'src/app/shared/enums/endpoints';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Filial } from 'src/app/models/filial';
import { Orcamento } from 'src/app/models/orcamento';
import {
  Gcptb028GrupoRemanejamento,
  RubricaGrupo,
} from 'src/app/models/rubrica';
import { Select2Data, Select2Option } from 'ng-select2-component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LimitesRubricasCadastroComponent } from './limites-rubricas-cadastro/limites-rubricas-cadastro.component';
import { NavigationService } from 'src/app/services/navigation-service';
import { LimitesRubricasUsoComponent } from './limites-rubricas-uso/limites-rubricas-uso.component';
import { PlanejamentoTipoResponse } from 'src/app/models/planejamento-response';

@Component({
  selector: 'app-limites-rubricas',
  templateUrl: './limites-rubricas.component.html',
  styleUrls: ['./limites-rubricas.component.scss'],
})
export class LimitesRubricasComponent implements OnInit {
  title: string = 'Limites Orçamentários por Rubrica';

  limitesRubricas: LimitesRubricaResponse[];
  somaLimitesRubrica: LimitesRubricaResponse;

  listaAnosOrcamentarios: Orcamento[];
  listaRubricas: RubricaGrupo[];
  listaGruposRemanejamento: Gcptb028GrupoRemanejamento[];
  listaFiliais: Filial[];
  listaTiposPlanejamento: PlanejamentoTipoResponse[];

  selectAnosOrcamentarios: Select2Data;
  selectRubricas: Select2Data;
  selectGruposRemanejamento: Select2Data;
  selectFiliais: Select2Data;
  selectTiposPlanejamento: Select2Data;

  selectedAnoOrcamentario: string = null;
  selectedRubrica: string = null;
  selectedGrupoRemanejamento: string = null;
  selectedFilial: string = null;
  selectedTipoPlanejamento: string = null;

  quantidadeTotal: number = 0;
  loading: boolean = true;
  previousPage: any;
  currentUser: any;
  currentProfile: PerfisEnum;

  permissions: ActionPolicies;

  public filtroRegistros: any = {
    pageNumber: 1,
    pageSize: 12,
    NuAnoOrcamentario: null,
    NuRubrica: null,
    NuGrupoRemanejamento: null,
    NuFilial: null,
    NuPlanejamentoTipo: null,
  };

  constructor(
    private apiService: ApiService,
    private modalService: NgbModal,
    public token: TokenStorageService,
    private toastr: ToastrService,
    private navigation: NavigationService
  ) {
    this.pageGuard();
  }

  async ngOnInit(): Promise<void> {
    await this.obterDados();
  }

  pageGuard() {
    this.currentProfile = this.token.getUserPerfil();
    if (this.currentProfile != PerfisEnum.NaoLogado) {
      this.obterPermissoes();
      return;
    }
    this.navigation.navigate('planejamento');
  }

  obterPermissoes() {
    this.permissions = this.token.getActionPolicies(ModuleEnum.Limites);
  }

  async obterDados(op?: number) {
    let list = [5, 4, 3, 2, 1, 0];

    if (op != null) {
      list = list.filter((x) => x !== op);
    }

    list.forEach((element) => {
      switch (element) {
        case 0:
          this.obterLimitesRubrica();
          break;
        case 1:
          this.obterAnosOrcamentarios();
          break;
        case 2:
          this.obterRubricas();
          break;
        case 3:
          this.obterGruposRemanejamento();
          break;
        case 4:
          this.obterFiliais();
          break;
        case 5:
          this.obterTiposPlanejamento();
          break;
        default:
          break;
      }
    });
  }

  public async obterAnosOrcamentarios(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<Orcamento[]>>(
        `${Endpoints.URL_ORCAMENTO}/limite-orcamentario/anos-orcamentarios`,
        this.filtroRegistros
      );

      this.listaAnosOrcamentarios = response.data;
      this.selectAnosOrcamentarios = this.listaAnosOrcamentarios.map(
        (m) =>
          ({
            value: m.nuOrcamento,
            label: `${m.nuAnoOrcamento}`,
          } as Select2Option)
      );
    } catch (error) {}
  }

  public async obterRubricas(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<RubricaGrupo[]>>(
        `${Endpoints.URL_ORCAMENTO}/limite-orcamentario/rubricas`,
        this.filtroRegistros
      );

      this.listaRubricas = response.data;

      this.selectRubricas = this.listaRubricas.map(
        (m) =>
          ({
            value: m.nuRubrica,
            label: `${m.coRubrica} - ${m.deRubrica}`,
          } as Select2Option)
      );
    } catch (error) {}
  }

  public async obterGruposRemanejamento(): Promise<void> {
    try {
      const response = await this.apiService.get<
        ApiResponse<Gcptb028GrupoRemanejamento[]>
      >(
        `${Endpoints.URL_ORCAMENTO}/limite-orcamentario/grupos-remanejamento`,
        this.filtroRegistros
      );

      this.listaGruposRemanejamento = response.data;

      this.selectGruposRemanejamento = this.listaGruposRemanejamento.map(
        (m) =>
          ({
            value: m.nuGrupoRemanejamento,
            label: `${m.coGrupoRemanejamento} - ${m.deGrupoRemanejamento}`,
          } as Select2Option)
      );
    } catch (error) {}
  }

  public async obterFiliais(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<Filial[]>>(
        `${Endpoints.URL_ORCAMENTO}/limite-orcamentario/gerencias-nacionais`,
        this.filtroRegistros
      );

      this.listaFiliais = response.data;

      this.selectFiliais = this.listaFiliais
        .filter((f) => f.nuFilialPai != null)
        .map(
          (m) => ({ value: m.nuFilial, label: m.sgFilial } as Select2Option)
        );
    } catch (error) {}
  }

  public async obterTiposPlanejamento(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<PlanejamentoTipoResponse[]>>(
        `${Endpoints.URL_ORCAMENTO}/limite-orcamentario/tipos-planejamento`,
        this.filtroRegistros
      );

      this.listaTiposPlanejamento = response.data;

      this.selectTiposPlanejamento = this.listaTiposPlanejamento
        .filter((f) => f.nuPlanejamentoTipo != null)
        .map(
          (m) => ({ value: m.nuPlanejamentoTipo, label: m.dePlanejamentoTipo } as Select2Option)
        );
    } catch (error) {}
  }

  async updateRelatorio(e, op: number): Promise<void> {
    this.loading = true;

    switch (op) {
      case 1: {
        this.filtroRegistros.NuAnoOrcamentario = e.value;
        if (e.value == null || this.selectAnosOrcamentarios.length > 1) {
          await this.obterDados(op);
        }
        break;
      }
      case 2: {
        this.filtroRegistros.NuRubrica = e.value;
        if (e.value == null || this.selectRubricas.length > 1) {
          await this.obterDados(op);
        }
        break;
      }
      case 3: {
        this.filtroRegistros.NuGrupoRemanejamento = e.value;
        if (e.value == null || this.selectGruposRemanejamento.length > 1) {
          await this.obterDados(op);
        }
        break;
      }
      case 4: {
        this.filtroRegistros.NuFilial = e.value;
        if (e.value == null || this.selectFiliais.length > 1) {
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
      this.obterLimitesRubrica();
    }
  }

  openModalUsoLimitesRubricas() {
    const modalRef = this.modalService.open(LimitesRubricasUsoComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      windowClass: 'custom-class',
      backdrop: 'static',
      keyboard: false,
    });

    modalRef.componentInstance.filtro = this.filtroRegistros;
  }

  openModalLimitesRubricas(
    isEditable: boolean,
    limiteRubrica?: LimitesRubricaResponse
  ) {
    const modalRef = this.modalService.open(LimitesRubricasCadastroComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'md',
      windowClass: 'custom-class',
      backdrop: 'static',
      keyboard: false,
    });

    modalRef.componentInstance.limiteRubrica = limiteRubrica;
    modalRef.componentInstance.isEditable = isEditable;
    modalRef.componentInstance.atualizarPagina.subscribe((data: boolean) => {
      if (data) {
        this.obterLimitesRubrica();
      }
    });
  }

  public async obterLimitesRubrica(): Promise<void> {
    try {
      const response = await this.apiService.get<
        ApiResponsePaginado<LimitesRubricaResponse>
      >(
        `${Endpoints.URL_ORCAMENTO}/limite-orcamentario/listar-paginado`,
        this.filtroRegistros
      );

      this.limitesRubricas = response.data.results;
      this.quantidadeTotal = response.data.totalRecords;
      this.sumariza();

      this.loading = false;
    } catch (error) {}
  }

  sumariza() {
    this.somaLimitesRubrica = {
      nuRubrica: null,
      nuFilial: null,
      nuAnoOrcamentario: null,
      nuPlanejamentoTipo: null,
      gcptb003Rubrica: null,
      gcptb005Filial: null,
      gcptb010Orcamento: null,
      gcptb019PlanejamentoTipo: null,
      vrLimiteRubrica: 0,
      dhCadastro: null,
      dhAlteracao: null,
      dhExclusao: null,
    };

    this.limitesRubricas.forEach((element) => {
      this.somaLimitesRubrica.vrLimiteRubrica += element.vrLimiteRubrica;
    });
  }

  async Excluir(limiteRubrica: LimitesRubricaResponse) {
    const alert = await Swal.fire({
      title: '',
      html: `Deseja realmente excluir limite rubrica?
        <br>Exercício: ${limiteRubrica.gcptb010Orcamento.nuAnoOrcamento}
        <br>Rubrica: ${limiteRubrica.gcptb003Rubrica.coRubrica}
        <br>UD: ${limiteRubrica.gcptb005Filial.sgFilial}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Não, cancelar!',
    }).then((result) => {
      if (result.value) {
        return true;
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        return false;
      }
    });

    if (alert) {
      this.loading = true;

      const deleteQuery = {
        nuAnoOrcamentario: limiteRubrica.nuAnoOrcamentario,
        nuRubrica: limiteRubrica.nuRubrica,
        nuFilial: limiteRubrica.nuFilial,
        nuPlanejamentoTipo: limiteRubrica.nuPlanejamentoTipo,
      };

      try {
        const response = await this.apiService.delete<ApiResponse<boolean>>(
          `${Endpoints.URL_ORCAMENTO}/limite-orcamentario`,
          deleteQuery
        );

        this.toastr.success(`Limite rubrica excluído com sucesso.`, 'Sucesso');
        this.obterLimitesRubrica();
      } catch (error) {
        console.error(error, 'aquirsd');
      }
      this.loading = false;
    }
  }

  limparFiltros(): void {
    this.selectedAnoOrcamentario = null;
    this.selectedRubrica = null;
    this.selectedGrupoRemanejamento = null;
    this.selectedFilial = null;
    this.selectedTipoPlanejamento = null;

    this.filtroRegistros = {
      pageNumber: 1,
      pageSize: this.filtroRegistros.pageSize ?? 10, 

      NuAno: null,
      NuRubrica: null,
      NuGrupoRemanejamento: null,
      NuFilial: null,
      NuPlanejamentoTipo: null, 
      ...(this.filtroRegistros?.Field !== undefined && { Field: null }),
      ...(this.filtroRegistros?.Order !== undefined && { Order: null }),
    };

    this.loading = true;
    this.obterDados(); 
  }
}
