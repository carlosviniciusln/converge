import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FileUploadModule } from 'primeng/fileupload';

import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CalendarModule } from 'primeng/calendar';
import { SliderModule } from 'primeng/slider';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { ContextMenuModule } from 'primeng/contextmenu';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { DropdownModule } from 'primeng/dropdown';

import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { ContratoComponent } from '../../pages/contrato/contrato.component';
import { PagamentoComponent } from '../../pages/relatorio/pagamento/pagamento.component';
import { AnaliticoComponent } from '../../pages/relatorio/informe-mensal/analitico/analitico.component';
import { SinteticoComponent } from 'src/app/pages/relatorio/informe-mensal/sintetico/sintetico.component';
import { UsuarioComponent } from 'src/app/pages/usuario/usuario.component';
import { CustomerService } from '../../services/customer-service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Select2Module } from 'ng-select2-component';

import {
  NgbActiveModal,
  NgbModule,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';
import { ContratoVigenciaComponent } from 'src/app/pages/dashboard/contrato-vigencia/contrato-vigencia.component';
import { PlanejamentoComponent } from 'src/app/pages/planejamento/planejamento.component';
import { KeysPipe } from 'src/app/components/pipes/key-pipe';
import { SortByPipe } from 'src/app/components/pipes/sort-by-pipe';
import { EvolucaoFinanceiraComponent } from 'src/app/pages/contrato/evolucao-financeira/evolucao-financeira.component';
import { GraficoComponent } from 'src/app/pages/contrato/evolucao-financeira/demais-tipos/grafico/grafico.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { EmpenhoComponent } from 'src/app/pages/relatorio/empenho/empenho.component';
import { MatMenuModule } from '@angular/material/menu';
import { ContratoDetalheComponent } from 'src/app/pages/contrato/contrato-detalhe/contrato-detalhe.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from 'src/app/app.component';
import { AdminLayoutComponent } from './admin-layout.component';
import { ContratoCadastroComponent } from 'src/app/pages/contrato/contrato-cadastro/contrato-cadastro.component';
import { RetencaoCadastroComponent } from 'src/app/pages/contrato/retencao/retencao-cadastro.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgxMaskModule } from 'ngx-mask';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { PagamentoCadastroComponent } from 'src/app/pages/contrato/pagamento-cadastro/pagamento-cadastro.component';
import { EditarPagamentoComponent } from 'src/app/pages/contrato/contrato-pendente/editar-pagamento/editar-pagamento.component';
import { ValoresRubricaComponent } from 'src/app/pages/dashboard/valores-rubrica/valores-rubrica.component';
import { DetalheEvolucaoComponent } from 'src/app/pages/contrato/evolucao-financeira/demais-tipos/detalhe-evolucao/detalhe-evolucao.component';
import { PickListModule } from 'primeng/picklist';
import { ValoresRubricaDetalhadoComponent } from 'src/app/pages/dashboard/valores-rubrica-detalhado/valores-rubrica-detalhado.component';
import { ValoresRubricaDetalhadoContratoComponent } from 'src/app/pages/dashboard/valores-rubrica-detalhado-contrato/valores-rubrica-detalhado-contrato.component';
import { EmpenhoCadastroComponent } from 'src/app/pages/contrato/empenho-cadastro/empenho-cadastro.component';
import { EvolucaoFinanceiraAquisicaoComponent } from 'src/app/pages/contrato/evolucao-financeira-aquisicao/evolucao-financeira-aquisicao.component';
import { GraficoAquisicaoComponent } from 'src/app/pages/contrato/evolucao-financeira-aquisicao/grafico-aquisicao/grafico-aquisicao.component';
import { GraficoAquisicaoGeralComponent } from 'src/app/pages/contrato/evolucao-financeira-aquisicao/grafico-aquisicao-geral/grafico-aquisicao-geral.component';
import { MatTabsModule } from '@angular/material/tabs';
import { AquisicaoComponent } from 'src/app/pages/contrato/evolucao-financeira/aquisicao/aquisicao.component';
import { GraficoComponent as GraficoAquisComponent } from 'src/app/pages/contrato/evolucao-financeira/aquisicao/grafico/grafico.component';
import { GraficoGeralComponent } from 'src/app/pages/contrato/evolucao-financeira/aquisicao/grafico-geral/grafico-geral.component';
import { DemaisTiposComponent } from 'src/app/pages/contrato/evolucao-financeira/demais-tipos/demais-tipos.component';
import { CartaQuitacaoCadastroComponent } from 'src/app/pages/contrato/carta-quitacao-cadastro/carta-quitacao-cadastro.component';
import { PlanejamentoCadastroComponent } from 'src/app/pages/planejamento/planejamento-cadastro/planejamento-cadastro.component';
import {
  CurrencyMaskConfig,
  CurrencyMaskModule,
  CURRENCY_MASK_CONFIG,
} from 'ng2-currency-mask';
import { LimitesRubricasComponent } from 'src/app/pages/planejamento/limites-rubricas/limites-rubricas.component';
import { LimitesRubricasCadastroComponent } from 'src/app/pages/planejamento/limites-rubricas/limites-rubricas-cadastro/limites-rubricas-cadastro.component';
import { LimitesRubricasUsoComponent } from 'src/app/pages/planejamento/limites-rubricas/limites-rubricas-uso/limites-rubricas-uso.component';
import { MensalizacaoEditarComponent } from 'src/app/pages/contrato/mensalizacao-exec-orcamentaria/mensalizacao-editar/mensalizacao-editar.component';
import { ConsumoComponent } from 'src/app/pages/relatorio/consumo/consumo.component';
import { ArtigoPagamentoComponent } from 'src/app/pages/contrato/artigo/artigo-pagamento.component';
import { GraficoArtigoComponent } from 'src/app/pages/contrato/artigo/grafico-artigo/grafico-artigo.component';
import { PlanejamentoOrcamentarioComponent } from 'src/app/pages/planejamento/planejamento-lista/planejamento-orcamentario.component';
import { ConsumoArpComponent } from 'src/app/pages/relatorio/consumo-arp/consumo-arp.component';
import { SharedLibraryModule } from 'src/app/shared/shared-library/shared-library.module';
import { DetalheFinanceiroComponent } from 'src/app/pages/contrato/evolucao-financeira/detalhe-financeiro/detalhe-financeiro.component';
import { MatListModule } from '@angular/material/list';
import { TimelineModule } from 'primeng/timeline';
import { CardModule } from 'primeng/card';
import { PaginatorModule } from 'primeng/paginator';


export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: 'right',
  allowNegative: true,
  decimal: ',',
  precision: 2,
  prefix: 'R$ ',
  suffix: '',
  thousands: '.',
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(AdminLayoutRoutes),
    HttpClientModule,
    NgbModule,
    NgbPaginationModule,
    TableModule,
    ConfirmDialogModule,
    RadioButtonModule,
    CalendarModule,
    SliderModule,
    DialogModule,
    MultiSelectModule,
    ContextMenuModule,
    ButtonModule,
    ToastModule,
    InputTextModule,
    ProgressBarModule,
    HighchartsChartModule,
    MatMenuModule,
    MatSlideToggleModule,
    PickListModule,
    MatTooltipModule,
    Select2Module,
    NgxMaskModule.forRoot(),
    MatTabsModule,
    CurrencyMaskModule,
    FileUploadModule,
    SharedLibraryModule,
    MatListModule,
    TimelineModule,
    CardModule,
    TableModule,
    DropdownModule,
    FormsModule,
    PaginatorModule
  ],
  declarations: [
    DashboardComponent,
    ContratoComponent,
    PagamentoComponent,
    ContratoVigenciaComponent,
    PlanejamentoComponent,
    PlanejamentoCadastroComponent,
    LimitesRubricasComponent,
    LimitesRubricasCadastroComponent,
    LimitesRubricasUsoComponent,
    AnaliticoComponent,
    SinteticoComponent,
    UsuarioComponent,
    EvolucaoFinanceiraComponent,
    EvolucaoFinanceiraAquisicaoComponent,
    GraficoAquisicaoComponent,
    GraficoAquisicaoGeralComponent,
    GraficoComponent,
    EmpenhoComponent,
    ContratoDetalheComponent,
    ContratoCadastroComponent,
    RetencaoCadastroComponent,
    PagamentoCadastroComponent,
    EditarPagamentoComponent,
    ValoresRubricaComponent,
    ValoresRubricaDetalhadoComponent,
    ValoresRubricaDetalhadoContratoComponent,
    EmpenhoCadastroComponent,
    AquisicaoComponent,
    GraficoAquisComponent,
    GraficoGeralComponent,
    DemaisTiposComponent,
    CartaQuitacaoCadastroComponent,
    MensalizacaoEditarComponent,
    KeysPipe,
    SortByPipe,
    DetalheEvolucaoComponent,
    ConsumoComponent,
    PlanejamentoOrcamentarioComponent,
    ArtigoPagamentoComponent,
    GraficoArtigoComponent,
    ConsumoArpComponent,
    DetalheFinanceiroComponent,
    // UserComponent,
    // TablesComponent,
    // IconsComponent,
    // TypographyComponent,
    // NotificationsComponent,
    // MapComponent,
    // RtlComponent
  ],
  providers: [
    CustomerService,
    ConfirmationService,
    NgbActiveModal,
    DatePipe,
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig },
  ],
  bootstrap: [AdminLayoutComponent],
})
export class AdminLayoutModule { }
