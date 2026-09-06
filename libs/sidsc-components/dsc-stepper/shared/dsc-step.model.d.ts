import { FormGroup } from '@angular/forms';
import { TemplateRef } from '@angular/core';
import { DscStepperButtonModel } from './dsc-stepper-button.model';
export interface DscStepModel {
    label: string;
    optional?: boolean;
    editable?: boolean;
    interacted?: boolean;
    completed?: boolean;
    formGroup?: FormGroup;
    contentTemplate?: TemplateRef<any>;
    reset?: DscStepperButtonModel;
    next?: DscStepperButtonModel;
    previous?: DscStepperButtonModel;
    errorMessage?: string;
    route?: string;
}
