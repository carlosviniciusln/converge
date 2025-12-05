import { PlanejamentoOrcamentarioComponent } from './../planejamento-lista/planejamento-orcamentario.component';
import { Component, Input, OnInit, SimpleChanges} from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ApiService } from 'src/app/services/api.service';
import { ApiResponse } from 'src/app/models/api-response';
import { ValoresExecutadosResponse } from 'src/app/models/Gcptb001ContratoResponse';
import { Endpoints } from 'src/app/shared/enums/endpoints';
import * as fileSaver from 'file-saver';
import { ActionPolicies, ModuleEnum, TokenStorageService } from 'src/app/services/token-storage.service';
import { PlanejamentoOrcamentarioModel } from 'src/app/models/planejamento-orcamentario';

@Component({
    selector: 'app-planejamento-aba-rubrica',
    templateUrl: './planejamento-aba-rubrica.component.html',
    styleUrls: ['./planejamento-aba-rubrica.component.scss'],
    animations: [
        trigger('rowExpansionTrigger', [
            state('void', style({
                transform: 'translateX(-10%)',
                opacity: 0
            })),
            state('active', style({
                transform: 'translateX(0)',
                opacity: 1
            })),
            transition('* <=> *', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ]
})
export class PlanejamentoAbaRubricaComponent implements OnInit {

    @Input() nuPlanejamento? : number;
    @Input() nuPlanejamentoOrcamentario? : number;
    @Input() anoExercio : number;
    @Input() tipoExercicio : string;
    permissions: ActionPolicies;
    listaPlanejamentoOrcamentario: PlanejamentoOrcamentarioModel[] = [];
    planejamentoOrcamentario: PlanejamentoOrcamentarioModel[] = [];
    pagamentosFilialContrato: ValoresExecutadosResponse[] = [];
    pagamentosRubricaContrato: ValoresExecutadosResponse[] = [];

    constructor(private apiService: ApiService,
        private token: TokenStorageService) { }

    ngOnInit() {
        this.obterPermissoes();

    }


ngOnChanges(changes: SimpleChanges) {
  if (changes['nuPlanejamento'] && changes['nuPlanejamento'].currentValue) {
    this.obterValores(this.nuPlanejamento+"");
  }
}


    obterPermissoes() {
        this.permissions = this.token.getActionPolicies(ModuleEnum.Contratos);
    }

    filterItem(value: string) {
        if (!value) {
            this.listaPlanejamentoOrcamentario = this.planejamentoOrcamentario;
        } else {
            const lowerCaseValue = value.toLowerCase();
            this.listaPlanejamentoOrcamentario = this.planejamentoOrcamentario?.filter(item => {
                return (item.cO_EXERCICIO && item.cO_EXERCICIO.toString().includes(value)) ||
                    (item.cO_CONTRATO && item.cO_CONTRATO.toLowerCase().includes(lowerCaseValue)) ||
                    (item.nO_EMPRESA && item.nO_EMPRESA.toLowerCase().includes(value.toLowerCase())) ||
                    (item.sG_FILIAL && item.sG_FILIAL.toLowerCase().includes(lowerCaseValue)) ||
                    (item.cO_RUBRICA && item.cO_RUBRICA.toString().includes(value)) ||
                    (item.dE_RUBRICA && item.dE_RUBRICA.toString().includes(value));
            });
        }
    }
    
    async exportExcel() {
        const rubricas = this.listaPlanejamentoOrcamentario?.length
          ? this.listaPlanejamentoOrcamentario
          : this.planejamentoOrcamentario;
        if (!rubricas || rubricas.length === 0) return;
      
        type Linha = {
          Ano: number | string;
          Mes: string;
          Rubrica: string;
          Contrato: string;
          UD: string;
          Empresa: string;
          Planejado: number;
          Limite: number;
          Diferenca: number;
          Executado: number;
          '%EP': number;
        };
        const linhas: Linha[] = [];
      
        const K = {
          contrato: ['cO_CONTRATO', 'CO_CONTRATO', 'nU_CONTRATO', 'NU_CONTRATO'] as string[],
          empresa: ['nO_EMPRESA', 'NO_EMPRESA'] as string[],
          filialNum: ['nU_FILIAL', 'NU_FILIAL'] as string[],
          filialSigla: ['sG_FILIAL', 'SG_FILIAL'] as string[],
          periodo: ['dE_PERIODO', 'DE_PERIODO'] as string[],
          limite: ['vR_LIMITE', 'VR_LIMITE'] as string[],
          planejadoMes: ['vR_PLANEJADO_MES', 'VR_PLANEJADO_MES'] as string[],
          diferenca: ['vR_DIFERENCA', 'VR_DIFERENCA'] as string[],
          executado: ['vR_EXECUTADO', 'VR_EXECUTADO'] as string[],
          ep: ['pC_EP', 'PC_EP'] as string[],
          exercicio: ['cO_EXERCICIO', 'CO_EXERCICIO'] as string[],
          rubricaCod: ['cO_RUBRICA', 'CO_RUBRICA', 'nU_RUBRICA', 'NU_RUBRICA'] as string[],
          rubricaDesc: ['dE_RUBRICA', 'DE_RUBRICA'] as string[],
        };
      
        const getStr = (obj: any, keys: string[], def = ''): string => {
          if (!obj) return def;
          for (const k of keys) {
            const v = obj[k];
            if (v !== undefined && v !== null && String(v) !== '') return String(v);
          }
          return def;
        };
      
        const getNum = (obj: any, keys: string[], def = 0): number => {
          if (!obj) return def;
          for (const k of keys) {
            const v = obj[k];
            if (v !== undefined && v !== null && String(v) !== '') {
              const n = Number(v);
              if (!isNaN(n)) return n;
            }
          }
          return def;
        };
      
        const cascadeNum = (keys: string[], def = 0, ...objs: any[]): number => {
          for (const o of objs) {
            const v = getNum(o, keys, NaN);
            if (!isNaN(v)) return v;
          }
          return def;
        };
      
        const anoFromPeriodo = (periodo: string, fallback: any): number | string => {
          const y = periodo && periodo.length >= 4 ? Number(periodo.slice(-4)) : NaN;
          if (!isNaN(y)) return y;
          const fb = getNum(fallback, K.exercicio, 0);
          return fb !== 0 ? fb : '';
        };

        const getContrato = (m: any, c: any, ud: any, r: any): string => {
          const pick = (o: any) => {
            const val = getStr(o, K.contrato, '');
            return val === '0' ? '' : val;
          };
          return pick(m) || pick(c) || pick(ud) || pick(r) || '';
        };
      
        const getRubricaFromRegistro = (r: any): string => {
          const code = getStr(r, K.rubricaCod, '');
          if (code && code !== '0') return code;
          return getStr(r, K.rubricaDesc, '');
        };
      
        const mesesFrom = (c: any, r: any): any[] => {
          const local = Array.isArray(c?.terceiroNivel) ? c.terceiroNivel : [];
          const reg = Array.isArray(r?.terceiroNivel) ? (r.terceiroNivel as any[]) : [];
          return local.length ? local : reg;
        };
      
        const siglaUD = (filialRef: number, udSiglas: Map<number, string>, ud: any, r: any): string => {
          if (!isNaN(filialRef)) {
            const s = udSiglas.get(filialRef);
            if (s) return s;
          }
          return getStr(ud, K.filialSigla, getStr(r, K.filialSigla, ''));
        };
      
        const udPromises: Promise<void>[] = [];
        for (const reg of rubricas) {
          const r: any = reg;
          if (!Array.isArray(r.detalhes) || r.detalhes.length === 0) {
            udPromises.push(this.detalharPorUD(reg));
          }
        }
        if (udPromises.length) await Promise.all(udPromises);
      
        for (const reg of rubricas) {
          const r: any = reg;
          const uds: any[] = Array.isArray(r.detalhes) ? r.detalhes : [];
          if (!uds.length) continue;
      
          const rubricaDoRegistro = getRubricaFromRegistro(r);
      
          const udSiglaPorFilial = new Map<number, string>();
          for (const ud of uds) {
            const filial = getNum(ud, K.filialNum, NaN);
            if (!isNaN(filial)) udSiglaPorFilial.set(filial, getStr(ud, K.filialSigla, ''));
          }
      
          for (const ud of uds) {
            await this.detalharPorContrato(reg, ud);
            const contratos: any[] = Array.isArray(r.segundoNivel) ? r.segundoNivel : [];
            if (!contratos.length) continue;
      
            for (const c of contratos) {
              await this.detalharPorMes(reg, c);
              const meses = mesesFrom(c, r);
              if (!meses.length) continue;
      
              const empresaStr = getStr(c, K.empresa, '') || getStr(ud, K.empresa, '') || getStr(r, K.empresa, '');
              const filialRef = getNum(c, K.filialNum, NaN) || getNum(ud, K.filialNum, NaN);
              const udSigla = siglaUD(filialRef, udSiglaPorFilial, ud, r);
      
              for (const m of meses) {
                const periodo = getStr(m, K.periodo, '');
                const ano = anoFromPeriodo(periodo, c ?? r);
                const contratoFinal = getContrato(m, c, ud, r);
      
                linhas.push({
                  Ano: ano,
                  Mes: periodo,
                  Rubrica: rubricaDoRegistro,
                  Contrato: contratoFinal,
                  UD: udSigla,
                  Empresa: empresaStr,
                  Planejado: cascadeNum(K.planejadoMes, 0, m, c, ud, r),
                  Limite: cascadeNum(K.limite, 0, m, c, ud, r),
                  Diferenca: cascadeNum(K.diferenca, 0, m, c, ud, r),
                  Executado: cascadeNum(K.executado, 0, m, c, ud, r),
                  '%EP': cascadeNum(K.ep, 0, c, ud, r),
                });
              }
            }
          }
        }
      
        const xlsx = await import('xlsx');
        const lib = (xlsx as any).default ?? xlsx;
        const worksheet = lib.utils.json_to_sheet(linhas);
        const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = lib.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, 'contratos');
    }      
      
    saveAsExcelFile(buffer: any, fileName: string): void {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        fileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    }

    public async obterValores(nuplanejamento: string) {
        try {
            const response = await this.apiService.get<
                ApiResponse<PlanejamentoOrcamentarioModel[]>
            >(`${Endpoints.URL_PLANEJAMENTO_ORCAMENTARIO_RUBRICA}?nuPlanejamento=${nuplanejamento}`);
            this.planejamentoOrcamentario = response.data;
            this.listaPlanejamentoOrcamentario = response.data;
        } catch (error) {
            console.error(error, 'obterValores por rubrica');
        }
    }

    async detalharPorUD(registro: PlanejamentoOrcamentarioModel) {
        try {
            registro.expanded = !registro.expanded;
            if (registro.expanded && !registro.detalhes) {
                const response = await this.apiService.get<
                    ApiResponse<PlanejamentoOrcamentarioModel[]>
                >(`${Endpoints.URL_PLANEJAMENTO_ORCAMENTARIO_UD}?nuPlanejamento=${this.nuPlanejamento}&nuRubrica=${registro.nU_RUBRICA}`)
                registro.detalhes = response.data;
            }
        } catch (error) {
            console.error(error, 'detalharPorUD');
        }
    }

    async detalharPorContrato(registro: PlanejamentoOrcamentarioModel, detalhe: any) {
        try {
            if (!detalhe.segundoNivel) {
                detalhe.segundoNivel = [];
            }
            detalhe.expanded = !detalhe.expanded;
            if (detalhe.expanded && !detalhe.segundoNivel.data) {
                const response = await
                this.apiService.get<ApiResponse<PlanejamentoOrcamentarioModel[]>>
                (`${Endpoints.URL_PLANEJAMENTO_ORCAMENTARIO_CONTRATO}?nuPlanejamento=${this.nuPlanejamento}&nuRubrica=${registro.nU_RUBRICA}&nuFilial=${detalhe.nU_FILIAL}`);
                registro.segundoNivel = response?.data;
            }
        }
        catch (error) {
            console.error(error, 'detalharPorContrato');
        }
    }

    async detalharPorMes(registro: PlanejamentoOrcamentarioModel, detalhe: any) {
      try {
          if (!detalhe.terceiroNivel) {
              detalhe.terceiroNivel = [];
          }
          detalhe.expanded = !detalhe.expanded;
          if (detalhe.expanded && !detalhe.terceiroNivel.data) {
              const response = await
              this.apiService.get<ApiResponse<PlanejamentoOrcamentarioModel[]>>
              (`${Endpoints.URL_PLANEJAMENTO_ORCAMENTARIO_MES}?nuPlanejamento=${this.nuPlanejamento}&nuRubrica=${registro.nU_RUBRICA}&nuContrato=${detalhe.nU_CONTRATO}`);
              registro.terceiroNivel = response.data;
          }
      }
      catch (error) {
          console.error(error, 'detalharPorUD');
      }
  }

}