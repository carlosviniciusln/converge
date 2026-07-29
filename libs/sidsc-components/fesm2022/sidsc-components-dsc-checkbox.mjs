import * as i0 from '@angular/core';
import { EventEmitter, forwardRef, Component, ViewEncapsulation, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';
import * as i2 from '@angular/cdk/a11y';
import { A11yModule } from '@angular/cdk/a11y';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import * as i1 from '@angular/material/checkbox';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { BaseControlValueAccessor } from 'sidsc-components/core';

class DscCheckboxComponent extends BaseControlValueAccessor {
    constructor() {
        super(...arguments);
        this.labelPosition = 'after';
        this._indeterminate = false;
        this._checked = false;
        this._required = false;
        this._size = 'standard';
        this.checkboxLabelSize = 'mat-mdc-checkbox--standard';
        this._variant = 'highlight';
        this.checkboxVariant = 'mat-mdc-checkbox--highlight';
        this.change = new EventEmitter();
        this.indeterminateChange = new EventEmitter();
        this._disable = false;
    }
    get indeterminate() {
        return this._indeterminate;
    }
    set indeterminate(value) {
        this._indeterminate = coerceBooleanProperty(value);
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
        this.checkboxLabelSize = `mat-mdc-checkbox--${value}`;
    }
    get variant() {
        return this._variant;
    }
    set variant(value) {
        this._variant = value;
        this.checkboxVariant = `mat-mdc-checkbox--${value}`;
    }
    onChanged($event) {
        this.change.emit($event);
    }
    onIndeterminateChange(value) {
        this.indeterminateChange.emit(value);
    }
    toggle() {
        this.checked = !this.checked;
        this.val = this.checked;
    }
    writeValue(value) {
        this.checked = !!value;
        this.val = this.checked;
    }
    validate(control) {
        return control.value === null || control.value === undefined ? { required: true } : null;
    }
    get disabled() {
        return this._disable;
    }
    set disabled(value) {
        this._disable = coerceBooleanProperty(value);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscCheckboxComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.12", type: DscCheckboxComponent, isStandalone: true, selector: "dsc-checkbox", inputs: { labelPosition: "labelPosition", name: "name", label: "label", ariaDescribedby: ["aria-describedby", "ariaDescribedby"], ariaLabel: ["aria-label", "ariaLabel"], ariaLabelledby: ["aria-labelledby", "ariaLabelledby"], indeterminate: "indeterminate", checked: "checked", required: "required", size: "size", variant: "variant", disabled: "disabled" }, outputs: { change: "change", indeterminateChange: "indeterminateChange" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => DscCheckboxComponent),
                multi: true
            },
            {
                provide: NG_VALIDATORS,
                useExisting: DscCheckboxComponent,
                multi: true
            }
        ], usesInheritance: true, ngImport: i0, template: "<mat-checkbox cdkMonitorSubtreeFocus\n              [(indeterminate)]=\"indeterminate\"\n              [required]=\"required\"\n              [aria-describedby]=\"ariaDescribedby\"\n              [aria-label]=\"ariaLabel\"\n              [aria-labelledby]=\"ariaLabelledby\"\n              [checked]=\"checked\"\n              [disabled]=\"disabled\"\n              [labelPosition]=\"labelPosition\"\n              [name]=\"name\"\n              [class.mat-mdc-slide-toggle--disabled]=\"disabled\"\n              [class]=\"checkboxLabelSize\"\n              [ngClass]=\"checkboxVariant\"\n              (focusout)=\"onTouched()\"\n              (change)=\"toggle();onChanged($event)\"\n              (indeterminateChange)=\"onIndeterminateChange($any($event).value)\">\n  {{ label }}\n</mat-checkbox>\n", styles: ["dsc-checkbox .mat-mdc-checkbox{--mdc-checkbox-unselected-focus-state-layer-color: var(--dsc-color-bg-neutral-1);--mdc-checkbox-unselected-hover-state-layer-color: var(--dsc-color-state-bg-highlight-hover);--mdc-checkbox-unselected-pressed-state-layer-color: var(--dsc-color-state-bg-highlight-active);--mdc-checkbox-unselected-focus-icon-color: var(--dsc-color-bg-neutral-7);--mdc-checkbox-unselected-hover-icon-color: var(--dsc-color-bg-neutral-7);--mdc-checkbox-unselected-icon-color: var(--dsc-color-bg-neutral-7);--mdc-checkbox-unselected-pressed-icon-color: var(--dsc-color-bg-neutral-7);--mdc-checkbox-unselected-focus-state-layer-opacity: var(--dsc-opacity-state-focus-1);--mdc-checkbox-selected-focus-state-layer-opacity: var(--dsc-opacity-state-focus-1)}dsc-checkbox .mat-mdc-checkbox.cdk-keyboard-focused .mdc-checkbox{outline:var(--dsc-border-width-thin) solid var(--dsc-color-state-border-focus-dark);border-radius:50%;outline-offset:-2px}dsc-checkbox .mat-mdc-checkbox .mdc-label{color:var(--dsc-color-content-neutral-5);padding:0}dsc-checkbox .mat-mdc-checkbox .mat-mdc-checkbox-touch-target{height:var(--dsc-icon-size-medium);width:var(--dsc-icon-size-medium)}dsc-checkbox .mat-mdc-checkbox--large .mdc-label{font:var(--dsc-typography-text-big-400);font-feature-settings:\"ss01\"!important}dsc-checkbox .mat-mdc-checkbox--standard .mdc-label{font:var(--dsc-typography-text-large-400);font-feature-settings:\"ss01\"!important}dsc-checkbox .mat-mdc-checkbox--small .mdc-label{font:var(--dsc-typography-text-standard-400);font-feature-settings:\"ss01\"!important}dsc-checkbox .mat-mdc-checkbox-disabled{--mdc-checkbox-disabled-selected-icon-color: var(--dsc-color-bg-neutral-5);--mdc-checkbox-disabled-unselected-icon-color: var(--dsc-color-bg-neutral-5)}dsc-checkbox .mat-mdc-checkbox-disabled .mdc-label{color:var(--dsc-color-state-content-disabled-2)}dsc-checkbox .mat-mdc-checkbox--highlight{--mdc-checkbox-selected-focus-state-layer-color: var(--dsc-color-state-bg-highlight-focus);--mdc-checkbox-selected-hover-state-layer-color: var(--dsc-color-state-bg-highlight-hover);--mdc-checkbox-selected-pressed-state-layer-color: var(--dsc-color-state-bg-highlight-active);--mdc-checkbox-selected-focus-icon-color: var(--dsc-color-bg-highlight-6);--mdc-checkbox-selected-hover-icon-color: var(--dsc-color-bg-highlight-6);--mdc-checkbox-selected-icon-color: var(--dsc-color-bg-highlight-5);--mdc-checkbox-selected-pressed-icon-color: var(--dsc-color-bg-highlight-6);--mdc-checkbox-unselected-focus-state-layer-color: var(--dsc-color-bg-neutral-7);--mdc-checkbox-unselected-hover-state-layer-color: var(--dsc-color-state-bg-highlight-hover);--mdc-checkbox-unselected-pressed-state-layer-color: var(--dsc-color-state-bg-highlight-active);--mdc-checkbox-unselected-pressed-icon-color: var(--dsc-color-bg-neutral-7);--mdc-checkbox-unselected-hover-icon-color: var(--dsc-color-bg-neutral-7)}dsc-checkbox .mat-mdc-checkbox--accent{--mdc-checkbox-selected-focus-state-layer-color: var(--dsc-color-state-bg-accent-focus);--mdc-checkbox-selected-hover-state-layer-color: var(--dsc-color-state-bg-accent-hover);--mdc-checkbox-selected-pressed-state-layer-color: var(--dsc-color-state-bg-accent-active);--mdc-checkbox-selected-focus-icon-color: var(--dsc-color-bg-accent-6);--mdc-checkbox-selected-hover-icon-color: var(--dsc-color-bg-accent-6);--mdc-checkbox-selected-icon-color: var(--dsc-color-bg-accent-5);--mdc-checkbox-selected-pressed-icon-color: var(--dsc-color-bg-accent-6);--mdc-checkbox-unselected-focus-state-layer-color: var(--dsc-color-bg-neutral-7);--mdc-checkbox-unselected-hover-state-layer-color: var(--dsc-color-state-bg-accent-hover);--mdc-checkbox-unselected-pressed-state-layer-color: var(--dsc-color-state-bg-accent-active);--mdc-checkbox-unselected-pressed-icon-color: var(--dsc-color-bg-neutral-7);--mdc-checkbox-unselected-hover-icon-color: var(--dsc-color-bg-neutral-7)}dsc-checkbox .mat-mdc-checkbox--danger{--mdc-checkbox-selected-focus-state-layer-color: var(--dsc-color-state-bg-danger-focus);--mdc-checkbox-selected-hover-state-layer-color: var(--dsc-color-state-bg-danger-hover);--mdc-checkbox-selected-pressed-state-layer-color: var(--dsc-color-state-bg-danger-active);--mdc-checkbox-selected-focus-icon-color: var(--dsc-color-bg-danger-5);--mdc-checkbox-selected-hover-icon-color: var(--dsc-color-bg-danger-5);--mdc-checkbox-selected-icon-color: var(--dsc-color-bg-danger-4);--mdc-checkbox-selected-pressed-icon-color: var(--dsc-color-bg-danger-5);--mdc-checkbox-unselected-focus-state-layer-color: var(--dsc-color-bg-danger-4);--mdc-checkbox-unselected-hover-state-layer-color: var(--dsc-color-state-bg-danger-hover);--mdc-checkbox-unselected-pressed-state-layer-color: var(--dsc-color-state-bg-danger-active);--mdc-checkbox-unselected-focus-icon-color: var(--dsc-color-bg-danger-5);--mdc-checkbox-unselected-hover-icon-color: var(--dsc-color-bg-danger-5);--mdc-checkbox-unselected-icon-color: var(--dsc-color-bg-danger-5);--mdc-checkbox-unselected-pressed-icon-color: var(--dsc-color-bg-danger-5)}dsc-checkbox .mat-mdc-checkbox--danger.mat-mdc-checkbox--small .mdc-label{color:var(--dsc-color-content-danger-2);font:var(--dsc-typography-text-standard-600)!important;font-feature-settings:\"ss01\"!important}dsc-checkbox .mat-mdc-checkbox--danger.mat-mdc-checkbox--standard .mdc-label{color:var(--dsc-color-content-danger-2);font:var(--dsc-typography-text-large-600)!important;font-feature-settings:\"ss01\"!important}dsc-checkbox .mat-mdc-checkbox--danger.mat-mdc-checkbox--large .mdc-label{color:var(--dsc-color-content-danger-2);font:var(--dsc-typography-text-big-600)!important;font-feature-settings:\"ss01\"!important}dsc-checkbox .mat-mdc-checkbox-ripple,dsc-checkbox .mdc-checkbox__ripple{border-radius:var(--dsc-border-radius-pill)}dsc-checkbox .mdc-checkbox:active .mdc-checkbox__native-control:checked~.mdc-checkbox__ripple{opacity:var(--dsc-opacity-state-active-1);border-radius:var(--dsc-border-radius-pill)}dsc-checkbox .mdc-checkbox:hover .mdc-checkbox__native-control:checked~.mdc-checkbox__ripple{opacity:var(--dsc-opacity-state-hover-1);border-radius:var(--dsc-border-radius-pill)}\n"], dependencies: [{ kind: "ngmodule", type: FormsModule }, { kind: "ngmodule", type: ReactiveFormsModule }, { kind: "ngmodule", type: MatInputModule }, { kind: "ngmodule", type: MatFormFieldModule }, { kind: "ngmodule", type: MatRadioModule }, { kind: "ngmodule", type: MatCheckboxModule }, { kind: "component", type: i1.MatCheckbox, selector: "mat-checkbox", inputs: ["disableRipple", "color", "tabIndex"], exportAs: ["matCheckbox"] }, { kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "ngmodule", type: A11yModule }, { kind: "directive", type: i2.CdkMonitorFocus, selector: "[cdkMonitorElementFocus], [cdkMonitorSubtreeFocus]", outputs: ["cdkFocusChange"], exportAs: ["cdkMonitorFocus"] }], encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscCheckboxComponent, decorators: [{
            type: Component,
            args: [{ selector: 'dsc-checkbox', standalone: true, imports: [
                        FormsModule,
                        ReactiveFormsModule,
                        MatInputModule,
                        MatFormFieldModule,
                        MatRadioModule,
                        MatCheckboxModule,
                        NgClass,
                        A11yModule
                    ], encapsulation: ViewEncapsulation.None, providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => DscCheckboxComponent),
                            multi: true
                        },
                        {
                            provide: NG_VALIDATORS,
                            useExisting: DscCheckboxComponent,
                            multi: true
                        }
                    ], template: "<mat-checkbox cdkMonitorSubtreeFocus\n              [(indeterminate)]=\"indeterminate\"\n              [required]=\"required\"\n              [aria-describedby]=\"ariaDescribedby\"\n              [aria-label]=\"ariaLabel\"\n              [aria-labelledby]=\"ariaLabelledby\"\n              [checked]=\"checked\"\n              [disabled]=\"disabled\"\n              [labelPosition]=\"labelPosition\"\n              [name]=\"name\"\n              [class.mat-mdc-slide-toggle--disabled]=\"disabled\"\n              [class]=\"checkboxLabelSize\"\n              [ngClass]=\"checkboxVariant\"\n              (focusout)=\"onTouched()\"\n              (change)=\"toggle();onChanged($event)\"\n              (indeterminateChange)=\"onIndeterminateChange($any($event).value)\">\n  {{ label }}\n</mat-checkbox>\n", styles: ["dsc-checkbox .mat-mdc-checkbox{--mdc-checkbox-unselected-focus-state-layer-color: var(--dsc-color-bg-neutral-1);--mdc-checkbox-unselected-hover-state-layer-color: var(--dsc-color-state-bg-highlight-hover);--mdc-checkbox-unselected-pressed-state-layer-color: var(--dsc-color-state-bg-highlight-active);--mdc-checkbox-unselected-focus-icon-color: var(--dsc-color-bg-neutral-7);--mdc-checkbox-unselected-hover-icon-color: var(--dsc-color-bg-neutral-7);--mdc-checkbox-unselected-icon-color: var(--dsc-color-bg-neutral-7);--mdc-checkbox-unselected-pressed-icon-color: var(--dsc-color-bg-neutral-7);--mdc-checkbox-unselected-focus-state-layer-opacity: var(--dsc-opacity-state-focus-1);--mdc-checkbox-selected-focus-state-layer-opacity: var(--dsc-opacity-state-focus-1)}dsc-checkbox .mat-mdc-checkbox.cdk-keyboard-focused .mdc-checkbox{outline:var(--dsc-border-width-thin) solid var(--dsc-color-state-border-focus-dark);border-radius:50%;outline-offset:-2px}dsc-checkbox .mat-mdc-checkbox .mdc-label{color:var(--dsc-color-content-neutral-5);padding:0}dsc-checkbox .mat-mdc-checkbox .mat-mdc-checkbox-touch-target{height:var(--dsc-icon-size-medium);width:var(--dsc-icon-size-medium)}dsc-checkbox .mat-mdc-checkbox--large .mdc-label{font:var(--dsc-typography-text-big-400);font-feature-settings:\"ss01\"!important}dsc-checkbox .mat-mdc-checkbox--standard .mdc-label{font:var(--dsc-typography-text-large-400);font-feature-settings:\"ss01\"!important}dsc-checkbox .mat-mdc-checkbox--small .mdc-label{font:var(--dsc-typography-text-standard-400);font-feature-settings:\"ss01\"!important}dsc-checkbox .mat-mdc-checkbox-disabled{--mdc-checkbox-disabled-selected-icon-color: var(--dsc-color-bg-neutral-5);--mdc-checkbox-disabled-unselected-icon-color: var(--dsc-color-bg-neutral-5)}dsc-checkbox .mat-mdc-checkbox-disabled .mdc-label{color:var(--dsc-color-state-content-disabled-2)}dsc-checkbox .mat-mdc-checkbox--highlight{--mdc-checkbox-selected-focus-state-layer-color: var(--dsc-color-state-bg-highlight-focus);--mdc-checkbox-selected-hover-state-layer-color: var(--dsc-color-state-bg-highlight-hover);--mdc-checkbox-selected-pressed-state-layer-color: var(--dsc-color-state-bg-highlight-active);--mdc-checkbox-selected-focus-icon-color: var(--dsc-color-bg-highlight-6);--mdc-checkbox-selected-hover-icon-color: var(--dsc-color-bg-highlight-6);--mdc-checkbox-selected-icon-color: var(--dsc-color-bg-highlight-5);--mdc-checkbox-selected-pressed-icon-color: var(--dsc-color-bg-highlight-6);--mdc-checkbox-unselected-focus-state-layer-color: var(--dsc-color-bg-neutral-7);--mdc-checkbox-unselected-hover-state-layer-color: var(--dsc-color-state-bg-highlight-hover);--mdc-checkbox-unselected-pressed-state-layer-color: var(--dsc-color-state-bg-highlight-active);--mdc-checkbox-unselected-pressed-icon-color: var(--dsc-color-bg-neutral-7);--mdc-checkbox-unselected-hover-icon-color: var(--dsc-color-bg-neutral-7)}dsc-checkbox .mat-mdc-checkbox--accent{--mdc-checkbox-selected-focus-state-layer-color: var(--dsc-color-state-bg-accent-focus);--mdc-checkbox-selected-hover-state-layer-color: var(--dsc-color-state-bg-accent-hover);--mdc-checkbox-selected-pressed-state-layer-color: var(--dsc-color-state-bg-accent-active);--mdc-checkbox-selected-focus-icon-color: var(--dsc-color-bg-accent-6);--mdc-checkbox-selected-hover-icon-color: var(--dsc-color-bg-accent-6);--mdc-checkbox-selected-icon-color: var(--dsc-color-bg-accent-5);--mdc-checkbox-selected-pressed-icon-color: var(--dsc-color-bg-accent-6);--mdc-checkbox-unselected-focus-state-layer-color: var(--dsc-color-bg-neutral-7);--mdc-checkbox-unselected-hover-state-layer-color: var(--dsc-color-state-bg-accent-hover);--mdc-checkbox-unselected-pressed-state-layer-color: var(--dsc-color-state-bg-accent-active);--mdc-checkbox-unselected-pressed-icon-color: var(--dsc-color-bg-neutral-7);--mdc-checkbox-unselected-hover-icon-color: var(--dsc-color-bg-neutral-7)}dsc-checkbox .mat-mdc-checkbox--danger{--mdc-checkbox-selected-focus-state-layer-color: var(--dsc-color-state-bg-danger-focus);--mdc-checkbox-selected-hover-state-layer-color: var(--dsc-color-state-bg-danger-hover);--mdc-checkbox-selected-pressed-state-layer-color: var(--dsc-color-state-bg-danger-active);--mdc-checkbox-selected-focus-icon-color: var(--dsc-color-bg-danger-5);--mdc-checkbox-selected-hover-icon-color: var(--dsc-color-bg-danger-5);--mdc-checkbox-selected-icon-color: var(--dsc-color-bg-danger-4);--mdc-checkbox-selected-pressed-icon-color: var(--dsc-color-bg-danger-5);--mdc-checkbox-unselected-focus-state-layer-color: var(--dsc-color-bg-danger-4);--mdc-checkbox-unselected-hover-state-layer-color: var(--dsc-color-state-bg-danger-hover);--mdc-checkbox-unselected-pressed-state-layer-color: var(--dsc-color-state-bg-danger-active);--mdc-checkbox-unselected-focus-icon-color: var(--dsc-color-bg-danger-5);--mdc-checkbox-unselected-hover-icon-color: var(--dsc-color-bg-danger-5);--mdc-checkbox-unselected-icon-color: var(--dsc-color-bg-danger-5);--mdc-checkbox-unselected-pressed-icon-color: var(--dsc-color-bg-danger-5)}dsc-checkbox .mat-mdc-checkbox--danger.mat-mdc-checkbox--small .mdc-label{color:var(--dsc-color-content-danger-2);font:var(--dsc-typography-text-standard-600)!important;font-feature-settings:\"ss01\"!important}dsc-checkbox .mat-mdc-checkbox--danger.mat-mdc-checkbox--standard .mdc-label{color:var(--dsc-color-content-danger-2);font:var(--dsc-typography-text-large-600)!important;font-feature-settings:\"ss01\"!important}dsc-checkbox .mat-mdc-checkbox--danger.mat-mdc-checkbox--large .mdc-label{color:var(--dsc-color-content-danger-2);font:var(--dsc-typography-text-big-600)!important;font-feature-settings:\"ss01\"!important}dsc-checkbox .mat-mdc-checkbox-ripple,dsc-checkbox .mdc-checkbox__ripple{border-radius:var(--dsc-border-radius-pill)}dsc-checkbox .mdc-checkbox:active .mdc-checkbox__native-control:checked~.mdc-checkbox__ripple{opacity:var(--dsc-opacity-state-active-1);border-radius:var(--dsc-border-radius-pill)}dsc-checkbox .mdc-checkbox:hover .mdc-checkbox__native-control:checked~.mdc-checkbox__ripple{opacity:var(--dsc-opacity-state-hover-1);border-radius:var(--dsc-border-radius-pill)}\n"] }]
        }], propDecorators: { labelPosition: [{
                type: Input
            }], name: [{
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
            }], indeterminate: [{
                type: Input
            }], checked: [{
                type: Input
            }], required: [{
                type: Input
            }], size: [{
                type: Input
            }], variant: [{
                type: Input
            }], change: [{
                type: Output
            }], indeterminateChange: [{
                type: Output
            }], disabled: [{
                type: Input
            }] } });

/**
 * Generated bundle index. Do not edit.
 */

export { DscCheckboxComponent };
//# sourceMappingURL=sidsc-components-dsc-checkbox.mjs.map
