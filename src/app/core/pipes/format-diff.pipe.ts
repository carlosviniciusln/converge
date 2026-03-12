
import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({
  name: 'formatDiff'
})
export class FormatDiffPipe implements PipeTransform {
  constructor(private currency: CurrencyPipe) {}

  transform(value: any, nullPlaceholder: string = '—'): string {
    // 1) Nulos/vazios
    if (value === null || value === undefined) return nullPlaceholder;
    if (typeof value === 'string' && value.trim() === '') return nullPlaceholder;

    // 2) Se já é number
    if (typeof value === 'number' && isFinite(value)) {
      return this.formatBRL(value);
    }

    // 3) Se é string, tentar converter para número
    if (typeof value === 'string') {
      const parsed = this.parseToNumber(value);
      if (parsed !== null && isFinite(parsed)) {
        return this.formatBRL(parsed);
      }
      // Não é número → retorna original (trim)
      return value.trim();
    }

    // 4) Outros tipos
    return String(value);
  }

  /** Formata como BRL com 2 casas, ex.: R$ 1.234,56 */
  private formatBRL(n: number): string {
    // "symbol" -> R$ com espaço; se não quiser espaço, remova abaixo
    const out = this.currency.transform(n, 'BRL', 'symbol', '1.2-2') ?? `${n}`;
    // Se preferir sem espaço: return out.replace('R$ ', 'R$');
    return out;
  }

  /**
   * Converte várias formas de string numérica para number.
   * Suporta:
   *   - "1234,56", "1.234,56", "100,0", "-1.234,5"
   *   - "1234.56", "100.0", "-1234.5"
   *   - Com "R$", espaços, e outros caracteres numéricos
   * Retorna null se não parecer número (ex: "ABC123").
   */
  private parseToNumber(input: string): number | null {
    if (!input) return null;

    // Verifica se a string tem PRINCIPALMENTE números/separadores/moeda
    // Se tiver muitos caracteres alfabéticos espalhados, não é número
    const onlyNumericChars = input.replace(/[^0-9,.\-]/g, '').length;
    const cleanLength = input.replace(/\s+/g, '').length;

    // Se menos de 50% da string são dígitos/separadores, não é número
    if (onlyNumericChars / cleanLength < 0.5) {
      return null;
    }

    // Remove moeda e espaços
    let s = input
      .replace(/\s+/g, '')       // espaços
      .replace(/R\$\s?/gi, '');  // R$, r$, etc.

    // Remove qualquer caractere que não seja dígito, ponto, vírgula ou sinal
    s = s.replace(/[^0-9,.\-]/g, '');

    if (s === '' || s === '-' || s === ',' || s === '.') return null;

    // Heurística de separadores:
    const hasComma = s.includes(',');
    const hasDot = s.includes('.');

    // Caso 1: vírgula e nenhum ponto -> padrão pt-BR: milhar opcional com ponto, decimal com vírgula
    // Ex.: "1.234,56" ou "100,0"
    if (hasComma && !hasDot) {
      // Remove separador de milhar inexistente (não tem ponto) -> nada a fazer
      // Troca vírgula por ponto (decimal)
      const normalized = s.replace(',', '.');
      const num = Number(normalized);
      return Number.isNaN(num) ? null : num;
    }

    // Caso 2: ponto e nenhuma vírgula -> padrão "ponto decimal"
    // Ex.: "1234.56" ou "100.0"
    if (hasDot && !hasComma) {
      const num = Number(s);
      return Number.isNaN(num) ? null : num;
    }

    // Caso 3: tem vírgula e ponto -> decidir qual é decimal pelo último separador
    // Ex.: "1,234.56" (decimal = '.') ou "1.234,56" (decimal = ',')
    if (hasComma && hasDot) {
      const lastComma = s.lastIndexOf(',');
      const lastDot = s.lastIndexOf('.');
      if (lastComma > lastDot) {
        // Decimal é vírgula → remove pontos (milhar) e troca vírgula por ponto
        const normalized = s.replace(/\./g, '').replace(',', '.');
        const num = Number(normalized);
        return Number.isNaN(num) ? null : num;
      } else {
        // Decimal é ponto → remove vírgulas (milhar)
        const normalized = s.replace(/,/g, '');
        const num = Number(normalized);
        return Number.isNaN(num) ? null : num;
      }
    }

    // Caso 4: nenhum separador decimal, só dígitos (e opcional '-')
    // Ex.: "1234" ou "-1234"
    const plainInt = Number(s);
    return Number.isNaN(plainInt) ? null : plainInt;
  }
}
