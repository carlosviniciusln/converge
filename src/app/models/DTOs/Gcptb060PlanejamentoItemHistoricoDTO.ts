import { Gcptb060DiffRegistros } from "./Gcptb060DiffRegistros"

export interface Gcptb060PlanejamentoItemHistoricoDTO{

        nuPlanejamento? : number;
        nuHistorico? : number;
        dhLog? : Date;
        nuPlanejamentoItem? : number;
        deRegistroAntigo? : string;
        deRegistroNovo? : string;
        deRubrica?: string;
        noRubrica?: string;
        nuUsuarioAlteracao? : number;
        noUsuarioAlteracao? : string;
        sgFilial?: string;
        deObservacao? : string;
        tpOperacao? : string;
        listaDiffs? : Gcptb060DiffRegistros[];
}
