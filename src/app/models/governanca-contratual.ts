export type StatusContratoGovernanca = 'Vigente' | 'Em renovação' | 'Suspenso' | 'Encerrado';
export type CategoriaDocumento = 'Contrato' | 'Termo aditivo' | 'Proposta' | 'Nota fiscal' | 'Parecer' | 'Relatório' | 'Documento SEI' | 'Outros';
export type StatusPendencia = 'Pendente' | 'Em análise' | 'Concluída';
export type Criticidade = 'Alta' | 'Média' | 'Baixa';

export interface DocumentoGovernanca {
  id: number;
  contratoId: number;
  nome: string;
  categoria: CategoriaDocumento;
  versao: number;
  tamanho: string;
  responsavel: string;
  enviadoEm: string;
  confidencial: boolean;
  storageReference?: string;
}

export interface AditivoGovernanca {
  numero: string;
  tipo: 'Prazo' | 'Valor' | 'Escopo';
  descricao: string;
  valor: number;
  assinadoEm: string;
}

export interface MovimentoFinanceiroGovernanca {
  id: number;
  tipo: 'Empenho' | 'Pagamento';
  documento: string;
  descricao: string;
  valor: number;
  data: string;
  status: 'Pago' | 'Liquidado' | 'Empenhado' | 'Pendente';
}

export interface EventoContratoGovernanca {
  id: number;
  tipo: string;
  titulo: string;
  descricao: string;
  data: string;
  responsavel: string;
}

export interface PendenciaGovernanca {
  id: number;
  titulo: string;
  prazo: string;
  responsavel: string;
  status: StatusPendencia;
  criticidade: Criticidade;
}

export interface ContratoGovernanca {
  id: number;
  numero: string;
  processoSei: string;
  orgao: string;
  unidade: string;
  contratada: string;
  cnpj: string;
  objeto: string;
  valorContratado: number;
  valorExecutado: number;
  valorPago: number;
  inicio: string;
  termino: string;
  status: StatusContratoGovernanca;
  responsavel: string;
  fiscal: string;
  gestor: string;
  documentos: DocumentoGovernanca[];
  aditivos: AditivoGovernanca[];
  movimentosFinanceiros: MovimentoFinanceiroGovernanca[];
  eventos: EventoContratoGovernanca[];
  pendencias: PendenciaGovernanca[];
}

export interface RegistroAuditoria {
  id: number;
  dataHora: string;
  usuario: string;
  acao: 'Criação' | 'Alteração' | 'Upload' | 'Aprovação' | 'Vinculação';
  modulo: 'Contratos' | 'Documentos' | 'Financeiro' | 'SEI';
  contratoId?: number;
  contratoNumero?: string;
  documentoId?: number;
  campo?: string;
  valorAnterior?: string;
  valorNovo?: string;
  descricao: string;
}

export interface FiltroAuditoria {
  inicio?: string;
  fim?: string;
  usuario?: string;
  contrato?: string;
  acao?: string;
  modulo?: string;
}

export interface ResumoGovernanca {
  contratosAtivos: number;
  valorContratado: number;
  valorExecutado: number;
  valorPago: number;
  saldo: number;
  proximosVencimento: number;
  vencidos: number;
  comPendencias: number;
  processosSei: number;
  documentosPendentes: number;
}