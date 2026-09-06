import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/models/generics/api-response';
import { ApiService } from 'src/app/shared/services/api.service';
import {
  ActionPolicies,
  ModuleEnum,
  TokenStorageService,
} from 'src/app/shared/services/token-storage.service';
import { Endpoints } from 'src/app/models/enums/endpoints';

@Component({
  selector: 'app-sintetico',
  templateUrl: './sintetico.component.html',
  styleUrls: ['./sintetico.component.scss'],
})
export class SinteticoComponent implements OnInit {
  permissions: ActionPolicies;

  listaInformeMensal: any[];
  listaInformeMensalPorTipo: any[];
  loading: boolean = true;
  listaAnos: string[];
  selectedAno: string = null;

  activityValues: number[] = [0, 100];

  public filtroRegistros: any = {
    nuAno: null,
    nuRubricaTipo: null,
    nuFilial: null,
    nuContrato: null,
  };

  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    public token: TokenStorageService
  ) {
    this.obterPermissoes();
  }

  obterPermissoes() {
    this.permissions = this.token.getActionPolicies(ModuleEnum.Relatorios);
  }

  async ngOnInit(): Promise<void> {
    await this.obterAnosOrcamentarios();
    await this.obterInformeMensalPorTipo();
    await this.obterInformeMensal();
    this.loading = false;
  }

  public async obterAnosOrcamentarios(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<string[]>>(
        `${Endpoints.URL_PAGAMENTO}/anos-orcamentarios`
      );
      console.log(response.data);
      this.listaAnos = response.data;
      //this.loading = false;
    } catch (error) {
      console.error(error, 'aquirsd');
      //this.loading = true;
    }
  }

  public async obterInformeMensal(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<any[]>>(
        `${Endpoints.URL_INFORME_MENSAL_SINTETICO}`,
        this.filtroRegistros
      );

      this.listaInformeMensal = response.data;
      //this.loading = false;
    } catch (error) {
      console.error(error, 'aquirsd');
      //this.loading = true;
    }
  }

  public async obterInformeMensalPorTipo(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<any[]>>(
        `${Endpoints.URL_INFORME_MENSAL_SINTETICO_RUBRICA_TIPO}`,
        this.filtroRegistros
      );

      this.listaInformeMensalPorTipo = response.data;
      //this.loading = false;
    } catch (error) {
      console.error(error, 'aquirsd');
      //this.loading = true;
    }
  }

  public downloadInformeMensal() {
    return this.apiService.downloadfile(
      `${Endpoints.URL_INFORME_MENSAL_SINTETICO}/excel`,
      this.filtroRegistros
    );
  }

  async updateRelatorio(id: string): Promise<void> {
    this.loading = true;
    this.filtroRegistros.nuAno = id;
    await this.obterInformeMensal();
  }

  valorTotal(lista: any, key: any) {
    return lista.reduce((sum, c) => sum + this.convertDecimal(c[key]), 0);
  }

  convertDecimal(value: string) {
    return value ? Number(value.toString().replace(',', '.')) : 0;
  }
}
