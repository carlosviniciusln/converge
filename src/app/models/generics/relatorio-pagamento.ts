export interface RelatorioPagamento {
    nuPagamento: number;
    nuPagamentoTipo: number;
    nuContrato: number;
    coContrato: string;
    noFornecedor: string;
    coRubrica: string;
    noRubricaTipo: string;
    sgFilial: string;
    coNumeroAteste: string;
    dePeriodo: string;
    dtPagamento: Date;
    dtPagamentoEfetivo: Date;
    vrExecutado: number;
    vrRetencao: number;
    nuAnoOrcamento: number;
}