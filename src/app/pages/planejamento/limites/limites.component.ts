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
  selectedExercicio: number;
  selectedTipo: any;
  selectedRubrica: any;
  public selectRubrica: Select2Data;
  public listaExercicios: Select2Data;
  public selectFilial: Select2Data;

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

  //EXPORTAR EXCEL
  exportExcel() {
    const dadosFiltrados = this.listaLimitesCompleta.map(item => {
      return {
        'Ano': item.cO_EXERCICIO,
        'Tipo': item.dE_PLANEJAMENTO_TIPO,
        'Unidade Demandante': item.sG_FILIAL,
        'Cod. Rubrica': item.cO_RUBRICA,
        'Desc. Rubrica': item.dE_RUBRICA,
        'Limite/Planejado': item.vR_LIMITE,
        'Solicitado': item.vR_PLANEJAMENTO,
        'Diferença': item.vR_DIFERENCA
      }
    })
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(dadosFiltrados);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "Orçamento_Limites_");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    fileSaver.saveAs(data, fileName + new Date().getTime() + EXCEL_EXTENSION);
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
      normaliza(item.cO_EXERCICIO).includes(termo) ||
      normaliza(item.nU_PLANEJAMENTO).includes(termo) ||
      normaliza(item.vR_LIMITE).includes(termo) ||
      normaliza(item.vR_PLANEJAMENTO).includes(termo) ||
      normaliza(item.dE_PLANEJAMENTO_TIPO).includes(termo) ||
      normaliza(item.nO_RUBRICA_TIPO).includes(termo) ||
      normaliza(item.dE_RUBRICA).includes(termo) ||
      normaliza(item.nO_STATUS).includes(termo) ||
      normaliza(item.sG_FILIAL).includes(termo);

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
        if (!item.dE_PLANEJAMENTO_TIPO) return acc;
        if (nuFilial && item.nU_FILIAL !== nuFilial) return acc;
        if (nuExercicio && item.nU_EXERCICIO_ORCAMENTO !== nuExercicio) return acc;
        if (nuRubrica && item.cO_RUBRICA !== nuRubrica) return acc;
        if (tipoProg && item.nO_RUBRICA_TIPO !== tipoProg) return acc;

        const tipo = `${item.dE_PLANEJAMENTO_TIPO}_${item.cO_EXERCICIO}`;

        if (!acc[tipo]) {
          acc[tipo] = {
            nU_PLANEJAMENTO: item.nU_PLANEJAMENTO,
            cO_EXERCICIO: item.cO_EXERCICIO,
            dE_PLANEJAMENTO_TIPO: tipo.split('_')[0],
            vR_LIMITE: 0,
            vR_PLANEJAMENTO: 0,
            vR_DIFERENCA: 0
          };
        }

        acc[tipo].vR_LIMITE += item.vR_LIMITE;
        acc[tipo].vR_PLANEJAMENTO += item.vR_PLANEJAMENTO;
        acc[tipo].vR_DIFERENCA += item.vR_DIFERENCA;

        return acc;
      }, {} as { [key: string]: Partial<LimitesModel> });

      const listaAgrupada = Object.values(agrupado);

      const listaAgrupadaOrdenada = listaAgrupada.sort((a, b) => {
        if (b.cO_EXERCICIO !== a.cO_EXERCICIO) {
          return b.cO_EXERCICIO - a.cO_EXERCICIO;
        }
        return b.nU_PLANEJAMENTO - a.nU_PLANEJAMENTO;
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
        const filtrado = this.listaLimitesCompleta.filter(
          item => item.nU_PLANEJAMENTO === registro.nU_PLANEJAMENTO && item.dE_PLANEJAMENTO_TIPO
            && (!this.selectedUnidadeDemandante || item.nU_FILIAL === this.selectedUnidadeDemandante)
            && (!this.selectedExercicio || item.nU_EXERCICIO_ORCAMENTO === this.selectedExercicio)
            && (!this.selectedRubrica?.label || item.cO_RUBRICA === this.selectedRubrica?.label)
            && (!this.selectedTipo || item.nO_RUBRICA_TIPO === this.selectedTipo)
        );

        const agrupado = filtrado.reduce((acc, item) => {
          const chave = `${item.cO_EXERCICIO}_${item.dE_PLANEJAMENTO_TIPO}_${item.nO_RUBRICA_TIPO}`;

          if (!acc[chave]) {
            acc[chave] = {
              cO_EXERCICIO: item.cO_EXERCICIO,
              dE_PLANEJAMENTO_TIPO: item.dE_PLANEJAMENTO_TIPO,
              nO_RUBRICA_TIPO: item.nO_RUBRICA_TIPO,
              vR_LIMITE: 0,
              vR_PLANEJAMENTO: 0,
              vR_DIFERENCA: 0
            };
          }

          acc[chave].vR_LIMITE += item.vR_LIMITE;
          acc[chave].vR_PLANEJAMENTO += item.vR_PLANEJAMENTO;
          acc[chave].vR_DIFERENCA += item.vR_DIFERENCA;

          return acc;
        }, {} as Record<string, LimitesModel>);

        const listaDetalhada = Object.values(agrupado).sort((a, b) =>
          b.cO_EXERCICIO !== a.cO_EXERCICIO
            ? b.cO_EXERCICIO - a.cO_EXERCICIO
            : a.dE_PLANEJAMENTO_TIPO.localeCompare(b.dE_PLANEJAMENTO_TIPO)
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

        const filtrado = this.listaLimitesCompleta.filter(
          item =>
            item.nU_PLANEJAMENTO === registro.nU_PLANEJAMENTO &&
            item.nO_RUBRICA_TIPO === limite.nO_RUBRICA_TIPO &&
            item.dE_PLANEJAMENTO_TIPO
            && (!this.selectedUnidadeDemandante || item.nU_FILIAL === this.selectedUnidadeDemandante)
            && (!this.selectedExercicio || item.nU_EXERCICIO_ORCAMENTO === this.selectedExercicio)
            && (!this.selectedRubrica?.label || item.cO_RUBRICA === this.selectedRubrica?.label)
            && (!this.selectedTipo?.label || item.nO_RUBRICA_TIPO === this.selectedTipo)
        );

        const agrupado = filtrado.reduce((acc, item) => {
          const chave = `${item.cO_EXERCICIO}_${item.dE_PLANEJAMENTO_TIPO}_${item.nU_RUBRICA}_${item.cO_RUBRICA}`;

          if (!acc[chave]) {
            acc[chave] = {
              cO_EXERCICIO: item.cO_EXERCICIO,
              dE_PLANEJAMENTO_TIPO: item.dE_PLANEJAMENTO_TIPO,
              nU_RUBRICA: item.nU_RUBRICA,
              cO_RUBRICA: item.cO_RUBRICA,
              dE_RUBRICA: item.dE_RUBRICA,
              vR_LIMITE: 0,
              vR_PLANEJAMENTO: 0,
              vR_DIFERENCA: 0
            };
          }

          acc[chave].vR_LIMITE += item.vR_LIMITE;
          acc[chave].vR_PLANEJAMENTO += item.vR_PLANEJAMENTO;
          acc[chave].vR_DIFERENCA += item.vR_DIFERENCA;

          return acc;
        }, {} as Record<string, LimitesModel>);

        const listaDetalhada2 = Object.values(agrupado).sort((a, b) =>
          b.cO_EXERCICIO !== a.cO_EXERCICIO
            ? b.cO_EXERCICIO - a.cO_EXERCICIO
            : a.dE_PLANEJAMENTO_TIPO.localeCompare(b.dE_PLANEJAMENTO_TIPO)
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

        const filtrado = this.listaLimitesCompleta.filter(
          item =>
            item.nU_PLANEJAMENTO === registro.nU_PLANEJAMENTO &&
            item.nO_RUBRICA_TIPO === this.ultimoDetalheLimite.nO_RUBRICA_TIPO &&
            item.nU_RUBRICA === detalhe.nU_RUBRICA &&
            item.dE_PLANEJAMENTO_TIPO
            && (!this.selectedUnidadeDemandante || item.nU_FILIAL === this.selectedUnidadeDemandante)
            && (!this.selectedExercicio || item.nU_EXERCICIO_ORCAMENTO === this.selectedExercicio)
            && (!this.selectedRubrica?.label || item.cO_RUBRICA === this.selectedRubrica?.label)
            && (!this.selectedTipo?.label || item.nO_RUBRICA_TIPO === this.selectedTipo)

        );
        const agrupado = filtrado.reduce((acc, item) => {
          const chave = `${item.cO_EXERCICIO}_${item.dE_PLANEJAMENTO_TIPO}_${item.nU_RUBRICA}_${item.cO_RUBRICA}_${item.sG_FILIAL}`;

          if (!acc[chave]) {
            acc[chave] = {
              cO_EXERCICIO: item.cO_EXERCICIO,
              dE_PLANEJAMENTO_TIPO: item.dE_PLANEJAMENTO_TIPO,
              nU_RUBRICA: item.nU_RUBRICA,
              cO_RUBRICA: item.cO_RUBRICA,
              sG_FILIAL: item.sG_FILIAL,
              dE_RUBRICA: item.dE_RUBRICA,
              vR_LIMITE: 0,
              vR_PLANEJAMENTO: 0,
              vR_DIFERENCA: 0
            };
          }

          acc[chave].vR_LIMITE += item.vR_LIMITE;
          acc[chave].vR_PLANEJAMENTO += item.vR_PLANEJAMENTO;
          acc[chave].vR_DIFERENCA += item.vR_DIFERENCA;

          return acc;
        }, {} as Record<string, LimitesModel>);

        const listaDetalhada3 = Object.values(agrupado).sort((a, b) =>
          b.cO_EXERCICIO !== a.cO_EXERCICIO
            ? b.cO_EXERCICIO - a.cO_EXERCICIO
            : a.dE_PLANEJAMENTO_TIPO.localeCompare(b.dE_PLANEJAMENTO_TIPO)
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
      const filialselecionada =
        this.selectFilial.find(
          (item): item is Select2Option => 'value' in item && item.label === ud.sG_FILIAL
        );
      modalRef.componentInstance.isEditable = true;
      modalRef.componentInstance.registro = ud;
      modalRef.componentInstance.planejamentoEdit = registro.nU_PLANEJAMENTO;
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
      this.listaExercicios = response.data?.map(c => ({ label: c.dE_EXERCICIO, value: c.nU_EXERCICIO_ORCAMENTO }));
    } catch (error) { }
  }

  onFiltroChange(): void {
    if(this.selectedExercicio == null && this.selectedRubrica == null && this.selectedTipo == null && this.selectedUnidadeDemandante == null){
      setTimeout(() => {
        window.location.reload()
      }, 1);
    }else{
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
