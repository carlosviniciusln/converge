import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { ContratoComponent } from '../../pages/contrato/contrato.component';
import { PagamentoComponent } from 'src/app/pages/relatorio/pagamento/pagamento.component';
import { AnaliticoComponent } from 'src/app/pages/relatorio/informe-mensal/analitico/analitico.component';
import { SinteticoComponent } from 'src/app/pages/relatorio/informe-mensal/sintetico/sintetico.component';
import { UsuarioComponent } from 'src/app/pages/usuario/usuario.component';
import { EvolucaoFinanceiraComponent } from 'src/app/pages/contrato/evolucao-financeira/evolucao-financeira.component';
import { EmpenhoComponent } from 'src/app/pages/relatorio/empenho/empenho.component';
import { ContratoDetalheComponent } from 'src/app/pages/contrato/contrato-detalhe/contrato-detalhe.component';
import { ContratoCadastroComponent } from 'src/app/pages/contrato/contrato-cadastro/contrato-cadastro.component';
import { RetencaoCadastroComponent } from 'src/app/pages/contrato/retencao/retencao-cadastro.component';
import { EvolucaoFinanceiraAquisicaoComponent } from 'src/app/pages/contrato/evolucao-financeira-aquisicao/evolucao-financeira-aquisicao.component';
import { PlanejamentoComponent } from 'src/app/pages/planejamento/planejamento.component';
import { PlanejamentoCadastroComponent } from 'src/app/pages/planejamento/planejamento-cadastro/planejamento-cadastro.component';
import { LimitesRubricasComponent } from 'src/app/pages/planejamento/limites-rubricas/limites-rubricas.component';
import { LimitesRubricasCadastroComponent } from 'src/app/pages/planejamento/limites-rubricas/limites-rubricas-cadastro/limites-rubricas-cadastro.component';
import { MensalizacaoComponent } from 'src/app/pages/contrato/mensalizacao-exec-orcamentaria/mensalizacao-exec-orcamentaria.component';
import { ValoresExecutadosComponent } from 'src/app/pages/valores-executados/valores-executados.component';
import { ContratoPendenteComponent } from 'src/app/pages/contrato/contrato-pendente/contrato-pendente.component';
import { ExportPagamentoComponent } from 'src/app/pages/relatorio/export-pagamento/export-pagamento.component';
import { ConsumoComponent } from 'src/app/pages/relatorio/consumo/consumo.component';
import { ArtigoPagamentoComponent } from 'src/app/pages/contrato/artigo/artigo-pagamento.component';
import { PlanejamentoOrcamentarioComponent } from 'src/app/pages/planejamento/planejamento-lista/planejamento-orcamentario.component';
import { PlanejamentoGeralComponent } from 'src/app/pages/planejamento/planejamento-geral/planejamento-geral.component';
import { ConsumoArpComponent } from 'src/app/pages/relatorio/consumo-arp/consumo-arp.component';
import { AtesteComponent } from 'src/app/pages/ateste/ateste.component';
import { AuthGuard } from 'src/app/shared/interceptors/auth.guard';
import { DetalharAtesteComponent } from 'src/app/pages/ateste/detalhar-ateste/detalhar-ateste.component';
import { DevelopComponent } from 'src/app/components/develop/develop.component';
import { LimitesComponent } from 'src/app/pages/planejamento/limites/limites.component';
import { RelatorioContratosComponent } from 'src/app/pages/planejamento/relatorio/relatorio-contratos/relatorio-contratos.component';

export const AdminLayoutRoutes: Routes = [
  { path: 'develop', component: DevelopComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'contrato', component: ContratoComponent },
  { path: 'contrato/atas', component: ContratoComponent },
  { path: 'contrato/create', component: ContratoCadastroComponent },
  { path: 'retencao/create', component: RetencaoCadastroComponent },
  { path: 'contrato/detalhe/:voltar/:id', component: ContratoDetalheComponent },
  { path: 'contrato/evolucao-financeira/:id', component: EvolucaoFinanceiraComponent },
  { path: 'contrato/exec-orc-mensalizacao/:id', component: MensalizacaoComponent },
  { path: 'contrato/evolucao-financeira-aquisicao/:id', component: EvolucaoFinanceiraAquisicaoComponent },
  { path: 'contrato/conciliacao', component: ContratoPendenteComponent },
  { path: 'contrato/artigos', component: ArtigoPagamentoComponent },
  { path: 'planejamento', component: PlanejamentoComponent },
  { path: 'planejamento/create', component: PlanejamentoCadastroComponent },
  { path: 'planejamento/limites', component: LimitesRubricasComponent },
  { path: 'valores-executados', component: ValoresExecutadosComponent },
  { path: 'planejamento/limites/create', component: LimitesRubricasCadastroComponent },
  { path: 'planejamento-orcamentario', component: PlanejamentoOrcamentarioComponent },
  { path: 'pagamento', component: PagamentoComponent },
  { path: 'consumo', component: ConsumoComponent },
  { path: 'consumo-arp', component: ConsumoArpComponent },
  { path: 'export-data-pagamento', component: ExportPagamentoComponent },
  { path: 'informe/analitico', component: AnaliticoComponent },
  { path: 'informe/sintetico', component: SinteticoComponent },
  { path: 'planejamento-orcamentario-detalhe', component: PlanejamentoGeralComponent },
  //{ path: 'usuario', component: UsuarioComponent, canActivate: [AuthGuard] },
  { path: 'usuarios', component: UsuarioComponent },
  { path: 'empenho', component: EmpenhoComponent },
  { path: 'mod-develop', component: DevelopComponent },
  { path: 'orcamento/limites', component: LimitesComponent },

  //   { path: "icons", component: IconsComponent },
  //   { path: "maps", component: MapComponent },
  //   { path: "notifications", component: NotificationsComponent },
  //   { path: "user", component: UserComponent },
  //   { path: "tables", component: TablesComponent },
  //   { path: "typography", component: TypographyComponent },
  //   { path: "rtl", component: RtlComponent },

  { path: 'ateste', component: AtesteComponent , canActivate: [AuthGuard]},
  { path: 'ateste/contrato/:id', component: DetalharAtesteComponent , canActivate: [AuthGuard]},


  //Relatório de Contratos
   { path: 'relatorio-contratos', component: RelatorioContratosComponent },


];
