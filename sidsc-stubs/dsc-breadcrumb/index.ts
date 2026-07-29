import { Component, Input } from '@angular/core';

export interface DscBreadcrumbItem {
  label: string;
  url?: string;
}

@Component({
  selector: 'dsc-breadcrumb',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class DscBreadcrumbComponent {
  @Input() urls: DscBreadcrumbItem[] = [];
}
