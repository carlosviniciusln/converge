import { Gcptb063PrevisaoDesembolsoDTO } from "./Gcptb063PrevisaoDesembolsoDTO";

export interface Gcpvw055DetalheTelaConsultaV2DTO {
  nuPlanejamentoItem: number;
  nuOrc: number;
  nuPlanejamento: number;

  nuContrato: number | null;
  coContrato: string | null;

  nuContratoOriginal: number | null;
  coContratoOriginal: string | null;

  nuSap: number | null;
  deSap: string | null;

  nuExercicioOrcamento: number;
  coExercicio: number;

  nuFilial: number;
  coFilial: string;
  deUnidadeDemandante: string;

  nuStatusPlanejamentoItem: number;
  noStatus: string;

  nuTipoDemanda: number;
  deDemanda: string;

  nuPlanejamentoTipo: number;
  dePlanejamentoTipo: string;

  deObjeto: string | null;

  nuObjetivoPdtic: number | null;
  deObjetivoPdtic: string | null;

  nuObjetivoPei: number | null;
  deObjetivoPei: string | null;

  deJustificativa: string | null;
  deObservacao: string | null;

  icServicoContinuo: 'SIM' | 'NÃO';

  nuTipoDigital: number | null;

  nuUsuario: number;
  coMatricula: number;
  dhCadastro: string; // ISO Date
  icInclusaoManual: boolean;


  nuModalidade: number | null;
  dePrazoVigencia: string | null;
  dtPrevisaoSiclg : string | null;
  vrGlobal : string | null;

  previsoesDesembolso: Gcptb063PrevisaoDesembolsoDTO[];
}
