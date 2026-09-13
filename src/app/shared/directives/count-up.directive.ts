import { Directive, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';

// Duração padrão da animação (ms) — rápida o suficiente para não parecer lenta,
// suave o suficiente para não distrair
const DEFAULT_DURATION_MS = 900;

type CountUpFormat = 'number' | 'currency';

/**
 * Anima um valor numérico subindo suavemente do valor anterior até o novo valor.
 * Uso: <span [appCountUp]="valor" appCountUpFormat="currency"></span>
 */
@Directive({
  selector: '[appCountUp]'
})
export class CountUpDirective implements OnChanges, OnDestroy {

  @Input('appCountUp') targetValue: number | null | undefined;
  @Input() appCountUpFormat: CountUpFormat = 'number';
  @Input() appCountUpDecimals = 0;
  @Input() appCountUpDuration = DEFAULT_DURATION_MS;

  private displayedValue = 0;
  private rafId: number | null = null;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['targetValue']) { return; }

    const target = Number(this.targetValue) || 0;

    if (this.prefersReducedMotion()) {
      this.setValue(target);
    } else {
      this.animate(this.displayedValue, target);
    }
  }

  ngOnDestroy(): void {
    if (this.rafId !== null) { cancelAnimationFrame(this.rafId); }
  }

  private animate(from: number, to: number): void {
    if (this.rafId !== null) { cancelAnimationFrame(this.rafId); }
    if (from === to) { this.setValue(to); return; }

    const start = performance.now();
    const duration = this.appCountUpDuration;

    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      this.setValue(from + (to - from) * eased);

      if (progress < 1) {
        this.rafId = requestAnimationFrame(step);
      } else {
        this.rafId = null;
        this.setValue(to);
      }
    };
    this.rafId = requestAnimationFrame(step);
  }

  private setValue(value: number): void {
    this.displayedValue = value;
    this.el.nativeElement.textContent = this.format(value);
  }

  private format(value: number): string {
    if (this.appCountUpFormat === 'currency') {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    }
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: this.appCountUpDecimals,
      maximumFractionDigits: this.appCountUpDecimals
    }).format(value);
  }

  private prefersReducedMotion(): boolean {
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  }
}
