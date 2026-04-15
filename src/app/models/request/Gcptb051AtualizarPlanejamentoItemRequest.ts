import { Gcptb063CriarPrevisaoDesembolsoRequest } from "./Gcptb063CriarPrevisaoDesembolsoRequest";

export interface Gcptb051AtualizarPlanejamentoItemRequest {
    NuPlanejamentoItem?: number;
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
    VrGlobal?: number;
    DePrazoVigencia?: number;
    DtPrevisaoSiclg?: string;
    NuOrc?: number;
    NuSap?: number;
    DeSap?: string;
    previsaoDesembolso?: Gcptb063CriarPrevisaoDesembolsoRequest[];
    previsaoDesembolsoExclusao?: {
        NuPlanejamentoItem: number;
        NuPrevisaoDesembolso: number;
    }[];


  }
