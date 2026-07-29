import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface DscMenu {
  title: string;
  icon?: string;
  url?: string;
  externalUrl?: string;
  children?: DscMenu[];
}

@Component({
  selector: 'dsc-sidenav',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class DscSidenavComponent {
  @Input() menu: DscMenu[] = [];
  @Input() opened: boolean = false;
  @Output() openedChange = new EventEmitter<boolean>();
}
