import * as i0 from '@angular/core';
import { Component, ViewEncapsulation, Inject, Injectable, NgModule } from '@angular/core';
import { take } from 'rxjs';
import * as i1 from '@angular/material/dialog';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import * as i2 from '@angular/common';
import { NgClass, NgIf, NgTemplateOutlet, CommonModule } from '@angular/common';
import * as i3 from 'sidsc-components/dsc-button';
import { DscButtonComponent } from 'sidsc-components/dsc-button';
import * as i4 from 'sidsc-components/dsc-tooltip';
import { DscTooltipModule } from 'sidsc-components/dsc-tooltip';
import * as i5 from '@angular/material/icon';
import { MatIconModule } from '@angular/material/icon';

class DscDialogComponent {
    constructor(dialogConfig, dialogRef) {
        this.dialogConfig = dialogConfig;
        this.dialogRef = dialogRef;
    }
    ngOnInit() {
        const context = this.dialogConfig?.context;
        if (context instanceof FormGroup && this.dialogConfig?.actionButton) {
            const actionButton = this.dialogConfig.actionButton;
            actionButton.confirmDisabled = context.invalid;
            this._formSub = context.statusChanges.subscribe(() => {
                actionButton.confirmDisabled = context.invalid;
            });
        }
    }
    ngOnDestroy() {
        this._formSub?.unsubscribe();
    }
    close(value) {
        this.dialogRef.close(value);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscDialogComponent, deps: [{ token: MAT_DIALOG_DATA }, { token: i1.MatDialogRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.12", type: DscDialogComponent, selector: "dsc-dialog", host: { classAttribute: "mat-elevation-z2" }, ngImport: i0, template: "\n<div mat-dialog-title\n     [class.mat-mdc-dialog-title__highlight]=\"dialogConfig.title.highlightVariant\">\n  <mat-icon *ngIf=\"dialogConfig.title.icon\"\n            class=\"mat-mdc-dialog-title__icon\"\n            [ngStyle]=\"{ 'color': dialogConfig.title.highlightVariant ? null : 'var(' + dialogConfig.title.iconColor + ')' }\">\n    {{ dialogConfig.title.icon }}\n  </mat-icon>\n  <h2 class=\"mat-mdc-dialog-title__text\">{{ dialogConfig.title.text }}</h2>\n  <dsc-button\n    (click)=\"close(false)\"\n    *ngIf=\"dialogConfig.title.showCloseButton\"\n    [ariaLabel]=\"'Fechar'\"\n    class=\"close-dialog\"\n    size=\"large\"\n    variant=\"secondary-text\"\n    icon=\"close\"\n    iconButton=\"true\">\n  </dsc-button>\n</div>\n<mat-dialog-content>\n  <ng-container [ngTemplateOutlet]=\"dialogConfig.template ? dialogConfig.template : simpleTemplate\"\n                [ngTemplateOutletContext]=\"{$implicit: dialogConfig.context}\">\n  </ng-container>\n</mat-dialog-content>\n<mat-dialog-actions *ngIf=\"dialogConfig.actionButton\"\n                    align=\"end\">\n  <dsc-button *ngIf=\"dialogConfig.actionButton.cancelText\"\n              [label]=\"dialogConfig.actionButton.cancelText\"\n              [size]=\"dialogConfig.actionButton.cancelSize ?? 'standard'\"\n              [variant]=\"dialogConfig.actionButton.cancelVariant ?? 'secondary-outlined'\"\n              [iconPrefix]=\"dialogConfig.actionButton.cancelIconPrefix\"\n              [iconSuffix]=\"dialogConfig.actionButton.cancelIconSuffix\"\n              [disabled]=\"dialogConfig.actionButton.cancelDisabled ?? false\"\n              [iconButton]=\"dialogConfig.actionButton.cancelIconButton\"\n              [icon]=\"dialogConfig.actionButton.cancelIcon\"\n              [dscTooltip]=\"dialogConfig.actionButton.cancelTooltip ?? ''\"\n              [ariaLabel]=\"dialogConfig.actionButton.cancelAriaLabel ?? ''\"\n              mat-dialog-close>\n  </dsc-button>\n  <dsc-button *ngIf=\"dialogConfig.actionButton.confirmText\"\n              [type]=\"dialogConfig.actionButton.type\"\n              [label]=\"dialogConfig.actionButton.confirmText\"\n              [size]=\"dialogConfig.actionButton.confirmSize ?? 'standard'\"\n              [variant]=\"dialogConfig.actionButton.confirmVariant ?? 'primary'\"\n              [iconPrefix]=\"dialogConfig.actionButton.confirmIconPrefix\"\n              [iconSuffix]=\"dialogConfig.actionButton.confirmIconSuffix\"\n              [disabled]=\"dialogConfig.actionButton.confirmDisabled ?? false\"\n              [iconButton]=\"dialogConfig.actionButton.confirmIconButton\"\n              [icon]=\"dialogConfig.actionButton.confirmIcon\"\n              [dscTooltip]=\"dialogConfig.actionButton.confirmTooltip ?? ''\"\n              [ariaLabel]=\"dialogConfig.actionButton.confirmAriaLabel ?? ''\"\n              [mat-dialog-close]=\"dialogConfig.context ? dialogConfig.context : true\">\n  </dsc-button>\n</mat-dialog-actions>\n\n<ng-template #simpleTemplate>\n  <p class=\"mat-mdc-dialog-content__message\">{{ dialogConfig.message }}</p>\n</ng-template>\n", styles: [".mat-mdc-dialog-container .mdc-dialog__container{--mdc-dialog-container-shape: var(--dsc-border-radius-nano);--mdc-dialog-container-elevation-shadow: 0px 3px 3px -2px rgba(0, 0, 0, .2), 0px 3px 4px 0px rgba(0, 0, 0, .14), 0px 1px 8px 0px rgba(0, 0, 0, .12) !important;--mdc-dialog-container-elevation: var(--mdc-dialog-container-elevation-shadow);--mdc-dialog-container-color: var(--dsc-color-bg-neutral-1)}.mat-mdc-dialog-container .mdc-dialog__container .mat-mdc-dialog-surface .mat-mdc-dialog-title{margin:0 0 var(--dsc-spacing-tiny)!important;display:flex;box-sizing:border-box;min-height:var(--dsc-spacing-bigger);padding-top:var(--dsc-spacing-micro);padding-bottom:var(--dsc-spacing-micro);padding-left:var(--dsc-spacing-smaller);padding-right:var(--dsc-spacing-micro);border-bottom:var(--dsc-border-width-hairline) solid var(--dsc-color-border-neutral-3)}.mat-mdc-dialog-container .mdc-dialog__container .mat-mdc-dialog-surface .mat-mdc-dialog-title__icon{color:var(--dsc-color-bg-neutral-7);align-self:center;height:var(--dsc-icon-size-large);width:var(--dsc-icon-size-large);font-size:var(--dsc-icon-size-large);margin:0 var(--dsc-spacing-nano) 0 0}.mat-mdc-dialog-container .mdc-dialog__container .mat-mdc-dialog-surface .mat-mdc-dialog-title__text{color:var(--dsc-color-content-neutral-5);font:var(--dsc-typography-head-small-600)!important;margin:0!important;flex:1;align-self:center;vertical-align:bottom;line-height:var(--dsc-font-line-height-tight)!important}.mat-mdc-dialog-container .mdc-dialog__container .mat-mdc-dialog-surface .mat-mdc-dialog-title__close-icon{align-self:center;height:var(--dsc-icon-size-large);width:var(--dsc-icon-size-large);font-size:var(--dsc-icon-size-large);margin:0;cursor:pointer;color:var(--dsc-color-bg-highlight-5)}.mat-mdc-dialog-container .mdc-dialog__container .mat-mdc-dialog-surface .mat-mdc-dialog-title .close-dialog{align-self:center;font-size:var(--dsc-icon-size-large);margin:0;cursor:pointer;color:var(--dsc-color-bg-highlight-5)}.mat-mdc-dialog-container .mdc-dialog__container .mat-mdc-dialog-surface .mat-mdc-dialog-title__highlight{background-color:var(--dsc-color-bg-highlight-5)}.mat-mdc-dialog-container .mdc-dialog__container .mat-mdc-dialog-surface .mat-mdc-dialog-title__highlight .mat-mdc-dialog-title__icon,.mat-mdc-dialog-container .mdc-dialog__container .mat-mdc-dialog-surface .mat-mdc-dialog-title__highlight .mat-mdc-dialog-title__text,.mat-mdc-dialog-container .mdc-dialog__container .mat-mdc-dialog-surface .mat-mdc-dialog-title__highlight .mat-mdc-dialog-title__close-icon{color:var(--dsc-color-content-neutral-1)}.mat-mdc-dialog-container .mdc-dialog__container .mat-mdc-dialog-surface .mat-mdc-dialog-title__highlight .close-dialog mat-icon{color:var(--dsc-color-content-neutral-1)}.mat-mdc-dialog-container .mdc-dialog__container .mat-mdc-dialog-surface .mat-mdc-dialog-content{padding:0 var(--dsc-spacing-smaller) var(--dsc-spacing-smaller)}.mat-mdc-dialog-container .mdc-dialog__container .mat-mdc-dialog-surface .mat-mdc-dialog-content__message{font:var(--dsc-typography-text-big-400)!important;font-feature-settings:\"ss01\"!important;color:var(--dsc-color-content-neutral-4)}.mat-mdc-dialog-container .mdc-dialog__container .mat-mdc-dialog-surface .mat-mdc-dialog-actions{gap:var(--dsc-spacing-tiny);padding:0 var(--dsc-spacing-smaller) var(--dsc-spacing-smaller)}@media (max-width: 576px){.mat-mdc-dialog-container .mdc-dialog__container .mat-mdc-dialog-surface .mat-mdc-dialog-actions{flex-direction:column;align-items:stretch}.mat-mdc-dialog-container .mdc-dialog__container .mat-mdc-dialog-surface .mat-mdc-dialog-actions dsc-button:nth-of-type(1){order:2}}.cdk-overlay-dark-backdrop{background:var(--dsc-color-bg-neutral-7)}.cdk-overlay-backdrop.cdk-overlay-backdrop-showing{opacity:var(--dsc-opacity-48)}\n"], dependencies: [{ kind: "directive", type: i1.MatDialogClose, selector: "[mat-dialog-close], [matDialogClose]", inputs: ["aria-label", "type", "mat-dialog-close", "matDialogClose"], exportAs: ["matDialogClose"] }, { kind: "directive", type: i1.MatDialogTitle, selector: "[mat-dialog-title], [matDialogTitle]", inputs: ["id"], exportAs: ["matDialogTitle"] }, { kind: "directive", type: i1.MatDialogContent, selector: "[mat-dialog-content], mat-dialog-content, [matDialogContent]" }, { kind: "directive", type: i1.MatDialogActions, selector: "[mat-dialog-actions], mat-dialog-actions, [matDialogActions]", inputs: ["align"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i3.DscButtonComponent, selector: "dsc-button", inputs: ["type", "label", "iconSuffix", "iconPrefix", "icon", "tabIndex", "dscTooltip", "ariaLabel", "ariaExpanded", "ariaControls", "iconStyle", "variant", "size", "disabled", "iconButton"] }, { kind: "directive", type: i4.DscTooltipDirective, selector: "[dscTooltip]", inputs: ["dscTooltipPosition", "dscTooltipVariant", "dscTooltipPositionAtOrigin", "dscTooltipDisabled", "dscTooltipShowDelay", "dscTooltipHideDelay", "dscTooltip"] }, { kind: "component", type: i5.MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "directive", type: i2.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i2.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscDialogComponent, decorators: [{
            type: Component,
            args: [{ selector: 'dsc-dialog', host: {
                        'class': 'mat-elevation-z2'
                    }, encapsulation: ViewEncapsulation.None, template: "\n<div mat-dialog-title\n     [class.mat-mdc-dialog-title__highlight]=\"dialogConfig.title.highlightVariant\">\n  <mat-icon *ngIf=\"dialogConfig.title.icon\"\n            class=\"mat-mdc-dialog-title__icon\"\n            [ngStyle]=\"{ 'color': dialogConfig.title.highlightVariant ? null : 'var(' + dialogConfig.title.iconColor + ')' }\">\n    {{ dialogConfig.title.icon }}\n  </mat-icon>\n  <h2 class=\"mat-mdc-dialog-title__text\">{{ dialogConfig.title.text }}</h2>\n  <dsc-button\n    (click)=\"close(false)\"\n    *ngIf=\"dialogConfig.title.showCloseButton\"\n    [ariaLabel]=\"'Fechar'\"\n    class=\"close-dialog\"\n    size=\"large\"\n    variant=\"secondary-text\"\n    icon=\"close\"\n    iconButton=\"true\">\n  </dsc-button>\n</div>\n<mat-dialog-content>\n  <ng-container [ngTemplateOutlet]=\"dialogConfig.template ? dialogConfig.template : simpleTemplate\"\n                [ngTemplateOutletContext]=\"{$implicit: dialogConfig.context}\">\n  </ng-container>\n</mat-dialog-content>\n<mat-dialog-actions *ngIf=\"dialogConfig.actionButton\"\n                    align=\"end\">\n  <dsc-button *ngIf=\"dialogConfig.actionButton.cancelText\"\n              [label]=\"dialogConfig.actionButton.cancelText\"\n              [size]=\"dialogConfig.actionButton.cancelSize ?? 'standard'\"\n              [variant]=\"dialogConfig.actionButton.cancelVariant ?? 'secondary-outlined'\"\n              [iconPrefix]=\"dialogConfig.actionButton.cancelIconPrefix\"\n              [iconSuffix]=\"dialogConfig.actionButton.cancelIconSuffix\"\n              [disabled]=\"dialogConfig.actionButton.cancelDisabled ?? false\"\n              [iconButton]=\"dialogConfig.actionButton.cancelIconButton\"\n              [icon]=\"dialogConfig.actionButton.cancelIcon\"\n              [dscTooltip]=\"dialogConfig.actionButton.cancelTooltip ?? ''\"\n              [ariaLabel]=\"dialogConfig.actionButton.cancelAriaLabel ?? ''\"\n              mat-dialog-close>\n  </dsc-button>\n  <dsc-button *ngIf=\"dialogConfig.actionButton.confirmText\"\n              [type]=\"dialogConfig.actionButton.type\"\n              [label]=\"dialogConfig.actionButton.confirmText\"\n              [size]=\"dialogConfig.actionButton.confirmSize ?? 'standard'\"\n              [variant]=\"dialogConfig.actionButton.confirmVariant ?? 'primary'\"\n              [iconPrefix]=\"dialogConfig.actionButton.confirmIconPrefix\"\n              [iconSuffix]=\"dialogConfig.actionButton.confirmIconSuffix\"\n              [disabled]=\"dialogConfig.actionButton.confirmDisabled ?? false\"\n              [iconButton]=\"dialogConfig.actionButton.confirmIconButton\"\n              [icon]=\"dialogConfig.actionButton.confirmIcon\"\n              [dscTooltip]=\"dialogConfig.actionButton.confirmTooltip ?? ''\"\n              [ariaLabel]=\"dialogConfig.actionButton.confirmAriaLabel ?? ''\"\n              [mat-dialog-close]=\"dialogConfig.context ? dialogConfig.context : true\">\n  </dsc-button>\n</mat-dialog-actions>\n\n<ng-template #simpleTemplate>\n  <p class=\"mat-mdc-dialog-content__message\">{{ dialogConfig.message }}</p>\n</ng-template>\n", styles: [".mat-mdc-dialog-container .mdc-dialog__container{--mdc-dialog-container-shape: var(--dsc-border-radius-nano);--mdc-dialog-container-elevation-shadow: 0px 3px 3px -2px rgba(0, 0, 0, .2), 0px 3px 4px 0px rgba(0, 0, 0, .14), 0px 1px 8px 0px rgba(0, 0, 0, .12) !important;--mdc-dialog-container-elevation: var(--mdc-dialog-container-elevation-shadow);--mdc-dialog-container-color: var(--dsc-color-bg-neutral-1)}.mat-mdc-dialog-container .mdc-dialog__container .mat-mdc-dialog-surface .mat-mdc-dialog-title{margin:0 0 var(--dsc-spacing-tiny)!important;display:flex;box-sizing:border-box;min-height:var(--dsc-spacing-bigger);padding-top:var(--dsc-spacing-micro);padding-bottom:var(--dsc-spacing-micro);padding-left:var(--dsc-spacing-smaller);padding-right:var(--dsc-spacing-micro);border-bottom:var(--dsc-border-width-hairline) solid var(--dsc-color-border-neutral-3)}.mat-mdc-dialog-container .mdc-dialog__container .mat-mdc-dialog-surface .mat-mdc-dialog-title__icon{color:var(--dsc-color-bg-neutral-7);align-self:center;height:var(--dsc-icon-size-large);width:var(--dsc-icon-size-large);font-size:var(--dsc-icon-size-large);margin:0 var(--dsc-spacing-nano) 0 0}.mat-mdc-dialog-container .mdc-dialog__container .mat-mdc-dialog-surface .mat-mdc-dialog-title__text{color:var(--dsc-color-content-neutral-5);font:var(--dsc-typography-head-small-600)!important;margin:0!important;flex:1;align-self:center;vertical-align:bottom;line-height:var(--dsc-font-line-height-tight)!important}.mat-mdc-dialog-container .mdc-dialog__container .mat-mdc-dialog-surface .mat-mdc-dialog-title__close-icon{align-self:center;height:var(--dsc-icon-size-large);width:var(--dsc-icon-size-large);font-size:var(--dsc-icon-size-large);margin:0;cursor:pointer;color:var(--dsc-color-bg-highlight-5)}.mat-mdc-dialog-container .mdc-dialog__container .mat-mdc-dialog-surface .mat-mdc-dialog-title .close-dialog{align-self:center;font-size:var(--dsc-icon-size-large);margin:0;cursor:pointer;color:var(--dsc-color-bg-highlight-5)}.mat-mdc-dialog-container .mdc-dialog__container .mat-mdc-dialog-surface .mat-mdc-dialog-title__highlight{background-color:var(--dsc-color-bg-highlight-5)}.mat-mdc-dialog-container .mdc-dialog__container .mat-mdc-dialog-surface .mat-mdc-dialog-title__highlight .mat-mdc-dialog-title__icon,.mat-mdc-dialog-container .mdc-dialog__container .mat-mdc-dialog-surface .mat-mdc-dialog-title__highlight .mat-mdc-dialog-title__text,.mat-mdc-dialog-container .mdc-dialog__container .mat-mdc-dialog-surface .mat-mdc-dialog-title__highlight .mat-mdc-dialog-title__close-icon{color:var(--dsc-color-content-neutral-1)}.mat-mdc-dialog-container .mdc-dialog__container .mat-mdc-dialog-surface .mat-mdc-dialog-title__highlight .close-dialog mat-icon{color:var(--dsc-color-content-neutral-1)}.mat-mdc-dialog-container .mdc-dialog__container .mat-mdc-dialog-surface .mat-mdc-dialog-content{padding:0 var(--dsc-spacing-smaller) var(--dsc-spacing-smaller)}.mat-mdc-dialog-container .mdc-dialog__container .mat-mdc-dialog-surface .mat-mdc-dialog-content__message{font:var(--dsc-typography-text-big-400)!important;font-feature-settings:\"ss01\"!important;color:var(--dsc-color-content-neutral-4)}.mat-mdc-dialog-container .mdc-dialog__container .mat-mdc-dialog-surface .mat-mdc-dialog-actions{gap:var(--dsc-spacing-tiny);padding:0 var(--dsc-spacing-smaller) var(--dsc-spacing-smaller)}@media (max-width: 576px){.mat-mdc-dialog-container .mdc-dialog__container .mat-mdc-dialog-surface .mat-mdc-dialog-actions{flex-direction:column;align-items:stretch}.mat-mdc-dialog-container .mdc-dialog__container .mat-mdc-dialog-surface .mat-mdc-dialog-actions dsc-button:nth-of-type(1){order:2}}.cdk-overlay-dark-backdrop{background:var(--dsc-color-bg-neutral-7)}.cdk-overlay-backdrop.cdk-overlay-backdrop-showing{opacity:var(--dsc-opacity-48)}\n"] }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_DIALOG_DATA]
                }] }, { type: i1.MatDialogRef }]; } });

class DscDialogService {
    constructor(dialog) {
        this.dialog = dialog;
    }
    confirm(dscDialogConfig) {
        const dialogRef = this.dialog.open(DscDialogComponent, {
            disableClose: dscDialogConfig.disableClose,
            autoFocus: dscDialogConfig.autoFocus,
            restoreFocus: dscDialogConfig.restoreFocus,
            hasBackdrop: true,
            ariaLabel: dscDialogConfig.ariaLabel,
            ariaLabelledBy: dscDialogConfig.ariaLabelledBy,
            ariaDescribedBy: dscDialogConfig.ariaDescribedBy,
            data: dscDialogConfig.data
        });
        dialogRef.afterClosed().pipe(take(1)).subscribe(value => {
            const actionButton = dscDialogConfig.data?.actionButton;
            if (value && actionButton?.confirmFunction) {
                actionButton.confirmFunction(value);
            }
            else if (!value && actionButton?.cancelFunction) {
                actionButton.cancelFunction();
            }
        });
        return dialogRef;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscDialogService, deps: [{ token: i1.MatDialog }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscDialogService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscDialogService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.MatDialog }]; } });

class DscDialogModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscDialogModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.2.12", ngImport: i0, type: DscDialogModule, declarations: [DscDialogComponent], imports: [MatDialogModule,
            NgClass,
            NgIf,
            DscButtonComponent,
            DscTooltipModule,
            MatIconModule,
            NgTemplateOutlet,
            CommonModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscDialogModule, providers: [DscDialogService], imports: [MatDialogModule,
            DscButtonComponent,
            DscTooltipModule,
            MatIconModule,
            CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscDialogModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [DscDialogComponent],
                    imports: [
                        MatDialogModule,
                        NgClass,
                        NgIf,
                        DscButtonComponent,
                        DscTooltipModule,
                        MatIconModule,
                        NgTemplateOutlet,
                        CommonModule
                    ],
                    providers: [DscDialogService]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { DscDialogModule, DscDialogService };
//# sourceMappingURL=sidsc-components-dsc-dialog.mjs.map
