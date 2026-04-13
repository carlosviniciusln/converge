import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';
import { ApiResponse } from 'src/app/models/generics/api-response';
import {
  DashboardOrcamentoExecucaoContratualResponse
} from 'src/app/models/DTOs/dashboard-orcamento-execucao-contratual.dto';

@Component({
  selector: 'app-dashboard-v2',
  templateUrl: './dashboard-v2.component.html',
  styleUrls: ['./dashboard-v2.component.scss']
})
export class DashboardV2Component implements OnInit {


  public dadosDashboardOrcamentoExecucaoContratual: DashboardOrcamentoExecucaoContratualResponse | null = null;
  public loading = true;
  public selectedContrato: number | null = null;
  public anoExercicio = new Date().getFullYear();
  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    console.log('[DEBUG] DashboardV2Component init, currentUrl=', this.router.url);
    try {
      const url = this.router.url || window.location.hash || '';
      if (url.includes('/dashboard') || url.includes('#/dashboard') || url === '' || url === '/') {
        this.loadAll();
      } else {
        console.log('[DEBUG] DashboardV2Component skipping loadAll because current route is', url);
      }
    } catch (e) {
      console.warn('Error checking route in DashboardV2Component.ngOnInit', e);
      this.loadAll();
    }
  }

  /**
   * Called when the user opens the contratos dropdown. If contratos aren't loaded yet,
   * fetch them and show a loading indicator while the request runs.
   */

  async loadAll() {
    this.loading = true;
    try {
      await Promise.all([
        this.getOrcamentoExecucaoContratual()
        // this.getAtualizacao()
      ]);
    } catch (err) {
      console.error('Erro ao carregar dashboard-v2', err);
    } finally {
      this.loading = false;
    }
  }



  async getOrcamentoExecucaoContratual() {

    try{

      const response = await this.apiService.get<ApiResponse<DashboardOrcamentoExecucaoContratualResponse>>(`v1/dashboard/orcamento-execucao-contratual`);

      if(!response?.data){
          console.error('Erro ao carregar dados de orçamento e execução contratual');
           this.dadosDashboardOrcamentoExecucaoContratual = [] as any;
           return;
      }

      this.dadosDashboardOrcamentoExecucaoContratual = response.data
      this.dadosDashboardOrcamentoExecucaoContratual.contratosDropdown = Object.entries(this.dadosDashboardOrcamentoExecucaoContratual.contratos)
      .map(([nuContrato, codigo]) => ({
      label: codigo,
      value: Number(nuContrato)
      }));

      this.anoExercicio = this.dadosDashboardOrcamentoExecucaoContratual.dhUltimaAtualizacao ? new Date(this.dadosDashboardOrcamentoExecucaoContratual.dhUltimaAtualizacao).getFullYear() : new Date().getFullYear();

    }

    catch(e){
    console.error('Erro ao carregar dados de orçamento e execução contratual', e);
    this.dadosDashboardOrcamentoExecucaoContratual = [] as any;
  }
}

  goToContratoFromDropdown(e: any) {
    const id = e?.value;
    if (id) {
      const url = `${window.location.origin}/#/contrato/evolucao-financeira/${id}`;
      window.open(url, '_blank');
    }
  }

}
