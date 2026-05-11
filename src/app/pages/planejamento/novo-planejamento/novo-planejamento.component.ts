import { Component, OnInit, AfterViewInit, ViewChildren, QueryList, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  NovoPlanejamentoService,
  ExercicioResumoListaResponse,
  ExercicioDetalheResponse,
  RegistroPlanejamento,
  RubricaPlanejamento,
  FiltroRegistrosPlanejamento,
  RelatorioLimiteNivel1,
} from './novo-planejamento.service';
import { PlanejamentoStatusResponse } from 'src/app/models/generics/planejamento-response';
import { PlanejamentoOrcamentarioModel } from 'src/app/models/generics/planejamento-orcamentario';
import { Option } from 'sidsc-components/dsc-select/shared/option';

@Component({
  selector: 'app-novo-planejamento',
  templateUrl: './novo-planejamento.component.html',
  styleUrls: ['./novo-planejamento.component.scss'],
})
export class NovoPlanejamentoComponent implements OnInit, AfterViewInit {

  // ── Estado de carregamento ────────────────────────────────────────────────
  loadingExercicios: boolean = false;
  loadingDetalhe: boolean = false;
  loadingRegistros: boolean = false;
  loadingRubricas: boolean = false;

  // ── Dados vindos da API ───────────────────────────────────────────────────

  /** endpoint 1 — lista de exercícios */
  exercicios: ExercicioResumoListaResponse[] = [];

  /** exercício selecionado na sidebar */
  exercicioSelecionado: ExercicioResumoListaResponse | null = null;

  /** endpoint 2 — detalhe do exercício (todas as programações do ano) */
  programacoesDoExercicio: ExercicioDetalheResponse[] = [];

  /** items passed to dsc-accordion */
  accordionItems: any[] = [];
  /** Show the compact dropdown history instead of the full list */
  showHistoryDropdown: boolean = true;

  /** programação clicada para ver detalhes inline */
  programacaoDetalhada: ExercicioDetalheResponse | null = null;

  /** endpoint 3 — registros paginados da programação selecionada */
  registros: RegistroPlanejamento[] = [];
  totalRegistros: number = 0;

  // ── Filtros disponíveis (vêm da API junto com os registros) ──────────────
  opcoesContrato: Option[] = [];
  opcoesFilial: Option[] = [];
  opcoesTipo: Option[] = [];
  opcoesStatus: Option[] = [];
  opcoesObjeto: Option[] = [];
  opcoesNuOrc: Option[] = [];

  // ── Filtros selecionados pelo usuário ─────────────────────────────────────
  filtroContrato: string = '';
  filtroFilial: string = '';
  filtroTipo: string = '';
  filtroStatus: string = '';

  /** endpoint 4 — visão por rubrica */
  rubricas: RubricaPlanejamento[] = [];

  /** endpoint 6 — status disponíveis para alteração em lote */
  listaStatus: PlanejamentoStatusResponse[] = [];
  // bind the full status object from the select so we can display its label in the title
  statusSelecionado: PlanejamentoStatusResponse | null = null;

  // ── Estado de modais ──────────────────────────────────────────────────────
  modalLimitesAberto: boolean = false;
  novoExercicioAberto: boolean = false;
  tabAtiva: 'registros' | 'rubricas' = 'registros';

  // ── Modal Limites — accordion 4 níveis ────────────────────────────────────
  loadingLimites: boolean = false;
  relatorioLimites: RelatorioLimiteNivel1[] = [];

  /** Controla quais itens do accordion estão expandidos em cada nível.
   *  Chave: "n1-{i}", "n2-{i}-{j}", "n3-{i}-{j}-{k}"
   */
  limExpanded: Record<string, boolean> = {};

  // ── Filtro de paginação ───────────────────────────────────────────────────
  filtro: FiltroRegistrosPlanejamento = {
    pageNumber: 1,
    pageSize: 10,
    nuPlanejamento: 0,
    tipoPlanejamento: '',
  };

  constructor(
    private service: NovoPlanejamentoService,
    private router: Router,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
  ) {}

  /** Called from the compact history dropdown menu */
  onSelectFromHistory(prog: ExercicioDetalheResponse): void {
    // close menu is handled by mat-menu automatically when clicking an item
    this.verDetalhesProgramacao(prog);
  }

  @ViewChildren('progTemplate', { read: TemplateRef })
  progTemplates!: QueryList<TemplateRef<any>>;

  async ngOnInit(): Promise<void> {
    await this.carregarExercicios();
    await this.carregarStatus();
  }

  // ── 1. Carrega lista de exercícios ────────────────────────────────────────

  async carregarExercicios(): Promise<void> {
    try {
      this.loadingExercicios = true;
      const resp = await this.service.listarExercicios();
      this.exercicios = resp?.data ?? [];
      if (this.exercicios.length > 0) {
        await this.selecionarExercicio(this.exercicios[0]);
      }
    } catch (e) {
      this.toastr.error('Erro ao carregar exercícios.', 'Erro');
    } finally {
      this.loadingExercicios = false;
    }
  }

  // ── 2. Seleciona exercício → carrega detalhe + programações ──────────────

  async selecionarExercicio(ex: ExercicioResumoListaResponse): Promise<void> {
    this.exercicioSelecionado = ex;
    this.programacaoDetalhada = null;
    this.registros = [];
    this.rubricas = [];

    try {
      this.loadingDetalhe = true;
      const resp = await this.service.obterDetalheExercicio(ex.cO_EXERCICIO);
      this.programacoesDoExercicio = resp?.data ?? [];

      // Ordena histórico do mais recente para o mais antigo (para reduzir scroll)
      // Prioriza data de abertura; se não existir, usa número da programação (maior = mais recente)
      this.programacoesDoExercicio.sort((a, b) => {
        const da = a.dT_ABERTURA ? new Date(a.dT_ABERTURA).getTime() : 0;
        const db = b.dT_ABERTURA ? new Date(b.dT_ABERTURA).getTime() : 0;
        if (da !== db) return db - da; // descending
        return (b.nU_PLANEJAMENTO ?? 0) - (a.nU_PLANEJAMENTO ?? 0);
      });

      // Seleciona automaticamente a primeira programação ativa (já ordenado: mais recente primeiro)
      const ativa = this.programacoesDoExercicio.find(p => p.statuS_PLANEJAMENTO === 'Aberta' || p.statuS_PLANEJAMENTO === 'Aberto' || p.statuS_PLANEJAMENTO === 'Ativa');
      const programacaoInicial = ativa ?? this.programacoesDoExercicio[0];
      if (programacaoInicial) {
        await this.verDetalhesProgramacao(programacaoInicial);
      }
      // rebuild accordion items (templates may not be available synchronously; schedule)
      setTimeout(() => this.buildAccordionItems(), 0);
    } catch (e) {
      this.toastr.error('Erro ao carregar detalhes do exercício.', 'Erro');
    } finally {
      this.loadingDetalhe = false;
    }
  }

  ngAfterViewInit(): void {
    // Rebuild when template QueryList changes (ngFor creates templates)
    this.progTemplates.changes.subscribe(() => {
      this.buildAccordionItems();
    });
    // initial build attempt
    this.buildAccordionItems();
  }

  private buildAccordionItems(): void {
    if (!this.programacoesDoExercicio || !this.progTemplates) {
      this.accordionItems = [];
      return;
    }
    const templates = this.progTemplates.toArray();
    this.accordionItems = this.programacoesDoExercicio.map((prog, idx) => ({
      title: (prog.tipo || this.tipoLimpo(prog.tipoFormatado)) + ' — Nº ' + prog.nU_PLANEJAMENTO,
      text: '',
      template: templates[idx] ?? null,
      context: prog,
      expanded: this.isProgramacaoAtiva(prog),
      visible: true,
    }));
    // ensure change detection so DSC receives updated templates
    this.cdr.detectChanges();
  }

  // ── 3/4/5. Seleciona programação → carrega registros, rubricas, dashboard ─

  async verDetalhesProgramacao(prog: ExercicioDetalheResponse): Promise<void> {
    this.programacaoDetalhada = prog;
    this.tabAtiva = 'registros';

    // tipoPlanejamento: usa o número do tipo (ex: "1") — extraído do campo tipoFormatado se tipo vier vazio
    const tipoPlanejamento = prog.tipo ?? (prog.tipoFormatado ?? '').split('-')[0].trim();

    this.filtro = {
      pageNumber: 1,
      pageSize: 10,
      nuPlanejamento: prog.nU_PLANEJAMENTO,
      tipoPlanejamento,
    };

    await Promise.all([
      this.carregarRegistros(),
      this.carregarRubricas(prog.nU_PLANEJAMENTO),
    ]);
  }

  fecharDetalhesProgramacao(): void {
    this.programacaoDetalhada = null;
  }

  // ── endpoint 3 ───────────────────────────────────────────────────────────

  async carregarRegistros(): Promise<void> {
    try {
      this.loadingRegistros = true;
      const resp = await this.service.listarRegistrosPaginados(this.filtro);
      const data = resp?.data;
      // A API retorna { contratos: [...], totalRecords: N, listaContrato: [...], ... }
      if (data && Array.isArray(data.contratos)) {
        this.registros = data.contratos;
        this.totalRegistros = data.totalRecords ?? data.contratos.length;
        // Popula as opções de filtro a partir das listas retornadas pela API
        this.opcoesContrato = (data.listaContrato ?? []).map(v => ({ label: v, value: v }));
        this.opcoesFilial   = (data.listaUnidadeDemandante ?? []).map(v => ({ label: v, value: v }));
        this.opcoesTipo     = (data.listaTipo ?? []).map(v => ({ label: v, value: v }));
        this.opcoesStatus   = (data.listaStatus ?? []).map(v => ({ label: v, value: v }));
        this.opcoesObjeto   = (data.listaObjeto ?? []).map(v => ({ label: v, value: v }));
        this.opcoesNuOrc    = (data.listaNuOrc ?? []).map(v => ({ label: v, value: v }));
      } else {
        this.registros = [];
        this.totalRegistros = 0;
      }
    } catch (e) {
      this.toastr.error('Erro ao carregar registros.', 'Erro');
    } finally {
      this.loadingRegistros = false;
    }
  }

  // ── endpoint 4 ───────────────────────────────────────────────────────────

  async carregarRubricas(nuPlanejamento: number): Promise<void> {
    try {
      this.loadingRubricas = true;
      const resp = await this.service.listarRubricas(nuPlanejamento);
      this.rubricas = resp?.data ?? [];
    } catch (e) {
      this.toastr.error('Erro ao carregar rubricas.', 'Erro');
    } finally {
      this.loadingRubricas = false;
    }
  }

  // ── endpoint 6 ───────────────────────────────────────────────────────────

  async carregarStatus(): Promise<void> {
    try {
      const resp = await this.service.listarStatusPlanejamento();
      this.listaStatus = resp?.data ?? [];
    } catch (e) {
      // silencioso — não bloqueia carregamento
    }
  }

  // ── Paginação ─────────────────────────────────────────────────────────────

  async mudarPagina(pagina: number): Promise<void> {
    this.filtro.pageNumber = pagina;
    await this.carregarRegistros();
  }

  // ── Filtros de registros ──────────────────────────────────────────────────

  async aplicarFiltros(): Promise<void> {
    this.filtro = {
      ...this.filtro,
      pageNumber: 1,
      contrato:   this.filtroContrato  || undefined,
      ud:         this.filtroFilial    || undefined,
      tipo:       this.filtroTipo      || undefined,
      status:     this.filtroStatus    || undefined,
    };
    await this.carregarRegistros();
  }

  async limparFiltros(): Promise<void> {
    this.filtroContrato = '';
    this.filtroFilial   = '';
    this.filtroTipo     = '';
    this.filtroStatus   = '';
    this.filtro = {
      ...this.filtro,
      pageNumber: 1,
      contrato:   undefined,
      ud:         undefined,
      tipo:       undefined,
      status:     undefined,
    };
    await this.carregarRegistros();
  }

  // ── Ações ─────────────────────────────────────────────────────────────────

  novoRegistro(): void {
    if (!this.programacaoDetalhada) return;
    this.router.navigate(['/planejamento/create'], {
      queryParams: {
        cO_EXERCICIO:    this.exercicioSelecionado?.cO_EXERCICIO,
        nuPlanejamento:  this.programacaoDetalhada.nU_PLANEJAMENTO,
        tipo:            this.programacaoDetalhada.tipo,
      }
    });
  }

  gerarExcel(): void {
    // placeholder — integrar endpoint de exportação quando disponível
    this.toastr.info('Funcionalidade em desenvolvimento.', 'Gerar Excel');
  }

  gerarAtualizacaoSAP(): void {
    // placeholder — integrar endpoint SAP quando disponível
    this.toastr.info('Funcionalidade em desenvolvimento.', 'Gerar Atualização SAP');
  }

  // ── Abas ──────────────────────────────────────────────────────────────────

  ativarTab(tab: 'registros' | 'rubricas'): void {
    this.tabAtiva = tab;
  }

  // ── Modal Limites ─────────────────────────────────────────────────────────

  async abrirLimites(): Promise<void> {
    if (!this.programacaoDetalhada) {
      this.toastr.warning('Selecione uma programação antes de ver os limites.', 'Atenção');
      return;
    }
    this.modalLimitesAberto = true;
    this.loadingLimites = true;
    this.relatorioLimites = [];
    try {
      const resp = await this.service.obterRelatorioLimites(this.programacaoDetalhada.nU_PLANEJAMENTO);
      this.relatorioLimites = resp?.data ?? [];
    } catch {
      this.toastr.error('Erro ao carregar limites da programação.', 'Erro');
    } finally {
      this.loadingLimites = false;
    }
  }

  fecharLimites(): void {
    this.modalLimitesAberto = false;
    this.limExpanded = {};
  }

  limToggle(key: string): void {
    this.limExpanded[key] = !this.limExpanded[key];
  }

  limIsOpen(key: string): boolean {
    return !!this.limExpanded[key];
  }

  // ── Novo Exercício ────────────────────────────────────────────────────────

  /** Ano que será criado = último ano cadastrado + 1 */
  get proximoAnoExercicio(): number {
    if (!this.exercicios.length) return new Date().getFullYear() + 1;
    return Math.max(...this.exercicios.map(e => e.cO_EXERCICIO)) + 1;
  }

  abrirNovoExercicio(): void {
    this.novoExercicioAberto = true;
  }

  fecharNovoExercicio(): void {
    this.novoExercicioAberto = false;
  }

  async confirmarNovoExercicio(): Promise<void> {
    try {
      this.loadingExercicios = true;
      const resp = await this.service.criarNovoExercicio();
      this.exercicios = resp?.data ?? this.exercicios;
      this.toastr.success('Exercício criado com sucesso.', 'Sucesso');
      this.fecharNovoExercicio();
      if (this.exercicios.length > 0) {
        await this.selecionarExercicio(this.exercicios[0]);
      }
    } catch (e) {
      this.toastr.error('Erro ao criar exercício.', 'Erro');
    } finally {
      this.loadingExercicios = false;
    }
  }

  // ── Reprogramação ─────────────────────────────────────────────────────────

  adicionarReprogramacao(): void {
    if (!this.exercicioSelecionado) return;
    // Navega para o fluxo existente de cadastro de reprogramação
    this.router.navigate(['/planejamento/create'], {
      queryParams: {
        cO_EXERCICIO: this.exercicioSelecionado.cO_EXERCICIO,
        nuPlanejamento: this.programacaoDetalhada?.nU_PLANEJAMENTO ?? 0,
        tipo: this.programacaoDetalhada?.tipo ?? '',
      }
    });
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  pct(executado: number, planejado: number): number {
    if (!planejado) return 0;
    return Math.round((executado / planejado) * 100);
  }

  pctLimite(planejado: number, limite: number): number {
    if (!limite) return 0;
    return Math.min(Math.round((planejado / limite) * 100), 100);
  }

  /** Normaliza o texto de status para comparações */
  statusNormalizado(status: string): string {
    return (status ?? '').toLowerCase().trim();
  }

  statusClass(status: string): string {
    switch (this.statusNormalizado(status)) {
      case 'aberta':
      case 'aberto':      return 'badge--aberto';
      case 'aprovado':
      case 'aprovada':    return 'badge--aprovado';
      case 'encerrado':
      case 'encerrada':   return 'badge--encerrado';
      case 'ativa':
      case 'ativo':       return 'badge--ativa';
      case 'substituída':
      case 'substituido': return 'badge--substituida';
      case 'criado':
      case 'criada':      return 'badge--aprovado';
      case 'cancelado':
      case 'cancelada':   return 'badge--encerrado';
      default:            return 'badge--encerrado';
    }
  }

  /** Extrai tipo limpo: "1 - Programação" → "Programação" */
  tipoLimpo(tipo: string): string {
    return (tipo ?? '').replace(/^\d+\s*-\s*/, '').trim();
  }

  /** Retorna true se a programação é a última/ativa do exercício */
  isProgramacaoAtiva(prog: ExercicioDetalheResponse): boolean {
    const s = this.statusNormalizado(prog.statuS_PLANEJAMENTO);
    return s === 'aberta' || s === 'aberto' || s === 'criado' || s === 'criada';
  }

  /** Soma CAPEX+OPEX planejado da programação */
  totalPlanejado(prog: ExercicioDetalheResponse): number {
    return (prog.capeX_PLANEJADO ?? 0) + (prog.opeX_PLANEJADO ?? 0);
  }

  trackByPlanejamento(_: number, ex: ExercicioResumoListaResponse): number {
    return ex.cO_EXERCICIO;
  }

  trackByNuPlanejamento(_: number, p: ExercicioDetalheResponse): number {
    return p.nU_PLANEJAMENTO;
  }
}
