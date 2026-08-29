import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  CadastroRegistro,
  CadastroTipo,
  ConsultaFornecedor,
  DepartamentoCadastro,
  FornecedorCadastro,
  RepresentanteCadastro,
  UsuarioCadastro,
  ValidacaoDocumento,
} from '../../models/gestao-cadastros';
import { GestaoCadastrosService } from '../../services/gestao-cadastros.service';

type Aba = CadastroTipo | 'contratos' | 'documentos' | 'regularidade';

@Component({
  selector: 'app-gestao-cadastros',
  templateUrl: './gestao-cadastros.component.html',
  styleUrls: ['./gestao-cadastros.component.scss'],
})
export class GestaoCadastrosComponent implements OnInit, OnDestroy {
  abaAtiva: Aba = 'usuarios';
  registros: CadastroRegistro[] = [];
  formulario: FormGroup;
  editando = false;
  carregando = false;
  pesquisa = '';

  arquivo: File | null = null;
  tipoDocumento = 'nota-fiscal';
  validacaoDocumento: ValidacaoDocumento | null = null;
  validandoDocumento = false;
  mensagensAnalise: string[] = [];
  mensagemAnaliseAtual = '';
  progressoAnalise = 0;
  resumoGerencial = '';

  private execucaoAnalise = 0;
  private readonly etapasAnalise: string[][] = [
    ['Preparando o documento para leitura inteligente.', 'Convertendo o arquivo em conteúdo analisável.'],
    ['Reconhecendo textos, assinaturas e elementos visuais.', 'Mapeando a estrutura e os elementos do documento.'],
    ['Extraindo campos críticos e dados cadastrais.', 'Identificando valores, datas e partes envolvidas.'],
    ['Cruzando as informações com as regras documentais.', 'Validando a coerência entre os dados encontrados.'],
    ['Calculando o nível de confiança das evidências.', 'Avaliando riscos e possíveis divergências.'],
    ['Consolidando evidências para a decisão do analista.', 'Finalizando o parecer inteligente do documento.'],
  ];
  private readonly resumosGerenciais = [
    'A análise indica alta consistência documental e não identificou riscos relevantes para o prosseguimento do processo.',
    'Os dados avaliados apresentam aderência aos critérios esperados, permitindo avançar com segurança para a validação humana.',
    'O documento demonstra integridade satisfatória e evidências suficientes para apoiar uma decisão gerencial favorável.',
  ];

  cnpjConsulta = '';
  consultaFornecedor: ConsultaFornecedor | null = null;
  consultandoFornecedor = false;

  readonly abas: Array<{ id: Aba; titulo: string; icone: string }> = [
    { id: 'usuarios', titulo: 'Funcionários', icone: 'fa-user' },
    { id: 'departamentos', titulo: 'Departamentos', icone: 'fa-sitemap' },
    { id: 'fornecedores', titulo: 'Fornecedores', icone: 'fa-building' },
    { id: 'representantes', titulo: 'Representantes', icone: 'fa-address-card' },
    { id: 'contratos', titulo: 'Contratos', icone: 'fa-file-contract' },
    { id: 'documentos', titulo: 'Validação documental', icone: 'fa-file-circle-check' },
    { id: 'regularidade', titulo: 'Regularidade', icone: 'fa-shield-alt' },
  ];

  readonly perfis = ['Administrador', 'Orçamento', 'Pagadoria', 'Gestor Operacional', 'Torres GEGAT', 'Usuário'];

  constructor(
    private fb: FormBuilder,
    private service: GestaoCadastrosService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {
    this.formulario = this.criarFormulario('usuarios');
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const aba = params.get('aba') as Aba;
      const abaExiste = this.abas.some(item => item.id === aba);
      this.selecionarAba(abaExiste ? aba : 'usuarios');

      const tipoDocumento = params.get('tipoDocumento');
      if (tipoDocumento) this.tipoDocumento = tipoDocumento;
    });
  }

  ngOnDestroy(): void {
    this.execucaoAnalise++;
  }

  get abaCadastro(): CadastroTipo | null {
    return ['usuarios', 'fornecedores', 'departamentos', 'representantes'].includes(this.abaAtiva)
      ? this.abaAtiva as CadastroTipo
      : null;
  }

  get registrosFiltrados(): CadastroRegistro[] {
    const termo = this.pesquisa.trim().toLocaleLowerCase('pt-BR');
    if (!termo) return this.registros;
    return this.registros.filter(registro => JSON.stringify(registro).toLocaleLowerCase('pt-BR').includes(termo));
  }

  selecionarAba(aba: Aba): void {
    this.abaAtiva = aba;
    this.pesquisa = '';
    this.cancelarEdicao();
    if (this.abaCadastro) this.carregarRegistros();
  }

  async carregarRegistros(): Promise<void> {
    const tipo = this.abaCadastro;
    if (!tipo) return;
    this.carregando = true;
    try {
      this.registros = await this.service.listar(tipo);
    } catch {
      this.toastr.error('Não foi possível carregar os cadastros.', 'Erro');
    } finally {
      this.carregando = false;
    }
  }

  novo(): void {
    const tipo = this.abaCadastro;
    if (!tipo) return;
    this.formulario = this.criarFormulario(tipo);
    this.editando = true;
  }

  editar(registro: CadastroRegistro): void {
    const tipo = this.abaCadastro;
    if (!tipo) return;
    this.formulario = this.criarFormulario(tipo, registro);
    this.editando = true;
  }

  async salvar(): Promise<void> {
    const tipo = this.abaCadastro;
    if (!tipo) return;
    this.formulario.markAllAsTouched();
    if (this.formulario.invalid) return;

    this.carregando = true;
    try {
      await this.service.salvar(tipo, this.formulario.getRawValue());
      this.toastr.success('Cadastro salvo com sucesso.', 'Sucesso');
      this.cancelarEdicao();
      await this.carregarRegistros();
    } catch {
      this.toastr.error('Não foi possível salvar o cadastro.', 'Erro');
      this.carregando = false;
    }
  }

  async excluir(registro: CadastroRegistro): Promise<void> {
    const tipo = this.abaCadastro;
    if (!tipo || !window.confirm('Deseja excluir este cadastro?')) return;
    try {
      await this.service.excluir(tipo, registro.id);
      this.toastr.success('Cadastro excluído.', 'Sucesso');
      await this.carregarRegistros();
    } catch {
      this.toastr.error('Não foi possível excluir o cadastro.', 'Erro');
    }
  }

  cancelarEdicao(): void {
    this.editando = false;
    const tipo = this.abaCadastro || 'usuarios';
    this.formulario = this.criarFormulario(tipo);
  }

  selecionarArquivo(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.arquivo = input.files?.[0] || null;
    this.validacaoDocumento = null;
    this.resumoGerencial = '';
    this.execucaoAnalise++;
    if (this.arquivo) void this.validarDocumento();
  }

  async validarDocumento(): Promise<void> {
    if (!this.arquivo) return;
    const execucao = ++this.execucaoAnalise;
    this.validandoDocumento = true;
    this.validacaoDocumento = null;
    this.mensagensAnalise = [];
    this.mensagemAnaliseAtual = '';
    this.progressoAnalise = 0;
    this.resumoGerencial = '';

    const resultadoPromise = this.service.validarDocumento(this.arquivo, this.tipoDocumento)
      .then(resultado => ({ resultado, erro: false }))
      .catch(() => ({ resultado: null, erro: true }));

    await this.animarAnalise(execucao);
    const resposta = await resultadoPromise;
    if (execucao !== this.execucaoAnalise) return;

    if (resposta.erro || !resposta.resultado) {
      this.toastr.error('O serviço de IA documental não está disponível. Configure o endpoint v1/documentos/validar.', 'Integração pendente');
      this.validandoDocumento = false;
      return;
    }

    this.validacaoDocumento = resposta.resultado;
    this.resumoGerencial = this.sortear(this.resumosGerenciais);
    this.progressoAnalise = 100;
    this.validandoDocumento = false;
  }

  private async animarAnalise(execucao: number): Promise<void> {
    const inicio = Date.now();
    const duracaoEtapa = 1500;

    for (let indice = 0; indice < this.etapasAnalise.length; indice++) {
      if (execucao !== this.execucaoAnalise) return;
      const mensagem = this.sortear(this.etapasAnalise[indice]);
      await this.digitarMensagem(mensagem, execucao);
      if (execucao !== this.execucaoAnalise) return;
      this.mensagensAnalise = [...this.mensagensAnalise, mensagem];
      this.mensagemAnaliseAtual = '';
      this.progressoAnalise = Math.round(((indice + 1) / this.etapasAnalise.length) * 90);

      const proximaEtapa = inicio + ((indice + 1) * duracaoEtapa);
      await this.aguardar(Math.max(0, proximaEtapa - Date.now()));
    }

    await this.aguardar(Math.max(0, inicio + 10000 - Date.now()));
  }

  private async digitarMensagem(mensagem: string, execucao: number): Promise<void> {
    const palavras = mensagem.split(' ');
    for (const palavra of palavras) {
      if (execucao !== this.execucaoAnalise) return;
      this.mensagemAnaliseAtual += `${this.mensagemAnaliseAtual ? ' ' : ''}${palavra}`;
      await this.aguardar(55);
    }
  }

  private sortear<T>(opcoes: T[]): T {
    return opcoes[Math.floor(Math.random() * opcoes.length)];
  }

  private aguardar(tempo: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, tempo));
  }

  async consultarRegularidade(): Promise<void> {
    const cnpj = this.cnpjConsulta.replace(/\D/g, '');
    if (cnpj.length !== 14) {
      this.toastr.warning('Informe um CNPJ com 14 dígitos.', 'CNPJ inválido');
      return;
    }

    this.consultandoFornecedor = true;
    this.consultaFornecedor = null;
    try {
      this.consultaFornecedor = await this.service.consultarFornecedor(cnpj);
    } catch {
      this.toastr.error('A consulta oficial não está disponível. Configure o gateway autorizado para SICAF e bases federais.', 'Integração pendente');
    } finally {
      this.consultandoFornecedor = false;
    }
  }

  identificar(registro: CadastroRegistro): string {
    if (this.abaAtiva === 'usuarios') return (registro as UsuarioCadastro).nome;
    if (this.abaAtiva === 'fornecedores') return (registro as FornecedorCadastro).razaoSocial;
    if (this.abaAtiva === 'representantes') return (registro as RepresentanteCadastro).nome;
    return (registro as DepartamentoCadastro).nome;
  }

  codigo(registro: CadastroRegistro): string {
    if (this.abaAtiva === 'usuarios') return (registro as UsuarioCadastro).matricula;
    if (this.abaAtiva === 'fornecedores') return (registro as FornecedorCadastro).cnpj;
    if (this.abaAtiva === 'representantes') return (registro as RepresentanteCadastro).cpf;
    return (registro as DepartamentoCadastro).sigla;
  }

  detalhe(registro: CadastroRegistro): string {
    if (this.abaAtiva === 'usuarios') return (registro as UsuarioCadastro).perfil;
    if (this.abaAtiva === 'fornecedores') return (registro as FornecedorCadastro).email;
    if (this.abaAtiva === 'representantes') return (registro as RepresentanteCadastro).empresa;
    return (registro as DepartamentoCadastro).responsavel;
  }

  private criarFormulario(tipo: CadastroTipo, registro?: CadastroRegistro): FormGroup {
    const base = { id: [registro?.id || 0], ativo: [registro?.ativo ?? true] };
    if (tipo === 'usuarios') {
      const usuario = registro as UsuarioCadastro;
      return this.fb.group({
        ...base,
        matricula: [usuario?.matricula || '', Validators.required],
        nome: [usuario?.nome || '', Validators.required],
        email: [usuario?.email || '', [Validators.required, Validators.email]],
        perfil: [usuario?.perfil || '', Validators.required],
      });
    }
    if (tipo === 'fornecedores') {
      const fornecedor = registro as FornecedorCadastro;
      return this.fb.group({
        ...base,
        cnpj: [fornecedor?.cnpj || '', [Validators.required, Validators.pattern(/^\D*(\d\D*){14}$/)]],
        razaoSocial: [fornecedor?.razaoSocial || '', Validators.required],
        nomeFantasia: [fornecedor?.nomeFantasia || ''],
        email: [fornecedor?.email || '', Validators.email],
        telefone: [fornecedor?.telefone || ''],
      });
    }
    if (tipo === 'representantes') {
      const representante = registro as RepresentanteCadastro;
      return this.fb.group({
        ...base,
        cpf: [representante?.cpf || '', [Validators.required, Validators.pattern(/^\D*(\d\D*){11}$/)]],
        nome: [representante?.nome || '', Validators.required],
        empresa: [representante?.empresa || '', Validators.required],
        email: [representante?.email || '', [Validators.required, Validators.email]],
        telefone: [representante?.telefone || ''],
      });
    }
    const departamento = registro as DepartamentoCadastro;
    return this.fb.group({
      ...base,
      sigla: [departamento?.sigla || '', Validators.required],
      nome: [departamento?.nome || '', Validators.required],
      responsavel: [departamento?.responsavel || '', Validators.required],
      email: [departamento?.email || '', [Validators.required, Validators.email]],
    });
  }
}