
export interface EvolucaoFinanceiraAquisicao {
    coContrato: string;
    grafico: Grafico;
    graficoGeral: Grafico;
    detalhe: Detalhe;
    resumo: Resumo[];
}

export interface Grafico {
    titulo?: any;
    categorias?: any;
    series: Series[];
}


export interface Series {
    name: string;
    type: string;
    color: string;
    data: number[];
}

export interface Detalhe {
    noEsgotamento: string;
    dtInicioVigencia: Date;
    dtFimVigencia: Date;
    noPrazoRemanescente: string;
    qtTotalItensPrevisto: number;
    qtTotalSolicitado: number;
    qtTotalPago: number;
    qtTotalPendente: number;
    vrTotalContrato: number;
    vrSaldoContrato: number;
    vrMediaEfetivaUltimos03Meses: number;
    vrExecutado: number;
    vrUnitario: number;  
}


export interface Resumo {
    dePeriodo: string;
    coNumeroAteste: string;
    dtPagamentoEfetivo?: Date;
    vrExecutado?: number;
    vrCredito?:number;
    vrGlosa?: number;
    vrMulta?: number;
    qtItens?: number;
    qtTradeIn?: number;
    nuSap?: number;
}