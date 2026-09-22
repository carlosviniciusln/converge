export function reaisParaCentavos(valor: number): number {
  validarNumero(valor);
  return Math.round((valor + Number.EPSILON) * 100);
}

export function centavosParaReais(centavos: number): number {
  validarCentavos(centavos);
  return centavos / 100;
}

export function calcularPercentual(baseCentavos: number, percentual: number): number {
  validarCentavos(baseCentavos);
  validarNaoNegativo(percentual, 'Percentual');
  return Math.round(baseCentavos * percentual / 100);
}

export function calcularProRata(valorCentavos: number, diasAtivos: number, diasCompetencia: number): number {
  validarCentavos(valorCentavos);
  validarNaoNegativo(diasAtivos, 'Dias ativos');
  if (!Number.isInteger(diasCompetencia) || diasCompetencia <= 0) {
    throw new Error('Dias da competência deve ser um inteiro maior que zero.');
  }
  if (diasAtivos > diasCompetencia) {
    throw new Error('Dias ativos não pode superar os dias da competência.');
  }
  return Math.round(valorCentavos * diasAtivos / diasCompetencia);
}

export function limitarPercentual(valorCentavos: number, baseCentavos: number, tetoPercentual?: number): number {
  validarCentavos(valorCentavos);
  validarCentavos(baseCentavos);
  if (tetoPercentual === undefined) return valorCentavos;
  validarNaoNegativo(tetoPercentual, 'Teto percentual');
  return Math.min(valorCentavos, calcularPercentual(baseCentavos, tetoPercentual));
}

export function arredondarDuracaoParaCima(duracao: number): number {
  validarNaoNegativo(duracao, 'Duração');
  return Math.ceil(duracao);
}

function validarCentavos(valor: number): void {
  validarNaoNegativo(valor, 'Valor em centavos');
  if (!Number.isInteger(valor)) {
    throw new Error('Valor monetário deve ser informado em centavos inteiros.');
  }
}

function validarNaoNegativo(valor: number, campo: string): void {
  validarNumero(valor);
  if (valor < 0) throw new Error(`${campo} não pode ser negativo.`);
}

function validarNumero(valor: number): void {
  if (!Number.isFinite(valor)) throw new Error('Valor numérico inválido.');
}