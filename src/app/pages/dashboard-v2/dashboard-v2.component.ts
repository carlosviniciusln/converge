import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';
import { ApiResponse } from 'src/app/models/generics/api-response';
import {
  DashboardOrcamentoExecucaoContratualResponse
} from 'src/app/models/DTOs/dashboard-orcamento-execucao-contratual.dto';
import { ContratoApiResponse, ContratoItem } from 'src/app/models/generics/Gcptb001ContratoResponse';
import { ModuleEnum, PerfisEnum, TokenStorageService } from 'src/app/shared/services/token-storage.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NovosContratosComponent } from '../dashboard/novos-contratos/novos-contratos.component';

@Component({
  selector: 'app-dashboard-v2',
  templateUrl: './dashboard-v2.component.html',
  styleUrls: ['./dashboard-v2.component.scss']
})
export class DashboardV2Component implements OnInit {


  public dadosDashboardOrcamentoExecucaoContratual: DashboardOrcamentoExecucaoContratualResponse | null = null;
  public loading = true;
  public selectedContrato: number | null = null;
  public contratosOrigem: ContratoItem[];
  public anoExercicio: number = new Date().getFullYear();
  public currentProfile: PerfisEnum;
  public quantidadeTotal: number = 0;
    filtroRegistros: any = {
    pageNumber: 1,
    pageSize: 4,
    Contrato: null,
    Fornecedor: null,
    Tipo: null,
    Gestor: null,
    Status: null,
    NoTipoArp: null
  };

  constructor(private apiService: ApiService, private router: Router, public token: TokenStorageService, private modalService: NgbModal) { }

  async ngOnInit() {
    this.obterPermissoes();
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
        this.getOrcamentoExecucaoContratual(),
        this.obterContratos()
        // this.getAtualizacao()
      ]);
    } catch (err) {
      console.error('Erro ao carregar dashboard-v2', err);
    } finally {
      this.loading = false;
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


  //MELHORIA - MAPEAR A VIEW 47 E APLICAR PADRONIZAÇÃO DE PAGINAÇÃO E RESPONSE
   public async obterContratos(): Promise<void> {
    const url = window.location.hostname;
    this.loading = true;
    try {
      const filtrosLimpos = this.limparFiltrosNulos(this.filtroRegistros);

      const response = await this.apiService.get<ApiResponse<ContratoApiResponse>>
        (`v1/contrato/novos-contratos`, filtrosLimpos);

      this.contratosOrigem = response?.data?.contratos;
      this.quantidadeTotal = response.data.totalRecords;

      if(this.contratosOrigem && this.contratosOrigem.length > 0){
        console.log('Contratos obtidos:', this.contratosOrigem);
        this.openModalNovosContratos();
      }

      this.loading = false;
    } catch (error) {
      this.loading = false;
      console.error('Erro ao obter contratos', error);
    }
  }

    obterPermissoes() {
      this.currentProfile = this.token.getUserPerfil();
    }

  openModalNovosContratos() {
    if(this.currentProfile === PerfisEnum.Pagadoria || this.currentProfile === PerfisEnum.Administrador){
      const modalRef = this.modalService.open(NovosContratosComponent, {
        ariaLabelledBy: 'modal-basic-title',
        windowClass: 'modal-dialog-medium-width',
      });
      modalRef.componentInstance.contratos = this.contratosOrigem;
      modalRef.componentInstance.quantidadeTotal = this.quantidadeTotal;
    }
  }




  async getOrcamentoExecucaoContratual() {

    try{

      const response = await this.apiService.get<ApiResponse<DashboardOrcamentoExecucaoContratualResponse>>(`v1/dashboard/orcamento-execucao-contratual`);

      if(!response?.data){
          console.error('Erro ao carregar dados de orçamento e execução contratual');
         this.dadosDashboardOrcamentoExecucaoContratual = null;
           return;
      }

      this.dadosDashboardOrcamentoExecucaoContratual = response.data
      this.dadosDashboardOrcamentoExecucaoContratual.contratosDropdown = Object.entries(this.dadosDashboardOrcamentoExecucaoContratual.contratos)
      .map(([nuContrato, codigo]) => ({
      label: codigo,
      value: Number(nuContrato)
      }));


      const dataUltimaAtualizacao = this.dadosDashboardOrcamentoExecucaoContratual?.dhUltimaAtualizacao;

      this.anoExercicio = this.anoExercicio = dataUltimaAtualizacao &&
       !isNaN(Date.parse(dataUltimaAtualizacao))
       ? new Date(dataUltimaAtualizacao).getFullYear()
       : new Date().getFullYear();


    }

    catch(e){
    console.error('Erro ao carregar dados de orçamento e execução contratual', e);
    this.dadosDashboardOrcamentoExecucaoContratual = null;
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
