import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'dsc-button-header',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class DscButtonHeaderComponent {
  @Input() icon: string = '';
  @Input() label: string = '';
  @Output() buttonClick = new EventEmitter<void>();
}
