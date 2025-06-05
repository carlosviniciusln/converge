import { ApiResponse } from "./api-response";
import { ContratoResponse } from "./contrato-response";

export interface Gcptb001ContratoResponse {
    nuContrato: number;
    coContrato: string;
    noEmpresa: string;
    noContratoTipo: string;
    sgFilial: string;
    icAtivo: true;
    dtInicioContrato: string;
    dtTerminoContrato: string;
    vrGlobal: number;
    vrExecutado: number;
    coCnpj: string;
    noObjeto: string;
    percDiasCorridos: number;
    percVrExecutado: number;
    percConsumo: number;
    saldoDisponivel: number;
}

export interface ContratoItem {
    nuContrato: number;
    icAtivo: boolean;
    coContrato: string;
    noEmpresa: string;
    noContratoTipo: string;
    sgFilial: string;
    vrGlobal: number;
    vrGlobalFormatado: string;
    dtInicioContrato: string;
    dtTerminoContrato: string;
    vrExecutado: string;
    pagamentosAta: ContratoResponse;
    expanded: boolean;
    coCnpj: string;
    noObjeto: string;
    percDiasCorridos: string;
    percVrExecutado: string;
    percConsumo: string;
    saldoDisponivel: string;
    no_Tipo_Arp:string;
    vrExecutadoFormatado:string;
    status: string;
    co_Processo: string;
  }

export interface ContratoApiResponse {
    contrato: string | null;
    fornecedor: string | null;
    tipo: string | null;
    gestor: string | null;
    status: string | null;
    contratos: ContratoItem[];
    listaContrato: string[];
    listaFornecedor: string[];
    listaTipo: string[];
    listaGestor: string[];
    listaStatus: string[];
    totalRecords: number;
}

export interface PlanejamentoItem {
    exercicio: string;
    planejado: string;
    mensalizacao: string;
    executado: string;
    percentual: string;
    status: string;
    observacao: string;
}

export interface PagamentoPendenteResponse {
    nU_CONTRATO: number;
    cO_CONTRATO: string;
    nU_PEDIDO: number;
    nU_PAGAMENTO: number;
    dT_LANCAMENTO: string;
    cO_MATRICULA: string;
    montante: number;
    miro: number;
    nU_ATESTE: string;
    competencia: string;
}
export interface ValoresExecutadosResponse {
    id: string;
    objeto: string;
    contrato: string;
    ano: number;
    vrTotalExecutado: number;
    vrTotalPrevisto: number;
    gn: string;
    coRubrica: string;
    deRubrica: string;
    mes: string;
    expanded: boolean;
    detalhes: ValoresExecutadosResponse[];
    segundoNivel: ValoresExecutadosResponse;
}

export interface Gcptb006Vigencias {
    nuVigenciaTipo: number;
    dtInicio: Date;
    dtTermino: Date;
    nuDiaInicio: number;
    nuDiaTermino: number;
    vrGlobal: number;
}

export interface Gcptb013Sistema {
    nuSistema: number;
    noSistema: string;
}

export interface Gcptb002ContratoTipo {
    nuContratoTipo: number;
    noContratoTipo: string;
}

export interface Gcptb005Filial {
    nuFilial: number;
    coFilial: string;
    sgFilial: string;
}

export interface Gcpvw008Mensalizacao {
    nU_MENSALIZACAO: number;
    dE_CONTRATO: string;
    dE_PERIODO: string;
    dE_RUBRICA: string;
    vR_PLANEJADO: number;
    vR_EXECUTADO: number;
    obS_PARCELA: string;
    dT_INI_VIGENCIA: string;
    dT_FIM_VIGENCIA: string;
}

export interface Gcpvw018EexcucaoOrcamentaria {
    cO_CONTRATO: string;
    dT_PAGAMENTO: string;
    execucao: number;
    nU_CONTRATO: string;
    nU_DOCUMENTO_FATURA: number;
    nU_DOCUMENTO_RW: number;
    nU_PEDIDO: number;
    periodo: string;
    vR_MONTANTE_FATURA: number;
    vR_MONTANTE_PAGAMENTO: number;
}

export interface TotalPorRubrica {
    rubrica: string;
    total: number;
}

export interface RetornoArtigo {
    coContrato: string;
    nuContrato: string;
    vrExecutado: number;
}

export interface ResumoPlanejamentoModel {
  tipoFormatado: string,
  nU_PLANEJAMENTO: number,
  cO_EXERCICIO: number,
  capeX_PLANEJADO: number,
  capeX_EXECUTADO: number,
  opeX_PLANEJADO: number,
  opeX_EXECUTADO: number,
  dT_ABERTURA: string,
  dT_FECHAMENTO: string,
  statuS_PLANEJAMENTO: string,
  perC_CAPEX: string,
  perC_OPEX: string,
  tipo: string
}

export interface ContatoItem {
    nU_PREPOSTO: number,
    nU_CONTRATO: number,
    cO_MATRICULA: string,
    nO_PREPOSTO: string
    dE_EMAIL: string,
    nU_TELEFONE: string,
    dE_CARGO: string
    cO_MATRICULA_USUARIO_REGISTRO: string,
    dT_REGISTRO: string,
    iC_ATIVO: boolean
    cO_MATRICULA_USUARIO_EXCLUSAO: string,
    dT_EXCLUSAO: string
  }