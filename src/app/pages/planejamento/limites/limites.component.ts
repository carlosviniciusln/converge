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
import { Table } from 'primeng/table';
import { ViewChild } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
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
  @ViewChild('dt') dt!: Table;
  @Input() anoExercio: number;
  @Input() tipoExercicio: string;
  loading: boolean = false;
  permissions: ActionPolicies;
  public currentProfile: PerfisEnum;
  public isPerfilAdminOrcamento = false;
  private filteredRawCache: LimitesModel[] = [];
  listaLimites: Partial<LimitesModel>[] = [];
  listaLimitesCompleta: Partial<LimitesModel>[] = [];
  listaAgrupadaBase: Partial<LimitesModel>[] = [];
  ultimoDetalheLimite: LimitesModel;
  selectedUnidadeDemandante: any;
  selectedExercicio: string;
  selectedTipo: any;
  selectedRubrica: any;
  public selectRubrica: Select2Data;
  public listaExercicios: Select2Data;
  public selectFilial: Select2Data;
  expandedRowKeys: { [key: string]: boolean } = {};

  /* ATRIBUTOS FILTROS */

    public filtroRegistros: any = {
    pageNumber: 1,
    pageSize: 10,
    nuFilial: null,
    coRubrica: null,
    noRubricaTipo: null,
    deOrdemProg: null
  };

  public selectTipo: Select2Data;
  constructor(private apiService: ApiService,
    private modalService: NgbModal,
    private token: TokenStorageService,
    private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.obterPermissoes();
    this.obterValores();
  }

  //PERMISSOES
  obterPermissoes() {
    this.permissions = this.token.getActionPolicies(ModuleEnum.Limites);
    this.currentProfile = this.token.getUserPerfil();

    if (this.currentProfile === 'Orçamento' || this.currentProfile === 'Administrador') {
      this.isPerfilAdminOrcamento = true;
    }
  }

  //EXPORTAR EXCEL NOVO
  exportExcel(){
    return this.apiService.downloadfile(
      `${Endpoints.URL_PLANEJAMENTO_ORCAMENTO}/obter-relatorio-limites-excel`,
      this.filtroRegistros
    );

  }

  private norm(sel: any): string {
    if (!sel) return '';
    const v = typeof sel === 'string' ? sel : (sel?.label ?? sel?.value ?? '').toString();
    return v.trim();
  }

  private aplicaFiltroNaBaseCrua(): LimitesModel[] {
    const fExc = this.norm(this.selectedExercicio).trim();
    const fTip = this.norm(this.selectedTipo).trim();
    const fRub = this.norm(this.selectedRubrica).trim();
    const fFil = this.norm(this.selectedUnidadeDemandante).trim();

    const matchRaw = (item: LimitesModel): boolean => {
      const exercicio = (item.deOrdemProg ?? '');
      const tipoPlan = item.noRubricaTipo;
      const rubrica = (item.coRubrica ?? '');
      const filial = (item.sgFilial ?? '');

      const okExercicio = !fExc || exercicio?.includes(fExc);
      const okTipo = !fTip || tipoPlan?.includes(fTip);
      const okRubrica = !fRub || rubrica?.includes(fRub);
      const okUnidade = !fFil || filial?.includes(fFil);

      return okExercicio && okTipo && okRubrica && okUnidade;
    };

    return this.listaLimitesCompleta.filter(matchRaw);
  }

  private groupByExercicio(raw: LimitesModel[]): LimitesModel[] {
    const acc: Record<string, Partial<LimitesModel>> = {};
    raw.forEach(item => {
      const tipo = `${item.deOrdemProg ?? ''}`;

      if (!acc[tipo]) {
        acc[tipo] = {
          coExercicio: item.coExercicio,
          nuPlanejamento: item.nuPlanejamento,
          deOrdemProg: item.deOrdemProg,
          vrLimite: 0,
          vrPlanejamento: 0,
          vrDiferenca: 0,
          expanded: false
        };
      }

      acc[tipo].vrLimite = (acc[tipo].vrLimite ?? 0) + (item.vrLimite ?? 0);
      acc[tipo].vrPlanejamento = (acc[tipo].vrPlanejamento ?? 0) + (item.vrPlanejamento ?? 0);
      acc[tipo].vrDiferenca = (acc[tipo].vrDiferenca ?? 0) + (item.vrDiferenca ?? 0);
    });

    const lista = Object.values(acc) as LimitesModel[];

    // Ordenação similar à sua
    return lista.sort((a, b) => {
      const aExc = a.coExercicio ?? 0;
      const bExc = b.coExercicio ?? 0;
      if (bExc !== aExc) return bExc - aExc;
      const aPlan = a.nuPlanejamento ?? 0;
      const bPlan = b.nuPlanejamento ?? 0;
      return bPlan - aPlan;
    });
  }

  private getFilterValue(sel: any): string {
    if (sel === null || sel === undefined) return '';
    if (typeof sel === 'object') {
      return (sel.value ?? sel.label ?? '').toString().trim();
    }
    return sel.toString().trim();
  }

  trackByPlanejamento = (index: number, item: LimitesModel) => item.nuPlanejamento;

  limparFiltros() {
    this.selectedExercicio = null;
    this.selectedTipo = null;
    this.selectedRubrica = null;
    this.selectedUnidadeDemandante = null;
    this.filterItem();
  }

  filtraTodosNiveis(row: LimitesModel) {
    const fExc = this.getFilterValue(this.selectedExercicio);
    const fTip = this.getFilterValue(this.selectedTipo);
    const fFil = this.getFilterValue(this.selectedUnidadeDemandante);
    const fRub = this.selectedRubrica?.label ?? this.getFilterValue(this.selectedRubrica);

    const filtrado = this.listaLimitesCompleta.filter(item => {
      return (
        item.nuPlanejamento === row.nuPlanejamento &&
        item.deOrdemProg &&
        (!fExc || item.deOrdemProg === fExc) &&
        (!fTip || item.noRubricaTipo === fTip) &&
        (!fRub || item.coRubrica === fRub) &&
        (!fFil || item.sgFilial === fFil)
      );
    });
    return filtrado;
  }

  private buildPrimeiroNivel(row: LimitesModel): LimitesModel[] {
    const filtrado = this.filtraTodosNiveis(row);
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
          deOrdemProg: item.deOrdemProg
        };
      }
      acc[chave].vrLimite += (item.vrLimite ?? 0);
      acc[chave].vrPlanejamento += (item.vrPlanejamento ?? 0);
      acc[chave].vrDiferenca += (item.vrDiferenca ?? 0);
      return acc;
    }, {} as Record<string, LimitesModel>);

    const listaDetalhada = Object.values(agrupado).sort((a, b) =>
      (b.coExercicio ?? 0) !== (a.coExercicio ?? 0)
        ? (b.coExercicio ?? 0) - (a.coExercicio ?? 0)
        : (a.deOrdemProg ?? '').localeCompare(b.deOrdemProg ?? '')
    );

    return listaDetalhada;
  }

  private buildSegundoNivel(row: LimitesModel, tipo: LimitesModel): LimitesModel[] {
    const filtrado = this.filtraTodosNiveis(row);
    const agrupado = filtrado.reduce((acc, item) => {
      const chave = `${item.deOrdemProg}_${item.noRubricaTipo}_${item.nuRubrica}`;
      if (!acc[chave]) {
        acc[chave] = {
          nuLimitePlanejamento: item.nuLimitePlanejamento,
          coExercicio: item.coExercicio,
          noRubricaTipo: item.noRubricaTipo,
          coRubrica: item.coRubrica,
          deRubrica: item.deRubrica,
          vrLimite: 0,
          vrPlanejamento: 0,
          vrDiferenca: 0,
          deOrdemProg: item.deOrdemProg
        };
      }
      acc[chave].vrLimite += (item.vrLimite ?? 0);
      acc[chave].vrPlanejamento += (item.vrPlanejamento ?? 0);
      acc[chave].vrDiferenca += (item.vrDiferenca ?? 0);
      return acc;
    }, {} as Record<string, LimitesModel>);

    const listaDetalhada = Object.values(agrupado).sort((a, b) =>
      (b.coExercicio ?? 0) !== (a.coExercicio ?? 0)
        ? (b.coExercicio ?? 0) - (a.coExercicio ?? 0)
        : (a.deOrdemProg ?? '').localeCompare(b.deOrdemProg ?? '')
    );
    return listaDetalhada.filter(item => item.noRubricaTipo === tipo.noRubricaTipo);
  }

  private buildTerceiroNivel(row: LimitesModel, limite: LimitesModel, contr: LimitesModel): LimitesModel[] {
    const filtrado = this.filtraTodosNiveis(row);
    const agrupado = filtrado.reduce((acc, item) => {
      const chave = `${item.deOrdemProg}_${item.nuRubrica}_${item.coRubrica}_${item.sgFilial}`;
      if (!acc[chave]) {
        acc[chave] = {
          nuLimitePlanejamento: item.nuLimitePlanejamento,
          coExercicio: item.coExercicio,
          noRubricaTipo: item.noRubricaTipo,
          coRubrica: item.coRubrica,
          deRubrica: item.deRubrica,
          sgFilial: item.sgFilial,
          nuRubrica: item.nuRubrica,
          nuFilial: item.nuFilial,
          vrLimite: 0,
          vrPlanejamento: 0,
          vrDiferenca: 0,
          deOrdemProg: item.deOrdemProg
        };
      }
      acc[chave].vrLimite += (item.vrLimite ?? 0);
      acc[chave].vrPlanejamento += (item.vrPlanejamento ?? 0);
      acc[chave].vrDiferenca += (item.vrDiferenca ?? 0);
      return acc;
    }, {} as Record<string, LimitesModel>);

    const listaDetalhada = Object.values(agrupado).sort((a, b) =>
      (b.coExercicio ?? 0) !== (a.coExercicio ?? 0)
        ? (b.coExercicio ?? 0) - (a.coExercicio ?? 0)
        : (a.deOrdemProg ?? '').localeCompare(b.deOrdemProg ?? '')
    );

    return listaDetalhada.filter(item => item.noRubricaTipo === limite.noRubricaTipo && item.deRubrica === contr.deRubrica)
  }

  onTogglePrimeiroNivel(row: LimitesModel) {
    const key = row.nuPlanejamento?.toString();
    if (!key) return;

    if (this.expandedRowKeys[key]) {
      delete this.expandedRowKeys[key];
      row.primeiroNivel = undefined;
      this.cd.detectChanges();
      return;
    }

    row.expanded = true;
    row.primeiroNivel = this.buildPrimeiroNivel(row);
    this.expandedRowKeys[key] = true;
    this.cd.detectChanges();
  }

  onToggleSegundoNivel(row: LimitesModel, tipo: LimitesModel) {
    const key = tipo.noRubricaTipo?.toString();
    if (!key) return;
    if (this.expandedRowKeys[key]) {
      delete this.expandedRowKeys[key];
      row.segundoNivel = undefined;
      this.cd.detectChanges();
      return;
    }
    row.expanded = true;
    row.segundoNivel = this.buildSegundoNivel(row, tipo);
    this.expandedRowKeys[key] = true;
    this.cd.detectChanges();
  }

  onToggleTerceiroNivel(row: LimitesModel, limite: LimitesModel, contr: LimitesModel) {
    const key = contr.coRubrica?.toString();
    if (!key) return;
    if (this.expandedRowKeys[key]) {
      delete this.expandedRowKeys[key];
      row.terceiroNivel = undefined;
      this.cd.detectChanges();
      return;
    }
    row.expanded = true;
    row.terceiroNivel = this.buildTerceiroNivel(row, limite, contr);
    this.expandedRowKeys[key] = true;
    this.cd.detectChanges();
  }

  filtraLista(): LimitesModel[] {
    const fExc = this.norm(this.selectedExercicio).trim();
    const fTipo = this.norm(this.selectedTipo).trim();
    const fRub = this.norm(this.selectedRubrica).trim();
    const fUnid = this.selectedUnidadeDemandante;
    const nenhumFiltro = !fExc && !fTipo && !fRub && !fUnid;

    if (fExc) {
      this.filtroRegistros.deOrdemProg = fExc;
      this.listaLimites.filter(x => x.deOrdemProg === fExc);
    }

    if (fTipo) {
      this.filtroRegistros.noRubricaTipo = fTipo;
      this.listaLimites.filter(x => x.noRubricaTipo === fTipo);
    }

    if (fRub) {
      this.filtroRegistros.coRubrica = fRub;
      this.listaLimites.filter(x => x.coRubrica === fRub);
    }

    if (fUnid) {
      this.filtroRegistros.nuFilial = this.listaLimitesCompleta.filter(x => x.sgFilial === fUnid)[0].nuFilial;
      this.listaLimites.filter(x => x.sgFilial === fUnid);
    }

    if (nenhumFiltro) {
      this.filtroRegistros = {
        pageNumber: 1,
        pageSize: 10,
        nuFilial: null,
        coRubrica: null,
        noRubricaTipo: null,
        deOrdemProg: null
      };
      this.listaLimites = this.listaLimitesCompleta;
    }
    return this.listaLimites;
  }

  filterItem() {
    this.listaLimites = this.listaLimitesCompleta;

    this.processa(this.filtraLista())

    // Colapsa tudo
    this.expandedRowKeys = {};
    this.listaLimites.forEach(r => {
      r.expanded = false;
      r.primeiroNivel = undefined;
      r.segundoNivel = undefined;
      r.segundoExpanded = false;
    });

    this.cd.detectChanges();
  }


  //requisições

  public async obterValores() {
    try {
      this.loading = true;
      const response = await this.apiService.get<ApiResponse<LimitesModel[]>>(
        `${Endpoints.URL_PLANEJAMENTO_ORCAMENTO}/obter-relatorio-limites`
      );
      console.log(response.data)
      this.processa(response.data);
    } catch (error) {
      console.error(error, 'obterValores nivel 1');
    }
  }

  processa(limites: LimitesModel[]) {
    this.loading = true;
    this.listaLimitesCompleta = Array.isArray(limites) ? limites.slice() : [];

    const listaDistinta = Array.from(
      new Set(this.listaLimitesCompleta.map(item => item.deOrdemProg))
    );
    listaDistinta.sort((a, b) => {
      const numA = parseFloat(a);
      const numB = parseFloat(b);

      const isNumA = !isNaN(numA) && /^[0-9]+$/.test(a);
      const isNumB = !isNaN(numB) && /^[0-9]+$/.test(b);

      if (isNumA && isNumB) {
        return numA - numB;
      }
      if (isNumA) return -1;
      if (isNumB) return 1;
      return a.localeCompare(b, 'pt-BR', { numeric: true });
    });
    this.listaExercicios = listaDistinta.map(valor => ({
      value: valor,
      label: valor
    })) as Select2Data;

    const listaDistintaTipo = Array.from(
      new Set(this.listaLimitesCompleta.map(item => item.noRubricaTipo))
    );
    this.selectTipo = listaDistintaTipo.map(valor => ({
      value: valor,
      label: valor
    })) as Select2Data;

    const listaDistintaRubrica = Array.from(
      new Set(this.listaLimitesCompleta.map(item => item.coRubrica))
    );
    listaDistintaRubrica.sort((a, b) => {
      const numA = parseInt(a.split('-')[0], 10);
      const numB = parseInt(b.split('-')[0], 10);

      if (numA !== numB) {
        return numA - numB;
      }
      const subA = a.split('-')[1] ? parseInt(a.split('-')[1], 10) : 0;
      const subB = b.split('-')[1] ? parseInt(b.split('-')[1], 10) : 0;
      return subA - subB;
    });
    this.selectRubrica = listaDistintaRubrica.map(valor => ({
      value: valor,
      label: valor,
    })) as Select2Data;

    const listaDistintaFiliais = Array.from(
      new Set(this.listaLimitesCompleta.map(item => item.sgFilial))
    );
    listaDistintaFiliais.sort((a, b) => a.localeCompare(b, 'pt-BR'));
    this.selectFilial = listaDistintaFiliais.map(valor => ({
      value: valor,
      label: valor
    })) as Select2Data;

    this.filteredRawCache = this.aplicaFiltroNaBaseCrua();
    this.listaAgrupadaBase = this.groupByExercicio(this.filteredRawCache);
    this.listaLimites = this.listaAgrupadaBase.map(x => ({ ...x }));
    this.expandedRowKeys = {}; // tudo colapsado
    this.loading = false;
    this.cd.detectChanges();
  }


  openModalPlanejamento(acao: string, ud?: any, registro?: any) {
    console.log(ud)
    console.log(registro)
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
}
