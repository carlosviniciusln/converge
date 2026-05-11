import { Filial } from "./filial";
import { Orcamento } from "./orcamento";
import { PlanejamentoTipoResponse } from "./planejamento-response";
import { RubricaGrupo } from "./rubrica";

export interface LimitesRubricaResponse extends LimitesRubricasUpdate {
    dhCadastro: Date;
    dhAlteracao: Date;
    dhExclusao: Date;

    gcptb003Rubrica: RubricaGrupo;
    gcptb005Filial: Filial;
    gcptb010Orcamento: Orcamento;
    gcptb019PlanejamentoTipo: PlanejamentoTipoResponse;
}

export interface LimitesRubricasUpdate {
    nuAnoOrcamentario: number;
    nuRubrica: number;
    nuFilial: number;
    nuPlanejamentoTipo: number;
    vrLimiteRubrica: number;
}

export interface LimitesRubricasUpdateV2 {
    nuPlanejamento: number;
    nuFilial: number;
    nuRubrica: number;
    vrLimite: number;
    nuLimitePlanejamento: number;
}

export interface UsoLimitesRubricaResponse {
    nuAnoOrcamentario: number;
    nuRubrica: number;
    nuPlanejamentoTipo: number;
    vrLimiteRubricaDisponivelAgrupado : number;
    vrLimiteRubricaUtilizadoAgrupado : number;
    peUtilizado : number;

    gcptb003Rubrica: RubricaGrupo;
    gcptb010Orcamento: Orcamento;
    gcptb019PlanejamentoTipo: PlanejamentoTipoResponse;
}
