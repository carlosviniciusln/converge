export interface Gcptb021CartaQuitacaoResponse
{
    nuCartaQuitacao: number;
    nuContrato: number;
    nuAno: number;
    dtRecebimento: Date;
    dhCadastro: Date;
    nuCartaQuitacaoStatus:number;
    noCartaQuitacaoStatus: string; 

}

export interface Gcptb021CartaQuitacao
{
    nuCartaQuitacao: number;
    nuContrato: number;
    nuAno: number;
    dtRecebimento: Date;
    nuCartaQuitacaoStatus: number; 
}