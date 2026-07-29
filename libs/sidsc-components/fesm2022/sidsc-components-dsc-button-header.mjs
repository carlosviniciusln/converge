import * as i0 from '@angular/core';
import { EventEmitter, Component, ViewEncapsulation, Input, HostBinding, Output } from '@angular/core';
import * as i1 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i2 from '@angular/material/icon';
import { MatIconModule } from '@angular/material/icon';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { DscBadgeDirective } from 'sidsc-components/dsc-badge';

class DscButtonHeaderComponent {
    constructor() {
        this.tabIndex = 0;
        this._disabled = false;
        this.buttonClick = new EventEmitter();
        this.isPressed = false;
    }
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        this._disabled = coerceBooleanProperty(value);
    }
    get isDisabled() {
        return this.disabled ? true : null;
    }
    onClick() {
        if (!this.disabled) {
            this.buttonClick.emit();
        }
    }
    onKeyEnterDown() {
        if (!this.disabled) {
            this.isPressed = true;
        }
    }
    onKeyEnterUp() {
        this.isPressed = false;
    }
    onBlur() {
        this.isPressed = false;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscButtonHeaderComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.12", type: DscButtonHeaderComponent, isStandalone: true, selector: "dsc-button-header", inputs: { icon: "icon", label: "label", tabIndex: "tabIndex", dscTooltip: "dscTooltip", ariaLabel: "ariaLabel", disabled: "disabled" }, outputs: { buttonClick: "buttonClick" }, host: { properties: { "attr.disabled": "this.isDisabled" } }, ngImport: i0, template: "<ng-container>\n  <button mat-icon-button\n          disableRipple=\"true\"\n          [attr.aria-label]=\"dscTooltip || ariaLabel\"\n          [ngClass]=\"[\n          'mat-mdc-icon-button--standard',\n          'mat-mdc-icon-button--secondary-text-inverse',\n          isPressed ? 'is-pressed' : ''\n          ]\"\n          [disabled]=\"disabled\"\n          [tabIndex]=\"tabIndex\"\n          (click)=\"onClick()\"\n          (keydown.enter)=\"onKeyEnterDown()\"\n          (keyup.enter)=\"onKeyEnterUp()\"\n          (blur)=\"onBlur()\"\n          >\n    <mat-icon>{{ icon }}</mat-icon>\n    <div>{{label}}</div>\n  </button>\n</ng-container>\n", styles: ["dsc-button-header button{background:transparent;border:none;outline:none;cursor:pointer}dsc-button-header button div{font:var(--dsc-typography-text-small-400);font-feature-settings:\"ss01\";color:var(--dsc-color-content-neutral-1)}dsc-button-header[disabled]{pointer-events:none!important}dsc-button-header .mdc-button{width:100%;gap:var(--dsc-spacing-nano);border-radius:var(--dsc-border-radius-nano)}dsc-button-header .mat-mdc-icon-button--standard{--mdc-icon-button-icon-size: var(--dsc-icon-medium)}dsc-button-header .mat-mdc-icon-button--standard.mat-mdc-button-base{--mdc-icon-button-state-layer-size: var(--dsc-button-height-standard);border-radius:10%;padding:calc(var(--dsc-spacing-nano) - var(--dsc-border-width-hairline))}dsc-button-header .mat-mdc-icon-button--standard.mat-mdc-button-base .mat-mdc-button-persistent-ripple{border-radius:10%}dsc-button-header .mat-mdc-icon-button--standard.mat-mdc-button-base .mat-mdc-button-touch-target{height:var(--mdc-icon-button-state-layer-size);width:var(--mdc-icon-button-state-layer-size)}dsc-button-header .mat-mdc-icon-button--standard.mat-mdc-button-base .mat-icon{font-size:var(--dsc-icon-medium);width:var(--dsc-icon-medium);height:var(--dsc-icon-medium);position:relative;z-index:2}dsc-button-header .mat-mdc-icon-button--secondary-text-inverse:not([disabled]){--mat-icon-color: var(--dsc-color-bg-neutral-1)}dsc-button-header .mat-mdc-icon-button--secondary-text-inverse:not([disabled]):hover{background-color:color-mix(in srgb,var(--dsc-color-state-bg-neutral-hover-on-dark),transparent 92%);border-radius:var(--dsc-border-radius-nano)}dsc-button-header .mat-mdc-icon-button--secondary-text-inverse:not([disabled]):active{background-color:color-mix(in srgb,var(--dsc-color-state-bg-neutral-active-on-dark),transparent 84%);border-radius:var(--dsc-border-radius-nano)}dsc-button-header .mat-mdc-icon-button--secondary-text-inverse:not([disabled]):focus-visible{outline:var(--dsc-border-width-thick) solid var(--dsc-color-border-neutral-1);border-radius:var(--dsc-border-radius-nano)}dsc-button-header .mat-mdc-icon-button--secondary-text-inverse:not([disabled]).is-pressed{background-color:color-mix(in srgb,var(--dsc-color-state-bg-neutral-active-on-dark),transparent 84%);border-radius:var(--dsc-border-radius-nano)}dsc-button-header .mat-mdc-icon-button--secondary-text-inverse[disabled]{--mat-icon-color: var(--dsc-color-bg-neutral-5) !important}.mat-badge-content{right:-8px!important;top:-29px!important}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "ngmodule", type: MatIconModule }, { kind: "component", type: i2.MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }], encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscButtonHeaderComponent, decorators: [{
            type: Component,
            args: [{ selector: 'dsc-button-header', standalone: true, encapsulation: ViewEncapsulation.None, imports: [CommonModule, MatIconModule, DscBadgeDirective], template: "<ng-container>\n  <button mat-icon-button\n          disableRipple=\"true\"\n          [attr.aria-label]=\"dscTooltip || ariaLabel\"\n          [ngClass]=\"[\n          'mat-mdc-icon-button--standard',\n          'mat-mdc-icon-button--secondary-text-inverse',\n          isPressed ? 'is-pressed' : ''\n          ]\"\n          [disabled]=\"disabled\"\n          [tabIndex]=\"tabIndex\"\n          (click)=\"onClick()\"\n          (keydown.enter)=\"onKeyEnterDown()\"\n          (keyup.enter)=\"onKeyEnterUp()\"\n          (blur)=\"onBlur()\"\n          >\n    <mat-icon>{{ icon }}</mat-icon>\n    <div>{{label}}</div>\n  </button>\n</ng-container>\n", styles: ["dsc-button-header button{background:transparent;border:none;outline:none;cursor:pointer}dsc-button-header button div{font:var(--dsc-typography-text-small-400);font-feature-settings:\"ss01\";color:var(--dsc-color-content-neutral-1)}dsc-button-header[disabled]{pointer-events:none!important}dsc-button-header .mdc-button{width:100%;gap:var(--dsc-spacing-nano);border-radius:var(--dsc-border-radius-nano)}dsc-button-header .mat-mdc-icon-button--standard{--mdc-icon-button-icon-size: var(--dsc-icon-medium)}dsc-button-header .mat-mdc-icon-button--standard.mat-mdc-button-base{--mdc-icon-button-state-layer-size: var(--dsc-button-height-standard);border-radius:10%;padding:calc(var(--dsc-spacing-nano) - var(--dsc-border-width-hairline))}dsc-button-header .mat-mdc-icon-button--standard.mat-mdc-button-base .mat-mdc-button-persistent-ripple{border-radius:10%}dsc-button-header .mat-mdc-icon-button--standard.mat-mdc-button-base .mat-mdc-button-touch-target{height:var(--mdc-icon-button-state-layer-size);width:var(--mdc-icon-button-state-layer-size)}dsc-button-header .mat-mdc-icon-button--standard.mat-mdc-button-base .mat-icon{font-size:var(--dsc-icon-medium);width:var(--dsc-icon-medium);height:var(--dsc-icon-medium);position:relative;z-index:2}dsc-button-header .mat-mdc-icon-button--secondary-text-inverse:not([disabled]){--mat-icon-color: var(--dsc-color-bg-neutral-1)}dsc-button-header .mat-mdc-icon-button--secondary-text-inverse:not([disabled]):hover{background-color:color-mix(in srgb,var(--dsc-color-state-bg-neutral-hover-on-dark),transparent 92%);border-radius:var(--dsc-border-radius-nano)}dsc-button-header .mat-mdc-icon-button--secondary-text-inverse:not([disabled]):active{background-color:color-mix(in srgb,var(--dsc-color-state-bg-neutral-active-on-dark),transparent 84%);border-radius:var(--dsc-border-radius-nano)}dsc-button-header .mat-mdc-icon-button--secondary-text-inverse:not([disabled]):focus-visible{outline:var(--dsc-border-width-thick) solid var(--dsc-color-border-neutral-1);border-radius:var(--dsc-border-radius-nano)}dsc-button-header .mat-mdc-icon-button--secondary-text-inverse:not([disabled]).is-pressed{background-color:color-mix(in srgb,var(--dsc-color-state-bg-neutral-active-on-dark),transparent 84%);border-radius:var(--dsc-border-radius-nano)}dsc-button-header .mat-mdc-icon-button--secondary-text-inverse[disabled]{--mat-icon-color: var(--dsc-color-bg-neutral-5) !important}.mat-badge-content{right:-8px!important;top:-29px!important}\n"] }]
        }], propDecorators: { icon: [{
                type: Input
            }], label: [{
                type: Input
            }], tabIndex: [{
                type: Input
            }], dscTooltip: [{
                type: Input
            }], ariaLabel: [{
                type: Input
            }], disabled: [{
                type: Input
            }], isDisabled: [{
                type: HostBinding,
                args: ['attr.disabled']
            }], buttonClick: [{
                type: Output
            }] } });

/**
 * Generated bundle index. Do not edit.
 */

export { DscButtonHeaderComponent };
//# sourceMappingURL=sidsc-components-dsc-button-header.mjs.map
