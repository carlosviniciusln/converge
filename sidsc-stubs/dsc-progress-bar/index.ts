import { Component, Input } from '@angular/core';

@Component({
  selector: 'dsc-progress-bar',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class DscProgressBarComponent {
  @Input() progress: number = 0;
}
