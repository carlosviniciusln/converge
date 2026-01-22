import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { FileUploadModule } from 'primeng/fileupload';
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
import { CommonModule, CurrencyPipe, DecimalPipe, registerLocaleData } from '@angular/common';
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
import { PlanejamentoGeralComponent } from './pages/planejamento/planejamento-geral/planejamento-geral.component';
import { PlanejamentoAbaRubricaComponent } from "./pages/planejamento/planejamento-aba-rubrica/planejamento-aba-rubrica.component";
import {MatTableModule} from '@angular/material/table';
import { SharedLibraryModule } from "./shared/shared-library/shared-library.module";
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

registerLocaleData(ptBr);

const maskConfig: Partial<IConfig> = {
  validation: false,
};

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
    ComponentsModule,
    NgbModule,
    RouterModule,
    AppRoutingModule,
    HttpClientModule,
    DialogModule,
    SplitButtonModule,
    AdminLayoutModule,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule.forRoot(),
    HighchartsChartModule,
    MatIconModule,
    SharedLibraryModule,
    MatListModule,
    TimelineModule,
    CardModule,
    DropdownModule,
    PaginatorModule,
    MatToolbarModule,MatTableModule,
    FileUploadModule,
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
    RelatorioContratoComponent
  ],
  providers: [
    AuthGuard,
    CurrencyPipe,
    DecimalPipe,
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
    MessageService,
    CargaGerais
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
