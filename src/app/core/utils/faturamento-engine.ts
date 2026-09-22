import {
  BaseCalculo,
  CompetenciaFaturamento,
  ContratoFaturamento,
  EventoCompetencia,
  ItemFaturavel,
  LinhaMemoriaCalculo,
  RegraPenalidade,
  ResultadoCompetencia,
} from '../../models/faturamento-motor';
import { calcularPercentual, limitarPercentual } from './faturamento-money';

export interface ContextoCalculo {
  usuario: string;
  versao: number;
  calculadoEm?: string;
}

export function calcularCompetencia(
  contrato: ContratoFaturamento,
  competencia: CompetenciaFaturamento,
  contexto: ContextoCalculo
): ResultadoCompetencia {
  validarCompetencia(contrato, competencia);
  const memoria: LinhaMemoriaCalculo[] = [];
  let linhaId = 1;

  const regras = contrato.regrasFaturamento
    .filter(regra => vigente(regra, competencia) && regra.ativa)
    .sort((a, b) => a.ordemAplicacao - b.ordemAplicacao);

  for (const regra of regras) {
    if (['PRO_RATA', 'TRANSICAO', 'RETENCAO_LIBERAVEL', 'DESCONTO_UNITARIO'].includes(regra.tipo)) continue;
    const item = contrato.itens.find(atual => atual.id === regra.itemId && atual.ativo);
    if (!item) continue;

    if (regra.tipo === 'MARCO_PERCENTUAL') {
      const eventos = competencia.eventos.filter(evento => evento.itemId === item.id && evento.tipo === regra.eventoGatilho);
      for (const evento of eventos) {
        const base = item.valorUnitarioCentavos * evento.quantidade;
        const resultado = calcularPercentual(base, regra.percentual || 0);
        memoria.push(linha(linhaId++, 'FATURAMENTO', regra.id, evento.id, regra.nome, `${evento.quantidade} x valor unitário x ${regra.percentual || 0}%`, base, regra.percentual, evento.quantidade, resultado));
      }
      continue;
    }

    const medicao = competencia.medicoes.find(atual => atual.itemId === item.id);
    if (!medicao) continue;
    const quantidade = regra.tipo === 'MENSAL_FIXO' ? 1 : medicao.quantidadeAceita;
    const baseUnitaria = regra.tipo === 'DEMANDA' ? item.valorUnitarioCentavos : item.valorMensalCentavos;
    const fatorProRata = possuiRegra(regras, item.id, 'PRO_RATA') ? medicao.fatorProRata : 1;
    const fatorTransicao = possuiRegra(regras, item.id, 'TRANSICAO') ? medicao.fatorTransicao : 1;
    const resultado = Math.round(baseUnitaria * quantidade * fatorProRata * fatorTransicao);
    memoria.push(linha(linhaId++, 'FATURAMENTO', regra.id, undefined, regra.nome, `${quantidade} x valor base x ${fatorProRata} pro rata x ${fatorTransicao} transição`, baseUnitaria * quantidade, undefined, quantidade, resultado));
  }

  const valorBrutoCentavos = somar(memoria, 'FATURAMENTO');

  for (const indicador of contrato.indicadoresSla.filter(item => item.ativo && vigente(item, competencia))) {
    const apuracoes = competencia.apuracoesSla.filter(apuracao => apuracao.indicadorId === indicador.id);
    const eventos = competencia.eventos.filter(evento => evento.indicadorSlaId === indicador.id);

    for (const apuracao of apuracoes) {
      const item = contrato.itens.find(atual => atual.id === apuracao.itemId);
      const base = apuracao.baseCalculoCentavos ?? resolverBase(indicador.baseCalculo, contrato, item, valorBrutoCentavos);
      let percentual = indicador.percentual || 0;
      let resultado = 0;

      if (indicador.tipoRegra === 'POR_FAIXA') {
        const faixa = indicador.faixas
          .filter(atual => apuracao.valorApurado >= atual.valorMinimo && apuracao.valorApurado <= atual.valorMaximo)
          .sort((a, b) => a.ordem - b.ordem)[0];
        if (!faixa) continue;
        percentual = faixa.percentualDesconto;
        resultado = calcularPercentual(base, percentual);
      } else if (indicador.tipoRegra === 'POR_OCORRENCIA') {
        resultado = calcularPercentual(base, percentual) * apuracao.quantidade;
      } else if (indicador.tipoRegra === 'POR_HORA') {
        resultado = calcularPercentual(base, percentual) * Math.ceil(apuracao.valorApurado);
      }

      resultado = limitarPercentual(resultado, base, indicador.tetoPercentual);
      if (resultado > 0) memoria.push(linha(linhaId++, 'DESCONTO_SLA', indicador.id, undefined, indicador.nome, `${apuracao.valorApurado} apurado; ${percentual}% sobre a base`, base, percentual, apuracao.quantidade, resultado));
    }

    if (indicador.tipoRegra === 'POR_MINUTO') {
      for (const evento of eventos) {
        const item = contrato.itens.find(atual => atual.id === evento.itemId);
        const base = resolverBase(indicador.baseCalculo, contrato, item, valorBrutoCentavos);
        const minutosCompetencia = minutosNoMes(competencia.ano, competencia.mes);
        const resultado = limitarPercentual(Math.round(base / minutosCompetencia * (evento.minutos || 0)), base, indicador.tetoPercentual);
        if (resultado > 0) memoria.push(linha(linhaId++, 'DESCONTO_SLA', indicador.id, evento.id, indicador.nome, `(base / ${minutosCompetencia} min) x ${evento.minutos || 0} min`, base, undefined, evento.minutos || 0, resultado));
      }
    }
  }

  for (const regra of regras.filter(item => item.tipo === 'DESCONTO_UNITARIO' || item.tipo === 'RETENCAO_LIBERAVEL')) {
    const item = contrato.itens.find(atual => atual.id === regra.itemId);
    if (!item) continue;
    const eventos = competencia.eventos.filter(evento => evento.itemId === item.id && (evento.tipo === 'TRADE_IN' || evento.tipo === regra.eventoGatilho));
    const medicao = competencia.medicoes.find(atual => atual.itemId === item.id);
    const quantidade = eventos.reduce((total, evento) => total + evento.quantidade, 0) || medicao?.quantidadeAceita || 0;
    const base = resolverBase(regra.baseCalculo, contrato, item, valorBrutoCentavos);
    const resultado = regra.percentual !== undefined
      ? calcularPercentual(base * quantidade, regra.percentual)
      : (regra.valorFixoCentavos || base) * quantidade;
    if (resultado > 0) memoria.push(linha(linhaId++, 'RETENCAO', regra.id, eventos[0]?.id, regra.nome, `${quantidade} x valor de retenção/desconto`, base, regra.percentual, quantidade, resultado));
  }

  for (const regra of contrato.penalidades.filter(item => item.ativa && vigente(item, competencia))) {
    const eventos = competencia.eventos.filter(evento => evento.regraPenalidadeId === regra.id);
    for (const evento of eventos) {
      const item = contrato.itens.find(atual => atual.id === evento.itemId);
      const base = resolverBase(regra.baseCalculo, contrato, item, valorBrutoCentavos);
      const quantidade = quantidadePenalidade(regra, evento);
      let resultado = regra.valorFixoCentavos
        ? regra.valorFixoCentavos * quantidade
        : calcularPercentual(base, regra.percentual || 0) * quantidade;
      resultado = limitarPercentual(resultado, base, regra.tetoPercentual);
      if (resultado > 0) memoria.push(linha(linhaId++, 'PENALIDADE', regra.id, evento.id, regra.descricao, `${quantidade} x penalidade sobre a base`, base, regra.percentual, quantidade, resultado));
    }
  }

  if (competencia.glosaCentavos > 0) memoria.push(linha(linhaId++, 'GLOSA', undefined, undefined, 'Glosa informada pelo gestor', 'Valor de glosa validado na competência', competencia.glosaCentavos, undefined, 1, competencia.glosaCentavos));
  if (competencia.retencaoContratualCentavos > 0) memoria.push(linha(linhaId++, 'RETENCAO', undefined, undefined, 'Retenção contratual informada', 'Valor de retenção contratual da competência', competencia.retencaoContratualCentavos, undefined, 1, competencia.retencaoContratualCentavos));
  if (competencia.retencaoTributariaCentavos > 0) memoria.push(linha(linhaId++, 'RETENCAO', undefined, undefined, 'Retenção tributária informada', 'Tributos retidos na competência', competencia.retencaoTributariaCentavos, undefined, 1, competencia.retencaoTributariaCentavos));

  const descontoSlaCentavos = somar(memoria, 'DESCONTO_SLA');
  const glosaCentavos = somar(memoria, 'GLOSA');
  const penalidadeCentavos = somar(memoria, 'PENALIDADE');
  const retencoesCalculadas = somar(memoria, 'RETENCAO');
  const retencaoContratualCentavos = retencoesCalculadas - competencia.retencaoTributariaCentavos;
  const retencaoTributariaCentavos = competencia.retencaoTributariaCentavos;
  const valorCalculadoCentavos = Math.max(0, valorBrutoCentavos - descontoSlaCentavos - glosaCentavos - penalidadeCentavos - retencaoContratualCentavos - retencaoTributariaCentavos);
  const bloqueado = contrato.documentosObrigatorios
    .filter(documento => documento.ativo && documento.obrigatorioParaPagamento)
    .some(documento => !competencia.documentos.some(entregue => entregue.documentoObrigatorioId === documento.id && entregue.entregue && entregue.validado));

  return {
    competenciaId: competencia.id,
    versao: contexto.versao,
    calculadoEm: contexto.calculadoEm || new Date().toISOString(),
    calculadoPor: contexto.usuario,
    valorBrutoCentavos,
    descontoSlaCentavos,
    glosaCentavos,
    penalidadeCentavos,
    retencaoContratualCentavos,
    retencaoTributariaCentavos,
    valorCalculadoCentavos,
    valorLiberadoCentavos: bloqueado ? 0 : valorCalculadoCentavos,
    statusLiberacao: bloqueado ? 'BLOQUEADO' : 'LIBERADO',
    memoria,
  };
}

function validarCompetencia(contrato: ContratoFaturamento, competencia: CompetenciaFaturamento): void {
  if (contrato.id !== competencia.contratoId) throw new Error('A competência não pertence ao contrato informado.');
  if (competencia.mes < 1 || competencia.mes > 12) throw new Error('Mês da competência inválido.');
}

function vigente(regra: { inicioVigencia: string; fimVigencia?: string }, competencia: CompetenciaFaturamento): boolean {
  return regra.inicioVigencia <= competencia.fim && (!regra.fimVigencia || regra.fimVigencia >= competencia.inicio);
}

function possuiRegra(regras: Array<{ itemId?: number; tipo: string }>, itemId: number, tipo: string): boolean {
  return regras.some(regra => regra.itemId === itemId && regra.tipo === tipo);
}

function resolverBase(base: BaseCalculo, contrato: ContratoFaturamento, item: ItemFaturavel | undefined, valorBruto: number): number {
  if (base === 'VALOR_GLOBAL_CONTRATO') return contrato.valorGlobalCentavos;
  if (base === 'VALOR_FATURA') return valorBruto;
  if (base === 'VALOR_MENSAL_ITEM' || base === 'VALOR_UNIDADE') return item?.valorMensalCentavos || 0;
  return item?.valorUnitarioCentavos || 0;
}

function quantidadePenalidade(regra: RegraPenalidade, evento: EventoCompetencia): number {
  if (regra.tipo === 'MULTA_DIA') return evento.quantidade || Math.ceil(evento.horas || 0) / 24;
  if (regra.tipo === 'MULTA_OCORRENCIA') return evento.quantidade || 1;
  return 1;
}

function minutosNoMes(ano: number, mes: number): number {
  return new Date(ano, mes, 0).getDate() * 24 * 60;
}

function linha(
  id: number,
  natureza: LinhaMemoriaCalculo['natureza'],
  regraId: number | undefined,
  eventoId: number | undefined,
  descricao: string,
  formula: string,
  baseCentavos: number,
  aliquota: number | undefined,
  quantidade: number,
  resultadoCentavos: number
): LinhaMemoriaCalculo {
  return { id, natureza, regraId, eventoId, descricao, formula, baseCentavos, aliquota, quantidade, resultadoCentavos };
}

function somar(memoria: LinhaMemoriaCalculo[], natureza: LinhaMemoriaCalculo['natureza']): number {
  return memoria.filter(item => item.natureza === natureza).reduce((total, item) => total + item.resultadoCentavos, 0);
}