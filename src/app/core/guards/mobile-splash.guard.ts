import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { TokenStorageService } from 'src/app/shared/services/token-storage.service';

// Largura máxima (px) considerada "mobile" para exibição da splashscreen
const MOBILE_MAX_WIDTH_PX = 767;

@Injectable({ providedIn: 'root' })
export class MobileSplashGuard implements CanActivate {
  constructor(
    private router: Router,
    private tokenStorage: TokenStorageService
  ) {}

  canActivate(): boolean | UrlTree {
    // Splash apenas em dispositivos mobile; desktop redireciona direto
    if (typeof window !== 'undefined' && window.innerWidth <= MOBILE_MAX_WIDTH_PX) {
      return true;
    }
    const destino = this.tokenStorage.isAuthenticated() ? '/dashboard' : '/login';
    return this.router.parseUrl(destino);
  }
}
