import { Select2Data } from "ng-select2-component";
import { Gcpvw030DetalhamentoDeContratosResponse } from "./Gcpvw030AtesteResponse";

export interface Gcpvw030ObterDetalhesPorContratoResponse{

    contrato : Gcpvw030DetalhamentoDeContratosResponse,
    rubrica: Gcpvw030InformacaoRubricaContrato[];
}


export interface Gcpvw030InformacaoRubricaContrato {

    NuRubrica : string,
    CoRubrica : string,
    DeRubrica : string,
    NuFilial : string,
    SgFilial : string,
    TotalContrato : string,
    VrExecutado : string,
    VrSaldo : string,
    IcVigenciaAtual : string
}