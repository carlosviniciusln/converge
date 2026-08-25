import { Component, OnInit } from '@angular/core';
import { ApiResponse } from 'src/app/models/generics/api-response';
import { ContratoApiResponse } from 'src/app/models/generics/Gcptb001ContratoResponse';
import { ApiService } from 'src/app/shared/services/api.service';
import {
  ActionPolicies,
  ModuleEnum,
  PerfisEnum,
  TokenStorageService,
} from 'src/app/shared/services/token-storage.service';
import { Endpoints } from 'src/app/models/enums/endpoints';
import { SidenavService } from 'src/app/services/sidenav.service';

declare interface RouteInfo {
  path: string;
  title: string;
  rtlTitle: string;
  icon: string;
  class: string;
  checkForAccess: boolean;
}

declare interface AcessInfo {
  path: string;
  hasAcess: boolean;
}

export const ROUTES: RouteInfo[] = [
  {
    path: '/dashboard',
    title: 'Início',
    rtlTitle: '',
    icon: 'icon-bank',
    class: '',
    checkForAccess: false,
  }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  menuItems: any[] = [];

  currentProfile: PerfisEnum;

  permissionsDashboard: ActionPolicies;
  permissionsContratos: ActionPolicies;
  permissionsUsuarios: ActionPolicies;
  permissionsPlanejamento: ActionPolicies;
  permissionsLimites: ActionPolicies;
  permissionsRelatorios: ActionPolicies;

  acessList: AcessInfo[] = [];

  isRelatoriosCollapsed: boolean = false;
  isOrcamentoCollapsed: boolean = false;
  isContratoCollapsed: boolean = false;
  isDotacaoCollapsed: boolean = false;
  isContratoCollapsedArt81: boolean = false;
  isPerfilOrcamento = false;
  isPerfilPrivilegiado = false;
  filtroIdArtigo81: any;
  id2024: number = 0;
  id2025: number = 0;
  filtroRegistros: any = {
    pageNumber: 1,
    pageSize: 10,
    Contrato: null,
    Fornecedor: null,
    Tipo: null,
    Gestor: null,
    Status: null,
    NoTipoArp: null
  };

  constructor(
    private apiService: ApiService,
    public token: TokenStorageService,
    public sidenav: SidenavService
  ) {
    this.concedeAccess();
  }

  ngOnInit() {
    this.menuItems = ROUTES.filter((menuItem) => menuItem);
  }

async getContratos(filtro: any): Promise<ApiResponse<ContratoApiResponse>>{
  let response = await this.apiService.get<ApiResponse<ContratoApiResponse>>
  (`${Endpoints.URL_CONTRATOS}/filter-paginado`, filtro);
  return response;
}

  concedeAccess() {
    this.currentProfile = this.token.getUserPerfil();
    this.permissionsDashboard = this.token.getActionPolicies(ModuleEnum.Dashboard);
    this.permissionsContratos = this.token.getActionPolicies(ModuleEnum.Contratos);
    this.permissionsUsuarios = this.token.getActionPolicies(ModuleEnum.Usuarios);
    this.permissionsPlanejamento = this.token.getActionPolicies(ModuleEnum.Planejamento);
    this.permissionsLimites = this.token.getActionPolicies(ModuleEnum.Limites);
    this.permissionsRelatorios = this.token.getActionPolicies(ModuleEnum.Relatorios);

    if(this.currentProfile === 'Orçamento' || this.currentProfile === 'Administrador'){
      this.isPerfilOrcamento = true;
    }

    if(this.currentProfile === 'Administrador'
      || this.currentProfile === 'Pagadoria'
      || this.currentProfile === 'Torres GEGAT'
      || this.currentProfile === 'Gestor Operacional'
      || this.currentProfile === PerfisEnum.Orcamento
    ){
      this.isPerfilPrivilegiado = true;
    }

    this.acessList.push({
      path: '/dashboard',
      hasAcess: this.permissionsDashboard?.Consultar ?? false,
    });
    this.acessList.push({
      path: '/contrato',
      hasAcess: this.permissionsContratos?.Consultar ?? false,
    });
    this.acessList.push({
      path: '/contrato/atas',
      hasAcess: this.permissionsContratos?.Consultar ?? false,
    });
    this.acessList.push({
      path: '/contrato/pendencia',
      hasAcess: this.permissionsContratos?.Consultar ?? false,
    });
    this.acessList.push({
      path: '/contrato/artigos',
      hasAcess: this.permissionsContratos?.Consultar ?? false,
    });
    this.acessList.push({
      path: '/usuarios',
      hasAcess: this.permissionsUsuarios?.Consultar ?? false,
    });
    this.acessList.push({
      path: '/planejamento',
      hasAcess: this.permissionsPlanejamento?.Consultar ?? false,
    });
    this.acessList.push({
      path: '/planejamento/limites',
      hasAcess: this.permissionsLimites?.Consultar ?? false,
    });
    this.acessList.push({
      path: '/planejamento/orcamentario',
      hasAcess: this.permissionsLimites?.Consultar ?? false,
    });
    this.acessList.push({
      path: '/valores-executados',
      hasAcess: this.permissionsLimites?.Consultar ?? false,
    });
    this.acessList.push({
      path: '/pagamento',
      hasAcess: this.permissionsRelatorios?.Consultar ?? false,
    });
    this.acessList.push({
      path: '/consumo',
      hasAcess: this.permissionsRelatorios?.Consultar ?? false,
    });
    this.acessList.push({
      path: '/empenho',
      hasAcess: this.permissionsRelatorios?.Consultar ?? false,
    });
    this.acessList.push({
      path: '/informe/analitico',
      hasAcess: this.permissionsRelatorios?.Consultar ?? false,
    });
    this.acessList.push({
      path: '/informe/sintetico',
      hasAcess: this.permissionsRelatorios?.Consultar ?? false,
    });
  }

  hasAccess(path: string): boolean {
    return this.acessList.some((x) => x.path == path && x.hasAcess);
  }

  isMobileMenu() {
    if (window.innerWidth > 991) {
      return false;
    }
    return true;
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
