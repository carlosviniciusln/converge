import { Gcptb060DiffRegistros } from "./Gcptb060DiffRegistros"

export class Gcptb060PlanejamentoItemHistoricoV2DTO{

        nuPlanejamento? : number;
        nuHistorico? : number;
        dhCadastro? : Date;
        nuPlanejamentoItem? : number;
        nuPrevisaoDesembolso? : number;
        deRegistroAntigo? : string;
        deRegistroNovo? : string;
        descricaoRubrica?: string;
        nuUsuarioAlteracao? : number;
        noUsuarioAlteracao? : string;
        sgFilial?: string;
        deObservacao? : string;
        tpOperacao? : string;
        listaDiffs? : Gcptb060DiffRegistros[] = [];
}
