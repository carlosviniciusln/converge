import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { ApiResponse } from 'src/app/models/api-response';
import { ContratoApiResponse, ContratoItem, Gcptb001ContratoResponse } from 'src/app/models/Gcptb001ContratoResponse';
import { ApiService } from 'src/app/services/api.service';
import {  TokenStorageService } from 'src/app/services/token-storage.service';
import { Endpoints } from 'src/app/shared/enums/endpoints';

@Component({
  selector: 'app-novos-contratos',
  templateUrl: './novos-contratos.component.html',
  styleUrls: ['./novos-contratos.component.scss'],
})
export class NovosContratosComponent implements OnInit {
  @Input() public contratos: ContratoItem[];
  @Input() public quantidadeTotal: number;
  selectedContratos: Gcptb001ContratoResponse[];
  loading: boolean = false;
  filtroRegistros: any = {
    pageNumber: 1,
    pageSize: 5,
    Contrato: null,
    Fornecedor: null,
    Tipo: null,
    Gestor: null,
    Status: null,
    NoTipoArp: null
  };
  constructor(
    private apiService: ApiService,
    public activeModal: NgbActiveModal,
    public token: TokenStorageService
  ) {
  }

  ngOnInit(): void {
  }

  navegarParaDetalhes(nuContrato: number) {
    const url = `/#/contrato/detalhe/v/${nuContrato}`
    window.open(url, '_blank');
  }

  loadPage(event: LazyLoadEvent) {
    const page = (event.first || 0) / (event.rows || this.filtroRegistros.pageSize) + 1;
    const pageSize = event.rows || this.filtroRegistros.pageSize;

    if (page !== this.filtroRegistros.pageNumber || pageSize !== this.filtroRegistros.pageSize) {
      this.filtroRegistros.pageNumber = page;
      this.filtroRegistros.pageSize = pageSize;
      this.obterContratos();
    }
  }

  public async obterContratos(): Promise<void> {
    try {
      const filtrosLimpos = this.limparFiltrosNulos(this.filtroRegistros);

      const response = await this.apiService.get<ApiResponse<ContratoApiResponse>>
        (`${Endpoints.URL_CONTRATOS}/novos-contratos`, filtrosLimpos);

        this.contratos = response?.data?.contratos;

      this.loading = false;
    } catch (error) {
      this.loading = false;
      console.error('Erro ao obter contratos', error);
    }
  }

  private limparFiltrosNulos(filtros: any): any {
    const filtrosLimpos: any = {};
    Object.keys(filtros).forEach((key) => {
      if (filtros[key] !== null && filtros[key] !== undefined && filtros[key] !== '') {
        filtrosLimpos[key] = filtros[key];
      }
    });
    return filtrosLimpos;
  }
}
