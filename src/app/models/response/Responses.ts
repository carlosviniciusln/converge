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
