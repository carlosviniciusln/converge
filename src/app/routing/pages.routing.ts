import { Routes } from '@angular/router';


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
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { DetalharAtesteComponent } from 'src/app/pages/ateste/detalhar-ateste/detalhar-ateste.component';
import { DevelopComponent } from 'src/app/components/develop/develop.component';
import { LimitesComponent } from 'src/app/pages/planejamento/limites/limites.component';
import { RelatorioContratoComponent } from 'src/app/pages/relatorio/relatorio-contrato/relatorio-contrato.component';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { DashboardV2Component } from '../pages/dashboard-v2/dashboard-v2.component';
import { ContratoComponent } from '../pages/contrato/contrato.component';
import { DotacaoComponent } from '../pages/dotacao/dotacao.component';
import { PlanejamentoV2Component } from '../pages/planejamento-v2/planejamento-v2.component';
import { PlanejamentoGeralV2Component } from '../pages/planejamento-v2/planejamento-geral-v2/planejamento-geral-v2.component';
import { GestaoCadastrosComponent } from '../pages/gestao-cadastros/gestao-cadastros.component';
import { NovoPlanejamentoComponent } from '../pages/planejamento/novo-planejamento/novo-planejamento.component';
import { PenalidadesComponent } from '../pages/penalidades/penalidades.component';
import { BuscaContratoComponent } from '../pages/dashboard/busca-contrato/busca-contrato.component';
import { BuscaUdComponent } from '../pages/dashboard/busca-ud/busca-ud.component';
import { BuscaGerencialComponent } from '../pages/dashboard/busca-gerencial/busca-gerencial.component';



export const PagesRoutes: Routes = [
  { path: 'develop', component: DevelopComponent },
  { path: 'dashboard-old', component: DashboardComponent },
  { path: 'dashboard', component: DashboardV2Component },
  { path: 'contrato', component: ContratoComponent },
  { path: 'contrato/atas', component: ContratoComponent },
  { path: 'contrato/create', component: ContratoCadastroComponent },
  { path: 'retencao/create', component: RetencaoCadastroComponent },
  { path: 'contrato/detalhe/:voltar/:id', component: ContratoDetalheComponent },
  { path: 'contrato/ficha/:id', component: BuscaContratoComponent },
  { path: 'busca-contrato', component: BuscaContratoComponent },
  { path: 'busca-ud', component: BuscaUdComponent },
  { path: 'busca-gerencial', component: BuscaGerencialComponent },
  { path: 'contrato/evolucao-financeira/:id', component: EvolucaoFinanceiraComponent },
  { path: 'contrato/exec-orc-mensalizacao/:id', component: MensalizacaoComponent },
  { path: 'contrato/evolucao-financeira-aquisicao/:id', component: EvolucaoFinanceiraAquisicaoComponent },
  { path: 'contrato/conciliacao', component: ContratoPendenteComponent },
  { path: 'contrato/artigos', component: ArtigoPagamentoComponent },
  { path: 'novo-planejamento', component: NovoPlanejamentoComponent },
  { path: 'planejamento', component: PlanejamentoComponent },
  { path: 'planejamento/create', component: PlanejamentoCadastroComponent },
  { path: 'planejamento/limites', component: LimitesRubricasComponent },
  { path: 'valores-executados', component: ValoresExecutadosComponent },
  { path: 'planejamento/limites/create', component: LimitesRubricasCadastroComponent },
  { path: 'planejamento-orcamentario', component: PlanejamentoOrcamentarioComponent },
  { path: 'planejamento-orcamentario-novo', component: PlanejamentoV2Component },
  { path: 'pagamento', component: PagamentoComponent },
  { path: 'consumo', component: ConsumoComponent },
  { path: 'consumo-arp', component: ConsumoArpComponent },
  { path: 'export-data-pagamento', component: ExportPagamentoComponent },
  { path: 'informe/analitico', component: AnaliticoComponent },
  { path: 'informe/sintetico', component: SinteticoComponent },
  { path: 'planejamento-orcamentario-detalhe', component: PlanejamentoGeralComponent },
  { path: 'planejamento-orcamentario-detalhe-novo', component: PlanejamentoGeralV2Component },
  //{ path: 'usuario', component: UsuarioComponent, canActivate: [AuthGuard] },
  { path: 'usuarios', component: UsuarioComponent },
  { path: 'cadastros', component: GestaoCadastrosComponent },
  { path: 'empenho', component: EmpenhoComponent },
  { path: 'mod-develop', component: DevelopComponent },
  { path: 'orcamento/limites', component: LimitesComponent },
  { path: 'ateste', component: AtesteComponent , canActivate: [AuthGuard]},
  { path: 'ateste/contrato/:id', component: DetalharAtesteComponent , canActivate: [AuthGuard]},
  { path: 'penalidades', component: PenalidadesComponent, canActivate: [AuthGuard] },
  { path: 'relatorio-contrato', component: RelatorioContratoComponent },
  { path: 'dotacao', component: DotacaoComponent}
];
