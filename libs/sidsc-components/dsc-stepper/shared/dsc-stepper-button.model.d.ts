import { DscButtonSize, DscButtonVariant } from 'sidsc-components/dsc-button';
export interface DscStepperButtonModel {
    variant?: DscButtonVariant;
    size?: DscButtonSize;
    label: string;
    iconSuffix?: string;
    iconPrefix?: string;
    tabIndex?: number;
}
