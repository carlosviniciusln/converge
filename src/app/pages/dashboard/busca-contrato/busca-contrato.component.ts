import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as html2pdf from 'html2pdf.js';

export interface DiagnosticoContrato {
  severidade: 'positivo' | 'atencao' | 'critico';
  usoTexto: string;
  projecaoTexto: string;
  pagamentosTexto: string;
  recomendacao: string;
}

@Component({
  selector: 'app-busca-contrato',
  templateUrl: './busca-contrato.component.html',
  styleUrls: ['./busca-contrato.component.scss'],
})
export class BuscaContratoComponent implements OnInit {
  contrato: string = '';
  nuContrato: string = '';
  vigenciaSelecionada: string = '9567';
  gerandoPdf: boolean = false;
  diagnostico!: DiagnosticoContrato;


  // Dados simulados (serão substituídos por API)
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

  vigencias = [
    { id: '9567', label: '9567 — 03/04/2025 a 02/04/2027 (Atual)' },
    { id: '8132', label: '8132 — 01/01/2024 a 31/12/2024' },
    { id: '7201', label: '7201 — 01/01/2023 a 31/12/2023' },
  ];

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

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.nuContrato = this.route.snapshot.paramMap.get('id') || '';
    this.route.queryParams.subscribe(params => {
      this.contrato = params['contrato'] || '';
    });
    this.diagnostico = this.montarDiagnostico();
  }

  voltar(): void {
    this.router.navigate(['/dashboard']);
  }

  trocarVigencia(id: string): void {
    this.vigenciaSelecionada = id;
    // TODO: recarregar dados da vigência via API
    this.diagnostico = this.montarDiagnostico();
  }

  // Consolida os indicadores das demais seções em um único parecer (topico "Diagnóstico" do prontuário)
  private montarDiagnostico(): DiagnosticoContrato {
    const usoAbaixoOuDentro = this.resumoVigencia.alertaOk;
    const temRetencaoEmAberto = this.atestes.comRetencao > 0;
    const temPenalidadeEmTratamento = this.penalidades.emTratamento > 0;

    const usoTexto = usoAbaixoOuDentro
      ? `Consumo dentro do esperado (${this.resumoVigencia.execPct} da vigência executados).`
      : `Consumo ACIMA da média estimada (${this.resumoVigencia.execPct} da vigência executados). Risco de esgotamento antecipado do saldo.`;

    const pagamentosTexto = temRetencaoEmAberto
      ? `Há competência com retenção vinculada em aberto: ${this.atestes.alertaTexto}`
      : 'Nenhum pagamento com pendência de retenção identificado nas últimas competências.';

    let severidade: DiagnosticoContrato['severidade'] = 'positivo';
    if (!usoAbaixoOuDentro || temRetencaoEmAberto) severidade = 'atencao';
    if (!usoAbaixoOuDentro && temRetencaoEmAberto) severidade = 'critico';

    const recomendacao = severidade === 'positivo'
      ? 'Contrato saudável. Manter acompanhamento mensal padrão.'
      : severidade === 'atencao'
        ? 'Recomenda-se atenção do fiscal do contrato nos próximos ciclos de pagamento e retenção.'
        : 'Recomenda-se ação imediata do gestor: revisar saldo remanescente e regularizar as pendências de retenção.';

    return {
      severidade,
      usoTexto,
      projecaoTexto: this.resumoVigencia.projecao.replace(/<\/?strong>/g, ''),
      pagamentosTexto,
      recomendacao,
    };
  }

  async exportarFicha(): Promise<void> {
    const elemento = document.getElementById('fichaContratoConteudo');
    if (!elemento || this.gerandoPdf) return;

    this.gerandoPdf = true;

    // Empilha todos os blocos (2 colunas viram 1) e adiciona cabeçalho com logo só durante a captura
    const gridsAlterados = Array.from(
      elemento.querySelectorAll<HTMLElement>('.painel-body, .diagnostico-grid')
    );
    const gridsOriginais = gridsAlterados.map(grid => grid.style.gridTemplateColumns);
    gridsAlterados.forEach(grid => (grid.style.gridTemplateColumns = '1fr'));

    const larguraOriginal = elemento.style.width;
    elemento.style.width = '900px';

    const cabecalho = document.createElement('div');
    cabecalho.innerHTML = `
      <div style="display:flex;align-items:center;gap:14px;padding-bottom:14px;margin-bottom:16px;border-bottom:2px solid #005ca9;">
        <img src="assets/images/logo.png" style="height:42px;" />
        <div>
          <div style="font-size:18px;font-weight:700;color:#002a4d;">Ficha do Contrato ${this.contrato || this.nuContrato || ''}</div>
          <div style="font-size:11px;color:#64747a;">CONVERGE - Plataforma de Gestão de Contratos &middot; Gerado em ${new Date().toLocaleString('pt-BR')}</div>
        </div>
      </div>`;
    elemento.insertBefore(cabecalho, elemento.firstChild);

    // Dá tempo do navegador aplicar o novo layout antes de capturar
    await new Promise(resolve => setTimeout(resolve, 150));

    const opcoes = {
      margin: [8, 8, 8, 8],
      filename: `ficha-contrato-${this.contrato || this.nuContrato || 'documento'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css'] },
    };

    try {
      await html2pdf().from(elemento).set(opcoes).save();
    } finally {
      cabecalho.remove();
      elemento.style.width = larguraOriginal;
      gridsAlterados.forEach((grid, i) => (grid.style.gridTemplateColumns = gridsOriginais[i]));
      this.gerandoPdf = false;
    }
  }
}
