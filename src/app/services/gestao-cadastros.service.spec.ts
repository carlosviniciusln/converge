import { fakeAsync, tick } from '@angular/core/testing';
import { ApiService } from '../shared/services/api.service';
import { GestaoCadastrosService } from './gestao-cadastros.service';

describe('GestaoCadastrosService', () => {
  it('interpreta os campos essenciais de um contrato no modo demonstrativo', fakeAsync(() => {
    const api = jasmine.createSpyObj<ApiService>('ApiService', ['postFormData']);
    const service = new GestaoCadastrosService(api);
    const arquivo = new File(['contrato'], 'contrato.pdf', { type: 'application/pdf' });
    let resultado: Awaited<ReturnType<GestaoCadastrosService['validarDocumento']>> | undefined;

    service.validarDocumento(arquivo, 'contrato').then(valor => resultado = valor);
    tick(800);

    expect(resultado?.status).toBe('aprovado');
    expect(resultado?.campos['Número do contrato']).toBeTruthy();
    expect(resultado?.campos['Tipo do contrato']).toBeTruthy();
    expect(resultado?.campos['Objeto']).toBeTruthy();
    expect(resultado?.campos['Vigência']).toContain(' a ');
    expect(resultado?.campos['Valor global']).toContain('R$');
  }));
});