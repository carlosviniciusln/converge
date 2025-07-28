import { Component, OnInit } from '@angular/core';
import { ApiResponse } from 'src/app/models/api-response';
import { Gcpvw030DetahamentoDeContratosResponse } from 'src/app/models/Gcpvw030AtesteResponse';
import { ApiService } from 'src/app/services/api.service';
import { Endpoints } from 'src/app/shared/enums/endpoints';



@Component({
  selector: 'app-ateste',
  templateUrl: './ateste.component.html',
  styleUrls: ['./ateste.component.scss']
})
export class AtesteComponent implements OnInit {

  constructor(
       private apiService: ApiService,
  ) { }


    /* VARIAVEIS E PROPRIEDADES  */

   
    loading: boolean = true;


    public listaGcpvw030Ateste : Gcpvw030DetahamentoDeContratosResponse[];

    filtroRegistros: any = {
      pageNumber: 1,
      pageSize: 10,
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
      // this.obterContratos();
    }
  }

  navegarParaDetalhes(nuContrato: number) {
    const url = `/#/ateste/contrato/${nuContrato}`
    window.open(url, '_blank');
  }

  
    public async obterContratosPorFilial(): Promise<void> {
      try {
        const response = await this.apiService.get<ApiResponse<Gcpvw030DetahamentoDeContratosResponse[]>>(
          `${Endpoints.URL_ATESTE}/contratos-filiais`
        );

        console.log("lista backend", response)

        this.listaGcpvw030Ateste = response.data || [];
        this.loading = false;
      } catch (error) {
        console.error(error, 'obter GCPVW0030');

      }
    }

}
