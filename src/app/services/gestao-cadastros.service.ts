import { Injectable } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { environment } from '../../environments/environment';
import {
  CadastroRegistro,
  CadastroTipo,
  ConsultaFornecedor,
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

  private readLocal<T extends CadastroRegistro>(tipo: CadastroTipo): T[] {
    const value = localStorage.getItem(this.storageKey(tipo));
    return value ? JSON.parse(value) : [];
  }

  private writeLocal(tipo: CadastroTipo, registros: CadastroRegistro[]): void {
    localStorage.setItem(this.storageKey(tipo), JSON.stringify(registros));
  }

  private storageKey(tipo: CadastroTipo): string {
    return `converge-cadastros-${tipo}`;
  }
}