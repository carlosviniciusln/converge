export type TipoObjetoFaturavel =
  | 'EQUIPAMENTO'
  | 'SERVICO_MENSAL'
  | 'SERVICO_EVENTUAL'
  | 'CIRCUITO'
  | 'OS'
  | 'CELULA'
  | 'LICENCA'
  | 'TRADE_IN';

export type TipoRegraFaturamento =
  | 'MARCO_PERCENTUAL'
  | 'MENSAL_FIXO'
  | 'MENSAL_QTD_ATIVA'
  | 'DEMANDA'
  | 'PRO_RATA'
  | 'TRANSICAO'
  | 'RETENCAO_LIBERAVEL'
  | 'DESCONTO_UNITARIO';

export type EventoGatilho =
  | 'ENTREGA'
  | 'INSTALACAO'
  | 'ATIVACAO'
  | 'ACEITE'
  | 'HOMOLOGACAO'
  | 'TREINAMENTO'
  | 'COMPETENCIA';

export type BaseCalculo =
  | 'VALOR_UNITARIO_ITEM'
  | 'VALOR_MENSAL_ITEM'
  | 'VALOR_GLOBAL_CONTRATO'
  | 'VALOR_FATURA'
  | 'VALOR_UNIDADE';

export type TipoPenalidade = 'MULTA_DIA' | 'MULTA_OCORRENCIA' | 'MULTA_PERCENTUAL' | 'MULTA_GLOBAL';
export type StatusCompetencia = 'RASCUNHO' | 'EM_APURACAO' | 'CALCULADA' | 'BLOQUEADA' | 'LIBERADA' | 'FECHADA';
export type StatusLiberacao = 'PENDENTE' | 'BLOQUEADO' | 'LIBERADO';

export interface UnidadePrestacao {
  id: number;
  contratoId: number;
  codigo: string;
  descricao: string;
  tipo: TipoObjetoFaturavel;
  municipio?: string;
  uf?: string;
  ativa: boolean;
}

export interface ItemFaturavel {
  id: number;
  contratoId: number;
  codigo: string;
  descricao: string;
  tipo: TipoObjetoFaturavel;
  unidadeMedida: string;
  valorUnitarioCentavos: number;
  valorMensalCentavos: number;
  quantidadeContratada: number;
  unidadeId?: number;
  permiteProRata: boolean;
  permiteRetencao: boolean;
  inicioVigencia: string;
  fimVigencia?: string;
  ativo: boolean;
}

export interface RegraFaturamento {
  id: number;
  contratoId: number;
  nome: string;
  tipo: TipoRegraFaturamento;
  itemId?: number;
  eventoGatilho?: EventoGatilho;
  baseCalculo: BaseCalculo;
  percentual?: number;
  valorFixoCentavos?: number;
  fatorTransicao?: number;
  ordemAplicacao: number;
  inicioVigencia: string;
  fimVigencia?: string;
  ativa: boolean;
}

export interface FaixaSla {
  id: number;
  valorMinimo: number;
  valorMaximo: number;
  percentualDesconto: number;
  ordem: number;
}

export interface IndicadorSla {
  id: number;
  contratoId: number;
  codigo: string;
  nome: string;
  unidadeApuracao: 'PERCENTUAL' | 'MINUTOS' | 'HORAS' | 'QUANTIDADE';
  meta: number;
  baseCalculo: BaseCalculo;
  tipoRegra: 'POR_FAIXA' | 'POR_OCORRENCIA' | 'POR_HORA' | 'POR_MINUTO';
  percentual?: number;
  tetoPercentual?: number;
  faixas: FaixaSla[];
  inicioVigencia: string;
  fimVigencia?: string;
  ativo: boolean;
}

export interface RegraPenalidade {
  id: number;
  contratoId: number;
  codigo: string;
  descricao: string;
  tipo: TipoPenalidade;
  baseCalculo: BaseCalculo;
  percentual?: number;
  valorFixoCentavos?: number;
  tetoPercentual?: number;
  cumulativa: boolean;
  inicioVigencia: string;
  fimVigencia?: string;
  ativa: boolean;
}

export interface DocumentoObrigatorio {
  id: number;
  contratoId: number;
  codigo: string;
  descricao: string;
  obrigatorioParaPagamento: boolean;
  ativo: boolean;
}

export interface ContratoFaturamento {
  id: number;
  numero: string;
  fornecedor: string;
  objeto: string;
  inicioVigencia: string;
  fimVigencia: string;
  valorGlobalCentavos: number;
  periodicidade: 'MENSAL' | 'POR_EVENTO' | 'SOB_DEMANDA';
  diaLimiteNotaFiscal: number;
  diaPagamento: number;
  status: 'ATIVO' | 'INATIVO';
  unidades: UnidadePrestacao[];
  itens: ItemFaturavel[];
  regrasFaturamento: RegraFaturamento[];
  indicadoresSla: IndicadorSla[];
  penalidades: RegraPenalidade[];
  documentosObrigatorios: DocumentoObrigatorio[];
}

export interface MedicaoCompetencia {
  id: number;
  itemId: number;
  unidadeId?: number;
  quantidadeMedida: number;
  quantidadeAceita: number;
  fatorProRata: number;
  fatorTransicao: number;
}

export interface EventoCompetencia {
  id: number;
  tipo: EventoGatilho | 'INDISPONIBILIDADE' | 'ATRASO' | 'CHAMADO' | 'TRADE_IN';
  itemId?: number;
  unidadeId?: number;
  indicadorSlaId?: number;
  regraPenalidadeId?: number;
  quantidade: number;
  minutos?: number;
  horas?: number;
  severidade?: string;
  ocorridoEm: string;
}

export interface ApuracaoSlaCompetencia {
  id: number;
  indicadorId: number;
  itemId?: number;
  unidadeId?: number;
  valorApurado: number;
  quantidade: number;
  baseCalculoCentavos?: number;
}

export interface DocumentoCompetencia {
  documentoObrigatorioId: number;
  entregue: boolean;
  validado: boolean;
  entregueEm?: string;
}

export interface CompetenciaFaturamento {
  id: number;
  contratoId: number;
  ano: number;
  mes: number;
  inicio: string;
  fim: string;
  status: StatusCompetencia;
  statusLiberacao: StatusLiberacao;
  medicoes: MedicaoCompetencia[];
  eventos: EventoCompetencia[];
  apuracoesSla: ApuracaoSlaCompetencia[];
  documentos: DocumentoCompetencia[];
  glosaCentavos: number;
  retencaoContratualCentavos: number;
  retencaoTributariaCentavos: number;
  fechadoEm?: string;
  fechadoPor?: string;
}

export interface LinhaMemoriaCalculo {
  id: number;
  natureza: 'FATURAMENTO' | 'DESCONTO_SLA' | 'GLOSA' | 'PENALIDADE' | 'RETENCAO';
  regraId?: number;
  eventoId?: number;
  descricao: string;
  formula: string;
  baseCentavos: number;
  aliquota?: number;
  quantidade: number;
  resultadoCentavos: number;
}

export interface ResultadoCompetencia {
  competenciaId: number;
  versao: number;
  calculadoEm: string;
  calculadoPor: string;
  valorBrutoCentavos: number;
  descontoSlaCentavos: number;
  glosaCentavos: number;
  penalidadeCentavos: number;
  retencaoContratualCentavos: number;
  retencaoTributariaCentavos: number;
  valorCalculadoCentavos: number;
  valorLiberadoCentavos: number;
  statusLiberacao: StatusLiberacao;
  justificativa?: string;
  versaoAnterior?: number;
  memoria: LinhaMemoriaCalculo[];
}

export type TipoAuditoriaFaturamento =
  | 'CONFIGURACAO_ALTERADA'
  | 'COMPETENCIA_CRIADA'
  | 'COMPETENCIA_SALVA'
  | 'CALCULO_PROCESSADO'
  | 'COMPETENCIA_FECHADA'
  | 'PAGAMENTO_BLOQUEADO'
  | 'PAGAMENTO_LIBERADO'
  | 'RECALCULO_PROCESSADO'
  | 'DEMONSTRACAO_RESTAURADA';

export interface AuditoriaFaturamento {
  id: number;
  contratoId: number;
  competenciaId?: number;
  tipo: TipoAuditoriaFaturamento;
  descricao: string;
  usuario: string;
  ocorridoEm: string;
  versaoResultado?: number;
}

export interface MotorFaturamentoState {
  contratos: ContratoFaturamento[];
  competencias: CompetenciaFaturamento[];
  resultados: ResultadoCompetencia[];
  auditoria: AuditoriaFaturamento[];
}