import { Data } from "./api-response";
import { RelatorioPagamento } from "./relatorio-pagamento";


// CRIAR DTOs para ca
export interface RelatorioPagamentoResponse {
 pagamentos: any[],
 pagamentosPaginado: Data<RelatorioPagamento>,
 listaRubricasAtivas: any[],
 listaFiliaisAtivas: any[],
 listaTodosOsAnos: any[]

}