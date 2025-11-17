import { ContratoResponse } from "./contrato-response";
import { Filial } from "./filial";
import { Orcamento } from "./orcamento";

export interface PlanejamentoOrcamentarioResponse {
    nuPlanejamentoItem: number;
    nuPlanejamentoOrcamentario: number;
    coPlanejamentoOrcamentario: string; // ano e numeração sequencial
    nuAno: number; // ano Exercicio
    nuFilial: number; // [GEPAC, GEQTI, GECMI, GEPTI, ...]
    deObjeto: string;
    deDigital: string;
    deJustificativa: string; // Justificativa Orcamento
    deObservacao: string; // Observação Orcamento
    nuPlanejamentoStatus: number; // [Em Avaliação, Em Revisão, Validado]
    nuDemandaTipo: number; // Planejado Para (Razão): [Nova Contratação, Alteração Contratual, Continuidade de Contrato Vigente]
    nuTipoDemanda?: number;
    // boServicoContinuo: boolean; // [Sim, Não] Atrelado a nuDemandaTipo?
    nuContrato?: number;
    //txCriticidade: string; // [Baixa, Média, Alta]
    nuObjetivoEstrategicoPdti: number;
    nuObjetivoEstrategicoPei: number;
    nuClassificacaoPlanejamento: number;
    nuPreComprometimento?: number;
    vrPreComprometimento?: number;
    nuPlanejamentoTipo: number; // Tipo Planejamento [Programação, Reprogramação]
    vrTotalOrcamentoPlanejamento: number;
    coContrato?: string;
    nuObjetivoPdtic?: number;
    nuObjetivoPei?: number;
    noStatus?: number;
    nuExercicioOrcamento?: number;
    nuStatusPlanejamentoItem?: number;
    /**/
    coMatricula: string;
    coExercicio?: number;

    // nuUsuario: number;
    // nuAnalistaCaixa: number;
    // nuColaborador: number;
    // noUsuario: string;
    // noAnalistaCaixa: string;
    // noColaborador: string;

    dhCadastro: Date;
    // dhExclusao: Date;

    gcptb001Contrato?: ContratoResponse;
    gcptb005Filial: Filial;
    gcptb010Orcamento?: Orcamento;
    gcptb019PlanejamentoTipo: PlanejamentoTipoResponse;
    gcptb023DemandaTipo: DemandaTipoResponse;
    gcptb024ClassificacaoPlanejamento: ClassificacaoPlanejamentoResponse;
    gcptb025PlanejamentoStatus: PlanejamentoStatusResponse;
    gcptb026ObjetivoEstrategico: ObjetivoEstrategicoResponse;
    gcptb027PrevisoesDesembolso: PrevisaoDesembolsoResponse[];

    cO_CONTRATO?: string;
    cO_EXERCICIO?: number;
    dE_DEMANDA?: string;
    nO_OBJETO?: string;
    nO_STATUS?: string;
    nU_CONTRATO?: number;
    nU_EXERCICIO_ORCAMENTO?: number;
    nU_FILIAL?: number;
    nU_ORC?: number;
    nU_PLANEJAMENTO?: number;
    nU_STATUS_PLANEJAMENTO?: number;
    nU_TIPO_DEMANDA?: number;
    sG_FILIAL?: string;
    vR_PLANEJAMENTO?: number;
    deObjetivoPdtic?: string;

}

export interface PlanejamentoItemResponse {
    nuPlanejamentoOrcamentario: number;
    coPlanejamentoOrcamentario: string; // ano e numeração sequencial
    nuAno: number; // ano Exercicio
    nuFilial: number; // [GEPAC, GEQTI, GECMI, GEPTI, ...]
    deObjeto: string;
    deUnidadeDemandante: string;
    deJustificativa: string; // Justificativa Orcamento
    deObservacao: string; // Observação Orcamento
    nuPlanejamentoStatus: number; // [Em Avaliação, Em Revisão, Validado]
    nuDemandaTipo: number; // Planejado Para (Razão): [Nova Contratação, Alteração Contratual, Continuidade de Contrato Vigente]
    // boServicoContinuo: boolean; // [Sim, Não] Atrelado a nuDemandaTipo?
    nuContrato?: number;
    //txCriticidade: string; // [Baixa, Média, Alta]
    nuObjetivoEstrategicoPdti: number;
    nuObjetivoEstrategicoPei: number;
    nuClassificacaoPlanejamento: number;
    nuPreComprometimento?: number;
    vrPreComprometimento?: number;
    nuPlanejamentoTipo: number; // Tipo Planejamento [Programação, Reprogramação]
    vrTotalOrcamentoPlanejamento: number;
    coContrato?: string;
    nuObjetivoPdtic?: number;
    nuObjetivoPei?: number;
    noStatus?: number;
    nuExercicioOrcamento?: number;
    nuStatusPlanejamentoItem?: number;

    dhCadastro: Date;
    // dhExclusao: Date;
    nuPrevisaoDesembolso: string;
    nuRubrica: string;
    vrJaneiro: number;
    vrFevereiro: number;
    vrMarco: number;
    vrAbril: number;
    vrMaio: number;
    vrJunho: number;
    vrJulho: number;
    vrAgosto: number;
    vrSetembro: number;
    vrOutubro: number;
    vrNovembro: number;
    vrDezembro: number;
    vrTotalRubrica: number;
    nuReserva: number;


    cO_CONTRATO?: string;
    cO_EXERCICIO?: number;
    dE_DEMANDA?: string;
    nO_OBJETO?: string;
    nO_STATUS?: string;
    nU_CONTRATO?: number;
    nU_EXERCICIO_ORCAMENTO?: number;
    nU_FILIAL?: number;
    nU_ORC?: number;
    nU_PLANEJAMENTO?: number;
    nU_STATUS_PLANEJAMENTO?: number;
    nU_TIPO_DEMANDA?: number;
    sG_FILIAL?: string;
    vR_PLANEJAMENTO?: number;
    deObjetivoPdtic?: string;

}

export interface PlanejamentoOrcamentarioConsultaResponse {
    nU_CONTRATO: number;
    nU_FILIAL: number,
    cO_FILIAL: string,
    sG_FILIAL: string,
    contrato: number,
    dT_FIM_VIGENCIA: Date,
    objeto: string,
    planejadO_PARA: number,
    exercicio: number,
    status: number,
    nO_STATUS: string,
    objetivO_PDTIC: number,
    objetivO_PEI: number,
    dE_OBJETIVO_PEI: string,
    tipO_PLANEJAMENTO: number,
    dE_TIPO_PLANEJAMENTO: string,
    justificativA_ORCAMENTO: string
}

export interface DemandaTipoResponse {
    nuDemanda: number;
    deDemanda: string;
}

export interface ClassificacaoPlanejamentoResponse {
    nuClassificacao: number;
    noClassificacao: string;
    noEnquadramento: string;
}

export interface PlanejamentoStatusResponse {
    nuPlanejamentoStatus: number
    noPlanejamentoStatus: string;
}

export interface PlanejamentoObjetoResponse {
    deObjeto: string;
}

export interface ObjetivoEstrategicoResponse {
    nuObjetivoEstrategico: number;
    coObjetivoEstrategico: string;
    deObjetivoEstrategico: string;
}

export interface PlanejamentoTipoResponse {
    nuPlanejamentoTipo: number;
    dePlanejamentoTipo: string;
}

export interface PrevisaoDesembolsoResponse {
    nuPrevisaoDesembolso: string;
    nuPlanejamentoOrcamentario: number;
    nuPlanejamentoItem: number;
    nuRubrica: string;
    vrJaneiro: number;
    vrFevereiro: number;
    vrMarco: number;
    vrAbril: number;
    vrMaio: number;
    vrJunho: number;
    vrJulho: number;
    vrAgosto: number;
    vrSetembro: number;
    vrOutubro: number;
    vrNovembro: number;
    vrDezembro: number;
    vrTotalRubrica: number;
    nuPreComprometimento: number;
    vrPreComprometimento: number;
    nuReserva: number;
}

/* novo mapeamento */
export interface PlanejamentoConsultaGeralResponse {
    nuPlanejamento: number;
    nuContrato: number;
    coContrato: string;
    nuExercicioOrcamento: number;
    coExercicio: number;
    nuFilial: number;
    deUnidadeDemandante: string;
    nuStatusPlanejamentoItem: number;
    noStatus: string;
    nuTipoDemanda: number;
    deDemanda: string;
    nuPlanejamentoTipo: number;
    dePlanejamentoTipo: string;
    deObjeto: string;
    nuObjetivoPdtic?: number; // Nullable
    deObjetivoPdtic: string;
    nuObjetivoPei?: number; // Nullable
    deObjetivoPei: string;
    deJustificativa: string;
    deCategoria?: string; // Nullable
    deServicoContinua: string;
    nuUsuario: number;
    coMatricula: string;
    dhCadastro: Date;
  }
