# Plano de implementacao - Motor unificado de faturamento

## 1. Objetivo da demonstracao

Entregar uma jornada navegavel que prove ao socio que o Converge consegue:

1. cadastrar regras diferentes por contrato sem alterar codigo;
2. abrir uma competencia e registrar medicoes/eventos;
3. calcular faturamento, SLA, glosas, multas e retencoes separadamente;
4. bloquear a liberacao por pendencia documental sem alterar o valor calculado;
5. explicar cada resultado em uma memoria de calculo auditavel;
6. recalcular preservando versao, usuario, data e resultado anterior.

O primeiro incremento sera um prototipo funcional no frontend, com dados locais persistidos em `localStorage`, seguindo o padrao ja usado no projeto. A API e o banco SQL Server entram numa etapa posterior, mantendo os mesmos contratos de dados.

## 2. Recorte eficiente para a primeira apresentacao

Usar tres contratos demonstrativos, pois juntos cobrem os mecanismos mais importantes:

| Cenario | Regras demonstradas | Razao da escolha |
|---|---|---|
| Torino 9.266/2023 | 70% entrega, 30% instalacao, servico por demanda e trade-in unitario | Demonstra marcos e desconto por quantidade |
| Telecom 11.659/2022 | mensal por circuito ativo, pro rata, indisponibilidade e faixa de SLA | Demonstra recorrencia e calculo operacional complexo |
| Globalweb 01412/2025 | mensalidade, primeira/ultima fatura proporcional e bloqueio documental | Demonstra separacao entre valor calculado e liberacao |

Vivo, HITSS, Amazon e ServiceNow entram como expansao depois que o fluxo vertical estiver validado.

## 3. Decisoes de arquitetura

- Criar um modulo funcional de motor de faturamento integrado ao menu `Operacional > Faturamento`.
- Manter o calculo em funcoes TypeScript puras, sem dependencia da interface, para permitir testes e futura migracao para backend.
- Modelar regras com tipos e parametros conhecidos. Nao executar SQL ou JavaScript informado pelo usuario.
- Separar obrigatoriamente `descontoSla`, `glosa`, `penalidade`, `retencaoContratual` e `retencaoTributaria`.
- Separar `valorCalculado`, `valorLiberado` e `statusLiberacao`.
- Versionar regras por inicio/fim de vigencia e impedir alteracao retroativa silenciosa.
- Gerar uma linha de memoria para cada regra aplicada, incluindo formula, base, aliquota, quantidade e resultado.
- Usar centavos inteiros ou biblioteca decimal no motor; nunca depender de ponto flutuante para valores financeiros.
- Tratar a sugestao `FORMULA_SQL` dos anexos como uma DSL controlada/operadores permitidos na aplicacao produtiva, evitando execucao arbitraria e dependencia do banco.

## 4. Fluxo de telas da demonstracao

1. **Cockpit de competencias**: contratos, competencia atual, status, bruto, descontos, liquido e bloqueios.
2. **Configuracao contratual**: dados gerais, itens/unidades, regras de faturamento, SLA, penalidades e documentos.
3. **Medicao da competencia**: quantidades, marcos, circuitos ativos, interrupcoes, eventos e documentos.
4. **Simulacao do calculo**: pre-visualizacao antes do fechamento, alertas e comparacao com a versao anterior.
5. **Espelho de faturamento**: resumo financeiro e memoria detalhada por regra.
6. **Historico e auditoria**: recalculos, mudancas de regra, bloqueios e liberacoes.

## 5. Backlog sequenciado

### Status da implementacao em 22/09/2026

| Task | Status | Entrega |
|---|---|---|
| FAT-001 | Concluida | Dominio tipado sem condicionais por fornecedor |
| FAT-002 | Concluida | Repositorio substituivel, `localStorage`, seed e restauracao |
| FAT-003 | Concluida | Rota, menu e shell responsivo |
| FAT-010 | Concluida | CRUD de itens faturaveis e unidades |
| FAT-011 | Concluida | CRUD de regras versionadas de faturamento |
| FAT-013 | Concluida | CRUD separado de penalidades e documentos bloqueadores |
| FAT-020 | Concluida | Utilitarios monetarios em centavos com sete testes unitarios |

Proximo marco: FAT-021, calculo do faturamento bruto usando as regras configuradas.

### Fase 0 - Fundacao do dominio

#### [x] FAT-001 - Definir contratos TypeScript do dominio

Criar modelos para contrato, item faturavel, unidade, regra versionada, indicador SLA, competencia, medicao, evento, documento, bloqueio, resultado e memoria de calculo.

**Aceite:** todos os cenarios dos tres contratos cabem nos modelos sem campos especificos como `regraTorino` ou `regraTelecom`.

#### [x] FAT-002 - Criar repositorio local e massa demonstrativa

Implementar servico com interface substituivel, seed dos tres contratos e persistencia em `localStorage`.

**Aceite:** recarregar a pagina preserva alteracoes; uma acao permite restaurar a demonstracao.

#### [x] FAT-003 - Criar rota, menu e estrutura visual

Adicionar rota `/faturamento/motor`, entrada no menu e shell com navegacao das etapas.

**Aceite:** acesso pelo menu existente, layout responsivo e sem regressao nas rotas de Ateste/Pagamento.

### Fase 1 - Parametrizacao contratual

#### [x] FAT-010 - Cadastro de itens e unidades faturaveis

Permitir equipamento, servico mensal/eventual, circuito, OS, celula, licenca e trade-in, com valor, unidade de medida, quantidade e vigencia.

**Aceite:** Torino e Telecom podem ser representados integralmente pela tela.

#### [x] FAT-011 - Editor de regras de faturamento

Suportar percentual por marco, valor fixo, quantidade ativa, demanda, pro rata, transicao, retencao liberavel e desconto unitario.

**Aceite:** formulario muda os parametros conforme o tipo e valida campos obrigatorios/incompativeis.

#### [x] FAT-012 - Editor de SLA e faixas

Cadastrar indicador, meta, unidade, base de desconto, regra por faixa, ocorrencia, hora ou minuto e teto.

**Aceite:** faixas nao podem se sobrepor e a vigencia da regra e obrigatoria.

#### [x] FAT-013 - Penalidades e documentos obrigatorios

Configurar penalidades administrativas separadas e documentos que bloqueiam pagamento.

**Aceite:** a interface deixa claro que bloqueio documental nao e desconto financeiro.

### Fase 2 - Motor deterministico

#### [x] FAT-020 - Normalizacao monetaria e arredondamento

Criar utilitarios para centavos, percentuais, pro rata, arredondamento por regra e limites.

**Aceite:** testes cobrem valores decimais, limites, zero, negativos proibidos e meses com duracoes diferentes.

#### [x] FAT-021 - Calculo do faturamento bruto

Implementar marcos, mensal recorrente, quantidade ativa, demanda, pro rata e transicao.

**Aceite:** Torino calcula entrega/instalacao e Globalweb calcula primeira/ultima competencia proporcional.

#### [x] FAT-022 - Calculo de SLA e glosas

Implementar indisponibilidade por minuto, faixas, ocorrencias, duracao excedente e teto.

**Aceite:** Telecom reproduz `VD = (VC / TTMM) x minutos` e aplica a faixa adicional correta.

#### [x] FAT-023 - Penalidades e retencoes

Calcular multas por dia/ocorrencia/percentual, teto cumulativo, trade-in e retencao liberavel.

**Aceite:** cada natureza aparece separada e o teto nunca e ultrapassado.

#### [x] FAT-024 - Consolidacao e memoria de calculo

Consolidar:

`liquido = bruto - SLA - glosa - multas - retencao contratual - retencao tributaria`

**Aceite:** toda parcela do total possui origem rastreavel; soma da memoria confere com o resumo.

### Fase 3 - Operacao mensal

#### [x] FAT-030 - Cockpit de competencias

Listar contratos/competencias com filtros e estados `Rascunho`, `Em apuracao`, `Calculada`, `Bloqueada`, `Liberada` e `Fechada`.

**Aceite:** valores e pendencias mais relevantes ficam visiveis sem abrir o detalhe.

#### [x] FAT-031 - Entrada de medicoes e eventos

Registrar quantidades, marcos, circuitos ativos, interrupcoes, chamados, severidade e atrasos.

**Aceite:** somente campos relevantes ao contrato selecionado sao exibidos.

#### [x] FAT-032 - Checklist documental e bloqueios

Registrar entrega/validacao de documentos e criar/remover bloqueios com motivo e auditoria.

**Aceite:** competencia pode estar calculada e bloqueada simultaneamente; liberar nao recalcula valores.

#### [x] FAT-033 - Simulacao, fechamento e recalculo

Permitir simular, fechar e recalcular mediante justificativa, preservando versoes anteriores.

**Aceite:** fechamento exige medicao valida; recalculo nunca sobrescreve a memoria anterior.

### Fase 4 - Saidas executivas e auditoria

#### [x] FAT-040 - Espelho de faturamento

Exibir KPIs de bruto, SLA, glosa, multas, retencoes, liquido calculado, valor liberado e status.

**Aceite:** usuario consegue expandir cada linha ate o evento e a regra que produziram o valor.

#### [x] FAT-041 - Comparacao entre calculos

Comparar versoes lado a lado, destacando regra, medicao e impacto financeiro alterados.

**Aceite:** diferenca total equivale a soma das diferencas detalhadas.

#### [x] FAT-042 - Exportacao do espelho

Gerar PDF/planilha com identificacao do contrato, competencia, resumo, memoria e bloqueios.

**Aceite:** exportado confere com a tela e inclui data, usuario e versao do calculo.

#### [x] FAT-043 - Trilha de auditoria

Registrar criacao/alteracao de regra, processamento, fechamento, bloqueio, liberacao e recalculo.

**Aceite:** eventos sao imutaveis e filtraveis por contrato, competencia e usuario.

### Fase 5 - Qualidade da demonstracao

#### [x] FAT-050 - Matriz automatizada de cenarios

Criar testes unitarios para os tres contratos e para cada tipo de regra implementado.

**Aceite:** resultados esperados sao fixados em fixtures e executados no build.

#### [x] FAT-051 - Estados de interface

Cobrir carregamento, vazio, erro, validacao, confirmacao, bloqueado, sem permissao e responsividade.

**Aceite:** fluxo funciona em desktop e tablet sem texto cortado ou sobreposicao.

#### [x] FAT-052 - Roteiro e reset da demonstracao

Criar dados coerentes, botao de restauracao e roteiro de 8 a 10 minutos.

**Aceite:** demonstracao pode ser repetida do inicio, sem preparacao manual no navegador.

## 6. Ordem de implementacao recomendada

1. FAT-001 a FAT-003: fundacao navegavel.
2. FAT-010, FAT-011 e FAT-013: parametrizar Torino e Globalweb.
3. FAT-020, FAT-021 e FAT-024: primeiro calculo ponta a ponta.
4. FAT-030 a FAT-033: transformar calculo em fluxo operacional.
5. FAT-012 e FAT-022: adicionar complexidade de SLA do Telecom.
6. FAT-023: completar penalidades e retencoes.
7. FAT-040, FAT-041 e FAT-043: explicar e auditar o resultado.
8. FAT-042 e FAT-050 a FAT-052: fechar qualidade e apresentacao.

O primeiro marco demonstravel deve ocorrer apos FAT-024: cadastrar Torino, informar entrega/instalacao/trade-in e visualizar o liquido com memoria. Nao esperar todos os cadastros para validar a experiencia.

## 7. Roteiro sugerido para o socio

1. Abrir o cockpit e mostrar tres contratos com modelos distintos.
2. Entrar no Torino e mostrar que 70/30 e trade-in sao parametros, nao codigo dedicado.
3. Abrir uma competencia, informar quantidades e executar a simulacao.
4. Expandir a memoria e conferir formula, base, quantidade e resultado.
5. Abrir o Telecom e demonstrar indisponibilidade por minuto e faixa de SLA.
6. Abrir o Globalweb, calcular normalmente e mostrar pagamento bloqueado por documento ausente.
7. Validar o documento e liberar o mesmo valor, provando a separacao entre calculo e liberacao.
8. Alterar uma medicao, recalcular com justificativa e comparar as duas versoes.

## 8. Fora do primeiro incremento

- Execucao real em SQL Server Agent.
- Integracoes reais com SAP, ServiceNow, SEI ou portal fiscal.
- Interpretacao automatica de clausulas contratuais por IA.
- Editor livre de SQL/formulas arbitrarias.
- Migracao imediata dos registros legados de ateste e pagamento.
- Cobertura integral dos sete contratos antes da validacao do fluxo.

## 9. Evolucao para producao

Depois da aprovacao do prototipo:

1. [x] publicar contrato OpenAPI para substituir o repositorio local;
2. [x] implementar schema SQL versionado e migracoes;
3. [ ] executar o motor no backend em transacao idempotente;
4. [ ] adicionar controle de concorrencia, perfis e segregacao de funcoes;
5. [ ] importar contratos/regras validados pelo juridico e pelo gestor;
6. [ ] homologar cada formula contra planilhas e memorias reais;
7. [ ] integrar o resultado aprovado ao fluxo atual de ateste/pagamento;
8. [ ] ativar observabilidade, conciliacao e recuperacao de falhas.

## 10. Definicao de pronto da prova de conceito

- Os tres contratos podem ser configurados sem condicional especifica por fornecedor.
- Os resultados batem com a matriz de testes e com a memoria exibida.
- Recalculo e versionamento sao demonstraveis.
- Bloqueio documental nao altera o valor calculado.
- SLA, glosa, multa e retencao nunca aparecem agregados numa categoria ambigua.
- Dados sobrevivem ao recarregamento e podem ser restaurados.
- Build Angular e testes do motor passam sem erros.
- O roteiro completo cabe em ate 10 minutos.