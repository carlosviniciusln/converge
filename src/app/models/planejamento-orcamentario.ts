export interface PlanejamentoOrcamentarioModel {
  nU_PLANEJAMENTO: number,
  nU_EXERCICIO_ORCAMENTO: number,
  cO_EXERCICIO: number,
  nU_CONTRATO: number,
  cO_CONTRATO: string,
  nO_RUBRICA_TIPO: string,
  nO_EMPRESA: string,
  nU_FILIAL: number,
  sG_FILIAL: string,
  nU_VIGENCIA: number,
  nU_RUBRICA: number,
  cO_RUBRICA: string,
  dE_RUBRICA: string,
  vR_LIMITE: number,
  dE_PERIODO: string,
  vR_PLANEJADO_MES: number,
  vR_EXECUTADO: number,
  vR_DIFERENCA: number,
  pC_EP: number,
  expanded: boolean;
  segundoExpanded: boolean;
  terceiroExpanded: boolean;
  detalhes: PlanejamentoOrcamentarioModel[];
  segundoNivel: PlanejamentoOrcamentarioModel[];
  terceiroNivel: PlanejamentoOrcamentarioModel[];
}

export interface PlanejamentosOrcamentariosResponse {
    planejamento: string,
    exercicio: string,
    ud: string,
    contrato: string,
    nuOrc: number,
    tipo: string,
    digital: string,
    status: string,
    objeto: string,
    totalRecords: number,
    contratos: ContratoPlanejamentosOrcamentario[],
    listaPlanejamento: string[],
    listaExercicio: number[],
    listaUnidadeDemandante: string[],
    listaNuOrc: string[],
    listaContrato: string[],
    listaTipo: string[],
    listaDigital: string[],
    listaObjeto: string[],
    listaStatus: string[]
}

export interface ContratoPlanejamentosOrcamentario {
  nU_ORC: number,
  nU_PLANEJAMENTO: number,
  nU_EXERCICIO_ORCAMENTO: number,
  cO_EXERCICIO: number,
  nU_CONTRATO: number,
  cO_CONTRATO: string,
  cO_FILIAL: string;
  nO_OBJETO: string,
  nU_STATUS_PLANEJAMENTO: number,
  nU_TIPO_DEMANDA: number,
  dE_DEMANDA: string,
  nO_STATUS: string,
  nO_STATUS_Original: string,
  nU_FILIAL: number,
  sG_FILIAL: string,
  vR_PLANEJAMENTO: number,
  sT_SELECIONADO: boolean
}
