import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private auth: TokenStorageService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (!this.auth.isAuthenticated()) {
      this.auth.signOut();
      this.toastr.error('Acesso Negado!', 'Error');
      this.router.navigate(['dashboard'], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    }
    return true;
  }
}
