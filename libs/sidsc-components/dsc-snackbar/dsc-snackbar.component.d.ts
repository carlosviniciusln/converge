import { OnInit } from '@angular/core';
import { MatSnackBarRef } from '@angular/material/snack-bar';
import { DscSnackbarConfig } from './shared/dsc-snackbar-config';
import * as i0 from "@angular/core";
export declare class DscSnackbarComponent implements OnInit {
    snackbarConfig: DscSnackbarConfig;
    private _snackbarRef;
    matIconName: string;
    constructor(snackbarConfig: DscSnackbarConfig, _snackbarRef: MatSnackBarRef<DscSnackbarComponent>);
    ngOnInit(): void;
    close(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DscSnackbarComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DscSnackbarComponent, "dsc-snackbar", never, {}, {}, never, never, false, never>;
}
