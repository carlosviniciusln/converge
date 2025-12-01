import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ExercicioModel, LimitesModel } from 'src/app/models/limites-model';
import * as fileSaver from 'file-saver';
import { ActionPolicies, ModuleEnum, PerfisEnum, TokenStorageService } from 'src/app/services/token-storage.service';
import { ApiResponse } from 'src/app/models/api-response';
import { ApiService } from 'src/app/services/api.service';
import { Endpoints } from 'src/app/shared/enums/endpoints';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ModalLimitesComponent } from './modal-limites/modal-limites.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalUploadComponent } from './modal-upload/modal-upload.component';
import { Select2Data, Select2Option } from 'ng-select2-component';
import { Filial } from 'src/app/models/filial';
import { Rubrica } from 'src/app/models/rubrica';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-limites',
  templateUrl: './limites.component.html',
  styleUrls: ['./limites.component.scss'],
  animations: [
    trigger('rowExpansionTrigger', [
      state('void', style({
        transform: 'translateX(-10%)',
        opacity: 0
      })),
      state('active', style({
        transform: 'translateX(0)',
        opacity: 1
      })),
      transition('* <=> *', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ]
})
export class LimitesComponent implements OnInit {
  @Input() anoExercio: number;
  @Input() tipoExercicio: string;
  loading: boolean = false;
  permissions: ActionPolicies;
  public currentProfile: PerfisEnum;
  public isPerfilAdminOrcamento = false;
  listaLimites: Partial<LimitesModel>[] = [];
  listaLimitesCompleta: Partial<LimitesModel>[] = [];
  ultimoDetalheLimite: LimitesModel;
  selectedUnidadeDemandante: number;
  selectedExercicio: string;
  selectedTipo: any;
  selectedRubrica: any;
  public selectRubrica: Select2Data;
  public listaExercicios: Select2Data;
  public selectFilial: Select2Data;


  /* ATRIBUTOS FILTROS */

    public filtroRegistros: any = {
    pageNumber: 1,
    pageSize: 10,
    nuFilial: null,
    coRubrica: null,
    noRubricaTipo: null,
    deOrdemProg: null
  };

  public readonly selectTipo: {
      label: string;
      value: string;
    }[] = [
        {
          label: 'CAPEX',
          value: 'CAPEX',
        },
        {
          label: 'OPEX',
          value: 'OPEX',
        },
      ];
  constructor(private apiService: ApiService,
    private modalService: NgbModal,
    private token: TokenStorageService) { }

  ngOnInit() {
    this.obterPermissoes();
    this.obterValores();
    this.obterFiliais();
    this.obterRubricas();
    this.obterOrcamentos();
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes['nuPlanejamento'] && changes['nuPlanejamento'].currentValue) {

  //   }
  // }

  //PERMISSOES
  obterPermissoes() {
    this.permissions = this.token.getActionPolicies(ModuleEnum.Limites);
    this.currentProfile = this.token.getUserPerfil();

    if (this.currentProfile === 'Orçamento' || this.currentProfile === 'Administrador') {
      this.isPerfilAdminOrcamento = true;
    }
  }

  //EXPORTAR EXCEL ANTIGO
  // exportExcel() {
  //   const dadosFiltrados = this.listaLimitesCompleta.map(item => {
  //     return {
  //       'Ano': item.cO_EXERCICIO,
  //       'Tipo': item.dE_ORDEM_PROG,
  //       'Unidade Demandante': item.sG_FILIAL,
  //       'Cod. Rubrica': item.cO_RUBRICA,
  //       'Desc. Rubrica': item.dE_RUBRICA,
  //       'Limite/Planejado': item.vR_LIMITE,
  //       'Solicitado': item.vR_PLANEJAMENTO,
  //       'Diferença': item.vR_DIFERENCA
  //     }
  //   })
  //   import("xlsx").then(xlsx => {
  //     const worksheet = xlsx.utils.json_to_sheet(dadosFiltrados);
  //     const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  //     const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
  //     this.saveAsExcelFile(excelBuffer, "Orçamento_Limites_");
  //   });
  // }

  // saveAsExcelFile(buffer: any, fileName: string): void {
  //   let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  //   let EXCEL_EXTENSION = '.xlsx';
  //   const data: Blob = new Blob([buffer], {
  //     type: EXCEL_TYPE
  //   });
  //   fileSaver.saveAs(data, fileName + new Date().getTime() + EXCEL_EXTENSION);
  // }

  //EXPORTAR EXCEL NOVO

  exportExcel(){
    return this.apiService.downloadfile(
      `${Endpoints.URL_PLANEJAMENTO_ORCAMENTO}/obter-relatorio-limites-excel`,
      this.filtroRegistros
    );

  }


  //FILTRO
filterItem(value: string) {
  const termo = value.trim().toLowerCase().replace(/[.,]/g, ''); // remove pontos e vírgulas

  if (!termo) {
    this.listaLimites = this.listaLimitesCompleta.map(item => ({ ...item }));
    return;
  }

  const normaliza = (val: any) => val?.toString().toLowerCase().replace(/[.,]/g, '') ?? '';

  const matchAndClean = (item: LimitesModel): LimitesModel | null => {
    const matchPrincipal =
    normaliza(item.deOrdemProg).includes(termo) ||
      normaliza(item.coExercicio).includes(termo) ||
      normaliza(item.nuPlanejamento).includes(termo) ||
      normaliza(item.vrLimite).includes(termo) ||
      normaliza(item.vrPlanejamento).includes(termo) ||
      normaliza(item.dePlanejamentoTipo).includes(termo) ||
      normaliza(item.noRubricaTipo).includes(termo) ||
      normaliza(item.deRubrica).includes(termo) ||
      normaliza(item.noStatus).includes(termo) ||
      normaliza(item.sgFilial).includes(termo);


    const detalhesFiltrados = item.detalhes?.map(matchAndClean).filter(Boolean) ?? [];
    const segundoNivelFiltrado = item.segundoNivel?.map(matchAndClean).filter(Boolean) ?? [];
    const terceiroNivelFiltrado = item.terceiroNivel?.map(matchAndClean).filter(Boolean) ?? [];

    if (matchPrincipal) {
      return {
        ...item,
        detalhes: item.detalhes ?? [],
        segundoNivel: item.segundoNivel ?? [],
        terceiroNivel: item.terceiroNivel ?? []
      };
    }
    if (detalhesFiltrados.length || segundoNivelFiltrado.length || terceiroNivelFiltrado.length) {
      return {
        ...item,
        detalhes: detalhesFiltrados,
        segundoNivel: segundoNivelFiltrado,
        terceiroNivel: terceiroNivelFiltrado
      };
    }

    return null;
  };

  this.listaLimites = this.listaLimitesCompleta
    .map(matchAndClean)
    .filter(Boolean) as LimitesModel[];
}
  //requisições
  public async obterValores() {
    try {
      this.loading = true;
      const response = await this.apiService.get<
        ApiResponse<LimitesModel[]>
      >(`${Endpoints.URL_PLANEJAMENTO_ORCAMENTO}/Obter-relatorio-limites`);
      const nuFilial = this.selectedUnidadeDemandante;
      const nuExercicio = this.selectedExercicio;
      const nuRubrica = this.selectedRubrica?.label;
      const tipoProg = this.selectedTipo;

      const agrupado = response.data.reduce((acc, item) => {
        const passaFiltro =
          (!nuFilial || item.nuFilial === nuFilial) &&
          (!nuExercicio || item.deOrdemProg === nuExercicio) &&
          (!nuRubrica || item.coRubrica === nuRubrica) &&
          (!tipoProg || item.noRubricaTipo === tipoProg);

        if (!passaFiltro) return acc;

        const tipo = `${item.deOrdemProg}`;

        if (!acc[tipo]) {
          acc[tipo] = {
            coExercicio: item.coExercicio,
            nuPlanejamento: item.nuPlanejamento,
            deOrdemProg: item.deOrdemProg,
            vrLimite: 0,
            vrPlanejamento: 0,
            vrDiferenca: 0
          };
        }

        acc[tipo].vrLimite += item.vrLimite;
        acc[tipo].vrPlanejamento += item.vrPlanejamento;
        acc[tipo].vrDiferenca += item.vrDiferenca;

        return acc;
      }, {} as { [key: string]: Partial<LimitesModel> });

      const listaAgrupada = Object.values(agrupado);

      const listaAgrupadaOrdenada = listaAgrupada.sort((a, b) => {
        if (b.coExercicio !== a.coExercicio) {
          return b.coExercicio - a.coExercicio;
        }
        return b.nuPlanejamento - a.nuPlanejamento;
      });

      this.listaLimites = Object.values(listaAgrupadaOrdenada);
      this.listaLimitesCompleta = Object.values(response.data)
      this.loading = false;
    } catch (error) {
      console.error(error, 'obterValores nivel 1');
    }
  }

  async detalharPorTipoRubrica(registro: LimitesModel) {
    try {
      registro.expanded = !registro.expanded;
      if (registro.expanded && !registro.detalhes) {
        const filtrado = this.listaLimitesCompleta.filter(item => {
          return (
            item.nuPlanejamento === registro.nuPlanejamento &&
            item.deOrdemProg &&
            (!this.selectedUnidadeDemandante || item.nuFilial === this.selectedUnidadeDemandante) &&
            (!this.selectedExercicio || item.deOrdemProg === this.selectedExercicio) &&
            (!this.selectedRubrica?.label || item.coRubrica === this.selectedRubrica.label) &&
            (!this.selectedTipo || item.noRubricaTipo === this.selectedTipo)
          );
        });

        const agrupado = filtrado.reduce((acc, item) => {
          const chave = `${item.deOrdemProg}_${item.noRubricaTipo}`;

          if (!acc[chave]) {
            acc[chave] = {
              nuLimitePlanejamento: item.nuLimitePlanejamento,
              coExercicio: item.coExercicio,
              noRubricaTipo: item.noRubricaTipo,
              vrLimite: 0,
              vrPlanejamento: 0,
              vrDiferenca: 0,
              deOrdemProg: item.deOrdemProg,
            };
          }

          acc[chave].vrLimite += item.vrLimite;
          acc[chave].vrPlanejamento += item.vrPlanejamento;
          acc[chave].vrDiferenca += item.vrDiferenca;

          return acc;
        }, {} as Record<string, LimitesModel>);

        const listaDetalhada = Object.values(agrupado).sort((a, b) =>
          b.coExercicio !== a.coExercicio
            ? b.coExercicio - a.coExercicio
            : a.deOrdemProg.localeCompare(b.deOrdemProg)
        );

        registro.detalhes = listaDetalhada;
      }
    } catch (error) {
      console.error(error, 'obterValores nivel 2');
    }
  }

  async detalharPorRubricaTipo(registro: LimitesModel, limite: any) {
    this.ultimoDetalheLimite = limite;
    try {
      if (!limite.segundoNivel) {
        limite.segundoNivel = [];
      }
      limite.expanded = !limite.expanded;
      if (limite.expanded && !limite.segundoNivel.data) {
        const filtrado = this.listaLimitesCompleta.filter(item => {
          return (
            item.nuPlanejamento === registro.nuPlanejamento &&
            item.noRubricaTipo === limite.noRubricaTipo &&
            item.deOrdemProg &&
            (!this.selectedUnidadeDemandante || item.nuFilial === this.selectedUnidadeDemandante) &&
            (!this.selectedExercicio || item.deOrdemProg === this.selectedExercicio) &&
            (!this.selectedRubrica?.label || item.coRubrica === this.selectedRubrica.label) &&
            (!this.selectedTipo?.label || item.noRubricaTipo === this.selectedTipo.label)
          );
        });

        const agrupado = filtrado.reduce((acc, item) => {
          const chave = `${item.deOrdemProg}_${item.nuRubrica}_${item.coRubrica}`;

          if (!acc[chave]) {
            acc[chave] = {
              nuLimitePlanejamento: item.nuLimitePlanejamento,
              coExercicio: item.coExercicio,
              nuRubrica: item.nuRubrica,
              coRubrica: item.coRubrica,
              deRubrica: item.deRubrica,
              vrLimite: 0,
              vrPlanejamento: 0,
              vrDiferenca: 0,
              deOrdemProg: item.deOrdemProg
            };
          }

          acc[chave].vrLimite += item.vrLimite;
          acc[chave].vrPlanejamento += item.vrPlanejamento;
          acc[chave].vrDiferenca += item.vrDiferenca;

          return acc;
        }, {} as Record<string, LimitesModel>);

        const listaDetalhada2 = Object.values(agrupado).sort((a, b) =>
          b.coExercicio !== a.coExercicio
            ? b.coExercicio - a.coExercicio
            : a.deOrdemProg.localeCompare(b.deOrdemProg)
        );

        registro.segundoNivel = listaDetalhada2;
      }
    }
    catch (error) {
      console.error(error, 'obterValores nivel 3');
    }
  }

  async detalharPorUd(registro: LimitesModel, detalhe: any, nuFilial?: number) {
    try {
      if (!detalhe.terceiroNivel) {
        detalhe.terceiroNivel = [];
      }
      detalhe.expanded = !detalhe.expanded;
      if (detalhe.expanded && !detalhe.terceiroNivel.data) {

        const filtrado = this.listaLimitesCompleta.filter(item => {
          return (
            item.nuPlanejamento === registro.nuPlanejamento &&
            item.noRubricaTipo === this.ultimoDetalheLimite.noRubricaTipo &&
            item.nuRubrica === detalhe.nuRubrica &&
            item.deOrdemProg &&
            (!this.selectedUnidadeDemandante || item.nuFilial === this.selectedUnidadeDemandante) &&
            (!this.selectedExercicio || item.deOrdemProg === this.selectedExercicio) &&
            (!this.selectedRubrica?.label || item.coRubrica === this.selectedRubrica.label) &&
            (!this.selectedTipo?.label || item.noRubricaTipo === this.selectedTipo.label)
          );
        });

        const agrupado = filtrado.reduce((acc, item) => {
          const chave = `${item.deOrdemProg}_${item.nuRubrica}_${item.coRubrica}_${item.sgFilial}`;

          if (!acc[chave]) {
            acc[chave] = {
              nuLimitePlanejamento: item.nuLimitePlanejamento,
              coExercicio: item.coExercicio,
              nuRubrica: item.nuRubrica,
              coRubrica: item.coRubrica,
              sgFilial: item.sgFilial,
              deRubrica: item.deRubrica,
              vrLimite: 0,
              vrPlanejamento: 0,
              vrDiferenca: 0,
              deOrdemProg: item.deOrdemProg
            };
          }

          acc[chave].vrLimite += item.vrLimite;
          acc[chave].vrPlanejamento += item.vrPlanejamento;
          acc[chave].vrDiferenca += item.vrDiferenca;

          return acc;
        }, {} as Record<string, LimitesModel>);

        const listaDetalhada3 = Object.values(agrupado).sort((a, b) =>
          b.coExercicio !== a.coExercicio
            ? b.coExercicio - a.coExercicio
            : a.deOrdemProg.localeCompare(b.deOrdemProg)
        );
        registro.terceiroNivel = listaDetalhada3;
      }
    }
    catch (error) {
      console.error(error, 'obterValores nivel 4');
    }
  }

  openModalPlanejamento(acao: string, ud?: any, registro?: any) {
    if (acao == 'cadastro') {
      const modalRef = this.modalService.open(ModalLimitesComponent, {
        ariaLabelledBy: 'modal-basic-title',
        size: 'md',
        windowClass: 'custom-class',
        backdrop: 'static',
        keyboard: false,
      });
      modalRef.componentInstance.isEditable = false;
    } else if (acao == 'alteracao') {
      const modalRef = this.modalService.open(ModalLimitesComponent, {
        ariaLabelledBy: 'modal-basic-title',
        size: 'md',
        windowClass: 'custom-class',
        backdrop: 'static',
        keyboard: false,
      });
      const filialselecionada = this.selectFilial.find((item): item is Select2Option => 'value' in item && item.label === ud.sgFilial);
      modalRef.componentInstance.isEditable = true;
      modalRef.componentInstance.registro = ud;
      modalRef.componentInstance.planejamentoEdit = registro.nuPlanejamento;
      modalRef.componentInstance.nuFilialEdit = filialselecionada?.value;
    }
  }

  openModalUpload() {
    const modalRef = this.modalService.open(ModalUploadComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'md',
      windowClass: 'custom-class',
      backdrop: 'static',
      keyboard: false,
    });
    //modalRef.componentInstance.anoSelecionado = anoSelecionado;
  }

  public async obterFiliais(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<Filial[]>>(
        `${Endpoints.URL_FILIAL}/ativos`
      );

      this.selectFilial = response?.data?.filter((x) => x.nuFilialPai != null).map(c => ({ label: c.sgFilial, value: c.nuFilial }));
    } catch (error) {
    }
  }

  public async obterRubricas(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<Rubrica[]>>(
        `${Endpoints.URL_RUBRICA}/ativas`
      );

      this.selectRubrica = response?.data?.map(c => ({ label: c.coRubrica, value: c.nuRubrica + '-' + c.deRubrica }));
    } catch (error) {
    }
  }

  public async obterOrcamentos(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<ExercicioModel[]>>(
        `${Endpoints.URL_CONTRATOS}/exercicios-ativos`
      );
      this.listaExercicios = response.data?.map(c => ({ label: c.dE_EXERCICIO, value: c.dE_EXERCICIO }));
    } catch (error) { }
  }

  onFiltroChange(e, op: number): void {
    console.log()
     switch (op) {
        case 1:
          this.filtroRegistros.deOrdemProg = e.value;
          break;
        case 2:
          this.filtroRegistros.noRubricaTipo = e.value;
          break;
        case 3:
          this.filtroRegistros.coRubrica = e.value?.label;
          break;
        case 4:
          this.filtroRegistros.nuFilial = e.value;
          break;
        default:
          break
      }

    if (this.selectedExercicio == null && this.selectedRubrica == null && this.selectedTipo == null && this.selectedUnidadeDemandante == null) {
      setTimeout(() => {
        window.location.reload()
      }, 1);
    } else {
      this.obterValores();
      this.listaLimitesCompleta.forEach(item => {
        item.expanded = false;
        item.detalhes = undefined;
        item.segundoNivel = undefined;
        item.terceiroNivel = undefined;
      });
    }

  }

}
