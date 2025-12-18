
export interface PlanejamentoOrcamentarioItemRequest {
    NuPlanejamentoItem: number;
    NuPlanejamento?: number;
    NuContrato?: number;
    NuFilial?: number;
    NuRubrica?: number;
    NuStatusPlanejamentoItem?: number;
    NuTipoDemanda?: number;
    NuVigencia?: number;
    DeObservacao?: string;
    DeDigital?: string;
    DeObjeto?: string;
    DeObjetivoPDTIC?: string;
    DeObjetivoPEI?: string;
    DeJustificativa?: string;
    NuOrc?: string;
    NuSap?: number;
    DeSap?: string;

    VrPlanejamentoItem?: number;
    VrJaneiro?: number;
    VrFevereiro?: number;
    VrMarco?: number;
    VrAbril?: number;
    VrMaio?: number;
    VrJunho?: number;
    VrJulho?: number;
    VrAgosto?: number;
    VrSetembro?: number;
    VrOutubro?: number;
    VrNovembro?: number;
    VrDezembro?: number;

    NuUsuario?: number;
    DhCadastro?: Date;
    DhExclusao?: Date;
    NuUsuarioExclusao?: number;
    NuUsuarioAlteracao?: number;
    DhAlteracao?: Date;
  }
