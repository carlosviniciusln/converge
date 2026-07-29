import { Component, Input } from '@angular/core';

@Component({
  selector: 'dsc-card',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class DscCardComponent {
  @Input() data: any = null;
}
