import { Component, HostListener } from '@angular/core';

// Distância (px) que o usuário precisa arrastar para disparar o refresh
const PULL_THRESHOLD = 70;
// Distância máxima (px) que o indicador pode ser arrastado (com resistência)
const MAX_PULL = 110;
// Acima dessa largura o gesto é ignorado (comportamento é só para mobile)
const MOBILE_MAX_WIDTH_PX = 768;

@Component({
  selector: 'app-pull-to-refresh',
  templateUrl: './pull-to-refresh.component.html',
  styleUrls: ['./pull-to-refresh.component.scss']
})
export class PullToRefreshComponent {

  pulling   = false;
  refreshing = false;
  pullDistance = 0;

  private startY = 0;
  private tracking = false;

  get readyToRelease(): boolean {
    return this.pullDistance >= PULL_THRESHOLD;
  }

  get indicatorStyle(): { [key: string]: string } {
    const translate = this.refreshing ? PULL_THRESHOLD : this.pullDistance;
    return { transform: `translateY(${translate}px)` };
  }

  @HostListener('window:touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    if (this.refreshing || !this.isMobile() || !this.isAtTop()) { return; }
    this.startY = event.touches[0].clientY;
    this.tracking = true;
  }

  @HostListener('window:touchmove', ['$event'])
  onTouchMove(event: TouchEvent): void {
    if (!this.tracking || this.refreshing) { return; }

    const diff = event.touches[0].clientY - this.startY;
    if (diff <= 0 || !this.isAtTop()) {
      this.reset();
      return;
    }

    // resistência: puxar mais fica progressivamente mais "duro"
    this.pullDistance = Math.min(diff * 0.5, MAX_PULL);
    this.pulling = true;

    // impede o bounce nativo da página enquanto o gesto está ativo
    if (event.cancelable) { event.preventDefault(); }
  }

  @HostListener('window:touchend')
  onTouchEnd(): void {
    if (!this.tracking) { return; }

    if (this.readyToRelease) {
      this.triggerRefresh();
    } else {
      this.reset();
    }
    this.tracking = false;
  }

  private triggerRefresh(): void {
    this.refreshing = true;
    this.pulling = false;
    window.location.reload();
  }

  private reset(): void {
    this.pulling = false;
    this.pullDistance = 0;
    this.tracking = false;
  }

  private isMobile(): boolean {
    return window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH_PX}px)`).matches;
  }

  private isAtTop(): boolean {
    return (document.scrollingElement?.scrollTop ?? window.scrollY) <= 0;
  }
}
