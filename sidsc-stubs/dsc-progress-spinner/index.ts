import { Component, Input } from '@angular/core';

@Component({
  selector: 'dsc-progress-spinner',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class DscProgressSpinnerComponent {
  @Input() indeterminate: boolean = false;
}
