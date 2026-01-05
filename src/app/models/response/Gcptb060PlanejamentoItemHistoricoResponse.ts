import { Gcptb060PlanejamentoItemHistoricoDTO } from "../DTOs/Gcptb060PlanejamentoItemHistoricoDTO";

export interface Gcptb060PlanejamentoItemHistoricoResponse{

  listaHistorico : Gcptb060PlanejamentoItemHistoricoDTO[];
}


interface ResultadoItem {
  succeeded: boolean;
  nuPlanejamentoItem: number;
  message: string;
}

interface ApiResponse {
  succeeded: boolean;
  data: {
    succeeded: boolean;
    resultados: ResultadoItem[];
  };
  errors: any[];
}
