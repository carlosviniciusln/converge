import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiResponse } from 'src/app/models/api-response';
import { ValoresRubricaDetalheContrato } from 'src/app/models/rubrica';
import { ApiService } from 'src/app/services/api.service';
import {
  ActionPolicies,
  ModuleEnum,
  TokenStorageService,
} from 'src/app/services/token-storage.service';
import { Endpoints } from 'src/app/shared/enums/endpoints';

@Component({
  selector: 'app-valores-rubrica-detalhado-contrato',
  templateUrl: './valores-rubrica-detalhado-contrato.component.html',
  styleUrls: ['./valores-rubrica-detalhado-contrato.component.scss'],
})
export class ValoresRubricaDetalhadoContratoComponent implements OnInit {
  @Input() public nuRubricaTipo: number;
  @Input() public nuFilial: number;
  @Input() public noFilial;
  @Input() public nuAno: number;
  @Input() public nuRubrica: number;
  @Input() public nuContrato: number;

  permissions: ActionPolicies;

  title: string = '';
  subTitle: string = '';

  listaValoresRubricaContrato: ValoresRubricaDetalheContrato[];
  totalRubrica: number = 0;

  constructor(
    private _modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private apiService: ApiService,
    public token: TokenStorageService
  ) {
    this.obterPermissoes();
  }

  obterPermissoes() {
    this.permissions = this.token.getActionPolicies(ModuleEnum.Dashboard);
  }

  ngOnInit(): void {
    this.title = this.noFilial;
    this.subTitle = `Valor Executado por Rubrica/Contrato - ${
      this.nuRubricaTipo === 1 ? 'Custeio' : 'Investimento'
    }`;
    this.obterValoresRubricaDetalheContrato();
  }

  public async obterValoresRubricaDetalheContrato(): Promise<void> {
    try {
      const response = await this.apiService.get<
        ApiResponse<ValoresRubricaDetalheContrato[]>
      >(
        `${Endpoints.URL_DASHBOARD}/${this.nuAno}/${this.nuRubricaTipo}/${this.nuFilial}/${this.nuRubrica}/${this.nuContrato}`
      );
      this.listaValoresRubricaContrato = response.data;
    } catch (error) {
      console.error(error);
    }
  }

  public obterValoresRubricaDetalheContratoExcel() {
    return this.apiService.downloadfile(
      `${Endpoints.URL_DASHBOARD}/excel/${this.nuAno}/${this.nuRubricaTipo}/${this.nuFilial}/${this.nuRubrica}/${this.nuContrato}`
    );
    //return await this.apiService.get(`${Endpoints.URL_DASHBOARD}/${this.nuAno}/${this.nuRubricaTipo}/${this.nuFilial}/excel`,{responseType: 'blob'});
  }

  // openModalRubricaContrato(nuRubrica: number){
  //   //this.obterValoresPorRubrica(2021,1,1,11, 'geauss');
  //   const modalRef = this.modalService.open(ValoresRubricaDetalhadoComponent, {ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'custom-class'});

  //   modalRef.componentInstance.nuRubricaTipo = this.nuRubricaTipo;
  //   modalRef.componentInstance.nuFilial = this.nuFilial;
  //   modalRef.componentInstance.noFilial = this.noFilial;
  //   modalRef.componentInstance.nuAno = this.nuAno;
  //   modalRef.componentInstance.nuRubrica = nuRubrica;
  // }
}
