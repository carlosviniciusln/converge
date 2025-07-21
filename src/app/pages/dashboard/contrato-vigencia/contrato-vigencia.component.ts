import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiResponse } from 'src/app/models/api-response';
import { ContratoVigencia } from 'src/app/models/contratoVigencia';
import { ApiService } from 'src/app/services/api.service';
import {
  ActionPolicies,
  ModuleEnum,
  TokenStorageService,
} from 'src/app/services/token-storage.service';
import { Endpoints } from 'src/app/shared/enums/endpoints';

@Component({
  selector: 'app-contrato-vigencia',
  templateUrl: './contrato-vigencia.component.html',
  styleUrls: ['./contrato-vigencia.component.scss'],
})
export class ContratoVigenciaComponent implements OnInit {
  @Input() public nuFilial: number;
  @Input() public coContrato: string;
  @Input() public noFilial;
  @Input() public nuDiasInicio: number | null;
  @Input() public nuDiasFim: number | null;
  @Input() public icSemSaldo: boolean | null;
  @Input() public tipo?: string;

  permissions: ActionPolicies;

  expandedRows = {};

  title: string = '';
  subTitle: string = '';
  loading: boolean = true;

  listaContratosVigenciaOrigem: ContratoVigencia[];

  listaContratosVigencia: ContratoVigencia[];

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

  ngOnInit() {
    this.title = this.noFilial;
    this.obterContratosVigencias();
  }

  public async obterContratosVigencias(): Promise<void> {
    try {
      this.listaContratosVigencia = null;
      this.loading = true;

      const response = await this.apiService.get<
        ApiResponse<ContratoVigencia[]>
      >(
        `${Endpoints.URL_DASHBOARD_EXECUCAO_DETALHE}?id=${this.nuFilial}&tipo=${this.tipo}`
      );

      this.listaContratosVigenciaOrigem = response.data.filter(
        (f) => !f.icArtigo81
      );

      this.assignCopy();

      const thisRef = this;

      this.listaContratosVigencia.forEach(function (i) {
        thisRef.expandedRows[i.coContrato] = false;
      });

      this.expandedRows = Object.assign({}, this.expandedRows);

      this.loading = false;
    } catch (error) {
      this.loading = false;
    }
  }

  public obterContratosVigenciasExcel() {
    return this.apiService.downloadfile(
      `${Endpoints.URL_CONTRATOS}/vigencias/excel/${this.nuFilial}/${this.nuDiasInicio}/${this.nuDiasFim}/${this.icSemSaldo}`
    );
  }

  public quantitativoContratos() {
    return this.listaContratosVigencia.length
  }

  assignCopy() {
    this.listaContratosVigencia = Object.assign(
      [],
      this.listaContratosVigenciaOrigem
    );
  }

  filterItem(value) {
    if (!value) {
      this.assignCopy();
    } // when nothing has typed
    this.listaContratosVigencia = Object.assign(
      [],
      this.listaContratosVigenciaOrigem
    ).filter(
      (item) =>
        item.cO_CONTRATO.toLowerCase().indexOf(value.toLowerCase()) > -1 ||
        item.nO_EMPRESA.toLowerCase().indexOf(value.toLowerCase()) > -1 ||
        item.sG_FILIAL.toLowerCase().indexOf(value.toLowerCase()) > -1
    );
  }


  defineEndDate(row: any): string {
    if(row.dT_TERMINO_PRORROGACAO && row.dT_TERMINO_PRORROGACAO != "0001-01-01T00:00:00"){
        return row.dT_TERMINO_PRORROGACAO
      }
      return row.dT_TERMINO
    }
}
