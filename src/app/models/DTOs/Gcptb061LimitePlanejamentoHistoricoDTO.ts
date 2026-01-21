import { Gcptb060DiffRegistros } from "./Gcptb060DiffRegistros"

export interface Gcptb061LimitePlanejamentoHistoricoDTO{

        nuPlanejamento? : number;
        nuHistorico? : number;
        dhLog? : Date;
        nUPlanejamentoItem? : number;
        deRegistroAntigo? : string;
        deRegistroNovo? : string;
        deObservacao? : string;
        nuUsuarioAlteracao? : number;
        noUsuarioAlteracao? : string;
        tpOperacao? : string;
        listaDiffs? : Gcptb060DiffRegistros[];
}
