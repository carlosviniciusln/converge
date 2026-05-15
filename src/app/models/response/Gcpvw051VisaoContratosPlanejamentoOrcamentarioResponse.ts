import { Select2Data } from "ng-select2-component";
import { Gcpvw051VisaoContratoPlanejamentoOrcamentario } from "../generics/Gcpvw051VisaoContratoPlanejamentoOrcamentario"

export class Gcpvw051VisaoContratosPlanejamentoOrcamentarioResponse {
    // planejamento: string;
    // exercicio: string;
    ud: string;
    contrato: string;
    nuOrc: number;
    tipo: string;
    // digital: string;
    status: string;
    objeto: string;
    contratos: Gcpvw051VisaoContratoPlanejamentoOrcamentario[];
    // listaPlanejamento: string[];
    // listaExercicio: number[];
    listaUnidadeDemandante: string[];
    listaNuOrc: string[];
    listaContrato: string[];
    listaTipo: string[];
    // listaDigital: string[];
    listaObjeto: string[];
    listaStatus: string[];
    listaDiretoria: string[];
    listaSuperintendencia: string[];
    totalRegistros: number;
}
