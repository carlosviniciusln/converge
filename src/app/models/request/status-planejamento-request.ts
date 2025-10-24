export interface AlterarStatusPlanejamento {
    nuPlanejamento: number,
    status: number,
    nuPlanejamentoItem: Gcptb051NuPlanejamentoItemDTO[]
}
 
 
export interface Gcptb051NuPlanejamentoItemDTO{
    NuTipoDemanda : number,
    NuContrato : number
}