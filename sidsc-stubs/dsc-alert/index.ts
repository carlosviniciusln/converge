import { Component, Input } from '@angular/core';

@Component({
  selector: 'dsc-alert',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class DscAlertComponent {
  @Input() variant: string = '';
  @Input() message: string = '';
}
