export interface Gcptb043ResumoExecucaoContratualDTO {
  nuRelatorioOrcamento: number;
  nuFilial: number;
  sgFilial: string | null;
  nuFilialPai: number;
  sgFilialPai: string | null;
  icUnidadePai: boolean;
  vrInvestimentoPlanejado: number;
  vrCusteioPlanejado: number;
  vrInvestimentoExecutado: number;
  vrCusteioExecutado: number;
  pcInvestimentoRealizado: number;
  pcCusteioRealizado: number;
  dhCadastro: string;
}

export interface Gcpvw024RelatorioOrcamentoDTO {
  nuResumoExecucaoContratual: number;
  qtContratoVigente: number;
  qtPagamentoAno: number;
  nuRubrica: number;
  vrExecutadoVigente: number;
  vrGlobalVigente: number;
  vrRetidoVigente: number;
  vrExecutadoAno: number;
}

export interface DashboardOrcamentoExecucaoContratualResponse {
  dashboardOrcamento: Gcptb043ResumoExecucaoContratualDTO;
  dashboardExecucaoContratual: Gcpvw024RelatorioOrcamentoDTO;
  contratos: Record<number, string>;
}

export type DashboardOrcamentoExecucaoContratualApiResponse = DashboardOrcamentoExecucaoContratualResponse;
