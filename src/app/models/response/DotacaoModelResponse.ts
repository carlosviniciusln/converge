import { Gcptb062DotacaoDTO } from "../DTOs/Gcptb062Dotacao";

export interface DotacaoModelResponse
{
  pedidos: Gcptb062DotacaoDTO[],
  totalRecords: number
}
