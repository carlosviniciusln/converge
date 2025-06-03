export interface ContratoResponse {
    contrato: string;
    nU_CONTRATO: number;
    nuContrato: number;
    co_Processo: string;
    nuFilial: number;
    nuContratoTipo: number;
    nuSistema: number;
    coContrato: string;
    noEmpresa: string;
    noOs: string;
    noObjeto: string;
    icArtigo81: boolean;
    nuDiaFechamentoFatura: number;
    icDiaUtilFechamentoFatura: boolean;
    nuDiaPagamentoFatura: number;
    icDiaUtilPagamentoFatura: boolean;
    nuDiaNotaFiscal: number;
    icDiaUtilNotaFiscal: boolean;
    nuUsuario: number;
    nuAnalistaCaixa: number;
    nuColaborador: number;
    noUsuario: string;
    noAnalistaCaixa: string;
    noColaborador: string;
    dhCadastro: Date;
    dhExclusao: Date;
    dtInicioContrato?: Date;
    dtTerminoContrato?: Date;
    vrGlobal: number;
    icAtivo: boolean;
    qtTotalEquip?: number;
    vrUnitarioEquip?: number;
    qtTotalTradeIn?: number;
    gcptb002ContratoTipo: Gcptb002ContratoTipo;
    gcptb005Filial: Gcptb005Filial;
    gcptb006Vigencias: Gcptb006Vigencia[];
    gcptb013Sistema: Gcptb013Sistema;
    gcptb011Pagamentos: Gcptb011Pagamento[];
    gcptb016Empenhos: Gcptb016Empenho[];
    no_Tipo_Arp: string;
    ic_Arp: boolean;
    nu_Ata: string;
    qtAtasPai: number;
}

export interface ContratoResponseV2 {
    cO_CNPJ: string;
    cO_CONTRATO: string;
    cO_MATRICULA_CADASTRO: string;
    contratO_TIPO: string;
    dH_CADASTRO: string;
    dH_EXCLUSAO: string;
    dT_INICIO: string;
    dT_TERMINO: string;
    diA_FECHAMENTO_FATURA: number;
    diA_PAGAMENTO_FATURA: number;
    filial: string;
    iC_ARTIGO_81: boolean;
    iC_ATIVO: boolean;
    matriculA_FISCAL_ADM: string;
    matriculA_FISCAL_TEC: string;
    nO_FISCAL_ADM: string;
    nO_FISCAL_TEC: string;
    nO_FORNECEDOR: string;
    nO_OBJETO: string;
    nO_USUARIO_CADASTRO: string;
    nU_CONTRATO: number;
    nU_CONTRATO_TIPO: number;
    nU_FISCAL_ADM: number;
    nU_FISCAL_TEC: number;
    nU_USUARIO_CADASTRO: number;
    sG_FILIAL: string;
    vR_GLOBAL: number;
    vR_GLOBAL_VIGENTE?: number;
    nuDiaPagamentoFatura: any;
    iC_DIA_PAGAMENTO_FATURA: any;
    iC_DIA_UTIL_FATURA: any;
    nU_FILIAL: string;
}

export interface Retencao {
    nU_RETENCAO: number;
    nU_LIBERACAO: number;
    nU_CONTRATO: number;
    cO_CONTRATO: string;
    nU_PEDIDO: number;
    nU_ATESTE: number;
    vR_PENALIDADE: number;
    dE_PERIODO: string;
    observacao: string | null;
    nU_TIPO_PENALIDADE: number;
    dE_TIPO_PENALIDADE: string;
}

export type RetencaoResponse = Retencao[];
export interface Gcptb002ContratoTipo {
    nuContratoTipo: number;
    noContratoTipo: string;
}

export interface Gcptb005Filial {
    nuFilial: number;
    nuFilialPai: number;
    coFilial: string;
    sgFilial: string;
    dhExclusao: Date;
}

export interface Gcptb007VigenciaTipo {
    nuVigenciaTipo: number;
    noVigenciaTipo: string;
}

export interface Gcptb013Sistema {
    nuSistema: number;
    noSistema: string;
}

export interface Gcptb006Vigencia {
    nuVigencia: number;
    nuVigenciaTipo: number;
    nuContrato: number;
    dtInicio: Date;
    dtTermino: Date;
    nuDiaInicio: number;
    nuDiaTermino: number;
    dtInicioCompetencia: string;
    protocoloSiclg: string;
    dhCadastro: Date;
    dhExclusao: Date;
    vrGlobal: number;
    gcptb007VigenciaTipo: Gcptb007VigenciaTipo;
    gcptb017VigenciaRubricas: Gcptb017VigenciaRubrica[];
    isEdicaoAditivoVigencia: boolean;
}

export interface Gcptb017VigenciaRubrica {
    nuVigenciaRubrica: number;
    nuVigencia: number;
    nuRubrica: number;
    nuServicoTipo: number;
    noServicoTipo: string;
    vrTotal: number;
    vrMediaEstimada: number;
    gcptb003Rubrica: Gcptb003Rubrica;
}

export interface Gcptb003Rubrica {
    nuRubrica: number;
    coRubrica: string;
    nuRubricaTipo: number;
    dhExclusao: Date;
    deRubrica: string;
}

export interface Gcptb011Pagamento {
    nuPagamento: number;
    nuPagamentoTipo: number;
    nuContrato: number;
    nuVigencia: number;
    nuVigenciaRubrica: number;
    nuOrcamento: number;
    dePeriodo: string;
    coNumeroAteste: string;
    vrCredito: number;
    vrEmpenhado: number;
    vrRedutor: number;
    vrGlosa: number;
    vrRecorrencia: number;
    vrAjuste: number;
    vrMulta: number;
    vrRetencao: number;
    vrExecutado: number;
    dtFaturamento: Date;
    dtNotaFiscal: Date;
    dtPagamento: Date;
    dtPagamentoEfetivo: Date;
    dhCadastro: Date;
    dhExclusao?: any;
    gcptb012PagamentoTipo: Gcptb012PagamentoTipo;
    gcptb017VigenciaRubrica: Gcptb017VigenciaRubrica;

    qtdItens?: number;
    qtdTradeIn?: number;
    nuSap?: number;
    qtTotalSolicitado?: number;
}

export interface Gcptb012PagamentoTipo {
    noPagamentoTipo: string;
    dePagamentoTipo: string;
}

export interface Gcptb016Empenho {
    nuEmpenho: number;
    nuContrato: number;
    dePeriodo: string;
    vrTotal: number;
}