import { ApiService } from '../shared/services/api.service';
import { HttpFaturamentoMotorService } from './faturamento-motor-http.service';

describe('HttpFaturamentoMotorService', () => {
  let api: jasmine.SpyObj<ApiService>;
  let service: HttpFaturamentoMotorService;

  beforeEach(() => {
    api = jasmine.createSpyObj<ApiService>('ApiService', ['get', 'put', 'post']);
    service = new HttpFaturamentoMotorService(api);
  });

  it('consulta contratos e competências pelos endpoints versionados', async () => {
    api.get.and.resolveTo([]);

    await service.listarContratos();
    await service.listarCompetencias(42);

    expect(api.get).toHaveBeenCalledWith('v1/faturamento-motor/contratos');
    expect(api.get).toHaveBeenCalledWith('v1/faturamento-motor/competencias', { contratoId: 42 });
  });

  it('preserva competência e versão na rota imutável do resultado', async () => {
    const resultado = {
      competenciaId: 99, versao: 3, calculadoEm: '2026-09-30T12:00:00Z', calculadoPor: 'Teste',
      valorBrutoCentavos: 100, descontoSlaCentavos: 0, glosaCentavos: 0, penalidadeCentavos: 0,
      retencaoContratualCentavos: 0, retencaoTributariaCentavos: 0, valorCalculadoCentavos: 100,
      valorLiberadoCentavos: 100, statusLiberacao: 'LIBERADO' as const, memoria: [],
    };
    api.put.and.resolveTo(resultado);

    await service.salvarResultado(resultado);

    expect(api.put).toHaveBeenCalledWith('v1/faturamento-motor/competencias/99/resultados/3', resultado);
  });

  it('registra auditoria por append e envia filtros de consulta', async () => {
    const registro = { contratoId: 7, competenciaId: 99, tipo: 'CALCULO_PROCESSADO' as const, descricao: 'Cálculo', usuario: 'Teste', versaoResultado: 1 };
    api.post.and.resolveTo({ ...registro, id: 1, ocorridoEm: '2026-09-30T12:00:00Z' });
    api.get.and.resolveTo([]);

    await service.registrarAuditoria(registro);
    await service.listarAuditoria(7);

    expect(api.post).toHaveBeenCalledWith('v1/faturamento-motor/auditoria', registro);
    expect(api.get).toHaveBeenCalledWith('v1/faturamento-motor/auditoria', { contratoId: 7 });
  });

  it('aciona o reset demonstrativo sem alterar o contrato HTTP', async () => {
    api.post.and.resolveTo([]);

    await service.resetarDemonstracao();

    expect(api.post).toHaveBeenCalledWith('v1/faturamento-motor/demonstracao/reset', {});
  });
});