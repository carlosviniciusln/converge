import { Gcptb060DiffRegistros } from "./Gcptb060DiffRegistros"

export interface Gcptb060PlanejamentoItemHistoricoDTO{

        NuPlanejamento : number;
        NuHistorico : number;
        DhLog : Date;
        NuPlanejamentoItem : number;
        DeRegistroAntigo : string;
        DeRegistroNovo : string;
        DeObservacao : string;
        NuUsuarioAlteracao : number;
        NoUsuarioAlteracao : string;
        TpOperacao : string;
        ListaDiffs : Gcptb060DiffRegistros[];
}
