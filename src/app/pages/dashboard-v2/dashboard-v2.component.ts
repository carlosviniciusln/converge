import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';
import { ApiService } from 'src/app/shared/services/api.service';
import { ApiResponse } from 'src/app/models/generics/api-response';
import {
  DashboardOrcamentoExecucaoContratualResponse
} from 'src/app/models/DTOs/dashboard-orcamento-execucao-contratual.dto';
import { ContratoApiResponse, ContratoItem } from 'src/app/models/generics/Gcptb001ContratoResponse';
import { ModuleEnum, PerfisEnum, TokenStorageService } from 'src/app/shared/services/token-storage.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NovosContratosComponent } from '../dashboard/novos-contratos/novos-contratos.component';

interface AtividadeFeed {
  icon: string;
  cor: 'success' | 'danger' | 'warning' | 'info' | 'neutro';
  titulo: string;
  descricao: string;
  tempo: string;
}

interface PagamentoPrevisto {
  dia: number;
  mes: string;
  descricao: string;
  contrato: string;
  fornecedor: string;
  valor: number;
  urgente: boolean;
}

interface DiaCalendario {
  dia: number | null;
  hoje: boolean;
  temPagamento: boolean;
}

interface RubricaTop {
  nome: string;
  valor: number;
}

@Component({
  selector: 'app-dashboard-v2',
  templateUrl: './dashboard-v2.component.html',
  styleUrls: ['./dashboard-v2.component.scss']
})
export class DashboardV2Component implements OnInit, OnDestroy {

  @ViewChild('budgetChart') budgetChartRef?: ElementRef<HTMLCanvasElement>;
  @ViewChild('donutChart') donutChartRef?: ElementRef<HTMLCanvasElement>;

  private budgetChart?: Chart;
  private donutChart?: Chart;

  public dadosDashboardOrcamentoExecucaoContratual: DashboardOrcamentoExecucaoContratualResponse | null = null;
  public loading = true;
  public selectedContrato: number | null = null;
  public contratosOrigem: ContratoItem[];
  public anoExercicio: number = new Date().getFullYear();
  public currentProfile: PerfisEnum;
  public currentUser: any;
  public quantidadeTotal: number = 0;

  public atividades: AtividadeFeed[] = [];
  public pagamentosPrevistos: PagamentoPrevisto[] = [];
  public diasCalendario: DiaCalendario[] = [];
  public nomeMesCalendario: string = '';
  public topRubricas: RubricaTop[] = [];

  filtroRegistros: any = {
    pageNumber: 1,
    pageSize: 4,
    Contrato: null,
    Fornecedor: null,
    Tipo: null,
    Gestor: null,
    Status: null,
    NoTipoArp: null
  };

  constructor(private apiService: ApiService, private router: Router, public token: TokenStorageService, private modalService: NgbModal) { }

  async ngOnInit() {
    this.obterPermissoes();
    this.currentUser = this.token.getUser();
    this.montarAtividadesSimuladas();
    this.montarTopRubricas();
    this.montarCalendarioEPagamentos();

    console.log('[DEBUG] DashboardV2Component init, currentUrl=', this.router.url);
    try {
      const url = this.router.url || window.location.hash || '';
      if (url.includes('/dashboard') || url.includes('#/dashboard') || url === '' || url === '/') {
        this.loadAll();
      } else {
        console.log('[DEBUG] DashboardV2Component skipping loadAll because current route is', url);
      }
    } catch (e) {
      console.warn('Error checking route in DashboardV2Component.ngOnInit', e);
      this.loadAll();
    }



  }

  ngOnDestroy(): void {
    this.destruirGraficos();
  }

  /**
   * Called when the user opens the contratos dropdown. If contratos aren't loaded yet,
   * fetch them and show a loading indicator while the request runs.
   */

  async loadAll() {
    this.loading = true;
    try {
      await Promise.all([
        this.getOrcamentoExecucaoContratual(),
        this.obterContratos()
        // this.getAtualizacao()
      ]);
    } catch (err) {
      console.error('Erro ao carregar dashboard-v2', err);
    } finally {
      this.loading = false;
      setTimeout(() => this.renderizarGraficos(), 0);
    }
  }

   private limparFiltrosNulos(filtros: any): any {
    const filtrosLimpos: any = {};
    Object.keys(filtros).forEach((key) => {
      if (filtros[key] !== null && filtros[key] !== undefined && filtros[key] !== '') {
        filtrosLimpos[key] = filtros[key];
      }
    });
    return filtrosLimpos;
  }


  //MELHORIA - MAPEAR A VIEW 47 E APLICAR PADRONIZAÇÃO DE PAGINAÇÃO E RESPONSE
   public async obterContratos(): Promise<void> {
    const url = window.location.hostname;
    this.loading = true;
    try {
      const filtrosLimpos = this.limparFiltrosNulos(this.filtroRegistros);

      const response = await this.apiService.get<ApiResponse<ContratoApiResponse>>
        (`v1/contrato/novos-contratos`, filtrosLimpos);

      this.contratosOrigem = response?.data?.contratos;
      this.quantidadeTotal = response.data.totalRecords;

      this.loading = false;
    } catch (error) {
      this.loading = false;
      console.error('Erro ao obter contratos', error);
    }
  }

    obterPermissoes() {
      this.currentProfile = this.token.getUserPerfil();
    }

  openModalNovosContratos() {
    if(this.currentProfile === PerfisEnum.Pagadoria || this.currentProfile === PerfisEnum.Administrador){
      const modalRef = this.modalService.open(NovosContratosComponent, {
        ariaLabelledBy: 'modal-basic-title',
        windowClass: 'modal-dialog-medium-width',
      });
      modalRef.componentInstance.contratos = this.contratosOrigem;
      modalRef.componentInstance.quantidadeTotal = this.quantidadeTotal;
    }
  }




  async getOrcamentoExecucaoContratual() {

    try{

      const response = await this.apiService.get<ApiResponse<DashboardOrcamentoExecucaoContratualResponse>>(`v1/dashboard/orcamento-execucao-contratual`);

      if(!response?.data){
          console.error('Erro ao carregar dados de orçamento e execução contratual');
         this.dadosDashboardOrcamentoExecucaoContratual = null;
           return;
      }

      this.dadosDashboardOrcamentoExecucaoContratual = response.data
      this.dadosDashboardOrcamentoExecucaoContratual.contratosDropdown = Object.entries(this.dadosDashboardOrcamentoExecucaoContratual.contratos)
      .map(([nuContrato, codigo]) => ({
      label: codigo,
      value: Number(nuContrato)
      }));


      const dataUltimaAtualizacao = this.dadosDashboardOrcamentoExecucaoContratual?.dhUltimaAtualizacao;

      this.anoExercicio = this.anoExercicio = dataUltimaAtualizacao &&
       !isNaN(Date.parse(dataUltimaAtualizacao))
       ? new Date(dataUltimaAtualizacao).getFullYear()
       : new Date().getFullYear();


    }

    catch(e){
    console.error('Erro ao carregar dados de orçamento e execução contratual', e);
    this.dadosDashboardOrcamentoExecucaoContratual = null;
  }
}

  goToContratoFromDropdown(e: any) {
    const id = e?.value;
    if (id) {
      const url = `${window.location.origin}/#/contrato/evolucao-financeira/${id}`;
      window.open(url, '_blank');
    }
  }

  get saudacao(): string {
    const hora = new Date().getHours();
    if (hora < 12) return 'Bom dia';
    if (hora < 18) return 'Boa tarde';
    return 'Boa noite';
  }

  get totalOrcamentoPlanejado(): number {
    const o = this.dadosDashboardOrcamentoExecucaoContratual?.dashboardOrcamento;
    return o ? (o.vrInvestimentoPlanejado || 0) + (o.vrCusteioPlanejado || 0) : 0;
  }

  get totalOrcamentoExecutado(): number {
    const o = this.dadosDashboardOrcamentoExecucaoContratual?.dashboardOrcamento;
    return o ? (o.vrInvestimentoExecutado || 0) + (o.vrCusteioExecutado || 0) : 0;
  }

  get saldoOrcamentarioDisponivel(): number {
    return Math.max(this.totalOrcamentoPlanejado - this.totalOrcamentoExecutado, 0);
  }

  get percExecucaoGeral(): number {
    return this.totalOrcamentoPlanejado > 0 ? (this.totalOrcamentoExecutado / this.totalOrcamentoPlanejado) * 100 : 0;
  }

  get percSaldoDisponivel(): number {
    return Math.max(100 - this.percExecucaoGeral, 0);
  }

  statusClasse(status: string): string {
    const s = (status || '').toLowerCase();
    if (s.includes('vigente')) return 'status-pill--vigente';
    if (s.includes('encerr')) return 'status-pill--encerrado';
    if (s.includes('suspen')) return 'status-pill--suspenso';
    if (s.includes('renov')) return 'status-pill--renovacao';
    return 'status-pill--neutro';
  }

  private renderizarGraficos(): void {
    this.destruirGraficos();
    const o = this.dadosDashboardOrcamentoExecucaoContratual?.dashboardOrcamento;
    if (!o) return;

    const budgetCtx = this.budgetChartRef?.nativeElement?.getContext('2d');
    if (budgetCtx) {
      this.budgetChart = new Chart(budgetCtx, {
        type: 'bar',
        data: {
          labels: ['CAPEX · Investimento', 'OPEX · Custeio'],
          datasets: [
            {
              label: 'Planejado',
              data: [o.vrInvestimentoPlanejado || 0, o.vrCusteioPlanejado || 0],
              backgroundColor: '#c7d4e3',
              borderRadius: 6,
              maxBarThickness: 46
            },
            {
              label: 'Executado',
              data: [o.vrInvestimentoExecutado || 0, o.vrCusteioExecutado || 0],
              backgroundColor: '#0b63a4',
              borderRadius: 6,
              maxBarThickness: 46
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8 } },
            tooltip: {
              callbacks: {
                label: (ctx) => `${ctx.dataset.label}: ${this.formatarMoeda(Number(ctx.parsed.y))}`
              }
            }
          },
          scales: {
            y: { ticks: { callback: (v) => this.formatarMoedaCurta(Number(v)) }, grid: { color: '#eef1f5' } },
            x: { grid: { display: false } }
          }
        }
      });
    }

    const donutCtx = this.donutChartRef?.nativeElement?.getContext('2d');
    if (donutCtx) {
      this.donutChart = new Chart(donutCtx, {
        type: 'doughnut',
        data: {
          labels: ['CAPEX Executado', 'OPEX Executado', 'Saldo Disponível'],
          datasets: [{
            data: [o.vrInvestimentoExecutado || 0, o.vrCusteioExecutado || 0, this.saldoOrcamentarioDisponivel],
            backgroundColor: ['#0b63a4', '#F9B200', '#dfe6ee'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '70%',
          plugins: { legend: { display: false } }
        }
      });
    }
  }

  private destruirGraficos(): void {
    this.budgetChart?.destroy();
    this.donutChart?.destroy();
    this.budgetChart = undefined;
    this.donutChart = undefined;
  }

  formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);
  }

  formatarMoedaCurta(valor: number): string {
    const v = valor || 0;
    if (v >= 1_000_000_000) return `R$ ${(v / 1_000_000_000).toFixed(1)}B`;
    if (v >= 1_000_000) return `R$ ${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000) return `R$ ${(v / 1_000).toFixed(0)}K`;
    return `R$ ${v.toFixed(0)}`;
  }

  // Feed simulado de atividades em tempo real (SSR-like), sem fonte de dados própria ainda no backend
  private montarAtividadesSimuladas(): void {
    this.atividades = [
      { icon: 'description', cor: 'info', titulo: 'Novo contrato gerado', descricao: 'Contrato Nº 2381/2026 - Vigilância Total Ltda.', tempo: 'agora mesmo' },
      { icon: 'payments', cor: 'success', titulo: 'Pagamento processado', descricao: 'Competência 08/2026 quitada - Contrato Nº 1190/2025', tempo: '4 min atrás' },
      { icon: 'warning', cor: 'danger', titulo: 'Possível falta de orçamento', descricao: 'Saldo insuficiente identificado para o Contrato Nº 3342/2026 (rubrica OPEX)', tempo: '12 min atrás' },
      { icon: 'task_alt', cor: 'success', titulo: 'Ateste aprovado', descricao: 'Competência 07/2026 atestada sem retenção - Contrato Nº 2210/2024', tempo: '25 min atrás' },
      { icon: 'account_balance', cor: 'info', titulo: 'Empenho complementar solicitado', descricao: 'Contrato Nº 1587/2025 (CAPEX) aguardando aprovação', tempo: '38 min atrás' },
      { icon: 'event_busy', cor: 'warning', titulo: 'Contrato próximo do vencimento', descricao: 'Contrato Nº 998/2023 vence em 15 dias', tempo: '1 h atrás' },
      { icon: 'gavel', cor: 'info', titulo: 'Nova ata de registro de preços', descricao: 'Processo 045/2026 cadastrado com sucesso', tempo: '1 h atrás' },
      { icon: 'block', cor: 'danger', titulo: 'Retenção aplicada', descricao: 'R$ 12.430,00 retidos no Contrato Nº 2765/2025 (penalidade vinculada)', tempo: '2 h atrás' },
      { icon: 'fact_check', cor: 'success', titulo: 'Planejamento validado', descricao: 'Planejamento orçamentário 2027 validado pela Diretoria Financeira', tempo: '2 h atrás' },
      { icon: 'archive', cor: 'neutro', titulo: 'Contrato encerrado', descricao: 'Contrato Nº 4021/2022 encerrado por término de vigência', tempo: '3 h atrás' },
      { icon: 'error_outline', cor: 'danger', titulo: 'Pagamento rejeitado', descricao: 'Divergência de valor identificada no Contrato Nº 1873/2025', tempo: '3 h atrás' },
      { icon: 'person_add', cor: 'info', titulo: 'Fiscal designado', descricao: 'Novo fiscal técnico vinculado ao Contrato Nº 2999/2026 (TI)', tempo: '4 h atrás' },
      { icon: 'trending_down', cor: 'warning', titulo: 'Saldo orçamentário baixo', descricao: 'CAPEX abaixo de 5% do limite na unidade SP01', tempo: '5 h atrás' },
      { icon: 'edit_note', cor: 'info', titulo: 'Aditivo contratual solicitado', descricao: 'Solicitação de aditivo enviada para o Contrato Nº 1456/2024', tempo: '6 h atrás' },
      { icon: 'event_available', cor: 'success', titulo: 'Competência fechada', descricao: 'Competência 09/2026 fechada com 38 pagamentos processados', tempo: '7 h atrás' },
      { icon: 'sync', cor: 'neutro', titulo: 'Contrato reprogramado', descricao: 'Contrato Nº 3120/2025 reprogramado para o próximo exercício', tempo: '8 h atrás' },
      { icon: 'verified', cor: 'success', titulo: 'NF validada automaticamente', descricao: 'Nota Fiscal 55231 vinculada ao Contrato Nº 2044/2025', tempo: '9 h atrás' },
      { icon: 'report', cor: 'danger', titulo: 'Penalidade aplicada', descricao: 'Multa aplicada ao fornecedor Ecoserv Ambiental Ltda.', tempo: '10 h atrás' },
      { icon: 'autorenew', cor: 'info', titulo: 'Status atualizado', descricao: 'Contrato Nº 872/2021 migrado para "Em Renovação"', tempo: '12 h atrás' },
      { icon: 'summarize', cor: 'success', titulo: 'Relatório gerado', descricao: 'Relatório mensal de execução orçamentária gerado com sucesso', tempo: 'ontem' },
    ];
  }

  private montarTopRubricas(): void {
    this.topRubricas = [
      { nome: 'Serviços de TI e Infraestrutura', valor: 18430000 },
      { nome: 'Vigilância e Segurança Patrimonial', valor: 15210000 },
      { nome: 'Limpeza e Conservação', valor: 12870000 },
      { nome: 'Locação de Equipamentos', valor: 9640000 },
      { nome: 'Manutenção Predial', valor: 8320000 },
      { nome: 'Consultoria Especializada', valor: 6910000 },
      { nome: 'Telecomunicações', valor: 5480000 },
      { nome: 'Energia Elétrica', valor: 4120000 },
      { nome: 'Transporte e Logística', valor: 3260000 },
      { nome: 'Materiais de Escritório', valor: 1740000 },
    ];
  }

  // Simulação de vencimentos/pagamentos futuros para antecipar o que está por vir
  private montarCalendarioEPagamentos(): void {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth();
    const nomesMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    this.nomeMesCalendario = `${nomesMeses[mes]} ${ano}`;

    const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
    const totalDias = new Date(ano, mes + 1, 0).getDate();

    const fornecedores = ['Vigilância Total Ltda.', 'Ecoserv Ambiental', 'Tech Solutions TI', 'Construtora Alfa', 'Limpa Bem Serviços', 'Transnorte Logística', 'Segurmax Patrimonial', 'Datacom Telecom'];
    const descricoes = ['Vencimento de empenho', 'Pagamento de competência', 'Fechamento de fatura', 'Renovação de garantia contratual'];
    const diasComPagamento = new Set<number>();
    const offsets = [1, 2, 4, 6, 8, 9, 12, 15];

    const pagamentos: PagamentoPrevisto[] = offsets.map((offset, idx) => {
      const data = new Date(ano, mes, hoje.getDate() + offset);
      const dia = data.getDate();
      diasComPagamento.add(dia);
      return {
        dia,
        mes: nomesMeses[data.getMonth()].substring(0, 3),
        descricao: descricoes[idx % descricoes.length],
        contrato: `Nº ${1000 + (idx * 37) % 4000}/202${idx % 2 === 0 ? 5 : 6}`,
        fornecedor: fornecedores[idx % fornecedores.length],
        valor: 45000 + (idx * 18345) % 260000,
        urgente: offset <= 3,
      };
    });
    this.pagamentosPrevistos = pagamentos.sort((a, b) => a.dia - b.dia);

    const dias: DiaCalendario[] = [];
    for (let i = 0; i < primeiroDiaSemana; i++) {
      dias.push({ dia: null, hoje: false, temPagamento: false });
    }
    for (let d = 1; d <= totalDias; d++) {
      dias.push({ dia: d, hoje: d === hoje.getDate(), temPagamento: diasComPagamento.has(d) });
    }
    this.diasCalendario = dias;
  }

}
