import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CategoriaDocumento, DocumentoGovernanca, FiltroAuditoria, RegistroAuditoria } from '../../models/governanca-contratual';
import { GovernancaContratualService } from '../../services/governanca-contratual.service';
import { TokenStorageService } from '../../shared/services/token-storage.service';

type ModoGovernanca = 'documentos' | 'auditoria';

@Component({ selector: 'app-governanca', templateUrl: './governanca.component.html', styleUrls: ['./governanca.component.scss'] })
export class GovernancaComponent implements OnInit {
  modo: ModoGovernanca = 'documentos';
  documentos: DocumentoGovernanca[] = [];
  auditoria: RegistroAuditoria[] = [];
  filtro: FiltroAuditoria = {};
  contratoSelecionado = 0;
  categoriaSelecionada: CategoriaDocumento = 'Contrato';
  arquivo: File | null = null;
  enviando = false;

  readonly contratos = this.service.listarContratos();
  readonly categorias: CategoriaDocumento[] = ['Contrato', 'Termo aditivo', 'Proposta', 'Nota fiscal', 'Parecer', 'Relatório', 'Documento SEI', 'Outros'];
  readonly usuarios = Array.from(new Set(this.service.listarAuditoria().map(item => item.usuario)));
  readonly acoes = ['Criação', 'Alteração', 'Upload', 'Aprovação', 'Vinculação'];
  readonly modulos = ['Contratos', 'Documentos', 'Financeiro', 'SEI'];

  constructor(private route: ActivatedRoute, public service: GovernancaContratualService, private token: TokenStorageService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.modo = data['modo'] || 'documentos';
      this.carregar();
    });
  }

  carregar(): void {
    this.documentos = this.service.listarDocumentos();
    this.auditoria = this.service.listarAuditoria(this.filtro);
  }

  selecionarArquivo(event: Event): void {
    this.arquivo = (event.target as HTMLInputElement).files?.[0] || null;
  }

  async enviarDocumento(): Promise<void> {
    if (!this.arquivo || !this.contratoSelecionado) {
      this.toastr.warning('Selecione o contrato e o arquivo.', 'Documento');
      return;
    }
    this.enviando = true;
    try {
      const usuario = this.token.getUser()?.name || this.token.getUser()?.nome || 'Usuário demonstrativo';
      await this.service.adicionarDocumento(this.contratoSelecionado, this.arquivo, this.categoriaSelecionada, usuario);
      this.arquivo = null;
      this.carregar();
      this.toastr.success('Documento versionado e registrado na trilha.', 'Sucesso');
    } finally {
      this.enviando = false;
    }
  }

  limparFiltros(): void { this.filtro = {}; this.carregar(); }
  contratoNumero(id: number): string { return this.contratos.find(contrato => contrato.id === id)?.numero || '-'; }
}