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

  validarDocumento(arquivo: File, tipoDocumento: string): Promise<ValidacaoDocumento> {
    const formData = new FormData();
    formData.append('arquivo', arquivo);
    formData.append('tipoDocumento', tipoDocumento);
    return this.api.postFormData<ValidacaoDocumento>('v1/documentos/validar', formData);
  }

  consultarFornecedor(cnpj: string): Promise<ConsultaFornecedor> {
    const apenasNumeros = cnpj.replace(/\D/g, '');
    return this.api.get<ConsultaFornecedor>(`v1/fornecedores/${apenasNumeros}/regularidade`);
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