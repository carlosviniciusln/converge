import { Injectable } from '@angular/core';
import {
  AuditoriaFaturamento,
  CompetenciaFaturamento,
  ContratoFaturamento,
  MotorFaturamentoState,
  ResultadoCompetencia,
} from '../models/faturamento-motor';

export abstract class FaturamentoMotorRepository {
  abstract listarContratos(): Promise<ContratoFaturamento[]>;
  abstract obterContrato(id: number): Promise<ContratoFaturamento | undefined>;
  abstract salvarContrato(contrato: ContratoFaturamento): Promise<ContratoFaturamento>;
  abstract listarCompetencias(contratoId?: number): Promise<CompetenciaFaturamento[]>;
  abstract salvarCompetencia(competencia: CompetenciaFaturamento): Promise<CompetenciaFaturamento>;
  abstract listarResultados(competenciaId?: number): Promise<ResultadoCompetencia[]>;
  abstract salvarResultado(resultado: ResultadoCompetencia): Promise<ResultadoCompetencia>;
  abstract listarAuditoria(contratoId?: number): Promise<AuditoriaFaturamento[]>;
  abstract registrarAuditoria(registro: Omit<AuditoriaFaturamento, 'id' | 'ocorridoEm'>): Promise<AuditoriaFaturamento>;
  abstract resetarDemonstracao(): Promise<ContratoFaturamento[]>;
}

@Injectable({ providedIn: 'root' })
export class LocalFaturamentoMotorService implements FaturamentoMotorRepository {
  private readonly storageKey = 'converge-faturamento-motor-v1';

  async listarContratos(): Promise<ContratoFaturamento[]> {
    return this.clone(this.readState().contratos);
  }

  async obterContrato(id: number): Promise<ContratoFaturamento | undefined> {
    const contrato = this.readState().contratos.find(item => item.id === id);
    return contrato ? this.clone(contrato) : undefined;
  }

  async salvarContrato(contrato: ContratoFaturamento): Promise<ContratoFaturamento> {
    const state = this.readState();
    const salvo = this.clone(contrato);
    const index = state.contratos.findIndex(item => item.id === salvo.id);

    if (index >= 0) {
      state.contratos.splice(index, 1, salvo);
    } else {
      salvo.id = salvo.id || this.nextId(state.contratos);
      state.contratos.push(salvo);
    }

    this.writeState(state);
    return this.clone(salvo);
  }

  async listarCompetencias(contratoId?: number): Promise<CompetenciaFaturamento[]> {
    const competencias = this.readState().competencias;
    return this.clone(contratoId ? competencias.filter(item => item.contratoId === contratoId) : competencias);
  }

  async salvarCompetencia(competencia: CompetenciaFaturamento): Promise<CompetenciaFaturamento> {
    const state = this.readState();
    const salva = this.clone(competencia);
    salva.id = salva.id || this.nextId(state.competencias);
    const index = state.competencias.findIndex(item => item.id === salva.id);
    index >= 0 ? state.competencias.splice(index, 1, salva) : state.competencias.push(salva);
    this.writeState(state);
    return this.clone(salva);
  }

  async listarResultados(competenciaId?: number): Promise<ResultadoCompetencia[]> {
    const resultados = this.readState().resultados
      .filter(item => competenciaId === undefined || item.competenciaId === competenciaId)
      .sort((a, b) => b.versao - a.versao);
    return this.clone(resultados);
  }

  async salvarResultado(resultado: ResultadoCompetencia): Promise<ResultadoCompetencia> {
    const state = this.readState();
    const salvo = this.clone(resultado);
    const index = state.resultados.findIndex(item => item.competenciaId === salvo.competenciaId && item.versao === salvo.versao);
    index >= 0 ? state.resultados.splice(index, 1, salvo) : state.resultados.push(salvo);
    this.writeState(state);
    return this.clone(salvo);
  }

  async listarAuditoria(contratoId?: number): Promise<AuditoriaFaturamento[]> {
    const registros = this.readState().auditoria
      .filter(item => contratoId === undefined || item.contratoId === contratoId)
      .sort((a, b) => b.ocorridoEm.localeCompare(a.ocorridoEm));
    return this.clone(registros);
  }

  async registrarAuditoria(registro: Omit<AuditoriaFaturamento, 'id' | 'ocorridoEm'>): Promise<AuditoriaFaturamento> {
    const state = this.readState();
    const salvo: AuditoriaFaturamento = { ...registro, id: this.nextId(state.auditoria), ocorridoEm: new Date().toISOString() };
    state.auditoria.push(salvo);
    this.writeState(state);
    return this.clone(salvo);
  }

  async resetarDemonstracao(): Promise<ContratoFaturamento[]> {
    const state = criarEstadoInicial();
    this.writeState(state);
    return this.clone(state.contratos);
  }

  private readState(): MotorFaturamentoState {
    const value = localStorage.getItem(this.storageKey);
    if (!value) {
      const initialState = criarEstadoInicial();
      this.writeState(initialState);
      return initialState;
    }

    try {
      const state = JSON.parse(value) as Partial<MotorFaturamentoState>;
      return {
        contratos: state.contratos || [],
        competencias: state.competencias || [],
        resultados: state.resultados || [],
        auditoria: state.auditoria || [],
      };
    } catch {
      const initialState = criarEstadoInicial();
      this.writeState(initialState);
      return initialState;
    }
  }

  private writeState(state: MotorFaturamentoState): void {
    localStorage.setItem(this.storageKey, JSON.stringify(state));
  }

  private nextId(items: Array<{ id: number }>): number {
    return Math.max(0, ...items.map(item => item.id)) + 1;
  }

  private clone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value)) as T;
  }
}

function criarEstadoInicial(): MotorFaturamentoState {
  return {
    contratos: [criarContratoTorino(), criarContratoTelecom(), criarContratoGlobalweb()],
    competencias: [],
    resultados: [],
    auditoria: [],
  };
}

function criarContratoTorino(): ContratoFaturamento {
  return {
    id: 1,
    numero: '9.266/2023',
    fornecedor: 'Torino Informática Ltda.',
    objeto: 'Fornecimento e instalação de equipamentos com trade-in',
    inicioVigencia: '2023-10-01',
    fimVigencia: '2027-09-30',
    valorGlobalCentavos: 382500000,
    periodicidade: 'POR_EVENTO',
    diaLimiteNotaFiscal: 20,
    diaPagamento: 10,
    status: 'ATIVO',
    unidades: [
      { id: 101, contratoId: 1, codigo: 'LOTE-01', descricao: 'Parque de equipamentos', tipo: 'EQUIPAMENTO', ativa: true },
    ],
    itens: [
      { id: 1001, contratoId: 1, codigo: 'EQP-01', descricao: 'Equipamento instalado', tipo: 'EQUIPAMENTO', unidadeMedida: 'UN', valorUnitarioCentavos: 1250000, valorMensalCentavos: 0, quantidadeContratada: 300, unidadeId: 101, permiteProRata: false, permiteRetencao: true, inicioVigencia: '2023-10-01', ativo: true },
      { id: 1002, contratoId: 1, codigo: 'SRV-EVT', descricao: 'Serviço técnico eventual', tipo: 'SERVICO_EVENTUAL', unidadeMedida: 'HORA', valorUnitarioCentavos: 28500, valorMensalCentavos: 0, quantidadeContratada: 500, permiteProRata: false, permiteRetencao: false, inicioVigencia: '2023-10-01', ativo: true },
      { id: 1003, contratoId: 1, codigo: 'TRD-01', descricao: 'Equipamento recolhido em trade-in', tipo: 'TRADE_IN', unidadeMedida: 'UN', valorUnitarioCentavos: 32780, valorMensalCentavos: 0, quantidadeContratada: 300, permiteProRata: false, permiteRetencao: false, inicioVigencia: '2023-10-01', ativo: true },
    ],
    regrasFaturamento: [
      { id: 1101, contratoId: 1, nome: 'Entrega dos equipamentos', tipo: 'MARCO_PERCENTUAL', itemId: 1001, eventoGatilho: 'ENTREGA', baseCalculo: 'VALOR_UNITARIO_ITEM', percentual: 70, ordemAplicacao: 1, inicioVigencia: '2023-10-01', ativa: true },
      { id: 1102, contratoId: 1, nome: 'Instalação e aceite', tipo: 'MARCO_PERCENTUAL', itemId: 1001, eventoGatilho: 'INSTALACAO', baseCalculo: 'VALOR_UNITARIO_ITEM', percentual: 30, ordemAplicacao: 2, inicioVigencia: '2023-10-01', ativa: true },
      { id: 1103, contratoId: 1, nome: 'Serviços sob demanda', tipo: 'DEMANDA', itemId: 1002, eventoGatilho: 'ACEITE', baseCalculo: 'VALOR_UNITARIO_ITEM', ordemAplicacao: 3, inicioVigencia: '2023-10-01', ativa: true },
      { id: 1104, contratoId: 1, nome: 'Desconto por trade-in', tipo: 'DESCONTO_UNITARIO', itemId: 1003, eventoGatilho: 'COMPETENCIA', baseCalculo: 'VALOR_UNITARIO_ITEM', ordemAplicacao: 4, inicioVigencia: '2023-10-01', ativa: true },
    ],
    indicadoresSla: [],
    penalidades: [
      { id: 1201, contratoId: 1, codigo: 'ATR-ENT', descricao: 'Atraso na entrega', tipo: 'MULTA_DIA', baseCalculo: 'VALOR_UNITARIO_ITEM', percentual: 0.1, tetoPercentual: 10, cumulativa: true, inicioVigencia: '2023-10-01', ativa: true },
    ],
    documentosObrigatorios: [
      { id: 1301, contratoId: 1, codigo: 'NF', descricao: 'Nota fiscal', obrigatorioParaPagamento: true, ativo: true },
      { id: 1302, contratoId: 1, codigo: 'ATESTE', descricao: 'Termo de aceite', obrigatorioParaPagamento: true, ativo: true },
    ],
  };
}

function criarContratoTelecom(): ContratoFaturamento {
  return {
    id: 2,
    numero: '11.659/2022',
    fornecedor: 'Operadora Telecom S.A.',
    objeto: 'Serviços continuados de conectividade por circuito ativo',
    inicioVigencia: '2022-08-01',
    fimVigencia: '2027-07-31',
    valorGlobalCentavos: 184300000,
    periodicidade: 'MENSAL',
    diaLimiteNotaFiscal: 5,
    diaPagamento: 20,
    status: 'ATIVO',
    unidades: [
      { id: 201, contratoId: 2, codigo: 'CIR-BSB-001', descricao: 'Circuito Brasília Matriz', tipo: 'CIRCUITO', municipio: 'Brasília', uf: 'DF', ativa: true },
      { id: 202, contratoId: 2, codigo: 'CIR-SP-001', descricao: 'Circuito São Paulo', tipo: 'CIRCUITO', municipio: 'São Paulo', uf: 'SP', ativa: true },
    ],
    itens: [
      { id: 2001, contratoId: 2, codigo: 'LINK-1GB', descricao: 'Circuito dedicado 1 Gbps', tipo: 'CIRCUITO', unidadeMedida: 'CIRCUITO/MÊS', valorUnitarioCentavos: 0, valorMensalCentavos: 1843000, quantidadeContratada: 20, permiteProRata: true, permiteRetencao: false, inicioVigencia: '2022-08-01', ativo: true },
    ],
    regrasFaturamento: [
      { id: 2101, contratoId: 2, nome: 'Circuitos ativos homologados', tipo: 'MENSAL_QTD_ATIVA', itemId: 2001, eventoGatilho: 'COMPETENCIA', baseCalculo: 'VALOR_MENSAL_ITEM', ordemAplicacao: 1, inicioVigencia: '2022-08-01', ativa: true },
      { id: 2102, contratoId: 2, nome: 'Pro rata de ativação', tipo: 'PRO_RATA', itemId: 2001, eventoGatilho: 'ATIVACAO', baseCalculo: 'VALOR_MENSAL_ITEM', ordemAplicacao: 2, inicioVigencia: '2022-08-01', ativa: true },
    ],
    indicadoresSla: [
      { id: 2201, contratoId: 2, codigo: 'DISP-MENSAL', nome: 'Disponibilidade mensal do circuito', unidadeApuracao: 'PERCENTUAL', meta: 99.7, baseCalculo: 'VALOR_MENSAL_ITEM', tipoRegra: 'POR_FAIXA', tetoPercentual: 20, inicioVigencia: '2022-08-01', ativo: true, faixas: [
        { id: 2211, valorMinimo: 99.67, valorMaximo: 99.69, percentualDesconto: 2, ordem: 1 },
        { id: 2212, valorMinimo: 99, valorMaximo: 99.6699, percentualDesconto: 10, ordem: 2 },
        { id: 2213, valorMinimo: 0, valorMaximo: 98.9999, percentualDesconto: 20, ordem: 3 },
      ] },
      { id: 2202, contratoId: 2, codigo: 'INDISP-MIN', nome: 'Tempo de indisponibilidade', unidadeApuracao: 'MINUTOS', meta: 0, baseCalculo: 'VALOR_MENSAL_ITEM', tipoRegra: 'POR_MINUTO', tetoPercentual: 100, inicioVigencia: '2022-08-01', ativo: true, faixas: [] },
    ],
    penalidades: [
      { id: 2301, contratoId: 2, codigo: 'ATR-OBR', descricao: 'Atraso em obrigação contratual', tipo: 'MULTA_DIA', baseCalculo: 'VALOR_FATURA', percentual: 0.05, tetoPercentual: 10, cumulativa: true, inicioVigencia: '2022-08-01', ativa: true },
    ],
    documentosObrigatorios: [
      { id: 2401, contratoId: 2, codigo: 'NF', descricao: 'Nota fiscal da competência', obrigatorioParaPagamento: true, ativo: true },
      { id: 2402, contratoId: 2, codigo: 'REL-SLA', descricao: 'Relatório mensal de SLA', obrigatorioParaPagamento: true, ativo: true },
    ],
  };
}

function criarContratoGlobalweb(): ContratoFaturamento {
  return {
    id: 3,
    numero: '01412/2025',
    fornecedor: 'Globalweb Outsourcing do Brasil S.A.',
    objeto: 'Serviços continuados com faturamento mensal e controle documental',
    inicioVigencia: '2025-01-21',
    fimVigencia: '2028-01-20',
    valorGlobalCentavos: 172800000,
    periodicidade: 'MENSAL',
    diaLimiteNotaFiscal: 25,
    diaPagamento: 5,
    status: 'ATIVO',
    unidades: [
      { id: 301, contratoId: 3, codigo: 'UD-001', descricao: 'Unidade de prestação principal', tipo: 'OS', municipio: 'Brasília', uf: 'DF', ativa: true },
    ],
    itens: [
      { id: 3001, contratoId: 3, codigo: 'SRV-MENSAL', descricao: 'Serviço mensal continuado', tipo: 'SERVICO_MENSAL', unidadeMedida: 'MÊS', valorUnitarioCentavos: 0, valorMensalCentavos: 4800000, quantidadeContratada: 1, unidadeId: 301, permiteProRata: true, permiteRetencao: false, inicioVigencia: '2025-01-21', ativo: true },
    ],
    regrasFaturamento: [
      { id: 3101, contratoId: 3, nome: 'Mensalidade do serviço', tipo: 'MENSAL_FIXO', itemId: 3001, eventoGatilho: 'COMPETENCIA', baseCalculo: 'VALOR_MENSAL_ITEM', ordemAplicacao: 1, inicioVigencia: '2025-01-21', ativa: true },
      { id: 3102, contratoId: 3, nome: 'Pro rata inicial e final', tipo: 'PRO_RATA', itemId: 3001, eventoGatilho: 'COMPETENCIA', baseCalculo: 'VALOR_MENSAL_ITEM', ordemAplicacao: 2, inicioVigencia: '2025-01-21', ativa: true },
    ],
    indicadoresSla: [],
    penalidades: [],
    documentosObrigatorios: [
      { id: 3201, contratoId: 3, codigo: 'NF', descricao: 'Nota fiscal', obrigatorioParaPagamento: true, ativo: true },
      { id: 3202, contratoId: 3, codigo: 'FGTS', descricao: 'Certificado de regularidade do FGTS', obrigatorioParaPagamento: true, ativo: true },
      { id: 3203, contratoId: 3, codigo: 'CNDT', descricao: 'Certidão negativa de débitos trabalhistas', obrigatorioParaPagamento: true, ativo: true },
    ],
  };
}