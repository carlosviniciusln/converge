
export interface EvolucaoFinanceira {
    coContrato: string;
    grafico: Grafico;
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
    vrTotalContrato: number;
    vrEmpenhado: number;
    vrExecutado: number;
    vrSaldoContrato: number;
    vrMediaMensalEstimada: number;
    vrMediaEfetivaUltimos03Meses: number;
    vrMediaMensalPagamentos: number;
    dtUltimoFatumentoPago?: any;
}

export interface Resumo {
    dePeriodo: string;
    coNumeroAteste:string;
    dtPagamentoEfetivo: Date;
    //vrEmpenhado: number;
    vrCredito : number;
    vrExecutado: number;
    vrGlosa: number;
    vrPago: number;
    vrDevolucaoGlosa: number;
    vrPassivo: number;
    vrMulta: number;
}