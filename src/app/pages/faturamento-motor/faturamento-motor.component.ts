import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { reaisParaCentavos, centavosParaReais } from '../../core/utils/faturamento-money';
import { calcularCompetencia } from '../../core/utils/faturamento-engine';
import {
  AuditoriaFaturamento,
  BaseCalculo,
  CompetenciaFaturamento,
  ContratoFaturamento,
  DocumentoObrigatorio,
  EventoGatilho,
  IndicadorSla,
  ItemFaturavel,
  RegraFaturamento,
  RegraPenalidade,
  ResultadoCompetencia,
  TipoObjetoFaturavel,
  TipoPenalidade,
  TipoRegraFaturamento,
  UnidadePrestacao,
} from '../../models/faturamento-motor';
import { FaturamentoMotorRepository } from '../../services/faturamento-motor.service';

type AbaMotor = 'cockpit' | 'visao' | 'itens' | 'regras' | 'sla' | 'governanca' | 'simulacao' | 'historico';

@Component({
  selector: 'app-faturamento-motor',
  templateUrl: './faturamento-motor.component.html',
  styleUrls: ['./faturamento-motor.component.scss'],
})
export class FaturamentoMotorComponent implements OnInit {
  contratos: ContratoFaturamento[] = [];
  contratoSelecionado?: ContratoFaturamento;
  abaAtiva: AbaMotor = 'visao';
  carregando = true;

  itemForm: FormGroup;
  unidadeForm: FormGroup;
  regraForm: FormGroup;
  slaForm: FormGroup;
  penalidadeForm: FormGroup;
  documentoForm: FormGroup;

  editandoItemId?: number;
  editandoUnidadeId?: number;
  editandoRegraId?: number;
  editandoSlaId?: number;
  editandoPenalidadeId?: number;
  editandoDocumentoId?: number;
  competenciaSimulacao?: CompetenciaFaturamento;
  resultadoSimulacao?: ResultadoCompetencia;
  competencias: CompetenciaFaturamento[] = [];
  resultadosCompetencia: ResultadoCompetencia[] = [];
  todosResultados: ResultadoCompetencia[] = [];
  auditoria: AuditoriaFaturamento[] = [];
  filtroStatus = '';
  filtroAuditoriaCompetencia = '';
  filtroAuditoriaUsuario = '';
  justificativaRecalculo = '';
  erroCarregamento = '';
  glosaReais = 0;
  retencaoContratualReais = 0;
  retencaoTributariaReais = 0;

  readonly abas: Array<{ id: AbaMotor; titulo: string; icone: string }> = [
    { id: 'visao', titulo: 'Visão geral', icone: 'fa-chart-pie' },
    { id: 'cockpit', titulo: 'Competências', icone: 'fa-table-list' },
    { id: 'itens', titulo: 'Itens e unidades', icone: 'fa-cubes' },
    { id: 'regras', titulo: 'Regras de faturamento', icone: 'fa-code-branch' },
    { id: 'sla', titulo: 'SLA e faixas', icone: 'fa-gauge-high' },
    { id: 'governanca', titulo: 'Penalidades e documentos', icone: 'fa-shield-halved' },
    { id: 'simulacao', titulo: 'Simular cálculo', icone: 'fa-calculator' },
    { id: 'historico', titulo: 'Histórico', icone: 'fa-clock-rotate-left' },
  ];
  readonly tiposObjeto: TipoObjetoFaturavel[] = ['EQUIPAMENTO', 'SERVICO_MENSAL', 'SERVICO_EVENTUAL', 'CIRCUITO', 'OS', 'CELULA', 'LICENCA', 'TRADE_IN'];
  readonly tiposRegra: TipoRegraFaturamento[] = ['MARCO_PERCENTUAL', 'MENSAL_FIXO', 'MENSAL_QTD_ATIVA', 'DEMANDA', 'PRO_RATA', 'TRANSICAO', 'RETENCAO_LIBERAVEL', 'DESCONTO_UNITARIO'];
  readonly eventos: EventoGatilho[] = ['ENTREGA', 'INSTALACAO', 'ATIVACAO', 'ACEITE', 'HOMOLOGACAO', 'TREINAMENTO', 'COMPETENCIA'];
  readonly basesCalculo: BaseCalculo[] = ['VALOR_UNITARIO_ITEM', 'VALOR_MENSAL_ITEM', 'VALOR_GLOBAL_CONTRATO', 'VALOR_FATURA', 'VALOR_UNIDADE'];
  readonly tiposPenalidade: TipoPenalidade[] = ['MULTA_DIA', 'MULTA_OCORRENCIA', 'MULTA_PERCENTUAL', 'MULTA_GLOBAL'];
  readonly unidadesSla: IndicadorSla['unidadeApuracao'][] = ['PERCENTUAL', 'MINUTOS', 'HORAS', 'QUANTIDADE'];
  readonly tiposRegraSla: IndicadorSla['tipoRegra'][] = ['POR_FAIXA', 'POR_OCORRENCIA', 'POR_HORA', 'POR_MINUTO'];

  constructor(
    private fb: FormBuilder,
    private repository: FaturamentoMotorRepository,
    private toastr: ToastrService
  ) {
    this.itemForm = this.criarItemForm();
    this.unidadeForm = this.criarUnidadeForm();
    this.regraForm = this.criarRegraForm();
    this.slaForm = this.criarSlaForm();
    this.penalidadeForm = this.criarPenalidadeForm();
    this.documentoForm = this.criarDocumentoForm();
  }

  async ngOnInit(): Promise<void> {
    await this.carregarContratos();
  }

  get competenciasFiltradas(): CompetenciaFaturamento[] {
    return this.competencias.filter(item => !this.filtroStatus || item.status === this.filtroStatus);
  }

  get resultadoAnterior(): ResultadoCompetencia | undefined {
    return this.resultadosCompetencia.length > 1 ? this.resultadosCompetencia[1] : undefined;
  }

  get comparacaoMemoria(): Array<{ descricao: string; anterior: number; atual: number; diferenca: number }> {
    const atual = this.resultadosCompetencia[0];
    const anterior = this.resultadosCompetencia[1];
    if (!atual || !anterior) return [];
    const descricoes = Array.from(new Set([...anterior.memoria.map(item => item.descricao), ...atual.memoria.map(item => item.descricao)]));
    return descricoes.map(descricao => {
      const valorAnterior = anterior.memoria.filter(item => item.descricao === descricao).reduce((total, item) => total + (item.natureza === 'FATURAMENTO' ? item.resultadoCentavos : -item.resultadoCentavos), 0);
      const valorAtual = atual.memoria.filter(item => item.descricao === descricao).reduce((total, item) => total + (item.natureza === 'FATURAMENTO' ? item.resultadoCentavos : -item.resultadoCentavos), 0);
      return { descricao, anterior: valorAnterior, atual: valorAtual, diferenca: valorAtual - valorAnterior };
    });
  }

  get auditoriaFiltrada(): AuditoriaFaturamento[] {
    return this.auditoria.filter(item =>
      (!this.filtroAuditoriaCompetencia || item.competenciaId === Number(this.filtroAuditoriaCompetencia))
      && (!this.filtroAuditoriaUsuario || item.usuario.toLocaleLowerCase('pt-BR').includes(this.filtroAuditoriaUsuario.toLocaleLowerCase('pt-BR'))));
  }

  async selecionarContrato(id: string | number): Promise<void> {
    const contrato = await this.repository.obterContrato(Number(id));
    if (!contrato) return;
    this.contratoSelecionado = contrato;
    this.abaAtiva = 'visao';
    this.cancelarEdicoes();
    await this.carregarOperacao();
  }

  selecionarAba(aba: AbaMotor): void {
    this.abaAtiva = aba;
    this.cancelarEdicoes();
  }

  async resetarDemonstracao(): Promise<void> {
    this.contratos = await this.repository.resetarDemonstracao();
    this.contratoSelecionado = this.contratos[0];
    this.cancelarEdicoes();
    await this.repository.registrarAuditoria({ contratoId: this.contratoSelecionado.id, tipo: 'DEMONSTRACAO_RESTAURADA', descricao: 'Massa demonstrativa restaurada.', usuario: 'Usuário demonstrador' });
    await this.carregarOperacao();
    this.toastr.success('Dados demonstrativos restaurados.', 'Motor de faturamento');
  }

  novoItem(): void {
    this.editandoUnidadeId = undefined;
    this.editandoItemId = 0;
    this.itemForm = this.criarItemForm();
  }

  editarItem(item: ItemFaturavel): void {
    this.editandoUnidadeId = undefined;
    this.editandoItemId = item.id;
    this.itemForm = this.criarItemForm(item);
  }

  async salvarItem(): Promise<void> {
    if (!this.contratoSelecionado || !this.validar(this.itemForm)) return;
    const value = this.itemForm.getRawValue();
    const item: ItemFaturavel = {
      id: this.editandoItemId || this.proximoId(this.contratoSelecionado.itens),
      contratoId: this.contratoSelecionado.id,
      codigo: value.codigo.trim(), descricao: value.descricao.trim(), tipo: value.tipo,
      unidadeMedida: value.unidadeMedida.trim(), valorUnitarioCentavos: reaisParaCentavos(Number(value.valorUnitario || 0)),
      valorMensalCentavos: reaisParaCentavos(Number(value.valorMensal || 0)), quantidadeContratada: Number(value.quantidadeContratada),
      unidadeId: value.unidadeId ? Number(value.unidadeId) : undefined, permiteProRata: !!value.permiteProRata,
      permiteRetencao: !!value.permiteRetencao, inicioVigencia: value.inicioVigencia, fimVigencia: value.fimVigencia || undefined, ativo: true,
    };
    this.upsert(this.contratoSelecionado.itens, item);
    await this.persistir('Item faturável salvo.');
    this.editandoItemId = undefined;
  }

  async excluirItem(item: ItemFaturavel): Promise<void> {
    if (!this.contratoSelecionado || this.contratoSelecionado.regrasFaturamento.some(regra => regra.itemId === item.id)) {
      this.toastr.warning('Remova as regras vinculadas antes de excluir o item.', 'Item em uso');
      return;
    }
    this.contratoSelecionado.itens = this.contratoSelecionado.itens.filter(atual => atual.id !== item.id);
    await this.persistir('Item faturável removido.');
  }

  novaUnidade(): void {
    this.editandoItemId = undefined;
    this.editandoUnidadeId = 0;
    this.unidadeForm = this.criarUnidadeForm();
  }

  editarUnidade(unidade: UnidadePrestacao): void {
    this.editandoItemId = undefined;
    this.editandoUnidadeId = unidade.id;
    this.unidadeForm = this.criarUnidadeForm(unidade);
  }

  async salvarUnidade(): Promise<void> {
    if (!this.contratoSelecionado || !this.validar(this.unidadeForm)) return;
    const value = this.unidadeForm.getRawValue();
    const unidade: UnidadePrestacao = {
      id: this.editandoUnidadeId || this.proximoId(this.contratoSelecionado.unidades), contratoId: this.contratoSelecionado.id,
      codigo: value.codigo.trim(), descricao: value.descricao.trim(), tipo: value.tipo,
      municipio: value.municipio?.trim() || undefined, uf: value.uf?.trim().toUpperCase() || undefined, ativa: true,
    };
    this.upsert(this.contratoSelecionado.unidades, unidade);
    await this.persistir('Unidade de prestação salva.');
    this.editandoUnidadeId = undefined;
  }

  async excluirUnidade(unidade: UnidadePrestacao): Promise<void> {
    if (!this.contratoSelecionado || this.contratoSelecionado.itens.some(item => item.unidadeId === unidade.id)) {
      this.toastr.warning('Desvincule os itens antes de excluir a unidade.', 'Unidade em uso');
      return;
    }
    this.contratoSelecionado.unidades = this.contratoSelecionado.unidades.filter(atual => atual.id !== unidade.id);
    await this.persistir('Unidade removida.');
  }

  novaRegra(): void {
    this.editandoRegraId = 0;
    this.regraForm = this.criarRegraForm();
  }

  editarRegra(regra: RegraFaturamento): void {
    this.editandoRegraId = regra.id;
    this.regraForm = this.criarRegraForm(regra);
  }

  async salvarRegra(): Promise<void> {
    if (!this.contratoSelecionado || !this.validar(this.regraForm)) return;
    const value = this.regraForm.getRawValue();
    if (value.tipo === 'MARCO_PERCENTUAL' && (value.percentual === null || value.percentual > 100)) {
      this.toastr.warning('A regra percentual exige percentual entre 0 e 100.', 'Revise a regra');
      return;
    }
    const regra: RegraFaturamento = {
      id: this.editandoRegraId || this.proximoId(this.contratoSelecionado.regrasFaturamento), contratoId: this.contratoSelecionado.id,
      nome: value.nome.trim(), tipo: value.tipo, itemId: Number(value.itemId), eventoGatilho: value.eventoGatilho || undefined,
      baseCalculo: value.baseCalculo, percentual: value.percentual === null || value.percentual === '' ? undefined : Number(value.percentual),
      valorFixoCentavos: value.valorFixo ? reaisParaCentavos(Number(value.valorFixo)) : undefined,
      fatorTransicao: value.fatorTransicao === null || value.fatorTransicao === '' ? undefined : Number(value.fatorTransicao),
      ordemAplicacao: Number(value.ordemAplicacao), inicioVigencia: value.inicioVigencia,
      fimVigencia: value.fimVigencia || undefined, ativa: !!value.ativa,
    };
    this.upsert(this.contratoSelecionado.regrasFaturamento, regra);
    this.contratoSelecionado.regrasFaturamento.sort((a, b) => a.ordemAplicacao - b.ordemAplicacao);
    await this.persistir('Regra de faturamento salva.');
    this.editandoRegraId = undefined;
  }

  async excluirRegra(regra: RegraFaturamento): Promise<void> {
    if (!this.contratoSelecionado) return;
    this.contratoSelecionado.regrasFaturamento = this.contratoSelecionado.regrasFaturamento.filter(atual => atual.id !== regra.id);
    await this.persistir('Regra removida.');
  }

  get faixasSla(): FormArray {
    return this.slaForm.get('faixas') as FormArray;
  }

  novoIndicadorSla(): void {
    this.editandoSlaId = 0;
    this.slaForm = this.criarSlaForm();
  }

  editarIndicadorSla(indicador: IndicadorSla): void {
    this.editandoSlaId = indicador.id;
    this.slaForm = this.criarSlaForm(indicador);
  }

  adicionarFaixa(): void {
    this.faixasSla.push(this.criarFaixaForm(undefined, this.faixasSla.length + 1));
  }

  removerFaixa(index: number): void {
    this.faixasSla.removeAt(index);
  }

  async salvarIndicadorSla(): Promise<void> {
    if (!this.contratoSelecionado || !this.validar(this.slaForm)) return;
    const value = this.slaForm.getRawValue();
    const faixas = value.faixas
      .map((faixa: any, index: number) => ({ id: faixa.id || Date.now() + index, valorMinimo: Number(faixa.valorMinimo), valorMaximo: Number(faixa.valorMaximo), percentualDesconto: Number(faixa.percentualDesconto), ordem: index + 1 }))
      .sort((a: any, b: any) => a.valorMinimo - b.valorMinimo);
    if (value.tipoRegra === 'POR_FAIXA' && !faixas.length) {
      this.toastr.warning('Inclua ao menos uma faixa para este tipo de indicador.', 'Revise o SLA');
      return;
    }
    if (faixas.some((faixa: any, index: number) => faixa.valorMinimo > faixa.valorMaximo || (index > 0 && faixa.valorMinimo <= faixas[index - 1].valorMaximo))) {
      this.toastr.warning('As faixas não podem se sobrepor e o mínimo deve ser menor ou igual ao máximo.', 'Revise o SLA');
      return;
    }
    const indicador: IndicadorSla = {
      id: this.editandoSlaId || this.proximoId(this.contratoSelecionado.indicadoresSla), contratoId: this.contratoSelecionado.id,
      codigo: value.codigo.trim(), nome: value.nome.trim(), unidadeApuracao: value.unidadeApuracao, meta: Number(value.meta),
      baseCalculo: value.baseCalculo, tipoRegra: value.tipoRegra,
      percentual: value.percentual === null || value.percentual === '' ? undefined : Number(value.percentual),
      tetoPercentual: value.tetoPercentual === null || value.tetoPercentual === '' ? undefined : Number(value.tetoPercentual),
      faixas, inicioVigencia: value.inicioVigencia, fimVigencia: value.fimVigencia || undefined, ativo: !!value.ativo,
    };
    this.upsert(this.contratoSelecionado.indicadoresSla, indicador);
    await this.persistir('Indicador de SLA salvo.');
    this.editandoSlaId = undefined;
    this.prepararSimulacao();
  }

  async excluirIndicadorSla(indicador: IndicadorSla): Promise<void> {
    if (!this.contratoSelecionado) return;
    this.contratoSelecionado.indicadoresSla = this.contratoSelecionado.indicadoresSla.filter(atual => atual.id !== indicador.id);
    await this.persistir('Indicador de SLA removido.');
    this.prepararSimulacao();
  }

  prepararSimulacao(): void {
    const contrato = this.contratoSelecionado;
    if (!contrato) return;
    const ano = 2026;
    const mes = 9;
    this.competenciaSimulacao = {
      id: contrato.id * 1000 + ano * 10 + mes, contratoId: contrato.id, ano, mes, inicio: '2026-09-01', fim: '2026-09-30',
      status: 'EM_APURACAO', statusLiberacao: 'PENDENTE',
      medicoes: contrato.itens.filter(item => item.tipo !== 'TRADE_IN').map((item, index) => ({ id: index + 1, itemId: item.id, unidadeId: item.unidadeId, quantidadeMedida: item.tipo === 'CIRCUITO' ? 2 : 1, quantidadeAceita: item.tipo === 'CIRCUITO' ? 2 : (item.tipo === 'SERVICO_EVENTUAL' ? 12 : 1), fatorProRata: contrato.numero === '01412/2025' ? 11 / 30 : 1, fatorTransicao: 1 })),
      eventos: [], apuracoesSla: [],
      documentos: contrato.documentosObrigatorios.map((documento, index) => ({ documentoObrigatorioId: documento.id, entregue: contrato.numero !== '01412/2025' || index > 0, validado: contrato.numero !== '01412/2025' || index > 0 })),
      glosaCentavos: 0, retencaoContratualCentavos: 0, retencaoTributariaCentavos: 0,
    };
    let eventoId = 1;
    contrato.regrasFaturamento.forEach(regra => {
      if (regra.tipo === 'MARCO_PERCENTUAL' && regra.eventoGatilho) this.competenciaSimulacao!.eventos.push({ id: eventoId++, tipo: regra.eventoGatilho, itemId: regra.itemId, quantidade: regra.eventoGatilho === 'ENTREGA' ? 10 : 8, ocorridoEm: '2026-09-15' });
      if (regra.tipo === 'DESCONTO_UNITARIO') this.competenciaSimulacao!.eventos.push({ id: eventoId++, tipo: 'TRADE_IN', itemId: regra.itemId, quantidade: 6, ocorridoEm: '2026-09-15' });
    });
    contrato.indicadoresSla.forEach((indicador, index) => {
      const item = contrato.itens[0];
      if (indicador.tipoRegra === 'POR_MINUTO') this.competenciaSimulacao!.eventos.push({ id: eventoId++, tipo: 'INDISPONIBILIDADE', indicadorSlaId: indicador.id, itemId: item?.id, quantidade: 1, minutos: 120, ocorridoEm: '2026-09-12' });
      else this.competenciaSimulacao!.apuracoesSla.push({ id: index + 1, indicadorId: indicador.id, itemId: item?.id, valorApurado: indicador.unidadeApuracao === 'PERCENTUAL' ? indicador.meta - 0.2 : 1, quantidade: 1, baseCalculoCentavos: item ? item.valorMensalCentavos * (item.tipo === 'CIRCUITO' ? 2 : 1) : undefined });
    });
    contrato.penalidades.forEach(regra => this.competenciaSimulacao!.eventos.push({ id: eventoId++, tipo: 'ATRASO', regraPenalidadeId: regra.id, itemId: contrato.itens[0]?.id, quantidade: 2, ocorridoEm: '2026-09-18' }));
    this.resultadoSimulacao = undefined;
    this.glosaReais = this.retencaoContratualReais = this.retencaoTributariaReais = 0;
    this.justificativaRecalculo = '';
  }

  async salvarRascunho(): Promise<void> {
    if (!this.competenciaSimulacao || !this.contratoSelecionado) return;
    this.competenciaSimulacao.status = 'RASCUNHO';
    this.competenciaSimulacao = await this.repository.salvarCompetencia(this.competenciaSimulacao);
    await this.auditar('COMPETENCIA_SALVA', 'Medições, eventos e documentos salvos como rascunho.');
    await this.carregarListasOperacionais();
    this.toastr.success('Rascunho da competência salvo.', 'Operação mensal');
  }

  async simularCalculo(): Promise<void> {
    if (!this.contratoSelecionado || !this.competenciaSimulacao) return;
    const resultadosExistentes = await this.repository.listarResultados(this.competenciaSimulacao.id);
    if (resultadosExistentes.length && !this.justificativaRecalculo.trim()) {
      this.toastr.warning('Informe a justificativa para gerar uma nova versão.', 'Recálculo controlado');
      return;
    }
    this.competenciaSimulacao.glosaCentavos = reaisParaCentavos(Number(this.glosaReais || 0));
    this.competenciaSimulacao.retencaoContratualCentavos = reaisParaCentavos(Number(this.retencaoContratualReais || 0));
    this.competenciaSimulacao.retencaoTributariaCentavos = reaisParaCentavos(Number(this.retencaoTributariaReais || 0));
    const versao = (resultadosExistentes[0]?.versao || 0) + 1;
    this.resultadoSimulacao = calcularCompetencia(this.contratoSelecionado, this.competenciaSimulacao, { usuario: 'Usuário demonstrador', versao });
    this.resultadoSimulacao.justificativa = this.justificativaRecalculo.trim() || undefined;
    this.resultadoSimulacao.versaoAnterior = resultadosExistentes[0]?.versao;
    this.competenciaSimulacao.statusLiberacao = this.resultadoSimulacao.statusLiberacao;
    this.competenciaSimulacao.status = this.resultadoSimulacao.statusLiberacao === 'BLOQUEADO' ? 'BLOQUEADA' : 'CALCULADA';
    this.competenciaSimulacao = await this.repository.salvarCompetencia(this.competenciaSimulacao);
    this.resultadoSimulacao = await this.repository.salvarResultado(this.resultadoSimulacao);
    await this.auditar(resultadosExistentes.length ? 'RECALCULO_PROCESSADO' : 'CALCULO_PROCESSADO', resultadosExistentes.length ? `Recálculo v${versao}: ${this.justificativaRecalculo.trim()}` : `Cálculo v${versao} processado.`, versao);
    if (this.resultadoSimulacao.statusLiberacao === 'BLOQUEADO') await this.auditar('PAGAMENTO_BLOQUEADO', 'Pagamento bloqueado por pendência documental.', versao);
    await this.carregarListasOperacionais();
    this.justificativaRecalculo = '';
    this.toastr.success('Cálculo processado com memória auditável.', 'Simulação concluída');
  }

  async fecharCompetencia(): Promise<void> {
    if (!this.competenciaSimulacao || !this.resultadoSimulacao) {
      this.toastr.warning('Processe o cálculo antes do fechamento.', 'Fechamento');
      return;
    }
    if (!this.competenciaSimulacao.medicoes.length || this.competenciaSimulacao.medicoes.some(item => item.quantidadeAceita < 0)) {
      this.toastr.warning('A medição da competência está inválida.', 'Fechamento');
      return;
    }
    this.competenciaSimulacao.status = 'FECHADA';
    this.competenciaSimulacao.fechadoEm = new Date().toISOString();
    this.competenciaSimulacao.fechadoPor = 'Usuário demonstrador';
    await this.repository.salvarCompetencia(this.competenciaSimulacao);
    await this.auditar('COMPETENCIA_FECHADA', `Competência fechada com o cálculo v${this.resultadoSimulacao.versao}.`, this.resultadoSimulacao.versao);
    await this.carregarListasOperacionais();
    this.toastr.success('Competência fechada e preservada.', 'Fechamento');
  }

  async atualizarLiberacaoDocumental(): Promise<void> {
    if (!this.competenciaSimulacao || !this.contratoSelecionado || !this.resultadoSimulacao) return;
    const bloqueado = this.contratoSelecionado.documentosObrigatorios.filter(item => item.ativo && item.obrigatorioParaPagamento)
      .some(item => !this.competenciaSimulacao!.documentos.some(documento => documento.documentoObrigatorioId === item.id && documento.entregue && documento.validado));
    this.resultadoSimulacao.statusLiberacao = bloqueado ? 'BLOQUEADO' : 'LIBERADO';
    this.resultadoSimulacao.valorLiberadoCentavos = bloqueado ? 0 : this.resultadoSimulacao.valorCalculadoCentavos;
    this.competenciaSimulacao.statusLiberacao = this.resultadoSimulacao.statusLiberacao;
    if (this.competenciaSimulacao.status !== 'FECHADA') this.competenciaSimulacao.status = bloqueado ? 'BLOQUEADA' : 'LIBERADA';
    await this.repository.salvarCompetencia(this.competenciaSimulacao);
    await this.repository.salvarResultado(this.resultadoSimulacao);
    await this.auditar(bloqueado ? 'PAGAMENTO_BLOQUEADO' : 'PAGAMENTO_LIBERADO', bloqueado ? 'Pagamento mantido bloqueado após checklist documental.' : 'Pagamento liberado após validação documental.', this.resultadoSimulacao.versao);
    await this.carregarListasOperacionais();
  }

  async abrirCompetencia(competencia: CompetenciaFaturamento): Promise<void> {
    this.competenciaSimulacao = JSON.parse(JSON.stringify(competencia));
    this.resultadosCompetencia = await this.repository.listarResultados(competencia.id);
    this.resultadoSimulacao = this.resultadosCompetencia[0];
    this.glosaReais = centavosParaReais(competencia.glosaCentavos);
    this.retencaoContratualReais = centavosParaReais(competencia.retencaoContratualCentavos);
    this.retencaoTributariaReais = centavosParaReais(competencia.retencaoTributariaCentavos);
    this.abaAtiva = 'simulacao';
  }

  async novaCompetencia(): Promise<void> {
    this.prepararSimulacao();
    if (!this.competenciaSimulacao || !this.contratoSelecionado) return;
    this.competenciaSimulacao.id = Date.now();
    this.competenciaSimulacao.status = 'RASCUNHO';
    this.competenciaSimulacao = await this.repository.salvarCompetencia(this.competenciaSimulacao);
    await this.auditar('COMPETENCIA_CRIADA', 'Nova competência de demonstração criada.');
    await this.carregarListasOperacionais();
    this.abaAtiva = 'simulacao';
  }

  exportarPlanilha(): void {
    if (!this.resultadoSimulacao || !this.contratoSelecionado || !this.competenciaSimulacao) return;
    const pendencias = this.contratoSelecionado.documentosObrigatorios.filter(item => item.ativo && item.obrigatorioParaPagamento)
      .filter(item => !this.competenciaSimulacao!.documentos.some(documento => documento.documentoObrigatorioId === item.id && documento.entregue && documento.validado));
    const metadados = [
      ['Contrato', this.contratoSelecionado.numero], ['Fornecedor', this.contratoSelecionado.fornecedor],
      ['Competência', `${String(this.competenciaSimulacao.mes).padStart(2, '0')}/${this.competenciaSimulacao.ano}`], ['Versão', this.resultadoSimulacao.versao],
      ['Data do cálculo', this.resultadoSimulacao.calculadoEm], ['Usuário', this.resultadoSimulacao.calculadoPor], ['Status', this.resultadoSimulacao.statusLiberacao],
      ['Valor bruto', (this.resultadoSimulacao.valorBrutoCentavos / 100).toFixed(2)], ['Valor líquido', (this.resultadoSimulacao.valorCalculadoCentavos / 100).toFixed(2)],
      ['Valor liberado', (this.resultadoSimulacao.valorLiberadoCentavos / 100).toFixed(2)], ['Bloqueios', pendencias.map(item => item.descricao).join(' | ') || 'Nenhum'], [],
      ['Natureza', 'Descrição', 'Fórmula', 'Base', 'Alíquota', 'Quantidade', 'Resultado'],
    ];
    const linhas = this.resultadoSimulacao.memoria.map(item => [item.natureza, item.descricao, item.formula, (item.baseCentavos / 100).toFixed(2), item.aliquota ?? '', item.quantidade, (item.resultadoCentavos / 100).toFixed(2)]);
    const csv = [...metadados, ...linhas].map(linha => linha.map(valor => `"${String(valor).replace(/"/g, '""')}"`).join(';')).join('\r\n');
    this.baixarArquivo(`espelho-${this.contratoSelecionado.numero.replace(/\W/g, '-')}-${this.competenciaSimulacao.ano}-${this.competenciaSimulacao.mes}.csv`, `\uFEFF${csv}`, 'text/csv;charset=utf-8');
  }

  exportarPdf(): void {
    if (!this.resultadoSimulacao || !this.contratoSelecionado || !this.competenciaSimulacao) return;
    const popup = window.open('', '_blank', 'width=1000,height=800');
    if (!popup) {
      this.toastr.warning('Permita pop-ups para gerar o PDF pelo diálogo de impressão.', 'Exportação');
      return;
    }
    const moeda = (valor: number) => (valor / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const pendencias = this.contratoSelecionado.documentosObrigatorios.filter(item => item.ativo && item.obrigatorioParaPagamento).filter(item => !this.competenciaSimulacao!.documentos.some(documento => documento.documentoObrigatorioId === item.id && documento.entregue && documento.validado));
    popup.document.write(`<html><head><title>Espelho de faturamento</title><style>body{font-family:Arial;padding:28px;color:#24343b}h1{color:#00385d}table{width:100%;border-collapse:collapse;font-size:12px}th,td{padding:8px;border:1px solid #ccd9dc;text-align:left}.num{text-align:right}.summary{display:flex;gap:24px;margin:18px 0}.summary div{padding:12px;background:#f2f7f7}</style></head><body><h1>Espelho de faturamento</h1><p><b>${this.contratoSelecionado.numero}</b> · ${this.contratoSelecionado.fornecedor}<br>Competência ${String(this.competenciaSimulacao.mes).padStart(2, '0')}/${this.competenciaSimulacao.ano} · Versão ${this.resultadoSimulacao.versao} · ${this.resultadoSimulacao.calculadoEm}</p><div class="summary"><div>Bruto<br><b>${moeda(this.resultadoSimulacao.valorBrutoCentavos)}</b></div><div>Líquido<br><b>${moeda(this.resultadoSimulacao.valorCalculadoCentavos)}</b></div><div>Liberado<br><b>${moeda(this.resultadoSimulacao.valorLiberadoCentavos)}</b></div></div><p><b>Status:</b> ${this.resultadoSimulacao.statusLiberacao}<br><b>Bloqueios:</b> ${pendencias.map(item => item.descricao).join(' | ') || 'Nenhum'}</p><table><thead><tr><th>Natureza</th><th>Descrição</th><th>Fórmula</th><th>Base</th><th>Resultado</th></tr></thead><tbody>${this.resultadoSimulacao.memoria.map(item => `<tr><td>${item.natureza}</td><td>${item.descricao}</td><td>${item.formula}</td><td class="num">${moeda(item.baseCentavos)}</td><td class="num">${moeda(item.resultadoCentavos)}</td></tr>`).join('')}</tbody></table><p>Gerado por ${this.resultadoSimulacao.calculadoPor} em ${new Date().toLocaleString('pt-BR')}.</p><script>window.onload=()=>window.print()</script></body></html>`);
    popup.document.close();
  }

  nomeIndicador(indicadorId?: number): string {
    return this.contratoSelecionado?.indicadoresSla.find(item => item.id === indicadorId)?.codigo || 'Indicador';
  }

  nomeDocumento(documentoId: number): string {
    return this.contratoSelecionado?.documentosObrigatorios.find(item => item.id === documentoId)?.descricao || 'Documento';
  }

  resultadoDaCompetencia(competenciaId: number): ResultadoCompetencia | undefined {
    return this.todosResultados.filter(item => item.competenciaId === competenciaId).sort((a, b) => b.versao - a.versao)[0];
  }

  novaPenalidade(): void {
    this.editandoPenalidadeId = 0;
    this.penalidadeForm = this.criarPenalidadeForm();
  }

  editarPenalidade(regra: RegraPenalidade): void {
    this.editandoPenalidadeId = regra.id;
    this.penalidadeForm = this.criarPenalidadeForm(regra);
  }

  async salvarPenalidade(): Promise<void> {
    if (!this.contratoSelecionado || !this.validar(this.penalidadeForm)) return;
    const value = this.penalidadeForm.getRawValue();
    const regra: RegraPenalidade = {
      id: this.editandoPenalidadeId || this.proximoId(this.contratoSelecionado.penalidades), contratoId: this.contratoSelecionado.id,
      codigo: value.codigo.trim(), descricao: value.descricao.trim(), tipo: value.tipo, baseCalculo: value.baseCalculo,
      percentual: value.percentual === null || value.percentual === '' ? undefined : Number(value.percentual),
      valorFixoCentavos: value.valorFixo ? reaisParaCentavos(Number(value.valorFixo)) : undefined,
      tetoPercentual: value.tetoPercentual === null || value.tetoPercentual === '' ? undefined : Number(value.tetoPercentual),
      cumulativa: !!value.cumulativa, inicioVigencia: value.inicioVigencia, fimVigencia: value.fimVigencia || undefined, ativa: true,
    };
    this.upsert(this.contratoSelecionado.penalidades, regra);
    await this.persistir('Penalidade salva separadamente dos descontos de SLA.');
    this.editandoPenalidadeId = undefined;
  }

  async excluirPenalidade(regra: RegraPenalidade): Promise<void> {
    if (!this.contratoSelecionado) return;
    this.contratoSelecionado.penalidades = this.contratoSelecionado.penalidades.filter(atual => atual.id !== regra.id);
    await this.persistir('Penalidade removida.');
  }

  novoDocumento(): void {
    this.editandoDocumentoId = 0;
    this.documentoForm = this.criarDocumentoForm();
  }

  editarDocumento(documento: DocumentoObrigatorio): void {
    this.editandoDocumentoId = documento.id;
    this.documentoForm = this.criarDocumentoForm(documento);
  }

  async salvarDocumento(): Promise<void> {
    if (!this.contratoSelecionado || !this.validar(this.documentoForm)) return;
    const value = this.documentoForm.getRawValue();
    const documento: DocumentoObrigatorio = {
      id: this.editandoDocumentoId || this.proximoId(this.contratoSelecionado.documentosObrigatorios), contratoId: this.contratoSelecionado.id,
      codigo: value.codigo.trim(), descricao: value.descricao.trim(), obrigatorioParaPagamento: !!value.obrigatorioParaPagamento, ativo: true,
    };
    this.upsert(this.contratoSelecionado.documentosObrigatorios, documento);
    await this.persistir('Documento obrigatório salvo.');
    this.editandoDocumentoId = undefined;
  }

  async excluirDocumento(documento: DocumentoObrigatorio): Promise<void> {
    if (!this.contratoSelecionado) return;
    this.contratoSelecionado.documentosObrigatorios = this.contratoSelecionado.documentosObrigatorios.filter(atual => atual.id !== documento.id);
    await this.persistir('Documento removido.');
  }

  cancelarEdicoes(): void {
    this.editandoItemId = this.editandoUnidadeId = this.editandoRegraId = this.editandoSlaId = this.editandoPenalidadeId = this.editandoDocumentoId = undefined;
  }

  nomeItem(itemId?: number): string {
    return this.contratoSelecionado?.itens.find(item => item.id === itemId)?.codigo || 'Todos';
  }

  formatarEnum(value: string): string {
    return value.replace(/_/g, ' ').toLocaleLowerCase('pt-BR').replace(/^./, char => char.toUpperCase());
  }

  private async carregarContratos(): Promise<void> {
    this.carregando = true;
    try {
      this.contratos = await this.repository.listarContratos();
      if (this.contratos.length) await this.selecionarContrato(this.contratos[0].id);
    } catch {
      this.erroCarregamento = 'Não foi possível carregar o motor de faturamento.';
    } finally {
      this.carregando = false;
    }
  }

  private async persistir(mensagem: string): Promise<void> {
    if (!this.contratoSelecionado) return;
    this.contratoSelecionado = await this.repository.salvarContrato(this.contratoSelecionado);
    const index = this.contratos.findIndex(item => item.id === this.contratoSelecionado!.id);
    if (index >= 0) this.contratos.splice(index, 1, this.contratoSelecionado);
    await this.repository.registrarAuditoria({ contratoId: this.contratoSelecionado.id, tipo: 'CONFIGURACAO_ALTERADA', descricao: mensagem, usuario: 'Usuário demonstrador' });
    this.auditoria = await this.repository.listarAuditoria(this.contratoSelecionado.id);
    this.toastr.success(mensagem, 'Motor de faturamento');
  }

  private validar(form: FormGroup): boolean {
    form.markAllAsTouched();
    return form.valid;
  }

  private upsert<T extends { id: number }>(items: T[], value: T): void {
    const index = items.findIndex(item => item.id === value.id);
    index >= 0 ? items.splice(index, 1, value) : items.push(value);
  }

  private proximoId(items: Array<{ id: number }>): number {
    return Math.max(0, ...items.map(item => item.id)) + 1;
  }

  private criarItemForm(item?: ItemFaturavel): FormGroup {
    return this.fb.group({
      codigo: [item?.codigo || '', Validators.required], descricao: [item?.descricao || '', Validators.required],
      tipo: [item?.tipo || 'SERVICO_MENSAL', Validators.required], unidadeMedida: [item?.unidadeMedida || '', Validators.required],
      valorUnitario: [item ? centavosParaReais(item.valorUnitarioCentavos) : 0, [Validators.required, Validators.min(0)]],
      valorMensal: [item ? centavosParaReais(item.valorMensalCentavos) : 0, [Validators.required, Validators.min(0)]],
      quantidadeContratada: [item?.quantidadeContratada ?? 1, [Validators.required, Validators.min(0)]], unidadeId: [item?.unidadeId || ''],
      permiteProRata: [item?.permiteProRata || false], permiteRetencao: [item?.permiteRetencao || false],
      inicioVigencia: [item?.inicioVigencia || this.contratoSelecionado?.inicioVigencia || '', Validators.required], fimVigencia: [item?.fimVigencia || ''],
    });
  }

  private criarUnidadeForm(unidade?: UnidadePrestacao): FormGroup {
    return this.fb.group({
      codigo: [unidade?.codigo || '', Validators.required], descricao: [unidade?.descricao || '', Validators.required],
      tipo: [unidade?.tipo || 'OS', Validators.required], municipio: [unidade?.municipio || ''], uf: [unidade?.uf || '', Validators.maxLength(2)],
    });
  }

  private criarRegraForm(regra?: RegraFaturamento): FormGroup {
    return this.fb.group({
      nome: [regra?.nome || '', Validators.required], tipo: [regra?.tipo || 'MARCO_PERCENTUAL', Validators.required],
      itemId: [regra?.itemId || '', Validators.required], eventoGatilho: [regra?.eventoGatilho || 'COMPETENCIA'],
      baseCalculo: [regra?.baseCalculo || 'VALOR_UNITARIO_ITEM', Validators.required], percentual: [regra?.percentual ?? null, Validators.min(0)],
      valorFixo: [regra?.valorFixoCentavos ? centavosParaReais(regra.valorFixoCentavos) : 0, Validators.min(0)],
      fatorTransicao: [regra?.fatorTransicao ?? null, Validators.min(0)], ordemAplicacao: [regra?.ordemAplicacao || 1, [Validators.required, Validators.min(1)]],
      inicioVigencia: [regra?.inicioVigencia || this.contratoSelecionado?.inicioVigencia || '', Validators.required],
      fimVigencia: [regra?.fimVigencia || ''], ativa: [regra?.ativa ?? true],
    });
  }

  private criarPenalidadeForm(regra?: RegraPenalidade): FormGroup {
    return this.fb.group({
      codigo: [regra?.codigo || '', Validators.required], descricao: [regra?.descricao || '', Validators.required],
      tipo: [regra?.tipo || 'MULTA_DIA', Validators.required], baseCalculo: [regra?.baseCalculo || 'VALOR_FATURA', Validators.required],
      percentual: [regra?.percentual ?? null, Validators.min(0)],
      valorFixo: [regra?.valorFixoCentavos ? centavosParaReais(regra.valorFixoCentavos) : 0, Validators.min(0)],
      tetoPercentual: [regra?.tetoPercentual ?? null, [Validators.min(0), Validators.max(100)]], cumulativa: [regra?.cumulativa || false],
      inicioVigencia: [regra?.inicioVigencia || this.contratoSelecionado?.inicioVigencia || '', Validators.required], fimVigencia: [regra?.fimVigencia || ''],
    });
  }

  private criarSlaForm(indicador?: IndicadorSla): FormGroup {
    return this.fb.group({
      codigo: [indicador?.codigo || '', Validators.required], nome: [indicador?.nome || '', Validators.required],
      unidadeApuracao: [indicador?.unidadeApuracao || 'PERCENTUAL', Validators.required], meta: [indicador?.meta ?? 0, Validators.required],
      baseCalculo: [indicador?.baseCalculo || 'VALOR_MENSAL_ITEM', Validators.required], tipoRegra: [indicador?.tipoRegra || 'POR_FAIXA', Validators.required],
      percentual: [indicador?.percentual ?? null, Validators.min(0)], tetoPercentual: [indicador?.tetoPercentual ?? null, [Validators.min(0), Validators.max(100)]],
      inicioVigencia: [indicador?.inicioVigencia || this.contratoSelecionado?.inicioVigencia || '', Validators.required], fimVigencia: [indicador?.fimVigencia || ''],
      ativo: [indicador?.ativo ?? true], faixas: this.fb.array((indicador?.faixas || []).map(faixa => this.criarFaixaForm(faixa))),
    });
  }

  private criarFaixaForm(faixa?: IndicadorSla['faixas'][number], ordem = 1): FormGroup {
    return this.fb.group({
      id: [faixa?.id || 0], valorMinimo: [faixa?.valorMinimo ?? 0, Validators.required], valorMaximo: [faixa?.valorMaximo ?? 0, Validators.required],
      percentualDesconto: [faixa?.percentualDesconto ?? 0, [Validators.required, Validators.min(0), Validators.max(100)]], ordem: [faixa?.ordem || ordem],
    });
  }

  private criarDocumentoForm(documento?: DocumentoObrigatorio): FormGroup {
    return this.fb.group({
      codigo: [documento?.codigo || '', Validators.required], descricao: [documento?.descricao || '', Validators.required],
      obrigatorioParaPagamento: [documento?.obrigatorioParaPagamento ?? true],
    });
  }

  private async carregarOperacao(): Promise<void> {
    this.prepararSimulacao();
    await this.carregarListasOperacionais();
    const ultima = this.competencias[0];
    if (ultima) {
      this.competenciaSimulacao = JSON.parse(JSON.stringify(ultima));
      this.resultadosCompetencia = await this.repository.listarResultados(ultima.id);
      this.resultadoSimulacao = this.resultadosCompetencia[0];
      this.glosaReais = centavosParaReais(ultima.glosaCentavos);
      this.retencaoContratualReais = centavosParaReais(ultima.retencaoContratualCentavos);
      this.retencaoTributariaReais = centavosParaReais(ultima.retencaoTributariaCentavos);
    }
  }

  private async carregarListasOperacionais(): Promise<void> {
    if (!this.contratoSelecionado) return;
    this.competencias = (await this.repository.listarCompetencias(this.contratoSelecionado.id)).sort((a, b) => b.id - a.id);
    const idsCompetencias = new Set(this.competencias.map(item => item.id));
    this.todosResultados = (await this.repository.listarResultados()).filter(item => idsCompetencias.has(item.competenciaId));
    this.auditoria = await this.repository.listarAuditoria(this.contratoSelecionado.id);
    if (this.competenciaSimulacao) this.resultadosCompetencia = await this.repository.listarResultados(this.competenciaSimulacao.id);
  }

  private async auditar(tipo: AuditoriaFaturamento['tipo'], descricao: string, versaoResultado?: number): Promise<void> {
    if (!this.contratoSelecionado) return;
    await this.repository.registrarAuditoria({ contratoId: this.contratoSelecionado.id, competenciaId: this.competenciaSimulacao?.id, tipo, descricao, usuario: 'Usuário demonstrador', versaoResultado });
    this.auditoria = await this.repository.listarAuditoria(this.contratoSelecionado.id);
  }

  private baixarArquivo(nome: string, conteudo: string, tipo: string): void {
    const url = URL.createObjectURL(new Blob([conteudo], { type: tipo }));
    const link = document.createElement('a');
    link.href = url;
    link.download = nome;
    link.click();
    URL.revokeObjectURL(url);
  }
}