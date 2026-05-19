import { Gcptb001ContratoDTO } from "../DTOs/Gcptb001ContratoDTO";
import { Gcptb003RubricaDTO } from "../DTOs/Gcptb003RubricaDTO";
import { Gcptb005FilialDTO } from "../DTOs/Gcptb005FilialDTO";
import { Gcptb019PlanejamentoTipoDTO } from "../DTOs/Gcptb019PlanejamentoTipoDTO";
import { Gcptb023DemandaTipoDTO } from "../DTOs/Gcptb023DemandaTipoDTO";
import { Gcptb025PlanejamentoStatusDTO } from "../DTOs/Gcptb025PlanejamentoStatusDTO";
import { Gcptb026ObjetivoEstrategicoDTO } from "../DTOs/Gcptb026ObjetivoEstrategicoDTO";
import { Gcptb066TipoDigitalDTO } from "../DTOs/Gcptb066TipoDigitalDTO";
import { EnumDTO } from "../enums/EnumDTO";

export class Gcpvw055DetalharPlanejamentoItensResponse {
  listaTiposModalidade: EnumDTO[];
  listaUnidadesDemandantes: Gcptb005FilialDTO[] = [];
  listaDigital: Gcptb066TipoDigitalDTO[] = [];
  listaRubricas: Gcptb003RubricaDTO[] = [];
  listaTiposPlanejamento: Gcptb019PlanejamentoTipoDTO[] = [];
  listaTiposDemanda: Gcptb023DemandaTipoDTO[] = [];
  listaStatusPlanejamento: Gcptb025PlanejamentoStatusDTO[] = [];
  listaObjetivosEstrategicosPdti : Gcptb026ObjetivoEstrategicoDTO[] = [];
  listaObjetivosEstrategicosPei : Gcptb026ObjetivoEstrategicoDTO[] = [];
  listaContratos : Gcptb001ContratoDTO[] = [];
}
