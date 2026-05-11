import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiResponse } from 'src/app/models/generics/api-response';
import { ValoresRubricaResponse } from 'src/app/models/generics/rubrica';
import { ApiService } from 'src/app/shared/services/api.service';
import {
  ActionPolicies,
  ModuleEnum,
  TokenStorageService,
} from 'src/app/shared/services/token-storage.service';
import { Endpoints } from 'src/app/models/enums/endpoints';
import { ValoresRubricaDetalhadoComponent } from '../valores-rubrica-detalhado/valores-rubrica-detalhado.component';

@Component({
  selector: 'app-valores-rubrica',
  templateUrl: './valores-rubrica.component.html',
  styleUrls: ['./valores-rubrica.component.scss'],
})
export class ValoresRubricaComponent implements OnInit {
  @Input() public nuRubricaTipo: number;
  @Input() public nuFilial: number;
  @Input() public noFilial;
  @Input() public nuAno: number;

  permissions: ActionPolicies;

  title: string = '';
  subTitle: string = '';

  listaValoresRubrica: ValoresRubricaResponse[];
  totalRubrica: number = 0;

  constructor(
    private modalService: NgbModal,
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
    this.subTitle = `Valor Executado por Rubrica - ${this.nuRubricaTipo === 1 ? 'Custeio' : 'Investimento'
      }`;
    this.obterValoresRubrica();
  }

  public async obterValoresRubrica(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<ValoresRubricaResponse[]>>(
        `${Endpoints.URL_DASHBOARD}/orcamento-filial-detalhe?nuFilial=${this.nuFilial}&rubricaTipo=${this.nuRubricaTipo === 1 ? 'Custeio' : 'Investimento'}`
      );
      this.listaValoresRubrica = response.data;
      this.totalRubrica = this.listaValoresRubrica.reduce(
        (a, b) => a + b.vR_EXECUTADO,
        0
      );
    } catch (error) {
      console.error(error);
    }
  }

  public obterValoresRubricaExcel() {
    return this.apiService.downloadfile(
      `${Endpoints.URL_DASHBOARD}/excel/${this.nuAno}/${this.nuRubricaTipo}/${this.nuFilial}`
    );
    //return await this.apiService.get(`${Endpoints.URL_DASHBOARD}/${this.nuAno}/${this.nuRubricaTipo}/${this.nuFilial}/excel`,{responseType: 'blob'});
  }

  openModalRubricaContrato(nuRubrica: number, coRubrica: string) {
    const modalRef = this.modalService.open(ValoresRubricaDetalhadoComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      windowClass: 'custom-class',
    });

    modalRef.componentInstance.nuRubricaTipo = this.nuRubricaTipo;
    modalRef.componentInstance.nuFilial = this.nuFilial;
    modalRef.componentInstance.noFilial = this.noFilial;
    modalRef.componentInstance.nuAno = this.nuAno;
    modalRef.componentInstance.nuRubrica = nuRubrica;
    modalRef.componentInstance.coRubrica = coRubrica;
  }
}
