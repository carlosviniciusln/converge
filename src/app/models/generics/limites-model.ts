

// NOMENCLATURA DE BANCO, SEMPRE UTILIZAR O PADRÃO PARA CADA LINGUAGEM
// export interface LimitesModel {
//   nU_PLANEJAMENTO?:number;
//   nU_EXERCICIO_ORCAMENTO?:number;
//   cO_EXERCICIO?:number;
//   nU_FILIAL?:number;
//   cO_FILIAL?:number;
//   sG_FILIAL?:string;
//   nU_RUBRICA?:number
//   cO_RUBRICA?:string;
//   dE_RUBRICA?:string;
//   nO_RUBRICA_TIPO?:string;
//   vR_PLANEJAMENTO?:number
//   nU_STATUS_PLANEJAMENTO?:number
//   nO_STATUS?:string;
//   nU_PLANEJAMENTO_TIPO?:number
//   dE_PLANEJAMENTO_TIPO?:string;
//   vR_LIMITE?:number;
//   vR_DIFERENCA?:number;
//   nU_LIMITE_PLANEJAMENTO?:number;
//   expanded?:boolean;
//   segundoExpanded?:boolean;
//   terceiroExpanded?:boolean;
//   detalhes?:Partial<LimitesModel>[];
//   segundoNivel?:Partial<LimitesModel>[];
//   terceiroNivel?:Partial<LimitesModel>[];
//   dE_ORDEM_PROG?: string;
// }


export interface LimitesModel {
  nuPlanejamento?:number;
  nuExercicioOrcamento?:number;
  coExercicio?:number;
  nuFilial?:number;
  coFilial?:number;
  sgFilial?:string;
  nuRubrica?:number
  coRubrica?:string;
  deRubrica?:string;
  noRubricaTipo?:string;
  vrPlanejamento?:number
  nuStatusPlanejamento?:number
  noStatus?:string;
  nuPlanejamentoTipo?:number
  dePlanejamentoTipo?:string;
  vrLimite?:number;
  vrDiferenca?:number;
  nuLimitePlanejamento?:number;
  expanded?:boolean;
  segundoExpanded?:boolean;
  terceiroExpanded?:boolean;
  primeiroNivel?:Partial<LimitesModel>[];
  segundoNivel?:Partial<LimitesModel>[];
  terceiroNivel?:Partial<LimitesModel>[];
  deOrdemProg?: string;
  listaOrdemProg?: string[];
  listaUnidadeDemandante?: string[];
  listaRubricas?: string[];
  listaTipo?: string[];
  totalRecords?: number;
  nuOrc?: string | null;
  ud?: string | null;
  tipo?: string | null;
}



export interface ExercicioModel {
  nU_EXERCICIO_ORCAMENTO: number,
  cO_EXERCICIO: number,
  dE_EXERCICIO: string,
  nU_PLANEJAMENTO: number,
  nU_USUARIO: number,
  dH_CADASTRO: string,
}

export interface StatusPlanejamentoModel{
  nU_PLANEJAMENTO: number,
  nU_ORDEM: number,
  cO_EXERCICIO: number,
  nO_STATUS: string,
  tipo: string
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
