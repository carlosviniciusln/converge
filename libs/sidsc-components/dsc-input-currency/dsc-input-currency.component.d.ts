import { EventEmitter, OnInit } from '@angular/core';
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { CurrencyMaskConfig } from 'ng2-currency-mask';
import { BaseComponent } from 'sidsc-components/core';
import * as i0 from "@angular/core";
export declare class DscInputCurrencyComponent extends BaseComponent<any> implements OnInit {
    ngControl: NgControl;
    matInput: MatInput;
    keydown: EventEmitter<any>;
    prefix?: string;
    suffix?: string;
    iconPrefix?: string;
    iconSuffix?: string;
    precision: number;
    customErrorMessages: {
        [key: string]: string;
    };
    get max(): number;
    set max(value: number | string);
    private _max;
    isActive: boolean;
    tooltipId: string;
    get min(): number;
    set min(value: number | string);
    private _min;
    get currencyOptions(): CurrencyMaskConfig;
    constructor(ngControl: NgControl, parentForm: NgForm, parentFormGroup: FormGroupDirective);
    ngOnInit(): void;
    private _initValidators;
    private _getValidators;
    getErrorMessage(): string | null;
    get formFieldClasses(): string[];
    onDrop(e: DragEvent): void;
    onDragOver(e: DragEvent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DscInputCurrencyComponent, [{ optional: true; self: true; }, { optional: true; }, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DscInputCurrencyComponent, "dsc-input-currency", never, { "prefix": { "alias": "prefix"; "required": false; }; "suffix": { "alias": "suffix"; "required": false; }; "iconPrefix": { "alias": "iconPrefix"; "required": false; }; "iconSuffix": { "alias": "iconSuffix"; "required": false; }; "precision": { "alias": "precision"; "required": false; }; "customErrorMessages": { "alias": "customErrorMessages"; "required": false; }; "max": { "alias": "max"; "required": false; }; "min": { "alias": "min"; "required": false; }; }, { "keydown": "keydown"; }, never, never, true, never>;
}
