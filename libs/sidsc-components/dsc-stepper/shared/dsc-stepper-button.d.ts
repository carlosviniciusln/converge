import { CdkStepper } from '@angular/cdk/stepper';
import * as i0 from "@angular/core";
export declare class CdkStepperNext {
    _stepper: CdkStepper;
    /** Type of the next button. Defaults to "submit" if not specified. */
    type: string;
    constructor(_stepper: CdkStepper);
    static ɵfac: i0.ɵɵFactoryDeclaration<CdkStepperNext, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<CdkStepperNext, "dsc-button[cdkStepperNext]", never, { "type": { "alias": "type"; "required": false; }; }, {}, never, never, true, never>;
}
/** Button that moves to the previous step in a stepper workflow. */
export declare class CdkStepperPrevious {
    _stepper: CdkStepper;
    /** Type of the previous button. Defaults to "button" if not specified. */
    type: string;
    constructor(_stepper: CdkStepper);
    static ɵfac: i0.ɵɵFactoryDeclaration<CdkStepperPrevious, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<CdkStepperPrevious, "dsc-button[cdkStepperPrevious]", never, { "type": { "alias": "type"; "required": false; }; }, {}, never, never, true, never>;
}
export declare class CdkStepperReset {
    _stepper: CdkStepper;
    constructor(_stepper: CdkStepper);
    static ɵfac: i0.ɵɵFactoryDeclaration<CdkStepperReset, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<CdkStepperReset, "dsc-button[cdkStepperReset]", never, {}, {}, never, never, true, never>;
}
export declare class DscStepperNext extends CdkStepperNext {
    static ɵfac: i0.ɵɵFactoryDeclaration<DscStepperNext, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<DscStepperNext, "dsc-button[dscStepperNext]", never, { "type": { "alias": "type"; "required": false; }; }, {}, never, never, true, never>;
}
/** Button that moves to the previous step in a stepper workflow. */
export declare class DscStepperPrevious extends CdkStepperPrevious {
    static ɵfac: i0.ɵɵFactoryDeclaration<DscStepperPrevious, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<DscStepperPrevious, "dsc-button[dscStepperPrevious]", never, { "type": { "alias": "type"; "required": false; }; }, {}, never, never, true, never>;
}
export declare class DscStepperReset extends CdkStepperReset {
    static ɵfac: i0.ɵɵFactoryDeclaration<DscStepperReset, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<DscStepperReset, "dsc-button[dscStepperReset]", never, {}, {}, never, never, true, never>;
}
