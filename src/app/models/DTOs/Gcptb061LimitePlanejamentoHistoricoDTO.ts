import { Gcptb060DiffRegistros } from "./Gcptb060DiffRegistros"

export interface Gcptb061LimitePlanejamentoHistoricoDTO{

        nuPlanejamento? : number;
        nuHistorico? : number;
        dhLog? : Date;
        nuLimitePlanejamento? : number;
        deRegistroAntigo? : string;
        deRubrica?: string;
        noRubrica?: string;
        sgFilial?: string;
        deRegistroNovo? : string;
        deObservacao? : string;
        nuUsuarioAlteracao? : number;
        noUsuarioAlteracao? : string;
        tpOperacao? : string;
        listaDiffs? : Gcptb060DiffRegistros[];
}
