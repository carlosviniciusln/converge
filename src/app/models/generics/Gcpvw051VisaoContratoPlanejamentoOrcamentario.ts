export interface Gcpvw051VisaoContratoPlanejamentoOrcamentario {
  nuOrc?: number;
  nuPlanejamento?: number;
  nuExercicioOrcamento?: number;
  coExercicio?: number;
  nuContrato?: number | null;
  coContrato?: string | null;
  coFilial?: string;
  sgFilial?: string;
  nuFilial?: number;
  noObjeto?: string;
  nuStatusPlanejamento?: number;
  noStatus?: string;
  nuTipoDemanda?: number;
  deDemanda?: string;
  vrPlanejamento?: number;

  //dados adicionais
  noStatusOriginal?: string;
  stSelecionado?: boolean;
}
