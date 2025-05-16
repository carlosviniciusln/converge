import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AppComponent } from "./app.component";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
//import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { AppRoutingModule } from "./app-routing.module";
import { ComponentsModule } from "./components/components.module";

import ptBr from '@angular/common/locales/pt';
import { CommonModule, registerLocaleData } from '@angular/common';
import { LoaderInterceptor } from "./shared/interceptors/loader.interceptor";
import { ErrorInterceptor } from "./shared/interceptors/error.interceptor";

import { BrowserModule } from "@angular/platform-browser";
import { AdminLayoutModule } from "./layouts/admin-layout/admin-layout.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LoginComponent } from './pages/login/login.component';
import { AuthInterceptor } from "./shared/interceptors/auth.interceptor";
import { AuthGuard } from "./shared/interceptors/auth.guard";
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
import { ModalRedirectComponent } from './pages/dashboard/modal-redirect/modal-redirect.component';
import { TabelaMensalizacaoComponent } from './pages/contrato/mensalizacao-exec-orcamentaria/tabela-mensalizacao/tabela-mensalizacao.component';
import { ModalReiniciarComponent } from './pages/contrato/mensalizacao-exec-orcamentaria/modal-reiniciar/modal-reiniciar.component';
import { ModalSimulacaoComponent } from './pages/contrato/modal-simulacao/modal-simulacao.component';
import { ExportPagamentoComponent } from './pages/relatorio/export-pagamento/export-pagamento.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NovosContratosComponent } from "./pages/dashboard/novos-contratos/novos-contratos.component";
import { ModalPlanejamentoComponent } from "./pages/planejamento/planejamento-lista/modal-planejamento/modal-planejamento.component";

registerLocaleData(ptBr);

const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  imports: [
    BrowserModule,
    MatMenuModule,
    CommonModule,
    BrowserAnimationsModule,
    TooltipModule,
    TableModule,
    MatTabsModule,
    NgxSpinnerModule,
    ComponentsModule,
    NgbModule,
    RouterModule,
    AppRoutingModule,
    HttpClientModule,
    AdminLayoutModule,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule.forRoot(),
    HighchartsChartModule,
    MatIconModule,
    MatToolbarModule,
    NgxMaskModule.forRoot(maskConfig)
  ],
  exports: [
    //CommonModule,
    //FormsModule,
    //ReactiveFormsModule
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    LoginComponent,
    MensalizacaoComponent,
    ValoresExecutadosComponent,
    ContratoPendenteComponent,
    ModalRedirectComponent,
    TabelaMensalizacaoComponent,
    ModalReiniciarComponent,
    ModalSimulacaoComponent,
    ExportPagamentoComponent,
    NovosContratosComponent,
    ModalPlanejamentoComponent

    //AuthLayoutComponent
  ],
  providers: [
    AuthGuard,
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
