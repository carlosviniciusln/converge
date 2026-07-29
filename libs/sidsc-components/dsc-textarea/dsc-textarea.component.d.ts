import { AfterViewInit, OnInit } from '@angular/core';
import { MatInput } from '@angular/material/input';
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { BaseComponent } from 'sidsc-components/core';
import * as i0 from "@angular/core";
export declare class DscTextareaComponent extends BaseComponent<string> implements OnInit, AfterViewInit {
    ngControl: NgControl;
    matInput: MatInput;
    get showCharCounter(): boolean;
    ariaDescribedby: string;
    set showCharCounter(value: boolean | string);
    private _showCharCounter;
    isActive: boolean;
    tooltipId: string;
    constructor(ngControl: NgControl, parentForm: NgForm, parentFormGroup: FormGroupDirective);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    get formFieldClasses(): string[];
    static ɵfac: i0.ɵɵFactoryDeclaration<DscTextareaComponent, [{ optional: true; self: true; }, { optional: true; }, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DscTextareaComponent, "dsc-textarea", never, { "showCharCounter": { "alias": "showCharCounter"; "required": false; }; "ariaDescribedby": { "alias": "aria-describedby"; "required": false; }; }, {}, never, never, true, never>;
}
