
import { Component, Input, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Table } from 'primeng/table';

import { ApiService } from 'src/app/shared/services/api.service';
import { Endpoints } from 'src/app/models/enums/endpoints';
import { ApiResponse } from 'src/app/models/generics/api-response';
import { ActionPolicies, ModuleEnum, PerfisEnum, TokenStorageService } from 'src/app/shared/services/token-storage.service';

import { ModalLimitesComponent } from './modal-limites/modal-limites.component';
import { ModalUploadComponent } from './modal-upload/modal-upload.component';

import { Select2Data, Select2Option } from 'ng-select2-component';
import { LimitesModel } from 'src/app/models/generics/limites-model';
import Swal from 'sweetalert2';
import { ModalHistoricoComponent } from './modal-historico/modal-historico.component';

@Component({
  selector: 'app-limites',
  templateUrl: './limites.component.html',
  styleUrls: ['./limites.component.scss'],
  animations: [
    trigger('rowExpansionTrigger', [
      state('void', style({ transform: 'translateX(-10%)', opacity: 0 })),
      state('active', style({ transform: 'translateX(0)', opacity: 1 })),
      transition('* <=> *', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ]
})
export class LimitesComponent implements OnInit {
  @ViewChild('dt') dt!: Table;

  @Input() anoExercio!: number;
  @Input() tipoExercicio!: string;

  loading = false;
  permissions!: ActionPolicies;
  public currentProfile!: PerfisEnum;
  public isPerfilAdminOrcamento = false;
  private listaCompletaMaster: LimitesModel[] = [];

  private filteredRawCache: LimitesModel[] = [];
  listaLimites: LimitesModel[] = [];
  listaLimitesCompleta: LimitesModel[] = [];
  listaAgrupadaBase: LimitesModel[] = [];

  selectedUnidadeDemandante: any;
  selectedExercicio!: string;
  selectedTipo: any;
  selectedRubrica: any;

  public selectRubrica: Select2Data = [];
  public listaExercicios: Select2Data = [];
  public selectFilial: Select2Data = [];
  public selectTipo: Select2Data = [];

  private initialListaExercicios: Select2Data = [];
  private initialSelectTipo: Select2Data = [];
  private initialSelectRubrica: Select2Data = [];
  private initialSelectFilial: Select2Data = [];

  expandedKeysL0: { [key: string]: boolean } = {};
  expandedKeysL1: { [key: string]: boolean } = {};
  expandedKeysL2: { [key: string]: boolean } = {};

  public filtroRegistros: any = {
    pageNumber: 1,
    pageSize: 10,
    nuFilial: null,
    coRubrica: null,
    noRubricaTipo: null,
    deOrdemProg: null
  };

  constructor(
    private apiService: ApiService,
    private modalService: NgbModal,
    private token: TokenStorageService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.obterPermissoes();
    this.obterValores();
  }

  obterPermissoes() {
    this.permissions = this.token.getActionPolicies(ModuleEnum.Limites);
    this.currentProfile = this.token.getUserPerfil();
    this.isPerfilAdminOrcamento = (this.currentProfile === 'Orçamento' || this.currentProfile === 'Administrador');
  }

  exportExcel() {
    return this.apiService.downloadfile(
      `${Endpoints.URL_PLANEJAMENTO_ORCAMENTO}/obter-relatorio-limites-excel`,
      this.filtroRegistros
    );
  }

    public visualizaHistorico(nuPlanejamento: any){

        const modalRef = this.modalService.open(ModalHistoricoComponent, {

          ariaLabelledBy: 'modal-basic-title',
          size: 'lg',
          fullscreen: 'xl',
          windowClass: 'modal-h-90',
          backdrop: 'static',
          keyboard: false,
          scrollable: true,

          });

          modalRef.componentInstance.nuPlanejamento = nuPlanejamento.nuPlanejamento;
          modalRef.componentInstance.nuLimitePlanejamento = null;
          modalRef.componentInstance.dePlanejamento = nuPlanejamento.deOrdemProg;
    }

  private norm(sel: any): string {
    if (!sel) return '';
    const v = typeof sel === 'string' ? sel : (sel?.label ?? sel?.value ?? '').toString();
    return v.trim();
  }

  private getFilterValue(sel: any): string {
    if (sel === null || sel === undefined) return '';
    if (typeof sel === 'object') return (sel.value ?? sel.label ?? '').toString().trim();
    return sel.toString().trim();
  }

  private keyL0(row: Partial<LimitesModel>): string {
    return `L0|${row.coExercicio}|${row.deOrdemProg}`;
  }
  private keyL1(tipo: Partial<LimitesModel>): string {
    return `L1|${tipo.coExercicio}|${tipo.deOrdemProg}|${tipo.noRubricaTipo}`;
  }
  private keyL2(contr: Partial<LimitesModel>): string {
    return `L2|${contr.coExercicio}|${contr.deOrdemProg}|${contr.coRubrica}`;
  }
  private keyL3(ud: Partial<LimitesModel>): string {
    return `L3|${ud.coExercicio}|${ud.deOrdemProg}|${ud.noRubricaTipo}|${ud.coRubrica}|${ud.sgFilial}|${ud.deRubrica}`;
  }

  trackByNivel0 = (index: number, item: LimitesModel) => (item as any).nivel0Key ?? this.keyL0(item);
  trackByNivel1 = (index: number, item: LimitesModel) => (item as any).nivel1Key ?? this.keyL1(item);
  trackByNivel2 = (index: number, item: LimitesModel) => (item as any).nivel2Key ?? this.keyL2(item);
  trackByNivel3 = (index: number, item: LimitesModel) => (item as any).nivel3Key ?? this.keyL3(item);

  private aplicaFiltroNaBaseCrua(): LimitesModel[] {
    const fExc = this.norm(this.selectedExercicio).trim();
    const fTip = this.norm(this.selectedTipo).trim();
    const fRub = this.norm(this.selectedRubrica).trim();
    const fFil = this.norm(this.selectedUnidadeDemandante).trim();

    const matchRaw = (item: LimitesModel): boolean => {
      const exercicio = (item.deOrdemProg ?? '');
      const tipoPlan = item.noRubricaTipo ?? '';
      const rubrica = (item.coRubrica ?? '');
      const filial = (item.sgFilial ?? '');

      const okExercicio = !fExc || exercicio.includes(fExc);
      const okTipo = !fTip || tipoPlan.includes(fTip);
      const okRubrica = !fRub || rubrica.includes(fRub);
      const okUnidade = !fFil || filial.includes(fFil);

      return okExercicio && okTipo && okRubrica && okUnidade;
    };

    return this.listaLimitesCompleta.filter(matchRaw);
  }

  private groupByExercicio(raw: LimitesModel[]): LimitesModel[] {
    const acc: Record<string, LimitesModel> = {};
    raw.forEach(item => {
      const grupo = `${item.deOrdemProg ?? ''}`;

      if (!acc[grupo]) {
        acc[grupo] = {
          nuPlanejamento: item.nuPlanejamento,
          coExercicio: item.coExercicio,
          deOrdemProg: item.deOrdemProg,
          vrLimite: 0,
          vrPlanejamento: 0,
          vrDiferenca: 0
        } as LimitesModel;
      }
      acc[grupo].vrLimite = (acc[grupo].vrLimite ?? 0) + (item.vrLimite ?? 0);
      acc[grupo].vrPlanejamento = (acc[grupo].vrPlanejamento ?? 0) + (item.vrPlanejamento ?? 0);
      acc[grupo].vrDiferenca = (acc[grupo].vrDiferenca ?? 0) + (item.vrDiferenca ?? 0);
    });

    const lista = Object.values(acc) as LimitesModel[];
    return lista.sort((a, b) => {
      const aExc = a.coExercicio ?? 0;
      const bExc = b.coExercicio ?? 0;
      if (bExc !== aExc) return bExc - aExc;
      return (a.deOrdemProg ?? '').localeCompare(b.deOrdemProg ?? '');
    });
  }

  private hydrateCombos(master: LimitesModel[]) {

    const listaDistinta = Array.from(new Set(master.map(item => item.deOrdemProg)));
    listaDistinta.sort((a, b) => {
      const numA = parseFloat(a);
      const numB = parseFloat(b);
      const isNumA = !isNaN(numA) && /^[0-9]+$/.test(a);
      const isNumB = !isNaN(numB) && /^[0-9]+$/.test(b);
      if (isNumA && isNumB) return numA - numB;
      if (isNumA) return -1;
      if (isNumB) return 1;
      return a.localeCompare(b, 'pt-BR', { numeric: true });
    });
    this.listaExercicios = listaDistinta.map(valor => ({ value: valor, label: valor })) as Select2Data;

    const listaDistintaTipo = Array.from(new Set(master.map(item => item.noRubricaTipo)));
    this.selectTipo = listaDistintaTipo.map(valor => ({ value: valor, label: valor })) as Select2Data;

    const listaDistintaRubrica = Array.from(new Set(master.map(item => item.coRubrica)));
    listaDistintaRubrica.sort((a, b) => {
      const numA = parseInt(a.split('-')[0], 10);
      const numB = parseInt(b.split('-')[0], 10);
      if (numA !== numB) return numA - numB;
      const subA = a.split('-')[1] ? parseInt(a.split('-')[1], 10) : 0;
      const subB = b.split('-')[1] ? parseInt(b.split('-')[1], 10) : 0;
      return subA - subB;
    });
    this.selectRubrica = listaDistintaRubrica.map(valor => ({ value: valor, label: valor })) as Select2Data;

    const listaDistintaFiliais = Array.from(new Set(master.map(item => item.sgFilial)));
    listaDistintaFiliais.sort((a, b) => a.localeCompare(b, 'pt-BR'));
    this.selectFilial = listaDistintaFiliais.map(valor => ({ value: valor, label: valor })) as Select2Data;
  }

  private renderGrid(base: LimitesModel[]) {
    this.loading = true;

    this.listaLimitesCompleta = base.slice();

    this.filteredRawCache = base;
    const agrupada = this.groupByExercicio(this.filteredRawCache);

    this.listaLimites = (agrupada as LimitesModel[]).map(x => {
      const item = { ...x } as any;
      item.nivel0Key = this.keyL0(item);
      return item as LimitesModel;
    });

    this.collapseAll();
    this.loading = false;
    this.cd.detectChanges();
  }

  public async obterValores() {
    try {
      this.loading = true;

      const response = await this.apiService.get<ApiResponse<LimitesModel[]>>(
        `${Endpoints.URL_PLANEJAMENTO_ORCAMENTO}/obter-relatorio-limites`
      );

      const data = (response?.data ?? {}) as unknown as LimitesModel;

      const master =
        Array.isArray((data as any).limites)
          ? (((data as any).limites) as LimitesModel[])
          : ((response?.data ?? []) as LimitesModel[]);

      this.listaCompletaMaster = master.slice();

      const ordemProgList: string[]   = Array.isArray((data as any).listaOrdemProg) ? (data as any).listaOrdemProg : [];
      const tipoList: string[]        = Array.isArray((data as any).listaTipo) ? (data as any).listaTipo : [];
      const rubricasList: string[]    = Array.isArray((data as any).listaRubricas) ? (data as any).listaRubricas : [];
      const filiaisList: string[]     = Array.isArray((data as any).listaUnidadeDemandante) ? (data as any).listaUnidadeDemandante : [];

      this.listaExercicios = ordemProgList.map(valor => ({ value: valor, label: valor })) as Select2Data;
      this.selectTipo      = tipoList.map(valor => ({ value: valor, label: valor })) as Select2Data;
      this.selectRubrica   = rubricasList.map(valor => ({ value: valor, label: valor })) as Select2Data;
      this.selectFilial    = filiaisList.map(valor => ({ value: valor, label: valor })) as Select2Data;

      this.initialListaExercicios = [...this.listaExercicios];
      this.initialSelectTipo      = [...this.selectTipo];
      this.initialSelectRubrica   = [...this.selectRubrica];
      this.initialSelectFilial    = [...this.selectFilial];

      this.renderGrid(this.listaCompletaMaster);
    } catch (error) {
      console.error(error, 'obterValores nivel 1');
    } finally {
      this.loading = false;
    }
  }

  filtraLista(): LimitesModel[] {
    const fExc = this.norm(this.selectedExercicio).trim();
    const fTipo = this.norm(this.selectedTipo).trim();
    const fRub = this.norm(this.selectedRubrica).trim();
    const fUnid = this.selectedUnidadeDemandante;
    const nenhumFiltro = !fExc && !fTipo && !fRub && !fUnid;

    this.filtroRegistros.deOrdemProg = fExc || null;
    this.filtroRegistros.noRubricaTipo = fTipo || null;
    this.filtroRegistros.coRubrica = fRub || null;

    if (fUnid) {
      const selected = this.listaCompletaMaster.find(x => x.sgFilial === fUnid);
      this.filtroRegistros.nuFilial = selected?.nuFilial ?? null;
    } else {
      this.filtroRegistros.nuFilial = null;
    }

    let base = this.listaCompletaMaster.slice();
    if (fExc)  base = base.filter(x => x.deOrdemProg === fExc);
    if (fTipo) base = base.filter(x => x.noRubricaTipo === fTipo);
    if (fRub)  base = base.filter(x => x.coRubrica === fRub);
    if (fUnid) base = base.filter(x => x.sgFilial === fUnid);

    if (nenhumFiltro) {
      base = this.listaCompletaMaster.slice();
      this.filtroRegistros = {
        pageNumber: 1,
        pageSize: 10,
        nuFilial: null,
        coRubrica: null,
        noRubricaTipo: null,
        deOrdemProg: null
      };
    }

    return base;
  }

  filterItem() {
    const baseFiltrada = this.filtraLista();
    this.renderGrid(baseFiltrada);
    this.hydrateCombos(baseFiltrada);
  }

  limparFiltros() {
    this.selectedExercicio = null as any;
    this.selectedTipo = null;
    this.selectedRubrica = null;
    this.selectedUnidadeDemandante = null;

    this.filtroRegistros = {
      pageNumber: 1,
      pageSize: 10,
      nuFilial: null,
      coRubrica: null,
      noRubricaTipo: null,
      deOrdemProg: null
    };

    this.renderGrid(this.listaCompletaMaster);
    this.listaExercicios = [...this.initialListaExercicios];
    this.selectTipo      = [...this.initialSelectTipo];
    this.selectRubrica   = [...this.initialSelectRubrica];
    this.selectFilial    = [...this.initialSelectFilial];
  }

  private collapseAll() {
    this.expandedKeysL0 = {};
    this.expandedKeysL1 = {};
    this.expandedKeysL2 = {};
    this.listaLimites = (this.listaLimites ?? []).map(r => ({ ...r, primeiroNivel: undefined })) as LimitesModel[];

    this.cd.markForCheck();
  }

  filtraTodosNiveis(row: LimitesModel): LimitesModel[] {
    const fExc = this.getFilterValue(this.selectedExercicio);
    const fTip = this.getFilterValue(this.selectedTipo);
    const fFil = this.getFilterValue(this.selectedUnidadeDemandante);
    const fRub = this.selectedRubrica?.label ?? this.getFilterValue(this.selectedRubrica);

    return this.listaLimitesCompleta.filter(item => {
      const mesmoGrupo =
        item.deOrdemProg === row.deOrdemProg &&
        item.coExercicio === row.coExercicio;

      return (
        mesmoGrupo &&
        (!fExc || item.deOrdemProg === fExc) &&
        (!fTip || item.noRubricaTipo === fTip) &&
        (!fRub || item.coRubrica === fRub) &&
        (!fFil || item.sgFilial === fFil)
      );
    });
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
        } as LimitesModel;
      }
      acc[chave].vrLimite       = (acc[chave].vrLimite ?? 0) + (item.vrLimite ?? 0);
      acc[chave].vrPlanejamento = (acc[chave].vrPlanejamento ?? 0) + (item.vrPlanejamento ?? 0);
      acc[chave].vrDiferenca    = (acc[chave].vrDiferenca ?? 0) + (item.vrDiferenca ?? 0);
      return acc;
    }, {} as Record<string, LimitesModel>);

    return (Object.values(agrupado) as LimitesModel[])
      .map(x => {
        const y = { ...x } as any;
        y.nivel1Key = this.keyL1(y);
        return y as LimitesModel;
      })
      .sort((a, b) =>
        (b.coExercicio ?? 0) !== (a.coExercicio ?? 0)
          ? (b.coExercicio ?? 0) - (a.coExercicio ?? 0)
          : (a.deOrdemProg ?? '').localeCompare(b.deOrdemProg ?? '')
      );
  }

  private buildSegundoNivel(row: LimitesModel, tipo: LimitesModel): LimitesModel[] {
    const filtrado = this.filtraTodosNiveis(row);
    const agrupado = filtrado.reduce((acc, item) => {
      const chave = `${item.deOrdemProg}_${item.noRubricaTipo}_${item.coRubrica}`;
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
        } as LimitesModel;
      }
      acc[chave].vrLimite       = (acc[chave].vrLimite ?? 0) + (item.vrLimite ?? 0);
      acc[chave].vrPlanejamento = (acc[chave].vrPlanejamento ?? 0) + (item.vrPlanejamento ?? 0);
      acc[chave].vrDiferenca    = (acc[chave].vrDiferenca ?? 0) + (item.vrDiferenca ?? 0);
      return acc;
    }, {} as Record<string, LimitesModel>);

    return (Object.values(agrupado) as LimitesModel[])
      .filter(item => item.noRubricaTipo === tipo.noRubricaTipo)
      .map(x => {
        const y = { ...x } as any;
        y.nivel2Key = this.keyL2(y);
        return y as LimitesModel;
      })
      .sort((a, b) =>
        (b.coExercicio ?? 0) !== (a.coExercicio ?? 0)
          ? (b.coExercicio ?? 0) - (a.coExercicio ?? 0)
          : (a.deOrdemProg ?? '').localeCompare(b.deOrdemProg ?? '')
      );
  }

  private buildTerceiroNivel(row: LimitesModel, limite: LimitesModel, contr: LimitesModel): LimitesModel[] {
    const filtrado = this.filtraTodosNiveis(row);
    const agrupado = filtrado.reduce((acc, item) => {
      const chave = `${item.deOrdemProg}_${item.noRubricaTipo}_${item.coRubrica}_${item.sgFilial}_${item.deRubrica}`;
      if (!acc[chave]) {
        acc[chave] = {
          nuLimitePlanejamento: item.nuLimitePlanejamento,
          nuPlanejamento: item.nuPlanejamento,
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
        } as LimitesModel;
      }
      acc[chave].vrLimite       = (acc[chave].vrLimite ?? 0) + (item.vrLimite ?? 0);
      acc[chave].vrPlanejamento = (acc[chave].vrPlanejamento ?? 0) + (item.vrPlanejamento ?? 0);
      acc[chave].vrDiferenca    = (acc[chave].vrDiferenca ?? 0) + (item.vrDiferenca ?? 0);
      return acc;
    }, {} as Record<string, LimitesModel>);

    return (Object.values(agrupado) as LimitesModel[])
      .filter(item => item.noRubricaTipo === limite.noRubricaTipo && item.deRubrica === contr.deRubrica)
      .map(x => {
        const y = { ...x } as any;
        y.nivel3Key = this.keyL3(y);
        return y as LimitesModel;
      })
      .sort((a, b) =>
        (b.coExercicio ?? 0) !== (a.coExercicio ?? 0)
          ? (b.coExercicio ?? 0) - (a.coExercicio ?? 0)
          : (a.deOrdemProg ?? '').localeCompare(b.deOrdemProg ?? '')
      );
  }

  onRowExpandL0(evt: { data: LimitesModel }) {
    const row = evt.data;
    const key = (row as any).nivel0Key ?? this.keyL0(row);
    this.expandedKeysL0 = { ...this.expandedKeysL0, [key]: true };

    if (!(row as any).primeiroNivel) {
      (row as any).primeiroNivel = [...this.buildPrimeiroNivel(row)];
    }
    this.cd.markForCheck();
  }
  onRowCollapseL0(evt: { data: LimitesModel }) {
    const row = evt.data;
    const key = (row as any).nivel0Key ?? this.keyL0(row);
    const { [key]: _, ...rest } = this.expandedKeysL0;
    this.expandedKeysL0 = rest;
    this.cd.markForCheck();
  }

  onRowExpandL1(evt: { data: LimitesModel }, parent: LimitesModel) {
    const tipo = evt.data;
    const key = (tipo as any).nivel1Key ?? this.keyL1(tipo);
    this.expandedKeysL1 = { ...this.expandedKeysL1, [key]: true };

    if (!(tipo as any).segundoNivel) {
      (tipo as any).segundoNivel = [...this.buildSegundoNivel(parent, tipo)];
    }
    this.cd.markForCheck();
  }
  onRowCollapseL1(evt: { data: LimitesModel }) {
    const tipo = evt.data;
    const key = (tipo as any).nivel1Key ?? this.keyL1(tipo);
    const { [key]: _, ...rest } = this.expandedKeysL1;
    this.expandedKeysL1 = rest;
    this.cd.markForCheck();
  }

  onRowExpandL2(evt: { data: LimitesModel }, parent: LimitesModel, tipo: LimitesModel) {
    const contr = evt.data;
    const key = (contr as any).nivel2Key ?? this.keyL2(contr);
    this.expandedKeysL2 = { ...this.expandedKeysL2, [key]: true };

    if (!(contr as any).terceiroNivel) {
      (contr as any).terceiroNivel = [...this.buildTerceiroNivel(parent, tipo, contr)];
    }
    this.cd.markForCheck();
  }
  onRowCollapseL2(evt: { data: LimitesModel }) {
    const contr = evt.data;
    const key = (contr as any).nivel2Key ?? this.keyL2(contr);
    const { [key]: _, ...rest } = this.expandedKeysL2;
    this.expandedKeysL2 = rest;
    this.cd.markForCheck();
  }

  onTogglePrimeiroNivel(row: LimitesModel) {
    const key = this.keyL0(row);
    const isOpen = !!this.expandedKeysL0[key];

    if (isOpen) {
      const { [key]: _, ...rest } = this.expandedKeysL0;
      this.expandedKeysL0 = rest;
      (row as any).primeiroNivel = undefined;
    } else {
      (row as any).primeiroNivel = [...this.buildPrimeiroNivel(row)];
      this.expandedKeysL0 = { ...this.expandedKeysL0, [key]: true };
    }
    this.cd.markForCheck();
  }

  onToggleSegundoNivel(row: LimitesModel, tipo: LimitesModel) {
    const key = this.keyL1(tipo);
    const isOpen = !!this.expandedKeysL1[key];

    if (isOpen) {
      const { [key]: _, ...rest } = this.expandedKeysL1;
      this.expandedKeysL1 = rest;
      (tipo as any).segundoNivel = undefined;
    } else {
      (tipo as any).segundoNivel = [...this.buildSegundoNivel(row, tipo)];
      this.expandedKeysL1 = { ...this.expandedKeysL1, [key]: true };
    }
    this.cd.markForCheck();
  }

  onToggleTerceiroNivel(row: LimitesModel, limite: LimitesModel, contr: LimitesModel) {
    const key = this.keyL2(contr);
    const isOpen = !!this.expandedKeysL2[key];

    if (isOpen) {
      const { [key]: _, ...rest } = this.expandedKeysL2;
      this.expandedKeysL2 = rest;
      (contr as any).terceiroNivel = undefined;
    } else {
      (contr as any).terceiroNivel = [...this.buildTerceiroNivel(row, limite, contr)];
      this.expandedKeysL2 = { ...this.expandedKeysL2, [key]: true };
    }
    this.cd.markForCheck();
  }

  openModalPlanejamento(acao: string, ud?: any, registro?: any) {
    if (acao === 'cadastro') {
      const modalRef = this.modalService.open(ModalLimitesComponent, {
        ariaLabelledBy: 'modal-basic-title', size: 'md',
        windowClass: 'custom-class', backdrop: 'static', keyboard: false
      });
      modalRef.componentInstance.isEditable = false;
      return;
    }

    if (acao === 'alteracao') {
      const modalRef = this.modalService.open(ModalLimitesComponent, {
        ariaLabelledBy: 'modal-basic-title', size: 'md',
        windowClass: 'custom-class', backdrop: 'static', keyboard: false
      });

      const filialselecionada = this.selectFilial.find(
        (item): item is Select2Option => 'value' in item && item.label === ud.sgFilial
      );

      const nuPlan = ud?.nuPlanejamento ?? this.tryGetNuPlanejamentoFallback(ud);

      modalRef.componentInstance.isEditable = true;
      modalRef.componentInstance.registro = ud;
      modalRef.componentInstance.planejamentoEdit = nuPlan ?? null;
      modalRef.componentInstance.nuFilialEdit = filialselecionada?.value ?? null;
    }
  }

  private tryGetNuPlanejamentoFallback(ud: any): number | null {
    const found = this.listaLimitesCompleta.find(i =>
      i.coExercicio === ud?.coExercicio &&
      i.deOrdemProg === ud?.deOrdemProg &&
      i.sgFilial === ud?.sgFilial &&
      i.coRubrica === ud?.coRubrica &&
      i.noRubricaTipo === ud?.noRubricaTipo
    );
    return found?.nuPlanejamento ?? null;
  }

  openModalUpload() {
    this.modalService.open(ModalUploadComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'md',
      windowClass: 'custom-class',
      backdrop: 'static',
      keyboard: false,
    });
  }

  async openModalDownload() {
    if(this.selectedExercicio == null || this.selectedExercicio == undefined ){
      await Swal.fire({
              title: 'Atenção!',
              text: 'Por favor, para fazer o download do arquivo com o layout de upload o filtro de Exercício precisa estar preenchido.',
              icon: 'warning',
              confirmButtonText: 'OK'
            });
            return;
    }else{
       await this.apiService.get<ApiResponse<LimitesModel[]>>(
         `${Endpoints.URL_PLANEJAMENTO_ORCAMENTO}/limites-exercicio`
       );
    }
  }

  formatBRLDiffNoBreak(value: number | null | undefined): string {
    const v = Number(value ?? 0);
    const sign = v < 0 ? '-' : '';
    const abs = Math.abs(v);

    const num = abs.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    return `R$\u00A0${sign}${num}`;
  }
}
