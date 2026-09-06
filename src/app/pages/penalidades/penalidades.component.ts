import { Component, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

type StatusPenalidade = 'Em apuração' | 'Defesa apresentada' | 'Aplicada' | 'Encerrada';

interface PenalidadeMock {
  protocolo: string;
  contrato: string;
  fornecedor: string;
  tipo: 'Multa' | 'Advertência' | 'Suspensão';
  motivo: string;
  valor: number | null;
  status: StatusPenalidade;
  prazo: string;
}

@Component({
  selector: 'app-penalidades',
  templateUrl: './penalidades.component.html',
  styleUrls: ['./penalidades.component.scss'],
})
export class PenalidadesComponent {
  pesquisa = '';
  tipo = '';
  status = '';
  novaPenalidade = this.criarFormularioVazio();

  readonly penalidades: PenalidadeMock[] = [
    { protocolo: 'PEN-2026-0041', contrato: '04466/2025', fornecedor: 'SERPRO', tipo: 'Multa', motivo: 'Descumprimento de nível de serviço', valor: 18420.75, status: 'Em apuração', prazo: '05/09/2026' },
    { protocolo: 'PEN-2026-0038', contrato: '07500/2024', fornecedor: 'EMBRATEL', tipo: 'Advertência', motivo: 'Atraso na entrega de evidências', valor: null, status: 'Defesa apresentada', prazo: '31/08/2026' },
    { protocolo: 'PEN-2026-0032', contrato: '12870/2024', fornecedor: 'TOTVS', tipo: 'Multa', motivo: 'Indisponibilidade acima do limite', valor: 9350, status: 'Aplicada', prazo: '22/08/2026' },
    { protocolo: 'PEN-2026-0027', contrato: '07231/2024', fornecedor: 'IBM Brasil', tipo: 'Advertência', motivo: 'Não conformidade documental', valor: null, status: 'Encerrada', prazo: '14/08/2026' },
    { protocolo: 'PEN-2026-0024', contrato: '04962/2024', fornecedor: 'Accenture', tipo: 'Suspensão', motivo: 'Reincidência em falha operacional', valor: null, status: 'Em apuração', prazo: '10/09/2026' },
    { protocolo: 'PEN-2026-0019', contrato: '05730/2024', fornecedor: 'Capgemini', tipo: 'Multa', motivo: 'Entrega parcial do objeto contratado', valor: 12780.4, status: 'Encerrada', prazo: '02/08/2026' },
  ];

  constructor(private modalService: NgbModal) {}

  abrirNovaPenalidade(conteudo: TemplateRef<unknown>): void {
    this.novaPenalidade = this.criarFormularioVazio();
    this.modalService.open(conteudo, {
      ariaLabelledBy: 'nova-penalidade-titulo',
      centered: true,
      size: 'lg',
      backdrop: 'static',
    });
  }

  salvarPenalidade(): void {
    const sequencial = String(this.penalidades.length + 42).padStart(4, '0');
    const dataPrazo = this.novaPenalidade.prazo.split('-').reverse().join('/');

    this.penalidades.unshift({
      protocolo: `PEN-2026-${sequencial}`,
      contrato: this.novaPenalidade.contrato,
      fornecedor: this.novaPenalidade.fornecedor,
      tipo: this.novaPenalidade.tipo,
      motivo: this.novaPenalidade.motivo,
      valor: this.novaPenalidade.tipo === 'Multa' ? this.novaPenalidade.valor : null,
      status: 'Em apuração',
      prazo: dataPrazo,
    });

    this.modalService.dismissAll();
  }

  get registrosFiltrados(): PenalidadeMock[] {
    const termo = this.pesquisa.trim().toLocaleLowerCase('pt-BR');
    return this.penalidades.filter(item => {
      const correspondeTexto = !termo || [item.protocolo, item.contrato, item.fornecedor, item.motivo]
        .some(valor => valor.toLocaleLowerCase('pt-BR').includes(termo));
      return correspondeTexto && (!this.tipo || item.tipo === this.tipo) && (!this.status || item.status === this.status);
    });
  }

  get emTratamento(): number {
    return this.penalidades.filter(item => item.status === 'Em apuração' || item.status === 'Defesa apresentada').length;
  }

  get totalMultas(): number {
    return this.penalidades.filter(item => item.tipo === 'Multa').length;
  }

  get valorAplicado(): number {
    return this.penalidades.reduce((total, item) => total + (item.valor || 0), 0);
  }

  limparFiltros(): void {
    this.pesquisa = '';
    this.tipo = '';
    this.status = '';
  }

  classeStatus(status: StatusPenalidade): string {
    if (status === 'Encerrada') return 'closed';
    if (status === 'Aplicada') return 'applied';
    if (status === 'Defesa apresentada') return 'defense';
    return 'investigation';
  }

  private criarFormularioVazio() {
    return {
      contrato: '',
      fornecedor: '',
      tipo: 'Advertência' as PenalidadeMock['tipo'],
      motivo: '',
      valor: null as number | null,
      prazo: '',
      observacoes: '',
    };
  }
}