import * as i0 from '@angular/core';
import { EventEmitter, forwardRef, Component, ViewEncapsulation, Input, Output } from '@angular/core';
import { NgClass, NgForOf, NgIf, AsyncPipe } from '@angular/common';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import * as i1 from '@angular/material/radio';
import { MatRadioModule } from '@angular/material/radio';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { BaseControlValueAccessor } from 'sidsc-components/core';

class DscRadioButtonComponent extends BaseControlValueAccessor {
    constructor() {
        super(...arguments);
        this._labelPosition = 'after';
        this._checked = false;
        this._required = false;
        this._size = 'standard';
        this.radioButtonLabelSize = 'mat-mdc-radio-button--standard';
        this._variant = 'highlight';
        this.radioButtonVariant = 'mat-mdc-radio-button--highlight';
        this.change = new EventEmitter();
        this.focus = new EventEmitter();
    }
    get labelPosition() {
        return this._labelPosition;
    }
    set labelPosition(value) {
        this._labelPosition = value;
    }
    get checked() {
        return this._checked;
    }
    set checked(value) {
        this._checked = coerceBooleanProperty(value);
    }
    get required() {
        return this._required;
    }
    set required(value) {
        this._required = coerceBooleanProperty(value);
    }
    get size() {
        return this._size;
    }
    set size(value) {
        this._size = value;
        this.radioButtonLabelSize = `mat-mdc-radio-button--${value}`;
    }
    get variant() {
        return this._variant;
    }
    set variant(value) {
        this._variant = value;
        this.radioButtonVariant = `mat-mdc-radio-button--${value}`;
    }
    writeValue(value) {
        this.checked = value && this.value && JSON.stringify(value) === JSON.stringify(this.value);
    }
    select() {
        if (!this.disabled) {
            this.checked = true;
            this.onChange(this.value);
            this.onTouched();
        }
    }
    onChanged($event) {
        this.change.emit($event);
    }
    validate(control) {
        return control.value === null || control.value === undefined ? { required: true } : null;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscRadioButtonComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.12", type: DscRadioButtonComponent, isStandalone: true, selector: "dsc-radio-button", inputs: { name: "name", label: "label", ariaDescribedby: ["aria-describedby", "ariaDescribedby"], ariaLabel: ["aria-label", "ariaLabel"], ariaLabelledby: ["aria-labelledby", "ariaLabelledby"], value: "value", labelPosition: "labelPosition", required: "required", size: "size", variant: "variant" }, outputs: { change: "change", focus: "focus" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => DscRadioButtonComponent),
                multi: true
            },
            {
                provide: NG_VALIDATORS,
                useExisting: DscRadioButtonComponent,
                multi: true
            }
        ], usesInheritance: true, ngImport: i0, template: "<mat-radio-button [aria-describedby]=\"ariaDescribedby\"\n                  [aria-label]=\"ariaLabel\"\n                  [aria-labelledby]=\"ariaLabelledby\"\n                  [checked]=\"checked\"\n                  [required]=\"required\"\n                  [disabled]=\"disabled\"\n                  [labelPosition]=\"labelPosition\"\n                  [name]=\"name\"\n                  [value]=\"value\"\n                  (change)=\"select();onChanged($event)\"\n                  (focusout)=\"onTouched()\"\n                  [class]=\"radioButtonLabelSize\"\n                  [ngClass]=\"radioButtonVariant\">\n  {{ label }}\n</mat-radio-button>\n", styles: ["dsc-radio-button .mat-mdc-radio-button{--mdc-radio-unselected-hover-icon-color: var(--dsc-color-state-bg-highlight-hover) !important;--mdc-radio-unselected-focus-icon-color: var(--dsc-color-bg-neutral-7);--mdc-radio-unselected-icon-color: var(--dsc-color-bg-neutral-7) !important;--mdc-radio-unselected-pressed-icon-color: var(--dsc-color-state-bg-highlight-active)}dsc-radio-button .mat-mdc-radio-button.cdk-keyboard-focused .mdc-radio{--mat-radio-ripple-color: color-mix(in srgb,var(--dsc-color-bg-neutral-1),transparent 84%);outline:var(--dsc-border-width-thin) solid var(--dsc-color-state-border-focus-dark);border-radius:50%;outline-offset:-2px}dsc-radio-button .mat-mdc-radio-button.cdk-keyboard-focused.mat-mdc-radio-button--danger .mdc-radio__background .mdc-radio__outer-circle{border-color:var(--dsc-color-bg-danger-5)!important}dsc-radio-button .mat-mdc-radio-button .mdc-radio{padding:var(--dsc-spacing-micro)}dsc-radio-button .mat-mdc-radio-button .mdc-radio--disabled{--mdc-radio-disabled-selected-icon-color: var(--dsc-color-bg-neutral-5) !important;--mdc-radio-disabled-unselected-icon-color: var(--dsc-color-bg-neutral-5) !important}dsc-radio-button .mat-mdc-radio-button .mdc-radio--disabled+label{color:var(--dsc-color-content-neutral-3)!important}dsc-radio-button .mat-mdc-radio-button--large .mdc-label{font:var(--dsc-typography-text-big-400);font-feature-settings:\"ss01\"!important}dsc-radio-button .mat-mdc-radio-button--standard .mdc-label{font:var(--dsc-typography-text-large-400);font-feature-settings:\"ss01\"!important}dsc-radio-button .mat-mdc-radio-button--small .mdc-label{font:var(--dsc-typography-text-standard-400);font-feature-settings:\"ss01\"!important}dsc-radio-button .mat-mdc-radio-button--highlight .mdc-radio{--mdc-radio-unselected-icon-color: var(--dsc-color-bg-neutral-7);--mdc-radio-unselected-pressed-icon-color: var(--dsc-color-state-bg-highlight-active);--mdc-radio-unselected-hover-icon-color: var(--dsc-color-state-bg-highlight-hover);--mdc-radio-selected-focus-icon-color: var(--dsc-color-bg-highlight-6);--mdc-radio-selected-hover-icon-color: var(--dsc-color-state-bg-highlight-hover);--mdc-radio-selected-icon-color: var(--dsc-color-bg-highlight-5);--mdc-radio-selected-pressed-icon-color: var(--dsc-color-bg-highlight-6);--mat-radio-checked-ripple-color: var(--dsc-color-bg-highlight-5);--mat-radio-ripple-color: var(--dsc-color-bg-highlight-5)}dsc-radio-button .mat-mdc-radio-button--accent .mdc-radio{--mdc-radio-unselected-icon-color: var(--dsc-color-bg-neutral-7);--mdc-radio-unselected-pressed-icon-color: var(--dsc-color-state-bg-accent-active);--mdc-radio-unselected-hover-icon-color: var(--dsc-color-state-bg-accent-hover);--mdc-radio-selected-focus-icon-color: var(--dsc-color-bg-accent-6);--mdc-radio-selected-hover-icon-color: var(--dsc-color-state-bg-accent-hover);--mdc-radio-selected-icon-color: var(--dsc-color-bg-accent-5);--mdc-radio-selected-pressed-icon-color: var(--dsc-color-bg-accent-6);--mat-radio-checked-ripple-color: var(--dsc-color-bg-accent-5);--mat-radio-ripple-color: var(--dsc-color-bg-neutral-7)}dsc-radio-button .mat-mdc-radio-button--danger .mdc-radio{--mdc-radio-unselected-icon-color: var(--dsc-color-bg-danger-5);--mdc-radio-unselected-pressed-icon-color: var(--dsc-color-state-bg-danger-active);--mdc-radio-unselected-hover-icon-color: var(--dsc-color-state-bg-danger-hover);--mdc-radio-selected-focus-icon-color: var(--dsc-color-bg-danger-5);--mdc-radio-selected-hover-icon-color: var(--dsc-color-state-bg-danger-hover);--mdc-radio-selected-icon-color: var(--dsc-color-bg-danger-5);--mdc-radio-selected-pressed-icon-color: var(--dsc-color-bg-danger-5);--mat-radio-checked-ripple-color: var(--dsc-color-bg-danger-4);--mat-radio-ripple-color: var(--dsc-color-bg-danger-4)}dsc-radio-button .mat-mdc-radio-button--danger.mat-mdc-radio-button--small .mdc-label{color:var(--dsc-color-content-danger-2);font:var(--dsc-typography-text-standard-600)!important;font-feature-settings:\"ss01\"!important}dsc-radio-button .mat-mdc-radio-button--danger.mat-mdc-radio-button--standard .mdc-label{color:var(--dsc-color-content-danger-2);font:var(--dsc-typography-text-large-600)!important;font-feature-settings:\"ss01\"!important}dsc-radio-button .mat-mdc-radio-button--danger.mat-mdc-radio-button--large .mdc-label{color:var(--dsc-color-content-danger-2);font:var(--dsc-typography-text-big-600)!important;font-feature-settings:\"ss01\"!important}dsc-radio-button .mdc-form-field>label{padding-left:0!important}\n"], dependencies: [{ kind: "ngmodule", type: MatRadioModule }, { kind: "component", type: i1.MatRadioButton, selector: "mat-radio-button", inputs: ["disableRipple", "tabIndex"], exportAs: ["matRadioButton"] }, { kind: "ngmodule", type: FormsModule }, { kind: "ngmodule", type: MatFormFieldModule }, { kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }], encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscRadioButtonComponent, decorators: [{
            type: Component,
            args: [{ selector: 'dsc-radio-button', standalone: true, imports: [MatRadioModule, FormsModule, NgForOf, MatFormFieldModule, NgIf, NgClass, AsyncPipe], encapsulation: ViewEncapsulation.None, providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => DscRadioButtonComponent),
                            multi: true
                        },
                        {
                            provide: NG_VALIDATORS,
                            useExisting: DscRadioButtonComponent,
                            multi: true
                        }
                    ], template: "<mat-radio-button [aria-describedby]=\"ariaDescribedby\"\n                  [aria-label]=\"ariaLabel\"\n                  [aria-labelledby]=\"ariaLabelledby\"\n                  [checked]=\"checked\"\n                  [required]=\"required\"\n                  [disabled]=\"disabled\"\n                  [labelPosition]=\"labelPosition\"\n                  [name]=\"name\"\n                  [value]=\"value\"\n                  (change)=\"select();onChanged($event)\"\n                  (focusout)=\"onTouched()\"\n                  [class]=\"radioButtonLabelSize\"\n                  [ngClass]=\"radioButtonVariant\">\n  {{ label }}\n</mat-radio-button>\n", styles: ["dsc-radio-button .mat-mdc-radio-button{--mdc-radio-unselected-hover-icon-color: var(--dsc-color-state-bg-highlight-hover) !important;--mdc-radio-unselected-focus-icon-color: var(--dsc-color-bg-neutral-7);--mdc-radio-unselected-icon-color: var(--dsc-color-bg-neutral-7) !important;--mdc-radio-unselected-pressed-icon-color: var(--dsc-color-state-bg-highlight-active)}dsc-radio-button .mat-mdc-radio-button.cdk-keyboard-focused .mdc-radio{--mat-radio-ripple-color: color-mix(in srgb,var(--dsc-color-bg-neutral-1),transparent 84%);outline:var(--dsc-border-width-thin) solid var(--dsc-color-state-border-focus-dark);border-radius:50%;outline-offset:-2px}dsc-radio-button .mat-mdc-radio-button.cdk-keyboard-focused.mat-mdc-radio-button--danger .mdc-radio__background .mdc-radio__outer-circle{border-color:var(--dsc-color-bg-danger-5)!important}dsc-radio-button .mat-mdc-radio-button .mdc-radio{padding:var(--dsc-spacing-micro)}dsc-radio-button .mat-mdc-radio-button .mdc-radio--disabled{--mdc-radio-disabled-selected-icon-color: var(--dsc-color-bg-neutral-5) !important;--mdc-radio-disabled-unselected-icon-color: var(--dsc-color-bg-neutral-5) !important}dsc-radio-button .mat-mdc-radio-button .mdc-radio--disabled+label{color:var(--dsc-color-content-neutral-3)!important}dsc-radio-button .mat-mdc-radio-button--large .mdc-label{font:var(--dsc-typography-text-big-400);font-feature-settings:\"ss01\"!important}dsc-radio-button .mat-mdc-radio-button--standard .mdc-label{font:var(--dsc-typography-text-large-400);font-feature-settings:\"ss01\"!important}dsc-radio-button .mat-mdc-radio-button--small .mdc-label{font:var(--dsc-typography-text-standard-400);font-feature-settings:\"ss01\"!important}dsc-radio-button .mat-mdc-radio-button--highlight .mdc-radio{--mdc-radio-unselected-icon-color: var(--dsc-color-bg-neutral-7);--mdc-radio-unselected-pressed-icon-color: var(--dsc-color-state-bg-highlight-active);--mdc-radio-unselected-hover-icon-color: var(--dsc-color-state-bg-highlight-hover);--mdc-radio-selected-focus-icon-color: var(--dsc-color-bg-highlight-6);--mdc-radio-selected-hover-icon-color: var(--dsc-color-state-bg-highlight-hover);--mdc-radio-selected-icon-color: var(--dsc-color-bg-highlight-5);--mdc-radio-selected-pressed-icon-color: var(--dsc-color-bg-highlight-6);--mat-radio-checked-ripple-color: var(--dsc-color-bg-highlight-5);--mat-radio-ripple-color: var(--dsc-color-bg-highlight-5)}dsc-radio-button .mat-mdc-radio-button--accent .mdc-radio{--mdc-radio-unselected-icon-color: var(--dsc-color-bg-neutral-7);--mdc-radio-unselected-pressed-icon-color: var(--dsc-color-state-bg-accent-active);--mdc-radio-unselected-hover-icon-color: var(--dsc-color-state-bg-accent-hover);--mdc-radio-selected-focus-icon-color: var(--dsc-color-bg-accent-6);--mdc-radio-selected-hover-icon-color: var(--dsc-color-state-bg-accent-hover);--mdc-radio-selected-icon-color: var(--dsc-color-bg-accent-5);--mdc-radio-selected-pressed-icon-color: var(--dsc-color-bg-accent-6);--mat-radio-checked-ripple-color: var(--dsc-color-bg-accent-5);--mat-radio-ripple-color: var(--dsc-color-bg-neutral-7)}dsc-radio-button .mat-mdc-radio-button--danger .mdc-radio{--mdc-radio-unselected-icon-color: var(--dsc-color-bg-danger-5);--mdc-radio-unselected-pressed-icon-color: var(--dsc-color-state-bg-danger-active);--mdc-radio-unselected-hover-icon-color: var(--dsc-color-state-bg-danger-hover);--mdc-radio-selected-focus-icon-color: var(--dsc-color-bg-danger-5);--mdc-radio-selected-hover-icon-color: var(--dsc-color-state-bg-danger-hover);--mdc-radio-selected-icon-color: var(--dsc-color-bg-danger-5);--mdc-radio-selected-pressed-icon-color: var(--dsc-color-bg-danger-5);--mat-radio-checked-ripple-color: var(--dsc-color-bg-danger-4);--mat-radio-ripple-color: var(--dsc-color-bg-danger-4)}dsc-radio-button .mat-mdc-radio-button--danger.mat-mdc-radio-button--small .mdc-label{color:var(--dsc-color-content-danger-2);font:var(--dsc-typography-text-standard-600)!important;font-feature-settings:\"ss01\"!important}dsc-radio-button .mat-mdc-radio-button--danger.mat-mdc-radio-button--standard .mdc-label{color:var(--dsc-color-content-danger-2);font:var(--dsc-typography-text-large-600)!important;font-feature-settings:\"ss01\"!important}dsc-radio-button .mat-mdc-radio-button--danger.mat-mdc-radio-button--large .mdc-label{color:var(--dsc-color-content-danger-2);font:var(--dsc-typography-text-big-600)!important;font-feature-settings:\"ss01\"!important}dsc-radio-button .mdc-form-field>label{padding-left:0!important}\n"] }]
        }], propDecorators: { name: [{
                type: Input
            }], label: [{
                type: Input
            }], ariaDescribedby: [{
                type: Input,
                args: ['aria-describedby']
            }], ariaLabel: [{
                type: Input,
                args: ['aria-label']
            }], ariaLabelledby: [{
                type: Input,
                args: ['aria-labelledby']
            }], value: [{
                type: Input
            }], labelPosition: [{
                type: Input
            }], required: [{
                type: Input
            }], size: [{
                type: Input
            }], variant: [{
                type: Input
            }], change: [{
                type: Output
            }], focus: [{
                type: Output
            }] } });

/**
 * Generated bundle index. Do not edit.
 */

export { DscRadioButtonComponent };
//# sourceMappingURL=sidsc-components-dsc-radio-button.mjs.map
