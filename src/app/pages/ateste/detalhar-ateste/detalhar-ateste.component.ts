import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiResponse } from 'src/app/models/api-response';
import { ContratoResponse, ContratoResponseV2 } from 'src/app/models/contrato-response';
import { ApiService } from 'src/app/services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Endpoints } from 'src/app/shared/enums/endpoints';
import { RegistrarAtesteComponent } from '../registrar-ateste/registrar-ateste.component';
import { Gcpvw030ObterDetalhesPorContratoResponse } from 'src/app/models/Gcpvw030ObterDetalhesPorContratoResponse';

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
  public ContratoV2: ContratoResponseV2;
  public DetalheExecutadoContrato: Gcpvw030ObterDetalhesPorContratoResponse;
  public DetalheContrato : any[]
  
  ngOnInit(): void {

    this.nuContrato = this.route.snapshot.paramMap.get('id');
    this.obterContrato();
    this.ObterDetalhesExecutadoContrato();
  }

    public async obterContrato(): Promise<void> {
      try {
 
        const responseV2 = await this.apiService.get<ApiResponse<ContratoResponseV2>>(
          `${Endpoints.URL_CONTRATOS}/detalhe-contrato?nuContrato=` + this.nuContrato
        );

        this.ContratoV2 = responseV2.data;
     
      } catch (error) {
        console.error(error, 'obterContrato');
      }
    }

    public async ObterDetalhesExecutadoContrato() : Promise<void>{
      try {
      const response = await this.apiService.get<ApiResponse<Gcpvw030ObterDetalhesPorContratoResponse>>(
        `${Endpoints.URL_CONTRATOS}/detalhe-executado-contrato?nuContrato=` + this.nuContrato
      );
        this.DetalheContrato = [{
          nuContrato: response.data.contrato.nuContrato,
          coContrato: response.data.contrato.coContrato,
          noObjeto: response.data.contrato.noObjeto,
          noEmpresa: response.data.contrato.noEmpresa,
          nuVigencia: response.data.contrato.nuVigencia,
          deCompetencia: response.data.contrato.dtProximaCompetencia,
          inicioVigencia: response.data.contrato.inicioVigencia,
          fimVigencia: response.data.contrato.fimVigencia,
          dtProximaCompetencia: response.data.contrato.dtProximaCompetencia,
          dtFimPeriodoCompetencia: response.data.contrato.dtFimPeriodoCompetencia,
          dtInicioPeriodoCompetencia: response.data.contrato.dtIniPeriodoCompetencia,
          totalContrato: response.data.contrato.totalContrato,
          vrExecutado: response.data.contrato.vrExecutado,
          vrSaldo: response.data.contrato.vrSaldo
        }]

      this.DetalheExecutadoContrato = response.data;

      } catch (error) {
      console.error(error, 'obterContrato');
  
    }
  }

    openModalRegistrarAteste() {
        const modalRef = this.modalService.open(RegistrarAtesteComponent, {
          ariaLabelledBy: 'modal-basic-title',
          size: 'lg',
          windowClass: 'modal-xl',
          backdrop: 'static',
          keyboard: false,
        });

        modalRef.componentInstance.contrato = this.DetalheContrato;
    
        // modalRef.componentInstance.atualizarPagina.subscribe((data: boolean) => {
        //   if (data) {
        //     this.obterContrato();
        //   }
        // });
      }
    
}
