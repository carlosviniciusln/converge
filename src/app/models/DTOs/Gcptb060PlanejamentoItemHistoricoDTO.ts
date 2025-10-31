import { Gcptb060DiffRegistros } from "./Gcptb060DiffRegistros"

export interface Gcptb060PlanejamentoItemHistoricoDTO{

        nuPlanejamento? : number;
        nuHistorico? : number;
        dhLog? : Date;
        nUPlanejamentoItem? : number;
        deRegistroAntigo? : string;
        deRegistroNovo? : string;
        deObservacao? : string;
        nUUsuarioAlteracao? : number;
        nOUsuarioAlteracao? : string;
        tpOperacao? : string;
        listaDiffs? : Gcptb060DiffRegistros[];
}
