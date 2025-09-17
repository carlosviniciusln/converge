
export interface LimitesModel {
  nU_PLANEJAMENTO: number;
  nU_EXERCICIO_ORCAMENTO: number;
  cO_EXERCICIO: number;
  nU_FILIAL: number;
  cO_FILIAL: number;
  sG_FILIAL: string;
  nU_RUBRICA: number
  cO_RUBRICA: string;
  dE_RUBRICA: string;
  nO_RUBRICA_TIPO: string;
  vR_PLANEJAMENTO: number
  nU_STATUS_PLANEJAMENTO: number
  nO_STATUS: string;
  nU_PLANEJAMENTO_TIPO: number
  dE_PLANEJAMENTO_TIPO: string;
  vR_LIMITE: number;
  vR_DIFERENCA: number;
  expanded: boolean;
  segundoExpanded: boolean;
  terceiroExpanded: boolean;
  detalhes: LimitesModel[];
  segundoNivel: LimitesModel[];
  terceiroNivel: LimitesModel[];
}


export interface ExercicioModel {
  nU_EXERCICIO_ORCAMENTO: number,
  cO_EXERCICIO: number,
  nU_USUARIO: number,
  dH_CADASTRO: string,
}

export interface StatusPlanejamentoModel{
  nU_PLANEJAMENTO: number,
  nU_ORDEM: number,
  cO_EXERCICIO: number,
  nO_STATUS: string
}

export interface listaErroUploadModel {
  noRubrica: string,
  noUnidadeDemandante: string,
  vrLimite: number,
  linha: number,
  erro: string,
  campo: string,
  erroVrLimite: boolean,
}