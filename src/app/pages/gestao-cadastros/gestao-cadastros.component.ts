import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {
  CadastroRegistro,
  CadastroTipo,
  ConsultaFornecedor,
  DepartamentoCadastro,
  FornecedorCadastro,
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
export class GestaoCadastrosComponent implements OnInit {
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

  cnpjConsulta = '';
  consultaFornecedor: ConsultaFornecedor | null = null;
  consultandoFornecedor = false;

  readonly abas: Array<{ id: Aba; titulo: string; icone: string }> = [
    { id: 'usuarios', titulo: 'Usuários', icone: 'fa-user' },
    { id: 'fornecedores', titulo: 'Fornecedores', icone: 'fa-building' },
    { id: 'contratos', titulo: 'Contratos', icone: 'fa-file-contract' },
    { id: 'departamentos', titulo: 'Departamentos', icone: 'fa-sitemap' },
    { id: 'documentos', titulo: 'Validação documental', icone: 'fa-file-circle-check' },
    { id: 'regularidade', titulo: 'Regularidade', icone: 'fa-shield-alt' },
  ];

  readonly perfis = ['Administrador', 'Orçamento', 'Pagadoria', 'Gestor Operacional', 'Torres GEGAT', 'Usuário'];

  constructor(
    private fb: FormBuilder,
    private service: GestaoCadastrosService,
    private toastr: ToastrService
  ) {
    this.formulario = this.criarFormulario('usuarios');
  }

  ngOnInit(): void {
    this.carregarRegistros();
  }

  get abaCadastro(): CadastroTipo | null {
    return ['usuarios', 'fornecedores', 'departamentos'].includes(this.abaAtiva)
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
  }

  async validarDocumento(): Promise<void> {
    if (!this.arquivo) return;
    this.validandoDocumento = true;
    this.validacaoDocumento = null;
    try {
      this.validacaoDocumento = await this.service.validarDocumento(this.arquivo, this.tipoDocumento);
    } catch {
      this.toastr.error('O serviço de IA documental não está disponível. Configure o endpoint v1/documentos/validar.', 'Integração pendente');
    } finally {
      this.validandoDocumento = false;
    }
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
    return (registro as DepartamentoCadastro).nome;
  }

  codigo(registro: CadastroRegistro): string {
    if (this.abaAtiva === 'usuarios') return (registro as UsuarioCadastro).matricula;
    if (this.abaAtiva === 'fornecedores') return (registro as FornecedorCadastro).cnpj;
    return (registro as DepartamentoCadastro).sigla;
  }

  detalhe(registro: CadastroRegistro): string {
    if (this.abaAtiva === 'usuarios') return (registro as UsuarioCadastro).perfil;
    if (this.abaAtiva === 'fornecedores') return (registro as FornecedorCadastro).email;
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