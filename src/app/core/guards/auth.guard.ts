import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PerfisEnum, TokenStorageService } from 'src/app/shared/services/token-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private auth: TokenStorageService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

 permissao = true;
 perfil : string = 'perfil_tecnico';
 logado = false

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {

    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }
    // pegar o perfil e verificar se ele tem o perfil técnico, se tiver liberar, se não bloqueia, manda mensagem e redireciona para o dashbord
    const perfil = this.auth.getUserProfile();


    if(perfil === PerfisEnum.FiscalTecnico ||
       perfil === PerfisEnum.Administrador ||
       perfil === PerfisEnum.TorresGEGAT   ||
       perfil === PerfisEnum.Pagadoria)
    {
      return true;
    }

    this.toastr.error('Acesso Negado! Você não possui permissão para acessar esse módulo', 'Error');
    this.router.navigate(['dashboard']);
    return false;
  }
}
