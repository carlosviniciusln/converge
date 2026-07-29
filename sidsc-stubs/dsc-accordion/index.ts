import { Component, Input } from '@angular/core';

@Component({
  selector: 'dsc-accordion',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class DscAccordionComponent {
  @Input() accordionItems: any[] = [];
  @Input() multi: boolean = false;
}
