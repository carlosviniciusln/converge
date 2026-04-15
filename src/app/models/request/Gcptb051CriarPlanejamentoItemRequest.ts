import { Gcptb063CriarPrevisaoDesembolsoRequest } from "./Gcptb063CriarPrevisaoDesembolsoRequest";

export interface Gcptb051CriarPlanejamentoItemRequest {
    NuPlanejamento?: number;
    NuContrato?: number;
    NuFilial?: number;
    NuRubrica?: number;
    NuStatusPlanejamentoItem?: number;
    NuDemandaTipo?: number;
    DeObjeto?: string;
    NuObjetivoPDTIC?: string;
    NuObjetivoPEI?: string;
    DeJustificativa?: string;
    DeObservacao?: string;
    NuModalidade?: number;
    NuOrc?: number;
    NuSap?: number;
    DeSap?: string;
    previsaoDesembolso?: Gcptb063CriarPrevisaoDesembolsoRequest[];


  }
