import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse } from 'src/app/models/generics/api-response';
import { Gcpvw54VisaoDashboardPlanejamentoOrcamentario } from 'src/app/models/generics/Gcpvw54VisaoDashboardPlanejamentoOrcamentario';
import { ApiService } from 'src/app/shared/services/api.service';
import { TokenStorageService } from 'src/app/shared/services/token-storage.service';

@Component({
  selector: 'app-planejamento-geral-v2',
  templateUrl: './planejamento-geral-v2.component.html',
  styleUrls: ['./planejamento-geral-v2.component.scss']
})
export class PlanejamentoGeralV2Component implements OnInit {


  public dadosDashboard : Gcpvw54VisaoDashboardPlanejamentoOrcamentario[] = [];
  public isUltimaReprogramacao: boolean = false;
  public anoExercicio: number;
  public ordemTipoExercicio: number;
  public statusExercio: number;
  public nuPlanejamentoExercicio: number;

  constructor(
    private apiService: ApiService,
    private modalService: NgbModal,
    public token: TokenStorageService,
    private toastr: ToastrService,
    private route : ActivatedRoute
  ) {}


  async ngOnInit(): Promise<void> {

     this.route.queryParams.subscribe(params => {
     this.isUltimaReprogramacao = params['isUltimaReprogramacao'] === 'true';
     this.anoExercicio = Number(params['coExercicio']) || 0;
     this.ordemTipoExercicio = Number(params['tipo']) || 0;
     this.statusExercio = params['statusPlanejamento'] ?? '';
     this.nuPlanejamentoExercicio = Number(params['nuPlanejamento']) || 0;
    });

    await this.obterdadosDashboard();

  }


    public async obterdadosDashboard(): Promise<void>{

    try {
      const response = await this.apiService.get<ApiResponse<Gcpvw54VisaoDashboardPlanejamentoOrcamentario[]>>
        (`v1/PlanejamentoOrcamentarioV/dashboard`, {nuPlanejamento:  this.nuPlanejamentoExercicio});
      this.dadosDashboard = response?.data;

    if (!response?.succeeded) {
        console.error('Erro da API:', response?.errors);
        this.dadosDashboard = [];
        return;
      }

      this.dadosDashboard = response.data ?? [];
    } catch (error) {
      console.error('Erro ao consumir API', error);
      this.dadosDashboard = [];
    }
  }

}
