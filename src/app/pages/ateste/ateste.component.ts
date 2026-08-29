import { Component, OnInit } from '@angular/core';
import { Select2Data } from 'ng-select2-component';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse } from 'src/app/models/generics/api-response';
import { Gcpvw030AtesteResponse, Gcpvw030DetalhamentoDeContratosResponse } from 'src/app/models/generics/Gcpvw030AtesteResponse';
import { ApiService } from 'src/app/shared/services/api.service';
import { Endpoints } from 'src/app/models/enums/endpoints';



@Component({
  selector: 'app-ateste',
  templateUrl: './ateste.component.html',
  styleUrls: ['./ateste.component.scss']
})
export class AtesteComponent implements OnInit {

  constructor(
       private apiService: ApiService,
       private toastr: ToastrService,
  ) { }


    /* VARIAVEIS E PROPRIEDADES  */


    public listaGcpvw030Ateste: Gcpvw030DetalhamentoDeContratosResponse[] = [];
    public selectTiposContrato: Select2Data = [];
    public selectTiposFornecedor: Select2Data = [];
    public sgFilial : string;
    public totalRecords: number;

    selectedTipoContrato: string = null;
    selectedTipoFornecedor: string = null;
    loading: boolean = true;

    filtroRegistros: any = {
      pageNumber: 1,
      pageSize: 10,
      Contrato: null,
      Fornecedor: null
    };

  /* MÉTODOS HERDADOS  */
  ngOnInit(): void {
    this.obterContratosPorFilial();
  }


  /* MÉTODOS AUXILIARES */

  loadPage(event: any) {
    const page = (event.first || 0) / (event.rows || this.filtroRegistros.pageSize) + 1;
    const pageSize = event.rows || this.filtroRegistros.pageSize;

    if (page !== this.filtroRegistros.pageNumber || pageSize !== this.filtroRegistros.pageSize) {
      this.filtroRegistros.pageNumber = page;
      this.filtroRegistros.pageSize = pageSize;
      this.obterContratosPorFilial();
    }
  }

  navegarParaDetalhes(nuContrato: number) {
    const url = `/#/ateste/contrato/${nuContrato}`
    window.open(url, '_blank');
  }


    public async obterContratosPorFilial(): Promise<void> {
      try {

        const filtrosLimpos = this.limparFiltrosNulos(this.filtroRegistros);
        const response = await this.apiService.get<ApiResponse<Gcpvw030AtesteResponse>>(
          `${Endpoints.URL_CONTRATOS}/contratos-filiais`,filtrosLimpos
        );


        if(response.data.totalRecords > 0){
          this.sgFilial = response.data?.contratos[0].sgFilial;
          this.listaGcpvw030Ateste = response.data.contratos || [];
          this.selectTiposContrato = response.data.listaContratos.map(x => ({label: x, value: x}));
          this.selectTiposFornecedor = response.data.listaFornecedor.map(x => ({label: x, value: x}));
          this.totalRecords = response.data.totalRecords;
        }else{
          this.toastr.info('Usuário logado não possui contratos', 'Info');
        }

      } catch (error) {
        console.error(error, 'obter GCPVW0030');
      } finally {
        this.loading = false;
      }
    }

    async updateRelatorio(e, op: number): Promise<void> {
      this.loading = true;
      this.filtroRegistros.pageNumber = 1;
      switch (op) {
        case 1:
          this.filtroRegistros.Contrato = e.value;
          break;
        case 2:
          this.filtroRegistros.Fornecedor = e.value;
          break;
      }
      await this.obterContratosPorFilial();
      this.loading = false;
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
