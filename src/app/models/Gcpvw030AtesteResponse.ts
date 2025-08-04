import { Select2Data } from "ng-select2-component";

export interface Gcpvw030DetalhamentoDeContratosResponse{

    nuContrato: string,
    coContrato: string,
    nuFilial: string,
    sgFilial: string,
    noEmpresa: string,
    noObjeto: string,
    nuVigencia: string,
    nuRubrica: string,
    coRubrica: string,
    inicioVigencia: Date, // dtInicioVigencia: Date
    fimVigencia: Date, // dtInicioVigencia: Date
    totalContrato: number,
    vrExecutado: number,
    vrSaldo: number,
    icVigenciaAtual: number,
    dtUltimoPagamento: Date,
    deUltimoPagamento: string,
    dtProximaCompetencia: Date,
    dtInicioPeriodoCompetencia: Date,
    dtFimPeriodoCompetencia: Date,



}


export class Gcpvw030AtesteResponse{
    contratos : Gcpvw030DetalhamentoDeContratosResponse[];
    listaFornecedor: string[];
    listaContratos: string[];
    totalRecords: number;

    constructor(
        contratos : Gcpvw030DetalhamentoDeContratosResponse[],
        listaFornecedor: string[],
        listaContratos: string[],
    )
    {

        this.contratos = contratos || [];
        this.listaFornecedor = listaFornecedor || [];
        this.listaContratos = listaContratos || [];
    }
}