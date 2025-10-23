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

    exportExcel() {

        const dadosFiltrados = this.listaPlanejamentoOrcamentario.map(item => {
            return {
                Ano: item.cO_EXERCICIO,
                Contrato: item.cO_CONTRATO,
                UD: item.sG_FILIAL,
                Empresa: item.nO_EMPRESA,
                "Limite": item.vR_LIMITE,
                "Diferença": item.vR_DIFERENCA,
                "% EP": item.pC_EP
            }
        })
        import("xlsx").then(xlsx => {
            const worksheet = xlsx.utils.json_to_sheet(dadosFiltrados);
            const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(excelBuffer, "contratos");
        });
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