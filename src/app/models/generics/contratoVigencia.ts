export interface ContratoVigencia
{
    nuContrato: number;
    coContrato: string;
    noEmpresa: string;
    sgFilial: string;
    icArtigo81: boolean;
    dtInicioVigencia: Date;
    dtFimVigencia: Date;
    vrGlobal: number;
    vrTotalPago: number;
    vrUltProrrogacao: number;
    vrTotalPagoUltProrrogacao: number;
    vrMediaMensal: number;
    vrMediaUlt3Meses: number;
    vrUltFatura: number;
    deUltPeriodoPago: string;
    vrSaldoContrato: number;
    contratoVigenciaRubrica: ContratoVigenciaRubrica[];
}

export interface ContratoVigenciaRubrica{
    coRubrica: string;
    vrGlobal: number;
    vrTotalPago: number;
    vrUltProrrogacao: number;
    vrTotalPagoUltProrrogacao: number;
    vrMediaMensal: number;
    vrMediaUlt3Meses: number;
    vrUltFatura: number;
    deUltPeriodoPago: string;
    vrSaldoContrato: number;    
}