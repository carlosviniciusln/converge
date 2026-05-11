export interface Gcpvw051VisaoContratoPlanejamentoOrcamentario {
  nuOrc?: number;
  nuPlanejamento?: number;
  nuExercicioOrcamento?: number;
  coExercicio?: number;

  nuContrato?: number | null;
  coContrato?: string | null;
  coContratoOriginal?: string | null;
  nuContratoOriginal?: number | null;

  coFilial?: string;
  sgFilial?: string;
  nuFilial?: number;

  noObjeto?: string;

  nuStatusPlanejamento?: number;
  noStatus?: string;

  nuTipoDemanda?: number;
  deDemanda?: string;

  nuPlanejamentoItem?: number;

  nuPlanejamentoTipo?: number;
  dePlanejamentoTipo?: string;

  nuSap?: number | null;
  deSap?: string | null;

  deUnidadeDemandante?: string;

  nuObjetivoPdtic?: number | null;
  deObjetivoPdtic?: string | null;

  nuObjetivoPei?: number | null;
  deObjetivoPei?: string | null;

  deJustificativa?: string | null;
  deObservacao?: string | null;

  deServicoContinuo?: string;

  vrPlanejamento?: number | null;

  nuUsuario?: number | null;
  coMatricula?: string;

  dhCadastro?: Date | string | null;

  icInclusaoManual?: boolean | null;

  // 🔹 campos apenas do front-end (não vêm da API)
  noStatusOriginal?: string;
  stSelecionado?: boolean;

  vrGegat?: number | null;
  vrGeorc?: number | null;
  vrDiferenca?: number | null;
  PcDiferenca?: number | null;
}
