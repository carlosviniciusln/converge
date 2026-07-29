import { Component, Input } from '@angular/core';

@Component({
  selector: 'dsc-button',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class DscButtonComponent {
  @Input() variant: string = '';
  @Input() size: string = '';
  @Input() label: string = '';
  @Input() icon: string = '';
  @Input() iconButton: boolean | string = false;
  @Input() iconPrefix: string = '';
  @Input() disabled: boolean = false;
}
