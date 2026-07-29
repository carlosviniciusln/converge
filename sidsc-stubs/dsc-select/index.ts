import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'dsc-select',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DscSelectComponent),
      multi: true,
    },
  ],
})
export class DscSelectComponent implements ControlValueAccessor {
  @Input() options: any[] = [];
  @Input() showFilter: boolean = false;
  @Input() label: string = '';
  @Input() placeholder: string = '';

  writeValue(_value: any): void {}
  registerOnChange(_fn: any): void {}
  registerOnTouched(_fn: any): void {}
}
