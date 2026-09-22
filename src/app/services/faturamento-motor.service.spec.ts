import { ResultadoCompetencia } from '../models/faturamento-motor';
import { LocalFaturamentoMotorService } from './faturamento-motor.service';

describe('LocalFaturamentoMotorService', () => {
  let service: LocalFaturamentoMotorService;

  beforeEach(async () => {
    localStorage.clear();
    service = new LocalFaturamentoMotorService();
    await service.resetarDemonstracao();
  });

  it('preserva versões anteriores do resultado e suas memórias', async () => {
    await service.salvarResultado(resultado(1, 100000));
    await service.salvarResultado(resultado(2, 120000));

    const versoes = await service.listarResultados(99);

    expect(versoes.map(item => item.versao)).toEqual([2, 1]);
    expect(versoes[1].memoria[0].resultadoCentavos).toBe(100000);
  });

  it('anexa auditoria sem permitir mutação pelos consumidores', async () => {
    await service.registrarAuditoria({ contratoId: 1, competenciaId: 99, tipo: 'CALCULO_PROCESSADO', descricao: 'Versão 1', usuario: 'Teste', versaoResultado: 1 });
    const primeiraLeitura = await service.listarAuditoria(1);
    primeiraLeitura[0].descricao = 'Alterada fora do repositório';
    await service.registrarAuditoria({ contratoId: 1, competenciaId: 99, tipo: 'RECALCULO_PROCESSADO', descricao: 'Versão 2', usuario: 'Teste', versaoResultado: 2 });

    const registros = await service.listarAuditoria(1);

    expect(registros.length).toBe(2);
    expect(registros.some(item => item.descricao === 'Versão 1')).toBeTrue();
    expect(registros.some(item => item.descricao === 'Alterada fora do repositório')).toBeFalse();
  });
});

function resultado(versao: number, valor: number): ResultadoCompetencia {
  return {
    competenciaId: 99,
    versao,
    calculadoEm: `2026-09-30T12:00:0${versao}Z`,
    calculadoPor: 'Teste',
    valorBrutoCentavos: valor,
    descontoSlaCentavos: 0,
    glosaCentavos: 0,
    penalidadeCentavos: 0,
    retencaoContratualCentavos: 0,
    retencaoTributariaCentavos: 0,
    valorCalculadoCentavos: valor,
    valorLiberadoCentavos: valor,
    statusLiberacao: 'LIBERADO',
    memoria: [{ id: 1, natureza: 'FATURAMENTO', descricao: `Versão ${versao}`, formula: 'valor fixado', baseCentavos: valor, quantidade: 1, resultadoCentavos: valor }],
  };
}