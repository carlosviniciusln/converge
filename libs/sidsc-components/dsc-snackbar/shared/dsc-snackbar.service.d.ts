import { MatSnackBar } from '@angular/material/snack-bar';
import { DscSnackbarConfig } from './dsc-snackbar-config';
import * as i0 from "@angular/core";
export declare class DscSnackbarService {
    snackBar: MatSnackBar;
    constructor(snackBar: MatSnackBar);
    add(snackbarConfig: DscSnackbarConfig): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DscSnackbarService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DscSnackbarService>;
}
