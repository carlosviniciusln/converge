export enum Endpoints {
  URL_DASHBOARD = 'v1/dashboard',
  URL_DASHBOARD_ORCAMENTO_EXECUCAO = 'v1/dashboard/orcamento-execucao-contratual',
  URL_DASHBOARD_EXECUCAO = 'v1/dashboard/execucao-contratual',
  URL_DASHBOARD_EXECUCAO_DETALHE = 'v1/dashboard/execucao-contratual-detalhe',
  URL_DASHBOARD_ORCAMENTO = 'v1/dashboard/orcamento',
  URL_LOGIN = 'v1/auth',

  URL_CONTRATOS = 'v1/contrato',
  URL_CONTRATOS_ATIVOS = 'v1/contrato/ativo',
  URL_CONTRATOS_VIGENCIAS = 'v1/contrato/vigencias',
  URL_CONTRATOS_EVOLUCAO_FINANCEIRA = 'v1/contrato/evolucao-financeira',
  URL_CONTRATOS_EVOLUCAO_FINANCEIRA_AQUISICAO = 'v1/contrato/evolucao-financeira-aquisicao',

  URL_CONTRATOS_PENDENTES = 'v1/PendenciaPagamento',
  URL_ATUALIZA_CONTRATOS_PENDENTES = 'v1/PendenciaPagamento',

  URL_RETENCAO = 'v1/Retencao',

  URL_PAGAMENTO = 'v1/pagamento',
  URL_PAGAMENTO_PAGINADO = 'v1/pagamento/paginado',
  URL_INFORME_MENSAL_ANALITICO = 'v1/pagamento/informe-mensal-analitico',
  URL_INFORME_MENSAL_SINTETICO = 'v1/pagamento/informe-mensal-sintetico',
  URL_INFORME_MENSAL_SINTETICO_RUBRICA_TIPO = 'v1/pagamento/informe-mensal-sintetico-rubrica-tipo',

  URL_RUBRICA = 'v1/rubrica',
  URL_FILIAL = 'v1/filial',

  URL_VALOR_EXECUTADO = 'v1/valorexecutado',

  URL_USUARIO = 'v1/usuario',
  URL_USUARIO_PAGINADO = 'v1/usuario/paginado',

  URL_EMPENHO = 'v1/empenho',
  URL_EMPENHO_PAGINADO = 'v1/empenho/paginado',

  URL_CARTA = 'v1/cartaquitacao',

  URL_ORCAMENTO = 'v1/orcamento',

  URL_ORCAMENTO_CADASTRO = 'v1/PlanejamentoOrcamentario/cadastrar-planejamento-item',
  URL_ORCAMENTO_EDITA = 'v1/PlanejamentoOrcamentario/editar-planejamento-item',

  URL_PLANEJAMENTO_ORCAMENTO = 'v1/PlanejamentoOrcamentario',

  URL_MENSALIZACAO = 'v1/mensalizacao',

  URL_EXECUCAO_ORCAMENTARIA = 'v1/execucaoOrcamentaria',

  URL_PREPOSTO = 'v1/Preposto',

  URL_ATESTE = 'v1/Ateste',

  URL_PLANEJAMENTO_ORCAMENTARIO_RUBRICA = 'v1/PlanejamentoOrcamentario/rubrica',
  URL_PLANEJAMENTO_ORCAMENTARIO_UD = 'v1/PlanejamentoOrcamentario/rubrica-ud',
  URL_PLANEJAMENTO_ORCAMENTARIO_CONTRATO = 'v1/PlanejamentoOrcamentario/ud-contrato',
  URL_PLANEJAMENTO_ORCAMENTARIO_MES = 'v1/PlanejamentoOrcamentario/contrato-mes',
  URL_PLANEJAMENTO_ORCAMENTARIO_FILTER_PAGINADO = 'v1/PlanejamentoOrcamentario/filter-paginado',
  URL_PLANEJAMENTO_ORCAMENTARIO_DASHBOARD = 'v1/PlanejamentoOrcamentario/dashboard',
  URL_PLANEJAMENTO_ORCAMENTARIO_RELATORIO_RUBRICAS = 'v1/PlanejamentoOrcamentario/obter-relatorio-rubricas-excel',
  URL_PLANEJAMENTO_ORCAMENTARIO_ALTERAR_STATUS = 'v1/PlanejamentoOrcamentario/alterar-status-planejamento-item'
}
