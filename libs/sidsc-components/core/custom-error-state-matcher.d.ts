import { ErrorStateMatcher } from '@angular/material/core';
import { AbstractControl, FormGroupDirective, NgControl, NgForm } from '@angular/forms';
export declare class CustomErrorStateMatcher implements ErrorStateMatcher {
    private _control;
    private _parentForm;
    private _parentFormGroup;
    constructor(_control: NgControl, _parentForm: NgForm, _parentFormGroup: FormGroupDirective);
    isErrorState(control: AbstractControl | null, form: FormGroupDirective | NgForm | null): boolean;
}
