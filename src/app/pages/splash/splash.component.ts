import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/shared/services/token-storage.service';

// Duração da splashscreen em milissegundos
const SPLASH_DURATION_MS = 2000;

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss']
})
export class SplashComponent implements OnInit, OnDestroy {
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private router: Router,
    private tokenStorage: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.timer = setTimeout(() => this.goNext(), SPLASH_DURATION_MS);
  }

  ngOnDestroy(): void {
    if (this.timer !== null) {
      clearTimeout(this.timer);
    }
  }

  private goNext(): void {
    const destino = this.tokenStorage.isAuthenticated() ? '/dashboard' : '/login';
    this.router.navigate([destino]);
  }
}
