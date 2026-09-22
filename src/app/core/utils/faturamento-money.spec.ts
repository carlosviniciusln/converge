import {
  arredondarDuracaoParaCima,
  calcularPercentual,
  calcularProRata,
  centavosParaReais,
  limitarPercentual,
  reaisParaCentavos,
} from './faturamento-money';

describe('faturamento-money', () => {
  it('converte reais e centavos sem erro binário aparente', () => {
    expect(reaisParaCentavos(327.8)).toBe(32780);
    expect(centavosParaReais(32780)).toBe(327.8);
  });

  it('calcula percentual arredondando para o centavo mais próximo', () => {
    expect(calcularPercentual(1250000, 70)).toBe(875000);
    expect(calcularPercentual(101, 50)).toBe(51);
  });

  it('calcula pro rata para competências de durações diferentes', () => {
    expect(calcularProRata(4800000, 11, 31)).toBe(1703226);
    expect(calcularProRata(4800000, 14, 28)).toBe(2400000);
  });

  it('impede dias ativos acima da competência', () => {
    expect(() => calcularProRata(4800000, 32, 31)).toThrowError();
  });

  it('limita desconto ao teto percentual', () => {
    expect(limitarPercentual(150000, 1000000, 10)).toBe(100000);
    expect(limitarPercentual(50000, 1000000, 10)).toBe(50000);
  });

  it('arredonda duração contratual para cima', () => {
    expect(arredondarDuracaoParaCima(1.01)).toBe(2);
  });

  it('rejeita valores monetários negativos ou fracionários em centavos', () => {
    expect(() => calcularPercentual(-1, 10)).toThrowError();
    expect(() => centavosParaReais(10.5)).toThrowError();
  });
});