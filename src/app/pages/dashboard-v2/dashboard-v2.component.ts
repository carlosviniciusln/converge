import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';
import { Endpoints } from 'src/app/models/enums/endpoints';
import { ApiResponse } from 'src/app/models/generics/api-response';
import { NumerosRapidosExecContratual } from 'src/app/models/generics/dashboard';
import {
  DashboardOrcamentoExecucaoContratualResponse,
  Gcptb043ResumoExecucaoContratualDTO,
  Gcpvw024RelatorioOrcamentoDTO,
} from 'src/app/models/DTOs/dashboard-orcamento-execucao-contratual.dto';

@Component({
  selector: 'app-dashboard-v2',
  templateUrl: './dashboard-v2.component.html',
  styleUrls: ['./dashboard-v2.component.scss']
})
export class DashboardV2Component implements OnInit {
  loading = true;
  numerosRapidos: NumerosRapidosExecContratual;
  // use `any` because templates expect legacy UPPER_CASE property names mapped from the DTO
  filial1885Data: any = null;
  numerosExecucaoContratual: Gcpvw024RelatorioOrcamentoDTO | null = null;
  ultimaAtualizacao: string = '';
  // contratos comes from the payload (Record<number,string>) - convert to array for UI
  contratos: Array<{ id: number; label: string }> = [];
  searchTerm: string = '';
  filteredContratos: Array<{ id: number; label: string }> = [];
  showContratoSuggestions = false;
  // PrimeNG dropdown options
  selectContratos: Array<{ label: string; value: number }> = [];
  selectedContrato: number | null = null;
  contratosLoading = false;

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    console.log('[DEBUG] DashboardV2Component init, currentUrl=', this.router.url);
    // Only initialize dashboard data when the route matches '/dashboard' to avoid
    // accidental initialization when another route is active (defensive).
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
        this.getNumerosRapidosExecContratual(),
        this.getOrcamentoExecucaoContratual(),
        this.getAtualizacao()
      ]);
    } catch (err) {
      console.error('Erro ao carregar dashboard-v2', err);
    } finally {
      this.loading = false;
    }
  }

  async getNumerosRapidosExecContratual() {
    const response = await this.apiService.get<ApiResponse<NumerosRapidosExecContratual>>(`${Endpoints.URL_DASHBOARD}/numeros-rapidos-exec-contratual`);
    this.numerosRapidos = response?.data;
  }

  async getOrcamentoExecucaoContratual() {
    // Calls the combined endpoint and maps the response to the component properties used by the cards
    const response = await this.apiService.get<ApiResponse<DashboardOrcamentoExecucaoContratualResponse>>(`${Endpoints.URL_DASHBOARD_ORCAMENTO_EXECUCAO}`);
    const payload = response?.data;
    if (!payload) {
      this.filial1885Data = null;
      this.numerosExecucaoContratual = null;
      this.contratos = [];
      this.filteredContratos = [];
      return;
    }

    // Map dashboardOrcamento -> filial data (contains planned/executed values and percentages)
    const orc = payload.dashboardOrcamento;
    if (orc) {
      // Create a view-model with property names matching existing templates (legacy casing)
      this.filial1885Data = {
        nuRelatorioOrcamento: orc.nuRelatorioOrcamento,
        nU_FILIAL: orc.nuFilial,
        sG_FILIAL: orc.sgFilial,
        nU_FILIAL_PAI: orc.nuFilialPai,
        sG_FILIAL_PAI: orc.sgFilialPai,
        iC_UNIDADE_PAI: orc.icUnidadePai,
        vR_INVESTIMENTO_PLANEJADO: orc.vrInvestimentoPlanejado,
        vR_CUSTEIO_PLANEJADO: orc.vrCusteioPlanejado,
        vR_INVESTIMENTO_EXECUTADO: orc.vrInvestimentoExecutado,
        vR_CUSTEIO_EXECUTADO: orc.vrCusteioExecutado,
        pC_INVESTIMENTO_REALIZADO: orc.pcInvestimentoRealizado,
        pC_CUSTEIO_REALIZADO: orc.pcCusteioRealizado,
        dhCadastro: orc.dhCadastro,
      } as any;
    } else {
      this.filial1885Data = null;
    }

    // Map execution numbers
    this.numerosExecucaoContratual = payload.dashboardExecucaoContratual ?? null;

    // Map contratos record -> array
    if (payload.contratos) {
      this.contratos = Object.entries(payload.contratos).map(([k, v]) => ({ id: +k, label: v }));
      this.filteredContratos = [...this.contratos];
      // populate dropdown options
      this.selectContratos = this.contratos.map(c => ({ label: c.label, value: c.id }));
    } else {
      this.contratos = [];
      this.filteredContratos = [];
      this.selectContratos = [];
    }

    // Optionally map quick numbers used elsewhere
    this.numerosRapidos = {
      nU_RESUMO_EXECUCAO_CONTRATUAL: this.numerosExecucaoContratual?.nuResumoExecucaoContratual ?? 0,
      qT_CONTRATO_VIGENTE: this.numerosExecucaoContratual?.qtContratoVigente ?? 0,
      qT_PAGAMENTO_ANO: this.numerosExecucaoContratual?.qtPagamentoAno ?? 0,
      nU_RUBRICA: this.numerosExecucaoContratual?.nuRubrica ?? 0,
      vR_EXECUTADO_VIGENTE: this.numerosExecucaoContratual?.vrExecutadoVigente ?? 0,
      vR_GLOBAL_VIGENTE: this.numerosExecucaoContratual?.vrGlobalVigente ?? 0,
      vR_RETIDO_VIGENTE: this.numerosExecucaoContratual?.vrRetidoVigente ?? 0,
      vR_EXECUTADO_ANO: this.numerosExecucaoContratual?.vrExecutadoAno ?? 0,
    } as NumerosRapidosExecContratual;

    // Use dashboardOrcamento.dhCadastro as last update timestamp if present (format it)
    if (this.filial1885Data && this.filial1885Data.dhCadastro) {
      this.ultimaAtualizacao = this.formatDateTime(this.filial1885Data.dhCadastro);
    }
  }

  onContratoSearchChange() {
    const term = (this.searchTerm || '').toLowerCase().trim();
    if (!term) {
      this.filteredContratos = [...this.contratos];
      this.showContratoSuggestions = false;
      return;
    }
    this.filteredContratos = this.contratos.filter(c => `${c.label}`.toLowerCase().includes(term) || `${c.id}`.includes(term));
    this.showContratoSuggestions = this.filteredContratos.length > 0;
  }

  goToContrato(c: { id: number; label: string }) {
    this.showContratoSuggestions = false;
    this.searchTerm = c.label;
    // open evolution page in a new tab using the app origin + hash route
    const url = `${window.location.origin}/#/contrato/evolucao-financeira/${c.id}`;
    window.open(url, '_blank');
  }

  hideContratoSuggestionsDelayed(delay = 150) {
    setTimeout(() => this.showContratoSuggestions = false, delay);
  }

  goToContratoFromDropdown(e: any) {
    const id = e?.value;
    if (id) {
      // open evolution page in a new tab using the app origin + hash route
      const url = `${window.location.origin}/#/contrato/evolucao-financeira/${id}`;
      window.open(url, '_blank');
    }
  }

  async loadContratosIfNeeded() {
    // show loading while fetching (if not already loaded)
    if (this.selectContratos && this.selectContratos.length > 0) {
      // small visual delay for UX
      this.contratosLoading = true;
      setTimeout(() => this.contratosLoading = false, 180);
      return;
    }
    try {
      this.contratosLoading = true;
      await this.getOrcamentoExecucaoContratual();
    } catch (e) {
      console.error('Erro ao carregar contratos', e);
    } finally {
      this.contratosLoading = false;
    }
  }

  async getAtualizacao() {
    const response = await this.apiService.get<ApiResponse<string>>(`${Endpoints.URL_DASHBOARD}/dt-ultima-atualizacao`);
    this.ultimaAtualizacao = response.data ? this.formatDateTime(response.data) : '';
  }

  /**
   * Format an ISO or timestamp string into 'dd/MM/yyyy HH:mm' using Intl when possible.
   */
  private formatDateTime(value: string): string {
    if (!value) return '';
    // Try to parse; if it's numeric, treat as epoch millis
    let d: Date;
    if (/^\d+$/.test(value)) {
      d = new Date(parseInt(value, 10));
    } else {
      d = new Date(value);
    }
    if (isNaN(d.getTime())) return value; // fallback to original
    try {
      const datePart = d.toLocaleDateString('pt-BR');
      const timePart = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      return `${datePart} ${timePart}`;
    } catch (e) {
      // fallback
      return d.toISOString();
    }
  }

}
