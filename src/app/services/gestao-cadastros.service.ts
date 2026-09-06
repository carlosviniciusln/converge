import { Injectable } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { environment } from '../../environments/environment';
import {
  BibliotecaDocumentoItem,
  CadastroRegistro,
  CadastroTipo,
  ConsultaFornecedor,
  DocumentoContratoVinculo,
  ValidacaoDocumento,
} from '../models/gestao-cadastros';

@Injectable({ providedIn: 'root' })
export class GestaoCadastrosService {
  private readonly baseUrl = 'v1/gestao-cadastros';

  constructor(private api: ApiService) {}

  async listar<T extends CadastroRegistro>(tipo: CadastroTipo): Promise<T[]> {
    if (environment.useLocalManagementData) {
      return this.readLocal<T>(tipo);
    }

    return this.api.get<T[]>(`${this.baseUrl}/${tipo}`);
  }

  async salvar<T extends CadastroRegistro>(tipo: CadastroTipo, registro: T): Promise<T> {
    if (environment.useLocalManagementData) {
      const registros = this.readLocal<T>(tipo);
      const salvo = { ...registro, id: registro.id || Date.now() } as T;
      const index = registros.findIndex(item => item.id === salvo.id);
      index >= 0 ? registros.splice(index, 1, salvo) : registros.push(salvo);
      this.writeLocal(tipo, registros);
      return salvo;
    }

    return registro.id
      ? this.api.put<T>(`${this.baseUrl}/${tipo}/${registro.id}`, registro)
      : this.api.post<T>(`${this.baseUrl}/${tipo}`, registro);
  }

  async excluir(tipo: CadastroTipo, id: number): Promise<void> {
    if (environment.useLocalManagementData) {
      const registros = this.readLocal<CadastroRegistro>(tipo).filter(item => item.id !== id);
      this.writeLocal(tipo, registros);
      return;
    }

    await this.api.delete<void>(`${this.baseUrl}/${tipo}/${id}`);
  }

  async validarDocumento(arquivo: File, tipoDocumento: string): Promise<ValidacaoDocumento> {
    if (environment.useLocalManagementData) {
      await this.simularProcessamento();
      return {
        arquivo: arquivo.name,
        tipoDocumento,
        status: 'aprovado',
        confianca: 0.967,
        campos: this.camposExtraidos(tipoDocumento),
        inconsistencias: [],
        analisadoEm: new Date().toISOString(),
      };
    }

    const formData = new FormData();
    formData.append('arquivo', arquivo);
    formData.append('tipoDocumento', tipoDocumento);
    return this.api.postFormData<ValidacaoDocumento>('v1/documentos/validar', formData);
  }

  async consultarFornecedor(cnpj: string): Promise<ConsultaFornecedor> {
    const apenasNumeros = cnpj.replace(/\D/g, '');

    if (environment.useLocalManagementData) {
      await this.simularProcessamento();
      const referencia = `${apenasNumeros.slice(-6)}-${new Date().getFullYear()}`;
      return {
        cnpj: apenasNumeros,
        razaoSocial: 'Converge Serviços e Tecnologia Ltda.',
        situacao: 'regular',
        consultadoEm: new Date().toISOString(),
        fontes: [
          { nome: 'Receita Federal', situacao: 'Ativa', protocolo: `RFB-${referencia}` },
          { nome: 'SICAF', situacao: 'Credenciamento válido', protocolo: `SICAF-${referencia}` },
          { nome: 'Regularidade do FGTS', situacao: 'Certidão válida', protocolo: `CRF-${referencia}` },
          { nome: 'Débitos Trabalhistas', situacao: 'Certidão negativa', protocolo: `CNDT-${referencia}` },
        ],
        apontamentos: [],
      };
    }

    return this.api.get<ConsultaFornecedor>(`v1/fornecedores/${apenasNumeros}/regularidade`);
  }

  async listarBiblioteca(): Promise<BibliotecaDocumentoItem[]> {
    if (environment.useLocalManagementData) {
      return this.readLocal<BibliotecaDocumentoItem>('biblioteca-documentos');
    }
    return this.api.get<BibliotecaDocumentoItem[]>(`${this.baseUrl}/biblioteca-documentos`);
  }

  async salvarItemBiblioteca(item: BibliotecaDocumentoItem): Promise<BibliotecaDocumentoItem> {
    const salvo: BibliotecaDocumentoItem = { ...item, atualizadoEm: new Date().toISOString() };

    if (environment.useLocalManagementData) {
      const itens = this.readLocal<BibliotecaDocumentoItem>('biblioteca-documentos');
      salvo.id = salvo.id || Date.now();
      const index = itens.findIndex(atual => atual.id === salvo.id);
      index >= 0 ? itens.splice(index, 1, salvo) : itens.push(salvo);
      this.writeLocal('biblioteca-documentos', itens);
      return salvo;
    }

    return salvo.id
      ? this.api.put<BibliotecaDocumentoItem>(`${this.baseUrl}/biblioteca-documentos/${salvo.id}`, salvo)
      : this.api.post<BibliotecaDocumentoItem>(`${this.baseUrl}/biblioteca-documentos`, salvo);
  }

  async excluirItemBiblioteca(id: number): Promise<void> {
    if (environment.useLocalManagementData) {
      const itens = this.readLocal<BibliotecaDocumentoItem>('biblioteca-documentos').filter(item => item.id !== id);
      this.writeLocal('biblioteca-documentos', itens);
      return;
    }
    await this.api.delete<void>(`${this.baseUrl}/biblioteca-documentos/${id}`);
  }

  async listarVinculosContrato(coContrato: string): Promise<DocumentoContratoVinculo[]> {
    if (environment.useLocalManagementData) {
      return this.readLocal<DocumentoContratoVinculo>('documentos-contrato')
        .filter(vinculo => vinculo.coContrato === coContrato);
    }
    return this.api.get<DocumentoContratoVinculo[]>(`${this.baseUrl}/documentos-contrato/${coContrato}`);
  }

  async salvarVinculosContrato(coContrato: string, vinculos: DocumentoContratoVinculo[]): Promise<void> {
    if (environment.useLocalManagementData) {
      const demaisContratos = this.readLocal<DocumentoContratoVinculo>('documentos-contrato')
        .filter(vinculo => vinculo.coContrato !== coContrato);
      const salvos = vinculos.map(vinculo => ({
        ...vinculo,
        id: vinculo.id || Date.now() + Math.floor(Math.random() * 1000),
        atualizadoEm: new Date().toISOString(),
      }));
      this.writeLocal('documentos-contrato', [...demaisContratos, ...salvos]);
      return;
    }
    await this.api.put<void>(`${this.baseUrl}/documentos-contrato/${coContrato}`, vinculos);
  }

  private camposExtraidos(tipoDocumento: string): Record<string, string> {
    if (tipoDocumento === 'contrato') {
      return {
        'Número do contrato': 'CT-2026/0148',
        Contratada: 'Converge Serviços e Tecnologia Ltda.',
        Vigência: '01/08/2026 a 31/07/2027',
        'Valor global': 'R$ 248.750,00',
      };
    }

    if (tipoDocumento === 'certidao') {
      return {
        Emitente: 'Secretaria da Receita Federal do Brasil',
        Documento: 'Certidão Negativa de Débitos',
        Validade: '24/02/2027',
        Situação: 'Válida',
      };
    }

    return {
      Emitente: 'Converge Serviços e Tecnologia Ltda.',
      'CNPJ do emitente': '12.345.678/0001-90',
      'Número do documento': '000.184.726',
      Emissão: '27/08/2026',
      'Valor total': 'R$ 18.420,75',
    };
  }

  private simularProcessamento(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 800));
  }

  private readLocal<T>(chave: CadastroTipo | string): T[] {
    const value = localStorage.getItem(this.storageKey(chave));
    return value ? JSON.parse(value) : [];
  }

  private writeLocal(chave: CadastroTipo | string, registros: unknown[]): void {
    localStorage.setItem(this.storageKey(chave), JSON.stringify(registros));
  }

  private storageKey(chave: CadastroTipo | string): string {
    return `converge-cadastros-${chave}`;
  }
}