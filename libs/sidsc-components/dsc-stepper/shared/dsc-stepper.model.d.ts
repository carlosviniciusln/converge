import { NumberInput } from '@angular/cdk/coercion';
import { DscStepModel } from './dsc-step.model';
export interface DscStepperModel {
    linear?: boolean;
    skipValidSteps?: boolean;
    noHorizontalLine?: boolean;
    orientation?: 'horizontal' | 'vertical';
    selectedIndex?: NumberInput;
    steps: DscStepModel[];
}
