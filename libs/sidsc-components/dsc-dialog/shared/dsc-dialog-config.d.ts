import { AutoFocusTarget } from '@angular/material/dialog';
import { DscDialogData } from './dsc-dialog-data';
export interface DscDialogConfig {
    ariaDescribedBy?: string;
    ariaLabel?: string;
    ariaLabelledBy?: string;
    autoFocus?: AutoFocusTarget | string | boolean;
    restoreFocus?: boolean;
    disableClose?: boolean;
    data: DscDialogData;
}
