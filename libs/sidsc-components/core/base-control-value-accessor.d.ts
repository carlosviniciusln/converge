import { ControlValueAccessor } from '@angular/forms';
import { BooleanInput } from '@angular/cdk/coercion';
export declare class BaseControlValueAccessor<T> implements ControlValueAccessor {
    private _val;
    private _disabled;
    private _updateOn;
    get val(): T | null;
    set val(value: T | null);
    get disabled(): boolean;
    set disabled(value: BooleanInput);
    get updateOn(): 'change' | 'blur' | 'submit';
    set updateOn(value: 'change' | 'blur' | 'submit' | undefined);
    onChange: (_: any) => void;
    onTouched: () => void;
    writeValue(value: T): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    setDisabledState(value: boolean): void;
    emitValueOn(): void;
}
