import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiResponse } from 'src/app/models/api-response';
import { ValoresRubricaDetalheResponse } from 'src/app/models/rubrica';
import { ApiService } from 'src/app/services/api.service';
import { ActionPolicies, ModuleEnum, TokenStorageService } from 'src/app/services/token-storage.service';
import { Endpoints } from 'src/app/shared/enums/endpoints';
import { ValoresRubricaDetalhadoContratoComponent } from '../valores-rubrica-detalhado-contrato/valores-rubrica-detalhado-contrato.component';

@Component({
  selector: 'app-valores-rubrica-detalhado',
  templateUrl: './valores-rubrica-detalhado.component.html',
  styleUrls: ['./valores-rubrica-detalhado.component.scss']
})
export class ValoresRubricaDetalhadoComponent implements OnInit {

  @Input() public nuRubricaTipo: number;
  @Input() public nuFilial: number;
  @Input() public noFilial;
  @Input() public nuAno: number;
  @Input() public nuRubrica: number;
  @Input() public coRubrica: string;

  permissions: ActionPolicies;

  title: string = "";
  subTitle: string = "";

  listaValoresRubricaContrato: ValoresRubricaDetalheResponse[];
  totalRubrica: number = 0;

  constructor(
    private _modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private apiService: ApiService,
    public token: TokenStorageService,
  ) {
    this.obterPermissoes();
  }

  obterPermissoes() {
    this.permissions = this.token.getActionPolicies(ModuleEnum.Dashboard);
  }

  ngOnInit(): void {
    this.title = this.noFilial;
    this.subTitle = `Valor Executado por Rubrica - ${this.nuRubricaTipo === 1 ? 'Custeio' : 'Investimento'}`;
    this.obterValoresRubrica();
  }

  public async obterValoresRubrica(): Promise<void> {
    try {

      const response = await this.apiService.get<
        ApiResponse<ValoresRubricaDetalheResponse[]>
      >(`${Endpoints.URL_DASHBOARD}/orcamento-rubrica-detalhe?nuFilial=${this.nuFilial}&coRubrica=${this.coRubrica}`);
      this.listaValoresRubricaContrato = response.data;

    } catch (error) {
      console.error(error);
    }
  }

  public obterValoresRubricaExcel() {
    return this.apiService.downloadfile(`${Endpoints.URL_DASHBOARD}/excel/${this.nuAno}/${this.nuRubricaTipo}/${this.nuFilial}/${this.nuRubrica}`);
    //return await this.apiService.get(`${Endpoints.URL_DASHBOARD}/${this.nuAno}/${this.nuRubricaTipo}/${this.nuFilial}/excel`,{responseType: 'blob'});
  }

  openModalRubricaDetalhadoContrato(nuRubrica: number, nuContrato: number) {
    //this.obterValoresPorRubrica(2021,1,1,11, 'geauss');
    const modalRef = this._modalService.open(ValoresRubricaDetalhadoContratoComponent, { ariaLabelledBy: 'modal-basic-title', windowClass: 'modal-dialog-xl' });

    modalRef.componentInstance.nuRubricaTipo = this.nuRubricaTipo;
    modalRef.componentInstance.nuFilial = this.nuFilial;
    modalRef.componentInstance.noFilial = this.noFilial;
    modalRef.componentInstance.nuAno = this.nuAno;
    modalRef.componentInstance.nuRubrica = nuRubrica;
    modalRef.componentInstance.nuContrato = nuContrato;
  }
}
