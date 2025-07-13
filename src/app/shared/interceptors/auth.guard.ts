import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { LoginComponent } from 'src/app/pages/login/login.component';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private auth: TokenStorageService,
    private router: Router,
    private toastr: ToastrService,
     private modalService: NgbModal,
  ) {}

 permissao = true;
 perfil : string = 'perfil_tecnico';
 logado = false

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {

    return true

    // antes de tudo verifico o perfil do usuário, se não tiver ninguém logado eu abro a tela de login, depois que logar eu verifico no return do 'logar' se ele é do perfil técnico, se for true, se não return com uma mensagem não tem permissão para acessar essa pagina com mensagem e redirecionamento para dasboard com a mensagem não tem permissão! 

    // !this.auth.isAuthenticated()
    if(!this.logado){
       this.modalService.open(LoginComponent, {ariaLabelledBy: 'modal-basic-title', size: 'sm', windowClass: 'custom-class'}).result.then((result) => {
            
          console.log(result, "result do logado");
            // se result for igual o perfil técnico return true, se não return false, verificar o return

          }, (reason) => {
            console.log(reason, "result do logado");
          });
    }

    // pegar o perfil e verificar se ele tem o perfil técnico, se tiver liberar, se não bloqueia, manda mensagem e redireciona para o dashbord
    const perfil = this.auth.getUserProfile();

    if(perfil === 'tecnico'){
      return true;
    }
    

    // if (!this.auth.isAuthenticated()) {
    //   this.auth.signOut();
    //   this.toastr.error('Acesso Negado!', 'Error');
    //   this.router.navigate(['dashboard'], {
    //     queryParams: { returnUrl: state.url },
    //   });
    //   return false;
    // } 

      return false;
  }
}
