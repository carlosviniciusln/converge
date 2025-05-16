import { Component, OnInit} from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ApiService } from 'src/app/services/api.service';
import { ApiResponse } from 'src/app/models/api-response';
import { ValoresExecutadosResponse } from 'src/app/models/Gcptb001ContratoResponse';
import { Endpoints } from 'src/app/shared/enums/endpoints';
import * as fileSaver from 'file-saver';
import { ActionPolicies, ModuleEnum, TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
    selector: 'app-valores-executados',
    templateUrl: './valores-executados.component.html',
    styleUrls: ['./valores-executados.component.scss'],
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
export class ValoresExecutadosComponent implements OnInit {
    permissions: ActionPolicies;
    listaValoresExecutados: ValoresExecutadosResponse[] = [];
    valorExecutado: ValoresExecutadosResponse[] = [];
    pagamentosFilialContrato: ValoresExecutadosResponse[] = [];
    pagamentosRubricaContrato: ValoresExecutadosResponse[] = [];

    constructor(private apiService: ApiService,
        private token: TokenStorageService) { }

    ngOnInit() {
        this.obterPermissoes();
        this.obterValores();
    }

    obterPermissoes() {
        this.permissions = this.token.getActionPolicies(ModuleEnum.Contratos);
    }

    filterItem(value: string) {
        if (!value) {
            this.listaValoresExecutados = this.valorExecutado;
        } else {
            const lowerCaseValue = value.toLowerCase();
            this.listaValoresExecutados = this.valorExecutado?.filter(item => {
                return (item.ano && item.ano.toString().includes(value)) ||
                    (item.contrato && item.contrato.toLowerCase().includes(lowerCaseValue)) ||
                    (item.objeto && item.objeto.toLowerCase().includes(value.toLowerCase())) ||
                    (item.gn && item.gn.toLowerCase().includes(lowerCaseValue)) ||
                    (item.vrTotalExecutado && item.vrTotalExecutado.toString().includes(value)) ||
                    (item.vrTotalPrevisto && item.vrTotalPrevisto.toString().includes(value));
            });
        }
    }

    exportExcel() {

        const dadosFiltrados = this.listaValoresExecutados.map(item => {
            return {
                Ano: item.ano,
                Contrato: item.contrato,
                GN: item.gn,
                Objeto: item.objeto,
                "Total Executado": item.vrTotalExecutado,
                "Total Previsto": item.vrTotalPrevisto
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

    public async obterValores() {
        try {
            const response = await this.apiService.get<
                ApiResponse<ValoresExecutadosResponse[]>
            >(`${Endpoints.URL_VALOR_EXECUTADO}/obter-todos`);
            this.valorExecutado = response.data;
            this.listaValoresExecutados = response.data;
        } catch (error) {
            console.error(error, 'obterValores');
        }
    }

    async detalharRubrica(registro: ValoresExecutadosResponse) {
        try {
            registro.expanded = !registro.expanded;
            if (registro.expanded && !registro.detalhes) {
                const response = await this.apiService.get<
                    ApiResponse<ValoresExecutadosResponse[]>
                >(`${Endpoints.URL_VALOR_EXECUTADO}/obter-pagamentos-filial-contrato?coContrato=` + registro.contrato + `&gn=` + registro.gn)
                registro.detalhes = response.data;
            }
        } catch (error) {
            console.error(error, 'detalharRubrica');
        }
    }

    async detalharPagamento(registro: ValoresExecutadosResponse, detalhe: any) { 
        console.log(registro)
        console.log(detalhe)
        try { 
            if (!detalhe.segundoNivel) { 
                detalhe.segundoNivel = {}; 
            } 
            detalhe.expanded = !detalhe.expanded; 
            if (detalhe.expanded && !detalhe.segundoNivel.data) { 
                const response = await 
                this.apiService.get<ApiResponse<ValoresExecutadosResponse[]>>
                (`${Endpoints.URL_VALOR_EXECUTADO}/obter-pagamentos-rubrica-contrato?coContrato=${registro.contrato}&rubrica=${detalhe.coRubrica}&gn=${registro.gn}`);
                detalhe.segundoNivel.data = response.data; 
            } 
        } 
        catch (error) { 
            console.error(error, 'detalharPagamento'); 
        } 
    }
}