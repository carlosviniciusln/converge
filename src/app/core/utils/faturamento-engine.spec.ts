import {
  CompetenciaFaturamento,
  ContratoFaturamento,
  DocumentoObrigatorio,
  ItemFaturavel,
} from '../../models/faturamento-motor';
import { calcularCompetencia } from './faturamento-engine';

describe('faturamento-engine', () => {
  it('calcula marcos, demanda, trade-in e multa do cenário Torino', () => {
    const equipamento = item(1, 'EQUIPAMENTO', 1250000, 0);
    const servico = item(2, 'SERVICO_EVENTUAL', 28500, 0);
    const tradeIn = item(3, 'TRADE_IN', 32780, 0);
    const contrato = contratoBase([equipamento, servico, tradeIn]);
    contrato.regrasFaturamento = [
      { id: 1, contratoId: 1, nome: 'Entrega 70%', tipo: 'MARCO_PERCENTUAL', itemId: 1, eventoGatilho: 'ENTREGA', baseCalculo: 'VALOR_UNITARIO_ITEM', percentual: 70, ordemAplicacao: 1, inicioVigencia: '2026-01-01', ativa: true },
      { id: 2, contratoId: 1, nome: 'Instalação 30%', tipo: 'MARCO_PERCENTUAL', itemId: 1, eventoGatilho: 'INSTALACAO', baseCalculo: 'VALOR_UNITARIO_ITEM', percentual: 30, ordemAplicacao: 2, inicioVigencia: '2026-01-01', ativa: true },
      { id: 3, contratoId: 1, nome: 'Serviço eventual', tipo: 'DEMANDA', itemId: 2, baseCalculo: 'VALOR_UNITARIO_ITEM', ordemAplicacao: 3, inicioVigencia: '2026-01-01', ativa: true },
      { id: 4, contratoId: 1, nome: 'Trade-in', tipo: 'DESCONTO_UNITARIO', itemId: 3, baseCalculo: 'VALOR_UNITARIO_ITEM', ordemAplicacao: 4, inicioVigencia: '2026-01-01', ativa: true },
    ];
    contrato.penalidades = [
      { id: 5, contratoId: 1, codigo: 'ATR', descricao: 'Atraso na entrega', tipo: 'MULTA_DIA', baseCalculo: 'VALOR_UNITARIO_ITEM', percentual: 0.1, tetoPercentual: 10, cumulativa: true, inicioVigencia: '2026-01-01', ativa: true },
    ];
    const competencia = competenciaBase(contrato);
    competencia.medicoes = [{ id: 1, itemId: 2, quantidadeMedida: 12, quantidadeAceita: 12, fatorProRata: 1, fatorTransicao: 1 }];
    competencia.eventos = [
      { id: 1, tipo: 'ENTREGA', itemId: 1, quantidade: 10, ocorridoEm: '2026-09-10' },
      { id: 2, tipo: 'INSTALACAO', itemId: 1, quantidade: 8, ocorridoEm: '2026-09-11' },
      { id: 3, tipo: 'TRADE_IN', itemId: 3, quantidade: 6, ocorridoEm: '2026-09-12' },
      { id: 4, tipo: 'ATRASO', itemId: 1, regraPenalidadeId: 5, quantidade: 2, ocorridoEm: '2026-09-13' },
    ];

    const resultado = calcularCompetencia(contrato, competencia, { usuario: 'teste', versao: 1, calculadoEm: '2026-09-30T12:00:00Z' });

    expect(resultado.valorBrutoCentavos).toBe(12092000);
    expect(resultado.retencaoContratualCentavos).toBe(196680);
    expect(resultado.penalidadeCentavos).toBe(2500);
    expect(resultado.valorCalculadoCentavos).toBe(11892820);
    expect(resultado.statusLiberacao).toBe('LIBERADO');
    expect(resultado.memoria.length).toBe(5);
  });

  it('calcula quantidade ativa, faixa, indisponibilidade e teto no cenário Telecom', () => {
    const circuito = item(1, 'CIRCUITO', 0, 1843000);
    const contrato = contratoBase([circuito]);
    contrato.regrasFaturamento = [
      { id: 1, contratoId: 1, nome: 'Circuitos ativos', tipo: 'MENSAL_QTD_ATIVA', itemId: 1, baseCalculo: 'VALOR_MENSAL_ITEM', ordemAplicacao: 1, inicioVigencia: '2026-01-01', ativa: true },
    ];
    contrato.indicadoresSla = [
      { id: 10, contratoId: 1, codigo: 'DISP', nome: 'Disponibilidade', unidadeApuracao: 'PERCENTUAL', meta: 99.7, baseCalculo: 'VALOR_MENSAL_ITEM', tipoRegra: 'POR_FAIXA', tetoPercentual: 20, inicioVigencia: '2026-01-01', ativo: true, faixas: [{ id: 1, valorMinimo: 99, valorMaximo: 99.6699, percentualDesconto: 10, ordem: 1 }] },
      { id: 11, contratoId: 1, codigo: 'MIN', nome: 'Indisponibilidade', unidadeApuracao: 'MINUTOS', meta: 0, baseCalculo: 'VALOR_MENSAL_ITEM', tipoRegra: 'POR_MINUTO', tetoPercentual: 100, inicioVigencia: '2026-01-01', ativo: true, faixas: [] },
    ];
    contrato.penalidades = [{ id: 20, contratoId: 1, codigo: 'ATR', descricao: 'Atraso', tipo: 'MULTA_DIA', baseCalculo: 'VALOR_FATURA', percentual: 0.05, tetoPercentual: 10, cumulativa: true, inicioVigencia: '2026-01-01', ativa: true }];
    const competencia = competenciaBase(contrato);
    competencia.medicoes = [{ id: 1, itemId: 1, quantidadeMedida: 2, quantidadeAceita: 2, fatorProRata: 1, fatorTransicao: 1 }];
    competencia.apuracoesSla = [{ id: 1, indicadorId: 10, itemId: 1, valorApurado: 99.5, quantidade: 1, baseCalculoCentavos: 3686000 }];
    competencia.eventos = [
      { id: 1, tipo: 'INDISPONIBILIDADE', indicadorSlaId: 11, itemId: 1, quantidade: 1, minutos: 120, ocorridoEm: '2026-09-12' },
      { id: 2, tipo: 'ATRASO', regraPenalidadeId: 20, quantidade: 2, ocorridoEm: '2026-09-14' },
    ];

    const resultado = calcularCompetencia(contrato, competencia, { usuario: 'teste', versao: 1 });

    expect(resultado.valorBrutoCentavos).toBe(3686000);
    expect(resultado.descontoSlaCentavos).toBe(373719);
    expect(resultado.penalidadeCentavos).toBe(3686);
    expect(resultado.valorCalculadoCentavos).toBe(3308595);
    expect(resultado.memoria.filter(linha => linha.natureza === 'DESCONTO_SLA').length).toBe(2);
  });

  it('calcula pro rata e bloqueia liberação sem alterar o calculado no cenário Globalweb', () => {
    const mensalidade = item(1, 'SERVICO_MENSAL', 0, 4800000);
    const contrato = contratoBase([mensalidade]);
    contrato.regrasFaturamento = [
      { id: 1, contratoId: 1, nome: 'Mensalidade', tipo: 'MENSAL_FIXO', itemId: 1, baseCalculo: 'VALOR_MENSAL_ITEM', ordemAplicacao: 1, inicioVigencia: '2026-01-01', ativa: true },
      { id: 2, contratoId: 1, nome: 'Pro rata', tipo: 'PRO_RATA', itemId: 1, baseCalculo: 'VALOR_MENSAL_ITEM', ordemAplicacao: 2, inicioVigencia: '2026-01-01', ativa: true },
    ];
    contrato.documentosObrigatorios = [{ id: 1, contratoId: 1, codigo: 'FGTS', descricao: 'Regularidade FGTS', obrigatorioParaPagamento: true, ativo: true }];
    const competencia = competenciaBase(contrato);
    competencia.medicoes = [{ id: 1, itemId: 1, quantidadeMedida: 1, quantidadeAceita: 1, fatorProRata: 11 / 31, fatorTransicao: 1 }];
    competencia.documentos = [{ documentoObrigatorioId: 1, entregue: false, validado: false }];

    const resultado = calcularCompetencia(contrato, competencia, { usuario: 'teste', versao: 1 });

    expect(resultado.valorBrutoCentavos).toBe(1703226);
    expect(resultado.valorCalculadoCentavos).toBe(1703226);
    expect(resultado.valorLiberadoCentavos).toBe(0);
    expect(resultado.statusLiberacao).toBe('BLOQUEADO');
  });

  it('mantém glosa e retenções em naturezas financeiras separadas', () => {
    const mensalidade = item(1, 'SERVICO_MENSAL', 0, 1000000);
    const contrato = contratoBase([mensalidade]);
    contrato.regrasFaturamento = [{ id: 1, contratoId: 1, nome: 'Mensalidade', tipo: 'MENSAL_FIXO', itemId: 1, baseCalculo: 'VALOR_MENSAL_ITEM', ordemAplicacao: 1, inicioVigencia: '2026-01-01', ativa: true }];
    const competencia = competenciaBase(contrato);
    competencia.medicoes = [{ id: 1, itemId: 1, quantidadeMedida: 1, quantidadeAceita: 1, fatorProRata: 1, fatorTransicao: 1 }];
    competencia.glosaCentavos = 10000;
    competencia.retencaoContratualCentavos = 20000;
    competencia.retencaoTributariaCentavos = 30000;

    const resultado = calcularCompetencia(contrato, competencia, { usuario: 'teste', versao: 1 });

    expect(resultado.glosaCentavos).toBe(10000);
    expect(resultado.retencaoContratualCentavos).toBe(20000);
    expect(resultado.retencaoTributariaCentavos).toBe(30000);
    expect(resultado.valorCalculadoCentavos).toBe(940000);
  });

  it('aplica transição e retenção liberável como regras parametrizadas', () => {
    const mensalidade = item(1, 'SERVICO_MENSAL', 0, 1000000);
    const contrato = contratoBase([mensalidade]);
    contrato.regrasFaturamento = [
      { id: 1, contratoId: 1, nome: 'Mensalidade', tipo: 'MENSAL_FIXO', itemId: 1, baseCalculo: 'VALOR_MENSAL_ITEM', ordemAplicacao: 1, inicioVigencia: '2026-01-01', ativa: true },
      { id: 2, contratoId: 1, nome: 'Transição', tipo: 'TRANSICAO', itemId: 1, baseCalculo: 'VALOR_MENSAL_ITEM', ordemAplicacao: 2, inicioVigencia: '2026-01-01', ativa: true },
      { id: 3, contratoId: 1, nome: 'Retenção liberável', tipo: 'RETENCAO_LIBERAVEL', itemId: 1, baseCalculo: 'VALOR_MENSAL_ITEM', valorFixoCentavos: 10000, ordemAplicacao: 3, inicioVigencia: '2026-01-01', ativa: true },
    ];
    const competencia = competenciaBase(contrato);
    competencia.medicoes = [{ id: 1, itemId: 1, quantidadeMedida: 2, quantidadeAceita: 2, fatorProRata: 1, fatorTransicao: 0.5 }];

    const resultado = calcularCompetencia(contrato, competencia, { usuario: 'teste', versao: 1 });

    expect(resultado.valorBrutoCentavos).toBe(500000);
    expect(resultado.retencaoContratualCentavos).toBe(20000);
    expect(resultado.valorCalculadoCentavos).toBe(480000);
  });

  it('aplica SLA por ocorrência e hora e multas por ocorrência, percentual e global', () => {
    const mensalidade = item(1, 'SERVICO_MENSAL', 0, 1000000);
    const contrato = contratoBase([mensalidade]);
    contrato.regrasFaturamento = [{ id: 1, contratoId: 1, nome: 'Mensalidade', tipo: 'MENSAL_FIXO', itemId: 1, baseCalculo: 'VALOR_MENSAL_ITEM', ordemAplicacao: 1, inicioVigencia: '2026-01-01', ativa: true }];
    contrato.indicadoresSla = [
      { id: 10, contratoId: 1, codigo: 'OCOR', nome: 'Ocorrências', unidadeApuracao: 'QUANTIDADE', meta: 0, baseCalculo: 'VALOR_MENSAL_ITEM', tipoRegra: 'POR_OCORRENCIA', percentual: 2, tetoPercentual: 20, inicioVigencia: '2026-01-01', ativo: true, faixas: [] },
      { id: 11, contratoId: 1, codigo: 'HORA', nome: 'Horas excedentes', unidadeApuracao: 'HORAS', meta: 0, baseCalculo: 'VALOR_MENSAL_ITEM', tipoRegra: 'POR_HORA', percentual: 1, tetoPercentual: 20, inicioVigencia: '2026-01-01', ativo: true, faixas: [] },
    ];
    contrato.penalidades = [
      { id: 20, contratoId: 1, codigo: 'OCO', descricao: 'Multa por ocorrência', tipo: 'MULTA_OCORRENCIA', baseCalculo: 'VALOR_FATURA', valorFixoCentavos: 5000, cumulativa: true, inicioVigencia: '2026-01-01', ativa: true },
      { id: 21, contratoId: 1, codigo: 'PER', descricao: 'Multa percentual', tipo: 'MULTA_PERCENTUAL', baseCalculo: 'VALOR_FATURA', percentual: 5, cumulativa: false, inicioVigencia: '2026-01-01', ativa: true },
      { id: 22, contratoId: 1, codigo: 'GLO', descricao: 'Multa global', tipo: 'MULTA_GLOBAL', baseCalculo: 'VALOR_FATURA', percentual: 2, cumulativa: false, inicioVigencia: '2026-01-01', ativa: true },
    ];
    const competencia = competenciaBase(contrato);
    competencia.medicoes = [{ id: 1, itemId: 1, quantidadeMedida: 1, quantidadeAceita: 1, fatorProRata: 1, fatorTransicao: 1 }];
    competencia.apuracoesSla = [
      { id: 1, indicadorId: 10, itemId: 1, valorApurado: 3, quantidade: 3 },
      { id: 2, indicadorId: 11, itemId: 1, valorApurado: 1.2, quantidade: 1 },
    ];
    competencia.eventos = [
      { id: 1, tipo: 'CHAMADO', regraPenalidadeId: 20, quantidade: 2, ocorridoEm: '2026-09-10' },
      { id: 2, tipo: 'ATRASO', regraPenalidadeId: 21, quantidade: 4, ocorridoEm: '2026-09-11' },
      { id: 3, tipo: 'ATRASO', regraPenalidadeId: 22, quantidade: 4, ocorridoEm: '2026-09-12' },
    ];

    const resultado = calcularCompetencia(contrato, competencia, { usuario: 'teste', versao: 1 });

    expect(resultado.descontoSlaCentavos).toBe(80000);
    expect(resultado.penalidadeCentavos).toBe(80000);
    expect(resultado.valorCalculadoCentavos).toBe(840000);
  });
});

function item(id: number, tipo: ItemFaturavel['tipo'], unitario: number, mensal: number): ItemFaturavel {
  return { id, contratoId: 1, codigo: `ITEM-${id}`, descricao: `Item ${id}`, tipo, unidadeMedida: 'UN', valorUnitarioCentavos: unitario, valorMensalCentavos: mensal, quantidadeContratada: 100, permiteProRata: true, permiteRetencao: true, inicioVigencia: '2026-01-01', ativo: true };
}

function contratoBase(itens: ItemFaturavel[]): ContratoFaturamento {
  return { id: 1, numero: 'TESTE', fornecedor: 'Fornecedor', objeto: 'Objeto', inicioVigencia: '2026-01-01', fimVigencia: '2026-12-31', valorGlobalCentavos: 100000000, periodicidade: 'MENSAL', diaLimiteNotaFiscal: 20, diaPagamento: 5, status: 'ATIVO', unidades: [], itens, regrasFaturamento: [], indicadoresSla: [], penalidades: [], documentosObrigatorios: documentosValidos() };
}

function documentosValidos(): DocumentoObrigatorio[] {
  return [{ id: 99, contratoId: 1, codigo: 'NF', descricao: 'Nota fiscal', obrigatorioParaPagamento: true, ativo: true }];
}

function competenciaBase(contrato: ContratoFaturamento): CompetenciaFaturamento {
  return { id: 1, contratoId: contrato.id, ano: 2026, mes: 9, inicio: '2026-09-01', fim: '2026-09-30', status: 'EM_APURACAO', statusLiberacao: 'PENDENTE', medicoes: [], eventos: [], apuracoesSla: [], documentos: contrato.documentosObrigatorios.map(documento => ({ documentoObrigatorioId: documento.id, entregue: true, validado: true })), glosaCentavos: 0, retencaoContratualCentavos: 0, retencaoTributariaCentavos: 0 };
}