import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'dsc-paginator',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class DscPaginatorComponent {
  @Input() length: number = 0;
  @Input() pageSize: number = 10;
  @Input() pageIndex: number = 0;
  @Input() pageSizeOptions: number[] = [10, 20, 50];
  @Output() page = new EventEmitter<any>();
}
