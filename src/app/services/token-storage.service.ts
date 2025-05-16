import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  readonly microsoftRoleClaim =
    'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

  createPolicyProfilesList: string[];
  updatePolicyProfilesList: string[];
  viewPolicyProfilesList: string[];
  exportPolicyProfilesList: string[];
  deletePolicyProfilesList: string[];

  policiesTensor: boolean[][][] = [];

  systemPolicies: ModulesPolicies = {
    Dashboard: {
      Administrador: {
        Consultar: true,
        Exportar: true,
      },
      Orcamento: {
        Consultar: true,
        Exportar: true,
      },
      Pagadoria: {
        Consultar: true,
        Exportar: true,
      },
      GestorOperacional: {
        Consultar: true,
        Exportar: true,
      },
      TorresGEGAT: {
        Consultar: true,
        Exportar: true,
      },
      Usuario: {
        Consultar: true,
        Exportar: true,
      },
      NaoLogado: {
        Consultar: true,
      },
    },
    Contratos: {
      Administrador: {
        Cadastrar: true,
        Alterar: true,
        Consultar: true,
        Exportar: true,
        Excluir: true,
      },
      Orcamento: {
        Cadastrar: true,
        Alterar: true,
        Consultar: true,
        Exportar: true,
        Excluir: true,
      },
      Pagadoria: {
        Cadastrar: true,
        Alterar: true,
        Consultar: true,
        Exportar: true,
        Excluir: true,
      },
      GestorOperacional: {
        Cadastrar: true,
        Alterar: true,
        Consultar: true,
        Exportar: true,
        Excluir: true,
      },
      TorresGEGAT: {
        Cadastrar: true,
        Alterar: true,
        Consultar: true,
        Exportar: true,
        Excluir: true,
      },
      Usuario: {
        Cadastrar: true,
        Alterar: true,
        Consultar: true,
        Exportar: true,
        Excluir: true,
      },
      NaoLogado: {
        Consultar: true,
      },
    },
    Usuarios: {
      Administrador: {
        Alterar: true,
        Consultar: true,
      },
      Orcamento: {
        Alterar: true,
        Consultar: true,
      },
      Pagadoria: {
        Consultar: true,
      },
      GestorOperacional: {
        Consultar: true,
      },
      TorresGEGAT: {
        Consultar: true,
      },
      Usuario: {
        Consultar: true,
      },
      NaoLogado: {
        Consultar: true,
      },
    },
    Planejamento: {
      Administrador: {
        Cadastrar: true,
        Alterar: true,
        Consultar: true,
        Exportar: true,
        Excluir: true,
      },
      Orcamento: {
        Cadastrar: true,
        Alterar: true,
        Consultar: true,
        Exportar: true,
        Excluir: true,
      },
      Pagadoria: {
        Consultar: true,
        Exportar: true,
      },
      GestorOperacional: {
        Consultar: true,
        Exportar: true,
      },
      TorresGEGAT: {
        Cadastrar: true,
        Alterar: true,
        Consultar: true,
        Exportar: true,
        Excluir: true,
      },
      Usuario: {
        Consultar: true,
        Exportar: true,
      },
      NaoLogado: {
        Consultar: true,
      },
    },
    Limites: {
      Administrador: {
        Cadastrar: true,
        Alterar: true,
        Consultar: true,
        Excluir: true,
      },
      Orcamento: {
        Cadastrar: true,
        Alterar: true,
        Consultar: true,
        Excluir: true,
      },
      Pagadoria: {
        Consultar: true,
      },
      GestorOperacional: {
        Consultar: true,
      },
      TorresGEGAT: {
        Consultar: true,
      },
      Usuario: {
        Consultar: true,
      },
    },
    Relatorios: {
      Administrador: {
        Consultar: true,
        Exportar: true,
      },
      Orcamento: {
        Consultar: true,
        Exportar: true,
      },
      Pagadoria: {
        Consultar: true,
        Exportar: true,
      },
      GestorOperacional: {
        Consultar: true,
        Exportar: true,
      },
      TorresGEGAT: {
        Consultar: true,
        Exportar: true,
      },
      Usuario: {
        Consultar: true,
        Exportar: true,
      },
      NaoLogado: {
        Consultar: true,
      },
    },
  };

  constructor(private jwtHelper: JwtHelperService) {}

  signOut(): void {
    window.localStorage.clear();
    window.location.reload();
  }

  public saveToken(token: string): void {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return window.localStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: any): void {
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return {};
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    if (token !== null) {
      return !this.jwtHelper.isTokenExpired(token);
    }
    return false;
  }

  public getActionPolicies(module: ModuleEnum): ActionPolicies {
    const profilePolicies = this.getProfilePolicies(module);
    const perfil = this.getUserPerfil();

    switch (perfil) {
      case PerfisEnum.Administrador:
        return profilePolicies.Administrador;
      case PerfisEnum.Orcamento:
        return profilePolicies.Orcamento;
      case PerfisEnum.Pagadoria:
        return profilePolicies.Pagadoria;
      case PerfisEnum.GestorOperacional:
        return profilePolicies.GestorOperacional;
      case PerfisEnum.TorresGEGAT:
        return profilePolicies.TorresGEGAT;
      case PerfisEnum.Usuario:
        return profilePolicies.Usuario;
      default:
        return profilePolicies.NaoLogado;
    }
  }

  getProfilePolicies(module: ModuleEnum): ProfilePolicies {
    switch (module) {
      case ModuleEnum.Relatorios:
        return this.systemPolicies.Relatorios;
      case ModuleEnum.Limites:
        return this.systemPolicies.Limites;
      case ModuleEnum.Planejamento:
        return this.systemPolicies.Planejamento;
      case ModuleEnum.Usuarios:
        return this.systemPolicies.Usuarios;
      case ModuleEnum.Contratos:
        return this.systemPolicies.Contratos;
      case ModuleEnum.Dashboard:
      default:
        return this.systemPolicies.Dashboard;
    }
  }

  public getUserProfile(): string {
    var profile: string | undefined = this.getUser().claims?.find(
      (x: { type: string; value: string }) => x.type == this.microsoftRoleClaim
    )?.value;
    return profile ?? '';
  }

  public getUserPerfil(): PerfisEnum {
    var profile: string | undefined = this.getUser().claims?.find(
      (x: { type: string; value: string }) => x.type == this.microsoftRoleClaim
    )?.value;

    switch (profile) {
      case PerfisEnum.Administrador.toString():
        return PerfisEnum.Administrador;
      case PerfisEnum.Orcamento.toString():
        return PerfisEnum.Orcamento;
      case PerfisEnum.Pagadoria.toString():
        return PerfisEnum.Pagadoria;
      case PerfisEnum.GestorOperacional.toString():
        return PerfisEnum.GestorOperacional;
      case PerfisEnum.TorresGEGAT.toString():
        return PerfisEnum.TorresGEGAT;
      case PerfisEnum.Usuario.toString():
        return PerfisEnum.Usuario;
      default:
        return PerfisEnum.NaoLogado;
    }
  }
}

export enum PageAction {
  Cadastrar = 'Cadastrar',
  Alterar = 'Alterar',
  Consultar = 'Consultar',
  Exportar = 'Exportar',
  Excluir = 'Excluir',
}

export enum PerfisEnum {
  Administrador = 'Administrador',
  Usuario = 'Usuário',
  Orcamento = 'Orçamento',
  Pagadoria = 'Pagadoria',
  GestorOperacional = 'Gestor Operacional',
  TorresGEGAT = 'Torres GEGAT',
  NaoLogado = 'Não Logado',
}

export enum ModuleEnum {
  Dashboard = 'Dashboard',
  Contratos = 'Contratos',
  Usuarios = 'Usuários',
  Planejamento = 'Planejamento',
  Limites = 'Limites',
  Relatorios = 'Relatórios',
}

export interface ActionPolicies {
  Cadastrar?: boolean;
  Alterar?: boolean;
  Consultar?: boolean;
  Exportar?: boolean;
  Excluir?: boolean;
}

export interface ProfilePolicies {
  Administrador?: ActionPolicies;
  Orcamento?: ActionPolicies;
  Pagadoria?: ActionPolicies;
  GestorOperacional?: ActionPolicies;
  TorresGEGAT?: ActionPolicies;
  Usuario?: ActionPolicies;
  NaoLogado?: ActionPolicies;
}

export interface ModulesPolicies {
  Dashboard: ProfilePolicies;
  Contratos: ProfilePolicies;
  Usuarios: ProfilePolicies;
  Planejamento: ProfilePolicies;
  Limites: ProfilePolicies;
  Relatorios: ProfilePolicies;
}
