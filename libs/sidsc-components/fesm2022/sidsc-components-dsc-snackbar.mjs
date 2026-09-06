import * as i0 from '@angular/core';
import { Component, ViewEncapsulation, Inject, Injectable, NgModule } from '@angular/core';
import * as i1 from '@angular/material/snack-bar';
import { MAT_SNACK_BAR_DATA, MatSnackBarModule } from '@angular/material/snack-bar';
import * as i2 from '@angular/material/icon';
import { MatIconModule } from '@angular/material/icon';
import * as i3 from '@angular/common';
import { NgClass, NgIf } from '@angular/common';
import * as i4 from 'sidsc-components/dsc-button';
import { DscButtonComponent } from 'sidsc-components/dsc-button';

class DscSnackbarComponent {
    constructor(snackbarConfig, _snackbarRef) {
        this.snackbarConfig = snackbarConfig;
        this._snackbarRef = _snackbarRef;
    }
    ngOnInit() {
        switch (this.snackbarConfig.data.variant) {
            case 'info':
                this.matIconName = 'info';
                break;
            case 'danger':
                this.matIconName = 'error';
                break;
            case 'success':
                this.matIconName = 'check_circle';
                break;
            case 'warning':
                this.matIconName = 'warning';
                break;
        }
    }
    close() {
        this._snackbarRef.dismiss();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscSnackbarComponent, deps: [{ token: MAT_SNACK_BAR_DATA }, { token: i1.MatSnackBarRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.12", type: DscSnackbarComponent, selector: "dsc-snackbar", ngImport: i0, template: "<div class=\"snackbar mat-elevation-z5\"\n     [ngClass]=\"snackbarConfig.data.variant\">\n  <div class=\"snackbar-container\">\n    <mat-icon *ngIf=\"snackbarConfig.data.showIcon\"\n              class=\"snackbar-icon\">\n      {{ matIconName }}\n    </mat-icon>\n    <div class=\"snackbar-content\">\n      <span>{{ snackbarConfig.data.message }}</span>\n    </div>\n    <div class=\"snackbar-action\"\n         *ngIf=\"snackbarConfig.data.button\">\n      <dsc-button [label]=\"snackbarConfig.data.button.label\"\n                  (click)=\"snackbarConfig.data.button.actionFunction()\"\n                  size=\"small\"\n                  variant=\"auxiliary\">\n      </dsc-button>\n    </div>\n  </div>\n</div>\n", styles: [".mat-mdc-snack-bar-label,.mdc-snackbar__surface{background:transparent!important;box-shadow:none!important;padding:0!important}.snackbar{background:var(--dsc-color-bg-neutral-1);border-radius:var(--dsc-border-radius-nano);padding:var(--dsc-spacing-nano) var(--dsc-spacing-nano) var(--dsc-spacing-nano) var(--dsc-spacing-tiny);min-width:21.5rem;max-width:41.5rem;box-shadow:-1px 2px 7px -1px #00000045}.snackbar-container{display:flex}.snackbar-container .snackbar-icon{height:var(--dsc-icon-size-medium);width:var(--dsc-icon-size-medium);font-size:var(--dsc-icon-size-medium);margin:0 var(--dsc-spacing-tiny) 0 0;display:flex;align-self:center}.snackbar-content{display:flex;flex-direction:column;justify-content:center;flex:1;font:var(--dsc-typography-text-standard-400);font-feature-settings:\"ss01\"}.snackbar-action{display:flex;flex-direction:column;justify-content:center;margin:0 0 0 var(--dsc-spacing-tiny)}.snackbar.success{background-color:var(--dsc-color-bg-success-5);color:var(--dsc-color-content-neutral-1)}.snackbar.success .mat-icon{color:var(--dsc-color-bg-neutral-1)}.snackbar.danger{background-color:var(--dsc-color-bg-danger-5);color:var(--dsc-color-content-neutral-1)}.snackbar.danger .mat-icon{color:var(--dsc-color-bg-neutral-1)}.snackbar.warning{background-color:var(--dsc-color-bg-warning-6);color:var(--dsc-color-content-neutral-5)}.snackbar.warning .mat-icon{color:var(--dsc-color-bg-neutral-7)}.snackbar.info{background-color:var(--dsc-color-bg-information-5);color:var(--dsc-color-content-neutral-1)}.snackbar.info .mat-icon{color:var(--dsc-color-bg-neutral-1)}\n"], dependencies: [{ kind: "component", type: i2.MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "directive", type: i3.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i4.DscButtonComponent, selector: "dsc-button", inputs: ["type", "label", "iconSuffix", "iconPrefix", "icon", "tabIndex", "dscTooltip", "ariaLabel", "ariaExpanded", "ariaControls", "iconStyle", "variant", "size", "disabled", "iconButton"] }], encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscSnackbarComponent, decorators: [{
            type: Component,
            args: [{ selector: 'dsc-snackbar', encapsulation: ViewEncapsulation.None, template: "<div class=\"snackbar mat-elevation-z5\"\n     [ngClass]=\"snackbarConfig.data.variant\">\n  <div class=\"snackbar-container\">\n    <mat-icon *ngIf=\"snackbarConfig.data.showIcon\"\n              class=\"snackbar-icon\">\n      {{ matIconName }}\n    </mat-icon>\n    <div class=\"snackbar-content\">\n      <span>{{ snackbarConfig.data.message }}</span>\n    </div>\n    <div class=\"snackbar-action\"\n         *ngIf=\"snackbarConfig.data.button\">\n      <dsc-button [label]=\"snackbarConfig.data.button.label\"\n                  (click)=\"snackbarConfig.data.button.actionFunction()\"\n                  size=\"small\"\n                  variant=\"auxiliary\">\n      </dsc-button>\n    </div>\n  </div>\n</div>\n", styles: [".mat-mdc-snack-bar-label,.mdc-snackbar__surface{background:transparent!important;box-shadow:none!important;padding:0!important}.snackbar{background:var(--dsc-color-bg-neutral-1);border-radius:var(--dsc-border-radius-nano);padding:var(--dsc-spacing-nano) var(--dsc-spacing-nano) var(--dsc-spacing-nano) var(--dsc-spacing-tiny);min-width:21.5rem;max-width:41.5rem;box-shadow:-1px 2px 7px -1px #00000045}.snackbar-container{display:flex}.snackbar-container .snackbar-icon{height:var(--dsc-icon-size-medium);width:var(--dsc-icon-size-medium);font-size:var(--dsc-icon-size-medium);margin:0 var(--dsc-spacing-tiny) 0 0;display:flex;align-self:center}.snackbar-content{display:flex;flex-direction:column;justify-content:center;flex:1;font:var(--dsc-typography-text-standard-400);font-feature-settings:\"ss01\"}.snackbar-action{display:flex;flex-direction:column;justify-content:center;margin:0 0 0 var(--dsc-spacing-tiny)}.snackbar.success{background-color:var(--dsc-color-bg-success-5);color:var(--dsc-color-content-neutral-1)}.snackbar.success .mat-icon{color:var(--dsc-color-bg-neutral-1)}.snackbar.danger{background-color:var(--dsc-color-bg-danger-5);color:var(--dsc-color-content-neutral-1)}.snackbar.danger .mat-icon{color:var(--dsc-color-bg-neutral-1)}.snackbar.warning{background-color:var(--dsc-color-bg-warning-6);color:var(--dsc-color-content-neutral-5)}.snackbar.warning .mat-icon{color:var(--dsc-color-bg-neutral-7)}.snackbar.info{background-color:var(--dsc-color-bg-information-5);color:var(--dsc-color-content-neutral-1)}.snackbar.info .mat-icon{color:var(--dsc-color-bg-neutral-1)}\n"] }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_SNACK_BAR_DATA]
                }] }, { type: i1.MatSnackBarRef }]; } });

class DscSnackbarService {
    constructor(snackBar) {
        this.snackBar = snackBar;
    }
    add(snackbarConfig) {
        this.snackBar.openFromComponent(DscSnackbarComponent, {
            verticalPosition: snackbarConfig.verticalPosition ?? 'bottom',
            horizontalPosition: snackbarConfig.horizontalPosition ?? 'center',
            duration: snackbarConfig.duration ?? 5000,
            data: snackbarConfig
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscSnackbarService, deps: [{ token: i1.MatSnackBar }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscSnackbarService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscSnackbarService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.MatSnackBar }]; } });

class DscSnackbarModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscSnackbarModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.2.12", ngImport: i0, type: DscSnackbarModule, declarations: [DscSnackbarComponent], imports: [MatSnackBarModule, MatIconModule, NgClass, NgIf, DscButtonComponent], exports: [DscSnackbarComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscSnackbarModule, providers: [DscSnackbarService], imports: [MatSnackBarModule, MatIconModule, DscButtonComponent] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscSnackbarModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [DscSnackbarComponent],
                    imports: [MatSnackBarModule, MatIconModule, NgClass, NgIf, DscButtonComponent],
                    exports: [DscSnackbarComponent],
                    providers: [DscSnackbarService]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { DscSnackbarComponent, DscSnackbarModule, DscSnackbarService };
//# sourceMappingURL=sidsc-components-dsc-snackbar.mjs.map
