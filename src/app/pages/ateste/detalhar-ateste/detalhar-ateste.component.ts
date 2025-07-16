import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiResponse } from 'src/app/models/api-response';
import { ContratoResponse, ContratoResponseV2 } from 'src/app/models/contrato-response';
import { ApiService } from 'src/app/services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Endpoints } from 'src/app/shared/enums/endpoints';
import { RegistrarAtesteComponent } from '../registrar-ateste/registrar-ateste.component';

@Component({
  selector: 'app-detalhar-ateste',
  templateUrl: './detalhar-ateste.component.html',
  styleUrls: ['./detalhar-ateste.component.scss']
})
export class DetalharAtesteComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
     private apiService: ApiService,
     private modalService: NgbModal,
  ) { }

  public nuContrato : string;
  public contratos : any[] = [{
    id: '1000',
    code: 'f230fh0g3',
    name: 'Bamboo Watch',
    description: 'Product Description',
    image: 'bamboo-watch.jpg',
    price: 65,
    category: 'Accessories',
    quantity: 24,
    inventoryStatus: 'INSTOCK',
    rating: 5
}];
  public ContratoV2: ContratoResponseV2;
  public Contrato: ContratoResponse;
  
  ngOnInit(): void {

    this.nuContrato = this.route.snapshot.paramMap.get('id');
    console.log(this.nuContrato, "nuContrato")
    this.obterContrato();

    // criar endpoint para carregar dados do contrato
  }

    public async obterContrato(): Promise<void> {
      try {
 
        const responseV2 = await this.apiService.get<ApiResponse<ContratoResponseV2>>(
          `${Endpoints.URL_CONTRATOS}/detalhe-contrato?nuContrato=` + this.nuContrato
        );

        const response = await this.apiService.get<ApiResponse<ContratoResponse>>(
          `${Endpoints.URL_CONTRATOS}/` + this.nuContrato
        );
        this.Contrato = response.data;
        this.ContratoV2 = responseV2.data;
     
      } catch (error) {
        console.error(error, 'obterContrato');
        //this.loading = true;
      }
    }

    somaVigencias(vigencias: any[]): number{
      let vrGlobalTotal = 0;
  
      vigencias.forEach(element => {
        vrGlobalTotal += element.vrGlobal
      });
      return vrGlobalTotal
    }

    openModalRegistrarAteste() {
        const modalRef = this.modalService.open(RegistrarAtesteComponent, {
          ariaLabelledBy: 'modal-basic-title',
          size: 'lg',
          windowClass: 'modal-xl',
          backdrop: 'static',
          keyboard: false,
        });
        // modalRef.componentInstance.nuContrato = nuContrato;
    
        // modalRef.componentInstance.atualizarPagina.subscribe((data: boolean) => {
        //   if (data) {
        //     this.obterContrato();
        //   }
        // });
      }
    
}
