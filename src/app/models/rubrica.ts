export interface Rubrica {
  nuRubrica: number;
  coRubrica: string;
  nuRubricaTipo: number;
  dhExclusao: Date;
  deRubrica: string;
}

export interface RubricaGrupo extends Rubrica {
  nuGrupoRemanejamento: number;

  gcptb028GrupoRemanejamento: Gcptb028GrupoRemanejamento;
}

export interface Gcptb028GrupoRemanejamento {
  nuGrupoRemanejamento: number;
  coGrupoRemanejamento: number;
  deGrupoRemanejamento: string;
}

export interface ValoresRubrica {
  nuRubrica: number;
  coRubrica: string;
  vrExecutado: number;
}

export interface ValoresRubricaResponse {
  nU_FILIAL: number;
  sG_FILIAL: string;
  nU_RUBRICA: number;
  cO_RUBRICA: string;
  nO_RUBRICA_TIPO: string;
  vR_EXECUTADO: number
}

export interface ValoresRubricaDetalhe {
  coContrato: string;
  coRubrica: string;
  nuRubrica: number;
  nuContrato: number;
  noContratoTipo: string;
  dtInicioVigencia: Date;
  dtFimVigencia: Date;
  vrExecutado: number;
}

export interface ValoresRubricaDetalheResponse {
  nU_CONTRATO: number,
  cO_CONTRATO: string,
  fornecedor: string,
  nU_FILIAL: number,
  sG_FILIAL: string,
  nU_RUBRICA: number,
  cO_RUBRICA: string,
  nO_RUBRICA_TIPO: string,
  dT_INICIO_VIGENCIA: string,
  dT_FIM_VIGENCIA: string,
  vR_EXECUTADO: number
}

export interface ValoresRubricaDetalheContrato {
  coContrato: string;
  noEmpresa: string;
  coRubrica: string;
  dePeriodo: string;
  nuAno: number;
  noPagamentoTipo: string;
  coNumeroAteste: string;
  dtPagamentoEfetivo: Date;
  vrExecutado: number;
}

export interface VigenciaRubrica {
  vigencia: any,
  rubrica: Rubrica
}


export interface Rubrica {
  cO_RUBRICA: string,
  valoresExecutados: any[],
  valoresMensais: any[],
  periodos: any[],
  series: any[],
}


