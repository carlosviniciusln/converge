export type EtapaExecucaoSiafic = 'Contrato' | 'Empenho' | 'Liquidação' | 'Pagamento';
export type StatusRegistroSiafic = 'Concluído' | 'Em processamento' | 'Pendente' | 'Com divergência';

export interface ClassificacaoOrcamentariaSiafic {
  unidadeOrcamentaria: string;
  programa: string;
  acao: string;
  naturezaDespesa: string;
  fonteRecursos: string;
  planoInterno: string;
}

export interface RegistroSiafic {
  id: string;
  etapa: EtapaExecucaoSiafic;
  numero: string;
  descricao: string;
  valor: number;
  data: string;
  status: StatusRegistroSiafic;
  origem: 'Converge' | 'SIAFIC';
}

export interface DivergenciaSiafic {
  id: number;
  tipo: 'Valor' | 'Classificação' | 'Documento' | 'Prazo';
  criticidade: 'Alta' | 'Média' | 'Baixa';
  descricao: string;
  valorConverge?: string;
  valorSiafic?: string;
  orientacao: string;
}

export interface LogIntegracaoSiafic {
  id: number;
  dataHora: string;
  operacao: string;
  protocolo: string;
  resultado: 'Sucesso' | 'Alerta' | 'Erro';
  detalhe: string;
}

export interface PainelIntegracaoSiafic {
  contratoId: number;
  contratoNumero: string;
  ambiente: 'DEMONSTRAÇÃO';
  sistemaDestino: string;
  ultimaSincronizacao: string;
  classificacao: ClassificacaoOrcamentariaSiafic;
  registros: RegistroSiafic[];
  divergencias: DivergenciaSiafic[];
  logs: LogIntegracaoSiafic[];
}

export interface ResultadoSincronizacaoSiafic {
  protocolo: string;
  dataHora: string;
  registrosConsultados: number;
  divergenciasEncontradas: number;
}