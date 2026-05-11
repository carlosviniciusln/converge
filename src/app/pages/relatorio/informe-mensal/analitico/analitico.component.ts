import { Component, OnInit } from '@angular/core';
import { ApiResponse } from 'src/app/models/generics/api-response';
import { Gcptb001ContratoResponse } from 'src/app/models/generics/Gcptb001ContratoResponse';
import { Filial } from 'src/app/models/generics/filial';
import { Rubrica } from 'src/app/models/generics/rubrica';
import { ApiService } from 'src/app/shared/services/api.service';
import { Endpoints } from 'src/app/models/enums/endpoints';
import { Select2Data, Select2Option, Select2Group } from 'ng-select2-component';
import {
  ActionPolicies,
  ModuleEnum,
  TokenStorageService,
} from 'src/app/shared/services/token-storage.service';

@Component({
  selector: 'app-analitico',
  templateUrl: './analitico.component.html',
  styleUrls: ['./analitico.component.scss'],
})
export class AnaliticoComponent implements OnInit {
  permissions: ActionPolicies;

  loading: boolean = true;

  listaInformeMensal: any[];
  listaAnos: string[];
  listaRubricas: Rubrica[];
  listaContratos: Gcptb001ContratoResponse[];
  listaFiliais: Filial[];

  selectAnos: Select2Data;
  selectRubricas: Select2Data;
  selectContratos: Select2Data;
  selectFiliais: Select2Data;

  selectedAno: string = null;
  selectedRubrica: string = null;
  selectedContrato: string = null;
  selectedFilial: string = null;

  public filtroRegistros: any = {
    nuAno: null,
    nuRubrica: null,
    nuFilial: null,
    nuContrato: null,
  };

  constructor(
    private apiService: ApiService,
    public token: TokenStorageService
  ) {
    this.obterPermissoes();
  }

  obterPermissoes() {
    this.permissions = this.token.getActionPolicies(ModuleEnum.Relatorios);
  }

  async ngOnInit(): Promise<void> {
    await this.obterInformeMensal();

    this.obterFiliais();
    this.obterRubricas();
    this.obterAnosOrcamentarios();
    this.obterContratos();
  }

  public async obterAnosOrcamentarios(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<string[]>>(
        `${Endpoints.URL_PAGAMENTO}/anos-orcamentarios`
      );

      this.listaAnos = response.data;

      this.selectAnos = this.listaAnos.map(
        (m) => ({ value: m, label: String(m) } as Select2Option)
      );

      this.loading = false;
    } catch (error) {
      //this.loading = true;
    }
  }
  public async obterFiliais(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<Filial[]>>(
        `${Endpoints.URL_FILIAL}/ativos`
      );

      this.listaFiliais = response.data;

      this.selectFiliais = this.listaFiliais
        .filter((f) => f.nuFilialPai != null)
        .map(
          (m) => ({ value: m.nuFilial, label: m.sgFilial } as Select2Option)
        );

      this.loading = false;
    } catch (error) {
      //this.loading = true;
    }
  }
  public async obterRubricas(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<Rubrica[]>>(
        `${Endpoints.URL_RUBRICA}/ativas`
      );

      this.listaRubricas = response.data;
      this.selectRubricas = this.listaRubricas.map(
        (m) =>
          ({
            value: m.nuRubrica,
            label: m.coRubrica + ' - ' + m.deRubrica,
          } as Select2Option)
      );

      this.loading = false;
    } catch (error) {
      //this.loading = true;
    }
  }
  public async obterContratos(): Promise<void> {
    try {
      const response = await this.apiService.get<
        ApiResponse<Gcptb001ContratoResponse[]>
      >(`${Endpoints.URL_CONTRATOS}`);

      this.listaContratos = response.data;
      this.selectContratos = this.listaContratos.map(
        (m) =>
          ({
            value: m.nuContrato,
            label: m.coContrato + ' - ' + m.noEmpresa,
          } as Select2Option)
      );

      this.loading = false;
    } catch (error) {
      //this.loading = true;
    }
  }
  public downloadInformeMensal() {
    return this.apiService.downloadfile(
      `${Endpoints.URL_INFORME_MENSAL_ANALITICO}/excel`,
      this.filtroRegistros
    );
  }

  async updateRelatorio(e, op: number): Promise<void> {
    this.loading = true;
    console.log(op, 'op');
    console.log(e.value, 'id');
    switch (op) {
      case 1: {
        this.filtroRegistros.nuAno = e.value;
        break;
      }
      case 2: {
        this.filtroRegistros.nuFilial = e.value;
        break;
      }
      case 3: {
        this.filtroRegistros.nuRubrica = e.value;
        break;
      }
      case 4: {
        this.filtroRegistros.nuContrato = e.value;
        break;
      }
      default: {
        this.filtroRegistros.nuAno = e.value;
        break;
      }
    }

    await this.obterInformeMensal();
  }

  public async obterInformeMensal(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<any[]>>(
        `${Endpoints.URL_INFORME_MENSAL_ANALITICO}`,
        this.filtroRegistros
      );

      this.listaInformeMensal = response.data;
      this.loading = false;
    } catch (error) {
      console.error(error, 'aquirsd');
      //this.loading = true;
    }
  }
}
