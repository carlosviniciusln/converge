
export interface Dashboard {
    contratos: Contrato[];
    orcamentos: Orcamento[]
    valoresExecutados: ValoresExecutados;
}

export interface NumerosRapidosExecContratual {
    nU_RESUMO_EXECUCAO_CONTRATUAL: number;
    qT_CONTRATO_VIGENTE: number;
    qT_PAGAMENTO_ANO: number;
    nU_RUBRICA: number;
    vR_EXECUTADO_VIGENTE: number;
    vR_GLOBAL_VIGENTE: number;
    vR_RETIDO_VIGENTE: number;
    vR_EXECUTADO_ANO: number;
}

export interface Contrato {
    nuGerencia: number;
    noGerencia: string;
    filhos: Contrato[];
    qtdVigentes: number;
    qtdInativos: number;
    qtdVencimento30dias: number;
    qtdVencimento90dias: number;
    qtdVencimento180dias: number;
    qtdSemSaldo: number;
}

export interface Orcamento {
    nuGerencia: number;
    noGerencia: string;
    filhos: Orcamento[];
    valorCusteio: number;
    valorInvestimento: number;
}

export interface ValoresExecutados {
    valorCusteio: number;
    valorInvestimento: number;
}

