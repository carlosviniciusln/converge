import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'dsc-checkbox',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DscCheckboxComponent),
      multi: true,
    },
  ],
})
export class DscCheckboxComponent implements ControlValueAccessor {
  @Input() variant: string = '';
  @Input() label: string = '';
  @Output() change = new EventEmitter<any>();

  writeValue(_value: any): void {}
  registerOnChange(_fn: any): void {}
  registerOnTouched(_fn: any): void {}
}
