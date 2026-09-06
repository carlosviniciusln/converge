import { TemplateRef } from '@angular/core';
import { DscButtonSize, DscButtonVariant } from 'sidsc-components/dsc-button';
export interface DscDialogData {
    title: DscDialogTitle;
    message?: string;
    template?: TemplateRef<any>;
    context?: any;
    actionButton?: DscDialogActionButton;
}
export type DscDialogTitle = {
    text: string;
    highlightVariant?: boolean;
    icon?: string;
    iconColor?: string;
    showCloseButton?: boolean;
};
export type DscDialogActionButton = {
    type: 'button' | 'submit';
    confirmText?: string;
    confirmSize?: DscButtonSize;
    confirmVariant?: DscButtonVariant;
    confirmIconSuffix?: string;
    confirmIconPrefix?: string;
    confirmDisabled?: boolean;
    confirmIconButton?: boolean;
    confirmIcon?: string;
    confirmTooltip?: string;
    confirmAriaLabel?: string;
    confirmFunction?: Function;
    cancelText?: string;
    cancelSize?: DscButtonSize;
    cancelVariant?: DscButtonVariant;
    cancelIconSuffix?: string;
    cancelIconPrefix?: string;
    cancelDisabled?: boolean;
    cancelIconButton?: boolean;
    cancelIcon?: string;
    cancelTooltip?: string;
    cancelAriaLabel?: string;
    cancelFunction?: Function;
};
