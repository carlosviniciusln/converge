import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ApiService } from 'src/app/services/api.service';
import { ApiResponse } from 'src/app/models/api-response';
import { PagamentoPendenteResponse } from 'src/app/models/Gcptb001ContratoResponse';
import { Endpoints } from 'src/app/shared/enums/endpoints';
import * as fileSaver from 'file-saver';
import { ActionPolicies, ModuleEnum, TokenStorageService } from 'src/app/services/token-storage.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditarPagamentoComponent } from './editar-pagamento/editar-pagamento.component';

@Component({
    selector: 'app-contrato-pendente',
    templateUrl: './contrato-pendente.component.html',
    styleUrls: ['./contrato-pendente.component.scss'],
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
export class ContratoPendenteComponent implements OnInit {
    permissions: ActionPolicies;
    filteredPagamentosPendentes: PagamentoPendenteResponse[];
    pagamentoPendente: PagamentoPendenteResponse[];

    currentUser: any;

    constructor(
        private apiService: ApiService,
        private token: TokenStorageService,
        private modalService: NgbModal,
    ) {
        this.currentUser = this.token.getUser();
    }

    ngOnInit() {
        this.obterPermissoes();
        this.obterContratosPendentes();
    }
    obterPermissoes() {
        this.permissions = this.token.getActionPolicies(ModuleEnum.Contratos);
    }

    public async obterContratosPendentes(): Promise<void> {
        try {
            const response = await this.apiService.get<
                ApiResponse<PagamentoPendenteResponse[]>
            >(`${Endpoints.URL_CONTRATOS_PENDENTES}/obter-todos`);

            this.pagamentoPendente = response.data;
            this.filteredPagamentosPendentes = response.data;
        } catch (error) {
            console.error(error, 'aquirsd');
            //this.loading = true;
        }
    }

    openModalPendente(detalhesContrato: PagamentoPendenteResponse) {
        const modalRef = this.modalService.open(EditarPagamentoComponent, {
            ariaLabelledBy: 'modal-basic-title',
            size: 'lg',
            windowClass: 'custom-class',
            backdrop: 'static',
            keyboard: false,
        });
        modalRef.componentInstance.contrato = detalhesContrato;
        modalRef.componentInstance.isConciliacao = true;

        modalRef.componentInstance.atualizarPagina.subscribe((data: boolean) => {
            if (data) {
                this.obterContratosPendentes();
            }
        });
    }


    filterItem(value: string) {
        if (!value) {
            this.filteredPagamentosPendentes = this.pagamentoPendente;
        } else {
            const lowerCaseValue = value.toLowerCase();
            this.filteredPagamentosPendentes = this.pagamentoPendente.filter(item => {
                return (item.nU_CONTRATO && item.nU_CONTRATO.toString().includes(value)) ||
                    (item.cO_CONTRATO && item.cO_CONTRATO.toLowerCase().includes(lowerCaseValue)) ||
                    (item.nU_PEDIDO && item.nU_PEDIDO.toString().includes(value.toLowerCase())) ||
                    (item.dT_LANCAMENTO && item.dT_LANCAMENTO.toString().includes(lowerCaseValue)) ||
                    (item.cO_MATRICULA && item.cO_MATRICULA.toLowerCase().includes(value)) ||
                    (item.montante && item.montante.toString().includes(value)) ||
                    (item.miro && item.miro.toString().includes(value)) ||
                    (item.nU_ATESTE && item.nU_ATESTE.toString().toLowerCase().includes(value)) ||
                    (item.competencia && item.competencia.toString().toLowerCase().includes(value))
            });
        }
    }

    exportExcel() {
        import("xlsx").then(xlsx => {
            const worksheet = xlsx.utils.json_to_sheet(this.filteredPagamentosPendentes);
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
}
