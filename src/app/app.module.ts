import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, APP_INITIALIZER } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { FileUploadModule } from 'primeng/fileupload';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AppComponent } from "./app.component";
//import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { AppRouting } from "./routing/app.routing";

import ptBr from '@angular/common/locales/pt';
import { CommonModule, CurrencyPipe, DecimalPipe, DatePipe, registerLocaleData } from '@angular/common';
import { LoaderInterceptor } from "./core/interceptors/loader.interceptor";
import { ErrorInterceptor } from "./core/interceptors/error.interceptor";

import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LoginComponent } from './components/login/login.component';
import { LoginPageComponent } from './pages/login/login-page.component';
import { AuthInterceptor } from "./core/interceptors/auth.interceptor";
import { AuthGuard } from "./core/guards/auth.guard";
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MensalizacaoComponent } from './pages/contrato/mensalizacao-exec-orcamentaria/mensalizacao-exec-orcamentaria.component';
import { ValoresExecutadosComponent } from './pages/valores-executados/valores-executados.component';
import { ContratoPendenteComponent } from './pages/contrato/contrato-pendente/contrato-pendente.component'
import { MatMenuModule } from '@angular/material/menu';
import { HighchartsChartModule } from "highcharts-angular";
import { MatIconModule } from '@angular/material/icon';
import { MensalizacaoEditarComponent } from './pages/contrato/mensalizacao-exec-orcamentaria/mensalizacao-editar/mensalizacao-editar.component';
import { TabelaMensalizacaoComponent } from './pages/contrato/mensalizacao-exec-orcamentaria/tabela-mensalizacao/tabela-mensalizacao.component';
import { ModalReiniciarComponent } from './pages/contrato/mensalizacao-exec-orcamentaria/modal-reiniciar/modal-reiniciar.component';
import { ModalSimulacaoComponent } from './pages/contrato/modal-simulacao/modal-simulacao.component';
import { ExportPagamentoComponent } from './pages/relatorio/export-pagamento/export-pagamento.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NovosContratosComponent } from "./pages/dashboard/novos-contratos/novos-contratos.component";
import { ModalPlanejamentoComponent } from "./pages/planejamento/planejamento-lista/modal-planejamento/modal-planejamento.component";
import { PlanejamentoGeralComponent } from './pages/planejamento/planejamento-geral/planejamento-geral.component';
import { PlanejamentoAbaRubricaComponent } from "./pages/planejamento/planejamento-aba-rubrica/planejamento-aba-rubrica.component";
import {MatTableModule} from '@angular/material/table';
import { SharedLibraryModule } from "./shared/lib/shared-library.module";
import { AtesteComponent } from './pages/ateste/ateste.component';
import { NavbarAtesteComponent } from './pages/ateste/navbar-ateste/navbar-ateste.component';
import { DetalharAtesteComponent } from './pages/ateste/detalhar-ateste/detalhar-ateste.component';
import { RegistrarAtesteComponent } from './pages/ateste/registrar-ateste/registrar-ateste.component';
import { LimitesComponent } from './pages/planejamento/limites/limites.component';
import { ModalLimitesComponent } from "./pages/planejamento/limites/modal-limites/modal-limites.component";
import { ModalUploadComponent } from './pages/planejamento/limites/modal-upload/modal-upload.component';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from "primeng/api";
import { SplitButtonModule } from 'primeng/splitbutton';
import { CargaGerais } from "src/assets/mock/Gcptb051CargaPlanejamentoItem";
import { RelatorioContratoComponent } from './pages/relatorio/relatorio-contrato/relatorio-contrato.component';
import { ModalHistoricoComponent } from "./pages/planejamento/limites/modal-historico/modal-historico.component";
import { MatListModule } from "@angular/material/list";
import { CardModule } from "primeng/card";
import { TimelineModule } from "primeng/timeline";
import { DropdownModule } from "primeng/dropdown";
import { PaginatorModule } from "primeng/paginator";
import { DialogModule } from "primeng/dialog";
import { MenuModule } from "primeng/menu";
import { PagesComponent } from "./pages/pages.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { DevelopComponent } from "./components/develop/develop.component";
import { KeycloakInitService } from "../keycloak.init";
import { KeycloakService } from "keycloak-angular";
import { CustomKeycloakInterceptor } from "./core/interceptors/keycloak.interceptor";
import { DialogService } from "primeng/dynamicdialog";

registerLocaleData(ptBr);

const maskConfig: Partial<IConfig> = {
  validation: false,
};

export function initializeKeycloak(keycloakInit: KeycloakInitService){
  return () => keycloakInit.init();
}

@NgModule({
  imports: [
    BrowserModule,
    MatMenuModule,
    CommonModule,
    CheckboxModule,
    BrowserAnimationsModule,
    TooltipModule,
    TableModule,
    MatTabsModule,
    NgxSpinnerModule,
    NgbModule,
    RouterModule,
    AppRouting,
    HttpClientModule,
    DialogModule,
    SplitButtonModule,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule.forRoot(),
    HighchartsChartModule,
    MatIconModule,
    MatListModule,
    TimelineModule,
    CardModule,
    DropdownModule,
    PaginatorModule,
    MatToolbarModule,MatTableModule,
    FileUploadModule,
    MenuModule,
    SharedLibraryModule,
    NgxMaskModule.forRoot(maskConfig)
  ],
  exports: [
    //CommonModule,
    //FormsModule,
    //ReactiveFormsModule
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    LoginPageComponent,
    MensalizacaoComponent,
    ValoresExecutadosComponent,
    ContratoPendenteComponent,
    TabelaMensalizacaoComponent,
    ModalReiniciarComponent,
    ModalSimulacaoComponent,
    ExportPagamentoComponent,
    NovosContratosComponent,
    ModalPlanejamentoComponent,
    PlanejamentoGeralComponent,
    PlanejamentoAbaRubricaComponent,
    AtesteComponent,
    NavbarAtesteComponent,
    DetalharAtesteComponent,
    RegistrarAtesteComponent,
    LimitesComponent,
    ModalLimitesComponent,
    ModalUploadComponent,
    ModalHistoricoComponent,
    //AuthLayoutComponent
    RelatorioContratoComponent,
    PagesComponent,
    SidebarComponent,
    NavbarComponent,
    DevelopComponent,
  ],
  providers: [
    AuthGuard,
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
    JwtHelperService,
    MessageService,
    CargaGerais,
    DialogService,
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    KeycloakInitService,
    KeycloakService,
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: initializeKeycloak,
    //   deps: [KeycloakInitService],
    //   multi: true
    // },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: CustomKeycloakInterceptor,
    //   multi: true
    // }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class AppModule { }
