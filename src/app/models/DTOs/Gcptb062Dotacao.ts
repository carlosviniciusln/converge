export interface Gcptb062DotacaoDTO {
  codigo: string;
  requerente?: string;
  dataAbertura?: string;
  status?: PedidoStatus;
  contratos?: Contrato[];
  justificativa?: string;
  setor?: string;
  vrTotalPedido?: number;

  searchText?: string
}

export interface Contrato {
  coContrato?: string;
  classificacaoDigital?: string;
  vrTotalContrato?: number;
  rubrica?: Rubrica[];
}

export interface Rubrica {
  coRubrica?: string;
  deRubrica?: string;
  vrRubrica?: number;
}


export type PedidoStatus = 'aberto' | 'em_atendimento' | 'concluido' | 'cancelado';

export interface DoadorOrcamental {                 // O QUE ESTÁ EM FATURAMENTO

  contrato: string;                       // ex: '0001/2025'
  objeto: string;                         // ex: 'OBJETO X'
  classificacaoDigital: string;            // ex: 'DIGITAL'
  unidadeDemandante: string;               // ex: 'GEGAT'
  rubrica: string;                         // ex: '3561-5'
  vrPlanejamento: number;                  // PLANEJEI GASTAR TANTO NO CONTRATO
  vrTotalReserva: number;                  // VALOR TOTAL RESERVA DA RUBRICA
  vrTotalPreComprementimento: number;      // VALOR TOTAL PRÉ-COMPROMETIMENTO
  vrPedido: number;                        // VALOR DO PEDIDO
  vrPagamentos: number;                    // O QUE JÁ FOI PAGO
}
