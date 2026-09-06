import { Component, OnInit, OnDestroy } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { TokenStorageService } from "src/app/shared/services/token-storage.service";
import { KeycloakService } from "keycloak-angular";
import { Subscription } from "rxjs";
import { filter } from "rxjs/operators";
import { SidenavService } from "src/app/services/sidenav.service";
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
  dataHoraAtual = '';
  searchTerm = '';

  private routerSub!: Subscription;
  private relogioInterval?: ReturnType<typeof setInterval>;

  constructor(
    public router: Router,
    private token: TokenStorageService,
    private keycloak: KeycloakService,
    public sidenav: SidenavService,
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

    this.atualizarDataHora();
    this.relogioInterval = setInterval(() => this.atualizarDataHora(), 60000);
  }

  get saudacao(): string {
    const hora = new Date().getHours();
    if (hora < 12) return 'Bom dia';
    if (hora < 18) return 'Boa tarde';
    return 'Boa noite';
  }

  private atualizarDataHora(): void {
    const agora = new Date();
    const dia = String(agora.getDate()).padStart(2, '0');
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const hora = String(agora.getHours()).padStart(2, '0');
    const minuto = String(agora.getMinutes()).padStart(2, '0');
    this.dataHoraAtual = `${dia}/${mes}/${agora.getFullYear()} ${hora}:${minuto}`;
  }

  toggleMenu(): void {
    this.sidenav.toggle();
  }

  // Direciona a busca do header conforme o que foi digitado: contrato (número), unidade (texto) ou gerencial (palavra-chave)
  pesquisar(): void {
    const termo = this.searchTerm.trim();
    if (!termo) return;

    const normalizado = termo
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

    if (normalizado.includes('gerenc')) {
      this.router.navigate(['/busca-gerencial'], { queryParams: { q: termo } });
    } else if (/\d/.test(termo)) {
      this.router.navigate(['/busca-contrato'], { queryParams: { contrato: termo } });
    } else {
      this.router.navigate(['/busca-ud'], { queryParams: { ud: termo } });
    }

    this.searchTerm = '';
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
    if (this.relogioInterval) {
      clearInterval(this.relogioInterval);
    }
  }
}
