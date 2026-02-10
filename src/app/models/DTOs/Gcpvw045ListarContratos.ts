export interface Gcpvw045ListarContratosDTO {
    nuContrato?: string;
    icAtivo?: boolean;
    coProcesso?: string;
    coContrato?: string;
    noEmpresa?: string;
    noContratoTipo?: string;
    sgFilial?: string;
    vrGlobal?: number;
    dtInicioContrato?: string;
    dtTerminoContrato?: string;
    vrExecutado?: string;
    noObjeto?: string;
    status?: boolean;
  }


  export interface Gcpvw045ListarContratosResponse {
      contrato: string | null;
      fornecedor: string | null;
      tipo: string | null;
      gestor: string | null;
      status: string | null;
      contratos: Gcpvw045ListarContratosDTO[];
      listaContrato: string[];
      listaFornecedor: string[];
      listaTipo: string[];
      listaGestor: string[];
      listaStatus: string[];
      totalRecords: number;
  }

