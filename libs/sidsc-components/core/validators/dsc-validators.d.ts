import { ValidatorFn } from '@angular/forms';
export declare class DscValidators {
    static min(min: number): ValidatorFn;
    static max(max: number): ValidatorFn;
    static maxTotalFileSize(maxTotalSize: number): ValidatorFn;
}
export declare function minValidator(min: number): ValidatorFn;
export declare function maxValidator(max: number): ValidatorFn;
export declare function acceptValidator(accept: string | undefined): ValidatorFn;
export declare function maxTotalFileSizeValidator(maxTotalSize: number): ValidatorFn;
