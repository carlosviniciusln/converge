import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { Endpoints } from 'src/app/models/enums/endpoints';
import { ApiResponse, ApiResponsePaginado } from 'src/app/models/generics/api-response';
import { ResumoPlanejamentoModel } from 'src/app/models/generics/Gcptb001ContratoResponse';
import { PlanejamentoStatusResponse } from 'src/app/models/generics/planejamento-response';
import { ContratoPlanejamentosOrcamentario, PlanejamentoOrcamentarioModel, PlanejamentosOrcamentariosResponse } from 'src/app/models/generics/planejamento-orcamentario';

/** Resposta de api/v1/Exercicio/resumo-planejamento (lista resumida de exercícios) */
export type ExercicioResumoListaResponse = ResumoPlanejamentoModel;

/** Resposta de api/v1/Exercicio/resumo-planejamento?coExercicio=XXXX (detalhe de um exercício) */
export interface ExercicioDetalheResponse {
  cO_EXERCICIO: number;
  statuS_PLANEJAMENTO: string;
  tipoFormatado: string;
  tipo: string;
  nU_PLANEJAMENTO: number;
  capeX_PLANEJADO: number;
  capeX_EXECUTADO: number;
  opeX_PLANEJADO: number;
  opeX_EXECUTADO: number;
  dT_ABERTURA: string;
  dT_FECHAMENTO: string;
  perC_CAPEX: string;
  perC_OPEX: string;
  /** Limites opcionais (quando vindos do backend) */
  capeX_LIMITE?: number;
  opeX_LIMITE?: number;
}

/** Filtro para api/v1/PlanejamentoOrcamentario/filter-paginado */
export interface FiltroRegistrosPlanejamento {
  pageNumber: number;
  pageSize: number;
  nuPlanejamento?: number;
  tipoPlanejamento?: string;
  nuAno?: number;
  contrato?: string;
  ud?: string;
  objeto?: string;
  status?: string;
  tipo?: string;
}

/** Filtro para api/v1/PlanejamentoOrcamentario/dashboard */
export interface FiltroDashboardPlanejamento {
  pageNumber: number;
  pageSize: number;
  nuPlanejamento: number;
  tipoPlanejamento?: string;
}

/** Item do dashboard (resumo da programação selecionada) */
export type DashboardPlanejamentoModel = PlanejamentoOrcamentarioModel;

/** Item da listagem paginada */
export type RegistroPlanejamento = ContratoPlanejamentosOrcamentario;

/** Item do endpoint rubrica */
export type RubricaPlanejamento = PlanejamentoOrcamentarioModel;

// ─── Modelos do relatório de limites (4 níveis) ────────────────────────────

export interface RelatorioLimiteNivel4 {
  /** Unidade Demandante */
  sG_FILIAL: string;
  vR_LIMITE: number;
  vR_SOLICITADO: number;
  vR_DIFERENCA: number;
}

export interface RelatorioLimiteNivel3 {
  cO_RUBRICA: string;
  dE_RUBRICA: string;
  vR_LIMITE: number;
  vR_SOLICITADO: number;
  vR_DIFERENCA: number;
  uds: RelatorioLimiteNivel4[];
}

export interface RelatorioLimiteNivel2 {
  /** CAPEX / OPEX */
  nO_RUBRICA_TIPO: string;
  vR_LIMITE: number;
  vR_SOLICITADO: number;
  vR_DIFERENCA: number;
  rubricas: RelatorioLimiteNivel3[];
}

export interface RelatorioLimiteNivel1 {
  cO_EXERCICIO: number;
  /** Ex: "Programação" ou "Reprogramação" */
  tipo: string;
  vR_LIMITE: number;
  vR_SOLICITADO: number;
  vR_DIFERENCA: number;
  categorias: RelatorioLimiteNivel2[];
}

@Injectable({
  providedIn: 'root',
})
export class NovoPlanejamentoService {

  constructor(private api: ApiService) {}

  // ─── 1. Lista de exercícios ───────────────────────────────────────────────
  listarExercicios(): Promise<ApiResponse<ExercicioResumoListaResponse[]>> {
    return this.api.get<ApiResponse<ExercicioResumoListaResponse[]>>(
      Endpoints.URL_EXERCICIO_RESUMO
    );
  }

  // ─── 2. Detalhe de um exercício ───────────────────────────────────────────
  obterDetalheExercicio(coExercicio: number): Promise<ApiResponse<ExercicioDetalheResponse[]>> {
    return this.api.get<ApiResponse<ExercicioDetalheResponse[]>>(
      `${Endpoints.URL_EXERCICIO_RESUMO}?coExercicio=${coExercicio}`
    );
  }

  // ─── 3. Registros paginados do planejamento ───────────────────────────────
  listarRegistrosPaginados(
    filtro: FiltroRegistrosPlanejamento
  ): Promise<ApiResponse<PlanejamentosOrcamentariosResponse>> {
    return this.api.get<ApiResponse<PlanejamentosOrcamentariosResponse>>(
      Endpoints.URL_PLANEJAMENTO_ORCAMENTARIO_FILTER_PAGINADO,
      filtro as any
    );
  }

  // ─── 4. Visão por rubrica ─────────────────────────────────────────────────
  listarRubricas(nuPlanejamento: number): Promise<ApiResponse<RubricaPlanejamento[]>> {
    return this.api.get<ApiResponse<RubricaPlanejamento[]>>(
      Endpoints.URL_PLANEJAMENTO_ORCAMENTARIO_RUBRICA,
      { nuPlanejamento }
    );
  }

  // ─── 5. Dashboard / resumo da programação selecionada ─────────────────────
  obterDashboard(
    filtro: FiltroDashboardPlanejamento
  ): Promise<ApiResponse<DashboardPlanejamentoModel[]>> {
    return this.api.get<ApiResponse<DashboardPlanejamentoModel[]>>(
      Endpoints.URL_PLANEJAMENTO_ORCAMENTARIO_DASHBOARD,
      filtro as any
    );
  }

  // ─── 6. Status disponíveis para alteração em lote ────────────────────────
  listarStatusPlanejamento(): Promise<ApiResponse<PlanejamentoStatusResponse[]>> {
    return this.api.get<ApiResponse<PlanejamentoStatusResponse[]>>(
      `${Endpoints.URL_ORCAMENTO}/status-planejamento`
    );
  }

  // ─── 7. Criar novo exercício ──────────────────────────────────────────────
  criarNovoExercicio(): Promise<ApiResponse<ExercicioResumoListaResponse[]>> {
    return this.api.post<ApiResponse<ExercicioResumoListaResponse[]>>(
      Endpoints.URL_EXERCICIO_NOVO,
      ''
    );
  }

  // ─── 8. Relatório de limites (4 níveis) ───────────────────────────────────
  obterRelatorioLimites(nuPlanejamento: number): Promise<ApiResponse<RelatorioLimiteNivel1[]>> {
    return this.api.get<ApiResponse<RelatorioLimiteNivel1[]>>(
      Endpoints.URL_PLANEJAMENTO_ORCAMENTARIO_RELATORIO_LIMITES,
      { nuPlanejamento }
    );
  }
}
