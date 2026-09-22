import { Injectable } from '@angular/core';
import { PainelIntegracaoSiafic, ResultadoSincronizacaoSiafic } from '../models/siafic-integration';

export abstract class ISiaficIntegrationService {
  abstract readonly isMock: boolean;
  abstract consultarContrato(contratoId: number): Promise<PainelIntegracaoSiafic>;
  abstract sincronizarContrato(contratoId: number): Promise<ResultadoSincronizacaoSiafic>;
}

@Injectable({ providedIn: 'root' })
export class MockSiaficIntegrationService implements ISiaficIntegrationService {
  readonly isMock = true;

  async consultarContrato(contratoId: number): Promise<PainelIntegracaoSiafic> {
    await this.simularLatencia(350);
    return this.criarPainel(contratoId);
  }

  async sincronizarContrato(contratoId: number): Promise<ResultadoSincronizacaoSiafic> {
    await this.simularLatencia(1100);
    const dataHora = new Date().toISOString();
    return {
      protocolo: `MOCK-SIAFIC-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
      dataHora,
      registrosConsultados: this.criarPainel(contratoId).registros.length,
      divergenciasEncontradas: this.criarPainel(contratoId).divergencias.length,
    };
  }

  private criarPainel(contratoId: number): PainelIntegracaoSiafic {
    const paineis: Record<number, PainelIntegracaoSiafic> = {
      148: {
        contratoId: 148,
        contratoNumero: 'CT-2026/0148',
        ambiente: 'DEMONSTRAÇÃO',
        sistemaDestino: 'SIAFIC do ente (adaptador não configurado)',
        ultimaSincronizacao: '2026-09-11T09:42:00',
        classificacao: {
          unidadeOrcamentaria: '110101 · Secretaria de Administração',
          programa: '0042 · Modernização da Gestão Pública',
          acao: '2184 · Sustentação de Serviços Digitais',
          naturezaDespesa: '3.3.90.40 · Serviços de TIC',
          fonteRecursos: '1.500.0000 · Recursos não vinculados',
          planoInterno: 'TI-GOV-2026',
        },
        registros: [
          { id: 'ctr-148', etapa: 'Contrato', numero: 'CT-2026/0148', descricao: 'Instrumento contratual vigente', valor: 2450000, data: '2026-01-15', status: 'Concluído', origem: 'Converge' },
          { id: 'emp-184', etapa: 'Empenho', numero: '2026NE000184', descricao: 'Empenho ordinário inicial', valor: 1600000, data: '2026-01-20', status: 'Concluído', origem: 'SIAFIC' },
          { id: 'liq-3912', etapa: 'Liquidação', numero: '2026NL003912', descricao: 'Liquidação da competência agosto/2026', valor: 145000, data: '2026-09-02', status: 'Com divergência', origem: 'SIAFIC' },
          { id: 'pag-4921', etapa: 'Pagamento', numero: '2026OB004921', descricao: 'Ordem bancária da competência agosto/2026', valor: 145000, data: '2026-09-05', status: 'Concluído', origem: 'SIAFIC' },
        ],
        divergencias: [
          { id: 1, tipo: 'Documento', criticidade: 'Média', descricao: 'Ateste da competência não localizado no vínculo da liquidação.', valorConverge: 'Ateste AT-2026/0088', valorSiafic: 'Sem referência documental', orientacao: 'Vincular o ateste à liquidação antes do fechamento mensal.' },
          { id: 2, tipo: 'Valor', criticidade: 'Baixa', descricao: 'Saldo empenhado difere do saldo contratual por aditivo ainda não reforçado.', valorConverge: 'R$ 931.000,00', valorSiafic: 'R$ 721.000,00', orientacao: 'Avaliar emissão de reforço de empenho no valor de R$ 210.000,00.' },
        ],
        logs: [
          { id: 1, dataHora: '2026-09-11T09:42:00', operacao: 'Consulta de execução', protocolo: 'MOCK-SIAFIC-2026-091142', resultado: 'Alerta', detalhe: '4 registros recebidos e 2 divergências identificadas.' },
          { id: 2, dataHora: '2026-09-10T16:18:00', operacao: 'Consulta de pagamento', protocolo: 'MOCK-SIAFIC-2026-091018', resultado: 'Sucesso', detalhe: 'Ordem bancária 2026OB004921 conciliada.' },
          { id: 3, dataHora: '2026-09-08T11:05:00', operacao: 'Consulta de empenho', protocolo: 'MOCK-SIAFIC-2026-090805', resultado: 'Sucesso', detalhe: 'Nota de empenho 2026NE000184 localizada.' },
        ],
      },
    };

    return paineis[contratoId] || {
      ...paineis[148],
      contratoId,
      contratoNumero: `Contrato ${contratoId}`,
      registros: paineis[148].registros.map(registro => ({ ...registro })),
      divergencias: [],
      logs: [],
    };
  }

  private simularLatencia(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}