import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Chart from 'chart.js/auto';
import * as d3 from 'd3';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-busca-gerencial',
  templateUrl: './busca-gerencial.component.html',
  styleUrls: ['./busca-gerencial.component.scss']
})
export class BuscaGerencialComponent implements OnInit, AfterViewInit, OnDestroy {
  searchTerm: string = '';
  diretorias = [ { id: 'Diretoria A', label: 'Diretoria A' }, { id: 'Diretoria B', label: 'Diretoria B' }, { id: 'Diretoria C', label: 'Diretoria C' }, { id: 'Diretoria D', label: 'Diretoria D' }, { id: 'Diretoria E', label: 'Diretoria E' } ];
  diretoriaSelecionada = this.diretorias[0].id;

  // --- Data placeholders (copied from busca-contrato for visual parity)
  contrato: string = '';
  // selected view (vision) id — (default set later)

  infoGeral = {
    fornecedor: 'Tech Solutions Serviços de TI Ltda.',
    cnpj: '12.345.678/0001-99',
    objeto: 'Prestação de serviços de suporte técnico e manutenção de sistemas',
    unidadeDemandante: 'DITI / GESIT',
    fiscal: 'João Carlos Lima',
    tipoContrato: 'Serviço Contínuo',
    mensalizacao: 'Sim – 12 parcelas',
    execucaoPct: 11.2,
  };

  // simplified "visão" options as requested
  vigencias = [
    { id: 'capex', label: 'Gerencial CAPEX / OPEX' },
    { id: 'vitec', label: 'VITEC' }
    // { id: 'unidade', label: 'Unidade Demandante' }
  ];

  // visible label for template (update explicitly to ensure change detection propagates)
  vigenciaLabel: string = 'Gerencial CAPEX / OPEX';

  // KPI sample values for Números Rápidos
  capexDotacao: string = 'R$ 50.000.000,00';
  capexPlanejado: string = 'R$ 40.000.000,00';
  capexExecutado: string = 'R$ 16.000.000,00';
  opexDotacao: string = 'R$ 50.000.000,00';
  opexPlanejado: string = 'R$ 30.000.000,00';
  opexExecutado: string = 'R$ 18.000.000,00';

  resumoVigencia = {
    inicio: '03/04/2025',
    termino: '02/04/2027',
    prazo: '1 Ano(s), 0 Mês(es), 30 Dia(s)',
    alertaOk: true,
    alertaTexto: 'Consumo ABAIXO da média estimada',
    contratado: 'R$ 113.631.779,04',
    saldo: 'R$ 100.882.995,60',
    mediaEstimada: 'R$ 4.734.657,46',
    mediaUlt3: 'R$ 2.733.513,17',
    mediaTodos: 'R$ 1.821.254,78',
    projecao: 'Mantendo a média mensal, o esgotamento ocorrerá em <strong>55 meses</strong>.',
    execPct: '11,2%',
  };

  pagamentos = {
    estimado: 'R$ 113.631.779,04',
    executado: 'R$ 12.748.783,44',
    media: 'R$ 4.734.657,46',
    mediaUlt3: 'R$ 2.733.513,17',
    alerta: '⬇ abaixo da média est.',
  };

  penalidades = {
    multas: 28,
    advertencias: 3,
    suspensoes: 0,
    emTratamento: 18,
    instSolicitada: 10,
    encerradas: 3,
  };

  atestes = {
    total: 4,
    comRetencao: 1,
    semRetencao: 3,
    alertaTexto: 'Jan/2026: retenção de R$ 100,02 — penalidade vinculada em aberto',
  };

  ordens = {
    total: 1,
    assinadas: 1,
    emAndamento: 0,
    pendentes: 0,
  };

  workflow = {
    os: 1,
    atestes: 4,
    atestesSub: '2 competências',
    pgto: 2,
    pgtoSub: 'de 8 competências',
    retencoes: 31,
    retencoesSub: 'RTC abertos',
  };

  // Highcharts integration (use project's Highcharts to match visual)
  // Chart.js references
  @ViewChild('orcChart', { static: false }) orcChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('orcBarChart', { static: false }) orcBarChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('execChart', { static: false }) execChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('capexChart', { static: false }) capexChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('capexSmallChart', { static: false }) capexSmallChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('opexSmallChart', { static: false }) opexSmallChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('orcMonthlyChart', { static: false }) orcMonthlyChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('diretoriaModal', { static: false }) diretoriaModal!: TemplateRef<any>;
  @ViewChild('radarChart', { static: false }) radarChartRef!: ElementRef<HTMLDivElement>;

  private orcChart?: Chart;
  private execChart?: Chart;
  private capexChart?: Chart;
  private orcBarChart?: Chart;
  private capexSmallChart?: Chart;
  private opexSmallChart?: Chart;
  private orcMonthlyChart?: Chart;
  private modalRef?: NgbModalRef;
  private radarSvg?: d3.Selection<SVGSVGElement, unknown, null, undefined>;

  modalTitle: string = '';
  // selected view (vision) id — default to Gerencial CAPEX / OPEX
  vigenciaSelecionada: string = 'capex';

  constructor(private route: ActivatedRoute, private modalService: NgbModal) {
    // keep minimal constructor: route used for query param sync; modalService for opening diretoria modal
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const q = (params['q'] || params['contrato'] || '').toString();
      if (q) {
        this.searchTerm = q;
      }
    });
  }

  ngAfterViewInit(): void {
    // Orçamento por Diretoria - pie (fallback data)
    const orcData = this.diretorias.map((d, i) => ({ label: d.label, value: [30,25,20,15,10][i] }));
    const self = this;

    // If not VITEC, create the original pie chart; if VITEC selected, the bar chart will be rendered on demand
    if (this.vigenciaSelecionada !== 'vitec') {
      this.orcChart = new Chart(this.orcChartRef.nativeElement.getContext('2d') as CanvasRenderingContext2D, {
        type: 'pie',
        data: {
          labels: orcData.map(d => d.label),
          datasets: [{ data: orcData.map(d => d.value), backgroundColor: ['#005CA9','#00437A','#002A4D','#127527','#ca9804'] }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true }, title: { display: true, text: 'Orçamento Total por Diretoria (%)' } },
          onClick: function(evt: any, elements: any[]) {
            if (elements && elements.length) {
              const idx = elements[0].index;
              const label = this.data.labels[idx];
              self.openDiretoriaModal(label);
            }
          }
        }
      });
      // ensure Chart.js respects container size
      setTimeout(() => { try { this.orcChart?.resize(); this.orcChart?.update(); } catch(_){} }, 80);
    } else {
      // if VITEC is already selected on init, render bar chart
      setTimeout(() => this.drawOrcBarChart(), 0);
    }

    // Orçamento CAPEX x OPEX - doughnut
    this.capexChart = new Chart(this.capexChartRef.nativeElement.getContext('2d') as CanvasRenderingContext2D, {
      type: 'doughnut',
      data: { labels: ['CAPEX','OPEX'], datasets: [{ data: [40,60], backgroundColor: ['#005CA9','#127527'] }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true }, title: { display: true, text: 'Orçamento: CAPEX x OPEX' } } }
    });
    setTimeout(() => { try { this.capexChart?.resize(); this.capexChart?.update(); } catch(_){} }, 80);

    // small charts under CAPEX and OPEX cards (Visão Gerencial)
    try {
      const capexCtx = this.capexSmallChartRef?.nativeElement?.getContext('2d') as CanvasRenderingContext2D | undefined;
      if (capexCtx) {
        this.capexSmallChart = new Chart(capexCtx, {
          type: 'bar',
          data: { labels: ['Jan','Fev','Mar','Abr','Mai'], datasets: [{ label: 'Capex', data: [20,30,25,35,28], backgroundColor: '#0b5ed7' }] },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
        });
      }
    } catch(e) { console.warn('capex small chart', e); }

    try {
      const opexCtx = this.opexSmallChartRef?.nativeElement?.getContext('2d') as CanvasRenderingContext2D | undefined;
      if (opexCtx) {
        this.opexSmallChart = new Chart(opexCtx, {
          type: 'bar',
          data: { labels: ['Jan','Fev','Mar','Abr','Mai'], datasets: [{ label: 'Opex', data: [25,28,30,22,26], backgroundColor: '#127527' }] },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
        });
      }
    } catch(e) { console.warn('opex small chart', e); }

    // monthly competency chart for CAPEX/OPEX (only for non-vitec view)
    if (this.vigenciaSelecionada !== 'vitec') {
      // allow layout to settle; small delay improves initial render in responsive containers
      setTimeout(() => { this.drawOrcMonthlyChart(); try { this.orcMonthlyChart?.resize(); this.orcMonthlyChart?.update(); } catch(_){} }, 120);
    }

    // render radar chart (D3)
    this.drawRadarChart();
  }
  
  openDiretoriaModal(label: string): void {
    this.modalTitle = label;
    try {
      this.modalRef = this.modalService.open(this.diretoriaModal, { ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'custom-class' });
    } catch (e) {
      // safety: if template modal cannot be opened, ignore
      console.warn('Failed to open modal', e);
    }
  }
  trocarVigencia(id: string): void {
    this.vigenciaSelecionada = id;
    const found = this.vigencias.find(x => x.id === id);
    this.vigenciaLabel = found ? found.label : 'Visão Gerencial';
    // if switching to VITEC, draw the grouped bar chart; otherwise destroy it
    if (id === 'vitec') {
      // allow DOM to update
      setTimeout(() => this.drawOrcBarChart(), 0);
    } else {
      try { this.orcBarChart?.destroy(); } catch (_) {}
      this.orcBarChart = undefined;
      // draw monthly chart for CAPEX/OPEX view
      setTimeout(() => this.drawOrcMonthlyChart(), 0);
    }
    // placeholder: in a real implementation we would reload data for the selected vigência
  }

  onDiretoriaChange(id: string): void {
    this.diretoriaSelecionada = id;
    // future: filter chart data by selected diretoria if needed
  }

  private drawOrcBarChart(): void {
    try {
      // destroy existing charts to avoid duplicates
      try { this.orcBarChart?.destroy(); } catch (_) {}
      const ctx = this.orcBarChartRef?.nativeElement?.getContext('2d') as CanvasRenderingContext2D | undefined;
      if (!ctx) return;

      const labels = this.diretorias.map(d => d.id);
      const planejado = [30,25,20,15,10];
      const executado = [28,22,25,15,10];

      this.orcBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            { label: 'Planejado por Diretoria (%)', data: planejado, backgroundColor: '#005CA9' },
            { label: 'Executado por Diretoria', data: executado, backgroundColor: '#FF7F11' }
          ]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: true } },
          scales: {
            x: { stacked: false },
            y: { beginAtZero: true, max: 100 }
          }
        }
      });
    } catch (e) {
      console.warn('Erro ao desenhar gráfico de barras (Orçamento VITEC)', e);
    }
  }

  private drawOrcMonthlyChart(): void {
    try {
      try { this.orcMonthlyChart?.destroy(); } catch (_) {}
      const ctx = this.orcMonthlyChartRef?.nativeElement?.getContext('2d') as CanvasRenderingContext2D | undefined;
      if (!ctx) return;

      const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

      // sample monthly datasets (replace with real data when available)
      const capexPlanejado = [220,180,240,200,210,230,250,240,220,210,200,230];
      const capexExecutado = [200,160,220,180,190,210,230,220,200,190,180,210];
      const opexPlanejado = [180,170,190,200,195,205,210,200,190,185,180,195];
      const opexExecutado = [170,160,180,190,185,195,200,190,180,175,170,185];

      this.orcMonthlyChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: months,
          datasets: [
            { label: 'Capex Planejado', data: capexPlanejado, borderColor: '#0b5ed7', backgroundColor: 'rgba(11,94,215,0.15)', tension: 0.2, fill: true },
            { label: 'Capex Executado', data: capexExecutado, borderColor: '#004a9e', backgroundColor: 'rgba(0,74,158,0.12)', tension: 0.2, fill: true },
            { label: 'Opex Planejado', data: opexPlanejado, borderColor: '#127527', backgroundColor: 'rgba(18,117,39,0.12)', tension: 0.2, fill: true },
            { label: 'Opex Executado', data: opexExecutado, borderColor: '#0f8a2f', backgroundColor: 'rgba(15,138,47,0.10)', tension: 0.2, fill: true }
          ]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: true } },
          scales: { y: { beginAtZero: true } }
        }
      });
    } catch (e) {
      console.warn('Erro ao desenhar orcMonthlyChart', e);
    }
  }

  ngOnDestroy(): void {
    // destroy Chart.js instances
    try {
      this.orcChart?.destroy();
      this.execChart?.destroy();
      this.capexChart?.destroy();
      if (this.radarSvg) {
        try { this.radarSvg.remove(); } catch (_) {}
      }
    } catch (e) {
      // ignore
    }
  }

  private drawRadarChart(): void {
    try {
      const container = this.radarChartRef?.nativeElement;
      if (!container) return;

      const axes = [
        { axis: 'Capex Dotação', value: 80 },
        { axis: 'Capex Planejado', value: 78 },
        { axis: 'Capex Executado', value: 40 },
        { axis: 'Capex Exec/Dot', value: 45 },
        { axis: 'Opex Dotação', value: 75 },
        { axis: 'Opex Planejado', value: 74 },
        { axis: 'Opex Executado', value: 55 },
        { axis: 'Opex Exec/Dot', value: 60 }
      ];

      const width = container.clientWidth || 300;
      const height = container.clientHeight || 150;
      const radius = Math.min(width, height) / 2 - 20;

      // clear existing
      d3.select(container).selectAll('*').remove();

      const svgContainer = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`);

      const svg = svgContainer.append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`);

      this.radarSvg = svgContainer as any;

      const angleSlice = (Math.PI * 2) / axes.length;
      const rScale = d3.scaleLinear().range([0, radius]).domain([0, 100]);

      // grid
      const levels = 4;
      for (let lvl = 1; lvl <= levels; lvl++) {
        const r = radius * (lvl / levels);
        svg.append('circle').attr('r', r).attr('fill', '#eee').attr('stroke', '#ddd').attr('fill-opacity', 0.01);
      }

      // axes and labels
      axes.forEach((d, i) => {
        const angle = angleSlice * i - Math.PI / 2;
        const lineCoord = [rScale(100) * Math.cos(angle), rScale(100) * Math.sin(angle)];
        svg.append('line').attr('x1', 0).attr('y1', 0).attr('x2', lineCoord[0]).attr('y2', lineCoord[1]).attr('stroke', '#bbb');
        const labelCoord = [rScale(110) * Math.cos(angle), rScale(110) * Math.sin(angle)];
        svg.append('text').attr('x', labelCoord[0]).attr('y', labelCoord[1])
          .attr('dy', '0.35em')
          .style('font-size', '10px')
          .style('text-anchor', 'middle')
          .text(d.axis);
      });

      // radar line
      const radarLine = d3.lineRadial()
        .radius((d: any) => rScale(d.value))
        .angle((d: any, i: number) => i * angleSlice)
        .curve(d3.curveLinearClosed as any);

      svg.append('path')
        .datum(axes)
        .attr('d', radarLine as any)
        .attr('fill', '#005CA9')
        .attr('fill-opacity', 0.25)
        .attr('stroke', '#005CA9')
        .attr('stroke-width', 1.5);

      // points
      svg.selectAll('.radar-circle')
        .data(axes)
        .enter()
        .append('circle')
        .attr('class', 'radar-circle')
        .attr('r', 3)
        .attr('cx', (d, i) => rScale((d as any).value) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr('cy', (d, i) => rScale((d as any).value) * Math.sin(angleSlice * i - Math.PI / 2))
        .attr('fill', '#005CA9');

    } catch (e) {
      console.warn('Erro ao desenhar radar chart', e);
    }
  }
}
