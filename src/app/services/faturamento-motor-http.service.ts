import { Injectable } from '@angular/core';
import {
  AuditoriaFaturamento,
  CompetenciaFaturamento,
  ContratoFaturamento,
  ResultadoCompetencia,
} from '../models/faturamento-motor';
import { ApiService } from '../shared/services/api.service';
import { FaturamentoMotorRepository } from './faturamento-motor.service';

@Injectable({ providedIn: 'root' })
export class HttpFaturamentoMotorService implements FaturamentoMotorRepository {
  private readonly baseUrl = 'v1/faturamento-motor';

  constructor(private api: ApiService) {}

  listarContratos(): Promise<ContratoFaturamento[]> {
    return this.api.get<ContratoFaturamento[]>(`${this.baseUrl}/contratos`);
  }

  obterContrato(id: number): Promise<ContratoFaturamento | undefined> {
    return this.api.get<ContratoFaturamento>(`${this.baseUrl}/contratos/${id}`);
  }

  salvarContrato(contrato: ContratoFaturamento): Promise<ContratoFaturamento> {
    return this.api.put<ContratoFaturamento>(`${this.baseUrl}/contratos/${contrato.id}`, contrato);
  }

  listarCompetencias(contratoId?: number): Promise<CompetenciaFaturamento[]> {
    return this.api.get<CompetenciaFaturamento[]>(`${this.baseUrl}/competencias`, contratoId === undefined ? {} : { contratoId });
  }

  salvarCompetencia(competencia: CompetenciaFaturamento): Promise<CompetenciaFaturamento> {
    return this.api.put<CompetenciaFaturamento>(`${this.baseUrl}/competencias/${competencia.id}`, competencia);
  }

  listarResultados(competenciaId?: number): Promise<ResultadoCompetencia[]> {
    return this.api.get<ResultadoCompetencia[]>(`${this.baseUrl}/resultados`, competenciaId === undefined ? {} : { competenciaId });
  }

  salvarResultado(resultado: ResultadoCompetencia): Promise<ResultadoCompetencia> {
    return this.api.put<ResultadoCompetencia>(`${this.baseUrl}/competencias/${resultado.competenciaId}/resultados/${resultado.versao}`, resultado);
  }

  listarAuditoria(contratoId?: number): Promise<AuditoriaFaturamento[]> {
    return this.api.get<AuditoriaFaturamento[]>(`${this.baseUrl}/auditoria`, contratoId === undefined ? {} : { contratoId });
  }

  registrarAuditoria(registro: Omit<AuditoriaFaturamento, 'id' | 'ocorridoEm'>): Promise<AuditoriaFaturamento> {
    return this.api.post<AuditoriaFaturamento>(`${this.baseUrl}/auditoria`, registro);
  }

  resetarDemonstracao(): Promise<ContratoFaturamento[]> {
    return this.api.post<ContratoFaturamento[]>(`${this.baseUrl}/demonstracao/reset`, {});
  }
}