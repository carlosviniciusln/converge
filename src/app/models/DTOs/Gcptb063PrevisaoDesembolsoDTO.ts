export interface Gcptb063PrevisaoDesembolsoDTO {
  nuPrevisaoDesembolso: number;
  nuPlanejamentoItem: number;

  nuRubrica: number;

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

  vrPlanejado: number;

  icInclusaoManual: boolean;
  dhCadastro: string; // ISO Date
  dhExclusao: string | null;

  nuUsuario: number;
}
