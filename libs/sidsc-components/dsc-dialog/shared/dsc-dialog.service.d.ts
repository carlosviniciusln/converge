import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DscDialogConfig } from './dsc-dialog-config';
import { DscDialogComponent } from '../dsc-dialog.component';
import * as i0 from "@angular/core";
export declare class DscDialogService {
    dialog: MatDialog;
    constructor(dialog: MatDialog);
    confirm(dscDialogConfig: DscDialogConfig): MatDialogRef<DscDialogComponent>;
    static ɵfac: i0.ɵɵFactoryDeclaration<DscDialogService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DscDialogService>;
}
