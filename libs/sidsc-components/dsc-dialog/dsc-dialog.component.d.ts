import { OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DscDialogData } from './shared/dsc-dialog-data';
import * as i0 from "@angular/core";
export declare class DscDialogComponent implements OnInit, OnDestroy {
    dialogConfig: DscDialogData;
    dialogRef: MatDialogRef<DscDialogComponent>;
    private _formSub?;
    constructor(dialogConfig: DscDialogData, dialogRef: MatDialogRef<DscDialogComponent>);
    ngOnInit(): void;
    ngOnDestroy(): void;
    close(value?: boolean): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DscDialogComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DscDialogComponent, "dsc-dialog", never, {}, {}, never, never, false, never>;
}
