import { Component, Input } from '@angular/core';

@Component({
  selector: 'dsc-input',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class DscInputComponent {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() size: string = '';
}
