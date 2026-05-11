import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-busca-contrato',
  templateUrl: './busca-contrato.component.html',
  styleUrls: ['./busca-contrato.component.scss'],
})
export class BuscaContratoComponent implements OnInit {
  contrato: string = '';
  vigenciaSelecionada: string = '9567';

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
    this.route.queryParams.subscribe(params => {
      this.contrato = params['contrato'] || '';
    });
  }

  voltar(): void {
    this.router.navigate(['/dashboard']);
  }

  trocarVigencia(id: string): void {
    this.vigenciaSelecionada = id;
    // TODO: recarregar dados da vigência via API
  }
}
