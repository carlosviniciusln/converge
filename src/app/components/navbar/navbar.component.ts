import { Component, OnInit, OnDestroy } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { TokenStorageService } from "src/app/shared/services/token-storage.service";
import { KeycloakService } from "keycloak-angular";
import { Subscription } from "rxjs";
import { filter } from "rxjs/operators";
import { SidenavService } from "src/app/services/sidenav.service";
import { AppInfoService } from "src/app/services/app-info.service";
import { MatDialog } from "@angular/material/dialog";
import { LoginComponent } from "src/app/components/login/login.component";
import { LoaderService } from "src/app/core/services/loader.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUser: any;
  isLoggedIn = false;
  ultimaAtualizacao = '';

  private routerSub!: Subscription;
  private infSub!: Subscription;

  constructor(
    public router: Router,
    private token: TokenStorageService,
    private keycloak: KeycloakService,
    public sidenav: SidenavService,
    public appInfo: AppInfoService,
    private dialog: MatDialog,
    private loader: LoaderService
  ) {
    this.currentUser = this.token.getUser();
    this.isLoggedIn = this.token.isAuthenticated();
  }

  ngOnInit(): void {
    this.routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.sidenav.close());

    this.infSub = this.appInfo.ultimaAtualizacao$.subscribe(value => {
      this.ultimaAtualizacao = value ? `Atualizado em: ${value}` : '';
    });

    this.appInfo.carregar();
  }

  toggleMenu(): void {
    this.sidenav.toggle();
  }

  openModalLogin(): void {
    this.dialog.open(LoginComponent, {
      width: '400px',
      panelClass: 'dsc-dialog-panel'
    });
  }

  signOut(): void {
    const confirmed = window.confirm('Deseja realmente sair?');
    if (!confirmed) {
      return;
    }

    this.loader.show();

    setTimeout(() => {
      this.token.signOut();

      try {
        this.keycloak.logout();
      } catch (error) {
        console.warn('Keycloak logout não disponível no momento.', error);
      }

      this.loader.hide();
      window.location.href = '/#/login';
    }, 500);
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
    this.infSub?.unsubscribe();
  }
}
