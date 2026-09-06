import * as i0 from '@angular/core';
import { EventEmitter, forwardRef, Component, ViewEncapsulation, Input, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, FormsModule } from '@angular/forms';
import * as i1 from '@angular/material/slide-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { NgClass } from '@angular/common';
import * as i2 from '@angular/cdk/a11y';
import { A11yModule } from '@angular/cdk/a11y';
import { BaseControlValueAccessor } from 'sidsc-components/core';

class DscSwitchComponent extends BaseControlValueAccessor {
    constructor() {
        super(...arguments);
        this.labelPosition = 'after';
        this._checked = false;
        this._required = false;
        this._size = 'standard';
        this.switchLabelSize = 'mat-mdc-slide-toggle--standard';
        this._variant = 'highlight';
        this.switchVariant = 'mat-mdc-slide-toggle--highlight';
        this._hideIcon = false;
        this.change = new EventEmitter();
        this.toggleChange = new EventEmitter();
    }
    get disabled() {
        return super.disabled;
    }
    set disabled(value) {
        super.disabled = value;
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
        this.switchLabelSize = `mat-mdc-slide-toggle--${value}`;
    }
    get variant() {
        return this._variant;
    }
    set variant(value) {
        this._variant = value;
        this.switchVariant = `mat-mdc-slide-toggle--${value}`;
    }
    get hideIcon() {
        return this._hideIcon;
    }
    set hideIcon(value) {
        this._hideIcon = coerceBooleanProperty(value);
    }
    toggle() {
        this.checked = !this.checked;
        this.val = this.checked;
    }
    writeValue(value) {
        this.checked = !!value;
        this.val = this.checked;
    }
    onChanged($event) {
        this.change.emit($event);
    }
    onToggleChange() {
        this.toggleChange.emit();
    }
    validate(control) {
        return control.value === null || control.value === undefined ? { required: true } : null;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscSwitchComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.12", type: DscSwitchComponent, isStandalone: true, selector: "dsc-switch", inputs: { labelPosition: "labelPosition", name: "name", label: "label", ariaDescribedby: ["aria-describedby", "ariaDescribedby"], ariaLabel: ["aria-label", "ariaLabel"], ariaLabelledby: ["aria-labelledby", "ariaLabelledby"], disabled: "disabled", checked: "checked", required: "required", size: "size", variant: "variant", hideIcon: "hideIcon" }, outputs: { change: "change", toggleChange: "toggleChange" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => DscSwitchComponent),
                multi: true
            },
            {
                provide: NG_VALIDATORS,
                useExisting: DscSwitchComponent,
                multi: true
            }
        ], usesInheritance: true, ngImport: i0, template: "<mat-slide-toggle cdkMonitorElementFocus\n                  [aria-describedby]=\"ariaDescribedby\"\n                  [aria-label]=\"ariaLabel\"\n                  [aria-labelledby]=\"ariaLabelledby\"\n                  [checked]=\"checked\"\n                  [required]=\"required\"\n                  [disabled]=\"disabled\"\n                  [labelPosition]=\"labelPosition\"\n                  [name]=\"name\"\n                  [class]=\"switchLabelSize\"\n                  [ngClass]=\"[switchVariant, disabled ? 'mat-mdc-slide-toggle--disabled' : '']\"\n                  [hideIcon]=\"hideIcon\"\n                  (change)=\"toggle();onChanged($event)\"\n                  (focusout)=\"onTouched()\"\n                  (toggleChange)=\"onToggleChange()\">\n  {{ label }}\n</mat-slide-toggle>\n", styles: ["dsc-switch .mat-mdc-slide-toggle .mdc-switch{--mdc-switch-disabled-track-opacity: 1;--mdc-switch-disabled-selected-icon-opacity: 1;--mdc-switch-disabled-unselected-icon-opacity: 1;--mdc-switch-disabled-selected-icon-color: var(--dsc-color-bg-neutral-1);--mdc-switch-disabled-unselected-icon-color: var(--dsc-color-bg-neutral-1);--mdc-switch-handle-surface-color: var(--dsc-color-bg-neutral-5);--mdc-switch-disabled-unselected-handle-color: var(--dsc-color-bg-neutral-5);--mdc-switch-disabled-selected-handle-color: var(--dsc-color-bg-neutral-5);--mdc-switch-disabled-unselected-track-color: var(--dsc-color-state-bg-disabled-3);--mdc-switch-disabled-selected-track-color: var(--dsc-color-state-bg-disabled-3);--mdc-switch-selected-icon-color: var(--dsc-color-content-neutral-1);--mdc-switch-unselected-icon-color: var(--dsc-color-content-neutral-1);--mdc-switch-unselected-pressed-state-layer-color: var(--dsc-color-state-bg-neutral-active-on-light);--mdc-switch-unselected-hover-state-layer-color: var(--dsc-color-state-bg-neutral-hover-on-light);--mdc-switch-unselected-focus-state-layer-color: var(--dsc-color-state-bg-neutral-focus-on-light);--mdc-switch-unselected-pressed-state-layer-opacity: var(--dsc-opacity-state-active-1);--mdc-switch-unselected-hover-state-layer-opacity: var(--dsc-opacity-state-hover-1);--mdc-switch-unselected-focus-state-layer-opacity: var(--dsc-opacity-state-focus-1);--mdc-switch-unselected-handle-color: var(--dsc-color-bg-neutral-6);--mdc-switch-unselected-pressed-handle-color: var(--dsc-color-bg-neutral-6);--mdc-switch-unselected-focus-handle-color: var(--dsc-color-bg-neutral-6);--mdc-switch-unselected-hover-handle-color: var(--dsc-color-bg-neutral-6);--mdc-switch-unselected-track-color: var(--dsc-color-bg-neutral-5);--mdc-switch-unselected-hover-track-color: var(--dsc-color-bg-neutral-5);--mdc-switch-unselected-pressed-track-color: var(--dsc-color-bg-neutral-5);--mdc-switch-unselected-focus-track-color: var(--dsc-color-bg-neutral-5);margin:0 var(--dsc-spacing-micro)}dsc-switch .mat-mdc-slide-toggle .mdc-label{color:var(--dsc-color-content-neutral-5)}dsc-switch .mat-mdc-slide-toggle .mat-mdc-slide-toggle-touch-target{height:var(--dsc-icon-size-medium);width:var(--dsc-icon-size-medium)}dsc-switch .mat-mdc-slide-toggle.cdk-keyboard-focused .mdc-switch__handle{outline:var(--dsc-border-width-thin) solid var(--dsc-color-state-border-focus-dark);outline-offset:10px}dsc-switch .mat-mdc-slide-toggle--large .mdc-label{font:var(--dsc-typography-text-big-400);font-feature-settings:\"ss01\"!important}dsc-switch .mat-mdc-slide-toggle--standard .mdc-label{font:var(--dsc-typography-text-large-400);font-feature-settings:\"ss01\"!important}dsc-switch .mat-mdc-slide-toggle--small .mdc-label{font:var(--dsc-typography-text-standard-400);font-feature-settings:\"ss01\"!important}dsc-switch .mat-mdc-slide-toggle--disabled{--mdc-switch-disabled-selected-handle-color: var(--dsc-color-state-bg-disabled-5);--mdc-switch-disabled-unselected-handle-color: var(--dsc-color-state-bg-disabled-5)}dsc-switch .mat-mdc-slide-toggle--disabled .mdc-label{color:var(--dsc-color-state-content-disabled-2)}dsc-switch .mat-mdc-slide-toggle--highlight .mdc-switch{--mdc-switch-selected-pressed-state-layer-color: var(--dsc-color-state-bg-highlight-active);--mdc-switch-selected-focus-state-layer-color: var(--dsc-color-state-bg-highlight-focus);--mdc-switch-selected-hover-state-layer-color: var(--dsc-color-state-bg-highlight-hover);--mdc-switch-selected-handle-color: var(--dsc-color-bg-highlight-5);--mdc-switch-selected-focus-handle-color: var(--dsc-color-bg-highlight-6);--mdc-switch-selected-hover-handle-color: var(--dsc-color-bg-highlight-6);--mdc-switch-selected-pressed-handle-color: var(--dsc-color-bg-highlight-6);--mdc-switch-selected-track-color: var(--dsc-color-bg-highlight-3);--mdc-switch-selected-focus-track-color: var(--dsc-color-bg-highlight-3);--mdc-switch-selected-hover-track-color: var(--dsc-color-bg-highlight-3);--mdc-switch-selected-pressed-track-color: var(--dsc-color-bg-highlight-3)}dsc-switch .mat-mdc-slide-toggle--accent .mdc-switch{--mdc-switch-selected-focus-state-layer-color: var(--dsc-color-state-bg-accent-focus);--mdc-switch-selected-hover-state-layer-color: var(--dsc-color-state-bg-accent-hover);--mdc-switch-selected-pressed-state-layer-color: var(--dsc-color-state-bg-accent-active);--mdc-switch-selected-handle-color: var(--dsc-color-bg-accent-5);--mdc-switch-selected-focus-handle-color: var(--dsc-color-bg-accent-6);--mdc-switch-selected-hover-handle-color: var(--dsc-color-bg-accent-6);--mdc-switch-selected-pressed-handle-color: var(--dsc-color-bg-accent-6);--mdc-switch-selected-track-color: var(--dsc-color-bg-accent-3);--mdc-switch-selected-focus-track-color: var(--dsc-color-bg-accent-3);--mdc-switch-selected-hover-track-color: var(--dsc-color-bg-accent-3);--mdc-switch-selected-pressed-track-color: var(--dsc-color-bg-accent-3)}dsc-switch .mat-mdc-slide-toggle--danger .mdc-switch{--mdc-switch-selected-focus-state-layer-color: var(--dsc-color-state-bg-danger-focus);--mdc-switch-selected-hover-state-layer-color: var(--dsc-color-state-bg-danger-hover);--mdc-switch-selected-pressed-state-layer-color: var(--dsc-color-state-bg-danger-active);--mdc-switch-selected-handle-color: var(--dsc-color-bg-danger-4);--mdc-switch-selected-focus-handle-color: var(--dsc-color-bg-danger-5);--mdc-switch-selected-hover-handle-color: var(--dsc-color-bg-danger-5);--mdc-switch-selected-pressed-handle-color: var(--dsc-color-bg-danger-5);--mdc-switch-selected-track-color: var(--dsc-color-bg-danger-3);--mdc-switch-selected-focus-track-color: var(--dsc-color-bg-danger-3);--mdc-switch-selected-hover-track-color: var(--dsc-color-bg-danger-3);--mdc-switch-selected-pressed-track-color: var(--dsc-color-bg-danger-3);--mdc-switch-unselected-hover-state-layer-color: var(--dsc-color-state-bg-danger-hover);--mdc-switch-unselected-focus-state-layer-color: var(--dsc-color-bg-danger-4);--mdc-switch-unselected-pressed-state-layer-color: var(--dsc-color-state-bg-danger-active);--mdc-switch-unselected-handle-color: var(--dsc-color-bg-danger-4);--mdc-switch-unselected-focus-handle-color: var(--dsc-color-bg-danger-5);--mdc-switch-unselected-hover-handle-color: var(--dsc-color-bg-danger-5);--mdc-switch-unselected-pressed-handle-color: var(--dsc-color-bg-danger-5);--mdc-switch-unselected-track-color: var(--dsc-color-bg-danger-3);--mdc-switch-unselected-focus-track-color: var(--dsc-color-bg-danger-3);--mdc-switch-unselected-hover-track-color: var(--dsc-color-bg-danger-3);--mdc-switch-unselected-pressed-track-color: var(--dsc-color-bg-danger-3)}dsc-switch .mat-mdc-slide-toggle--danger .mdc-label{color:var(--dsc-color-content-danger-2);font:var(--dsc-typography-text-large-600)!important;font-feature-settings:\"ss01\"!important}dsc-switch .mat-mdc-slide-toggle--danger.mat-mdc-slide-toggle--small .mdc-label{color:var(--dsc-color-content-danger-2);font:var(--dsc-typography-text-standard-600)!important;font-feature-settings:\"ss01\"!important}dsc-switch .mat-mdc-slide-toggle--danger.mat-mdc-slide-toggle--standard .mdc-label{color:var(--dsc-color-content-danger-2);font:var(--dsc-typography-text-large-600)!important;font-feature-settings:\"ss01\"!important}dsc-switch .mat-mdc-slide-toggle--danger.mat-mdc-slide-toggle--large .mdc-label{color:var(--dsc-color-content-danger-2);font:var(--dsc-typography-text-big-600)!important;font-feature-settings:\"ss01\"!important}dsc-switch .mdc-form-field>label{padding-left:0!important}dsc-switch .mdc-switch.mdc-switch--selected .mdc-switch__icon{width:var(--dsc-icon-size-nano);height:var(--dsc-icon-size-nano)}dsc-switch .mdc-switch.mdc-switch--unselected .mdc-switch__icon{width:var(--dsc-icon-size-small);height:var(--dsc-icon-size-small)}dsc-switch .mdc-switch.mdc-switch--selected:disabled .mdc-switch__icon{fill:var(--dsc-color-state-bg-disabled-1)}dsc-switch .mdc-switch.mdc-switch--unselected:disabled .mdc-switch__icon{fill:var(--dsc-color-state-bg-disabled-1)}\n"], dependencies: [{ kind: "ngmodule", type: MatSlideToggleModule }, { kind: "component", type: i1.MatSlideToggle, selector: "mat-slide-toggle", inputs: ["disabled", "disableRipple", "color", "tabIndex"], exportAs: ["matSlideToggle"] }, { kind: "ngmodule", type: MatCheckboxModule }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "ngmodule", type: A11yModule }, { kind: "directive", type: i2.CdkMonitorFocus, selector: "[cdkMonitorElementFocus], [cdkMonitorSubtreeFocus]", outputs: ["cdkFocusChange"], exportAs: ["cdkMonitorFocus"] }], encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscSwitchComponent, decorators: [{
            type: Component,
            args: [{ selector: 'dsc-switch', standalone: true, imports: [MatSlideToggleModule, MatCheckboxModule, FormsModule, NgClass, A11yModule], encapsulation: ViewEncapsulation.None, providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => DscSwitchComponent),
                            multi: true
                        },
                        {
                            provide: NG_VALIDATORS,
                            useExisting: DscSwitchComponent,
                            multi: true
                        }
                    ], template: "<mat-slide-toggle cdkMonitorElementFocus\n                  [aria-describedby]=\"ariaDescribedby\"\n                  [aria-label]=\"ariaLabel\"\n                  [aria-labelledby]=\"ariaLabelledby\"\n                  [checked]=\"checked\"\n                  [required]=\"required\"\n                  [disabled]=\"disabled\"\n                  [labelPosition]=\"labelPosition\"\n                  [name]=\"name\"\n                  [class]=\"switchLabelSize\"\n                  [ngClass]=\"[switchVariant, disabled ? 'mat-mdc-slide-toggle--disabled' : '']\"\n                  [hideIcon]=\"hideIcon\"\n                  (change)=\"toggle();onChanged($event)\"\n                  (focusout)=\"onTouched()\"\n                  (toggleChange)=\"onToggleChange()\">\n  {{ label }}\n</mat-slide-toggle>\n", styles: ["dsc-switch .mat-mdc-slide-toggle .mdc-switch{--mdc-switch-disabled-track-opacity: 1;--mdc-switch-disabled-selected-icon-opacity: 1;--mdc-switch-disabled-unselected-icon-opacity: 1;--mdc-switch-disabled-selected-icon-color: var(--dsc-color-bg-neutral-1);--mdc-switch-disabled-unselected-icon-color: var(--dsc-color-bg-neutral-1);--mdc-switch-handle-surface-color: var(--dsc-color-bg-neutral-5);--mdc-switch-disabled-unselected-handle-color: var(--dsc-color-bg-neutral-5);--mdc-switch-disabled-selected-handle-color: var(--dsc-color-bg-neutral-5);--mdc-switch-disabled-unselected-track-color: var(--dsc-color-state-bg-disabled-3);--mdc-switch-disabled-selected-track-color: var(--dsc-color-state-bg-disabled-3);--mdc-switch-selected-icon-color: var(--dsc-color-content-neutral-1);--mdc-switch-unselected-icon-color: var(--dsc-color-content-neutral-1);--mdc-switch-unselected-pressed-state-layer-color: var(--dsc-color-state-bg-neutral-active-on-light);--mdc-switch-unselected-hover-state-layer-color: var(--dsc-color-state-bg-neutral-hover-on-light);--mdc-switch-unselected-focus-state-layer-color: var(--dsc-color-state-bg-neutral-focus-on-light);--mdc-switch-unselected-pressed-state-layer-opacity: var(--dsc-opacity-state-active-1);--mdc-switch-unselected-hover-state-layer-opacity: var(--dsc-opacity-state-hover-1);--mdc-switch-unselected-focus-state-layer-opacity: var(--dsc-opacity-state-focus-1);--mdc-switch-unselected-handle-color: var(--dsc-color-bg-neutral-6);--mdc-switch-unselected-pressed-handle-color: var(--dsc-color-bg-neutral-6);--mdc-switch-unselected-focus-handle-color: var(--dsc-color-bg-neutral-6);--mdc-switch-unselected-hover-handle-color: var(--dsc-color-bg-neutral-6);--mdc-switch-unselected-track-color: var(--dsc-color-bg-neutral-5);--mdc-switch-unselected-hover-track-color: var(--dsc-color-bg-neutral-5);--mdc-switch-unselected-pressed-track-color: var(--dsc-color-bg-neutral-5);--mdc-switch-unselected-focus-track-color: var(--dsc-color-bg-neutral-5);margin:0 var(--dsc-spacing-micro)}dsc-switch .mat-mdc-slide-toggle .mdc-label{color:var(--dsc-color-content-neutral-5)}dsc-switch .mat-mdc-slide-toggle .mat-mdc-slide-toggle-touch-target{height:var(--dsc-icon-size-medium);width:var(--dsc-icon-size-medium)}dsc-switch .mat-mdc-slide-toggle.cdk-keyboard-focused .mdc-switch__handle{outline:var(--dsc-border-width-thin) solid var(--dsc-color-state-border-focus-dark);outline-offset:10px}dsc-switch .mat-mdc-slide-toggle--large .mdc-label{font:var(--dsc-typography-text-big-400);font-feature-settings:\"ss01\"!important}dsc-switch .mat-mdc-slide-toggle--standard .mdc-label{font:var(--dsc-typography-text-large-400);font-feature-settings:\"ss01\"!important}dsc-switch .mat-mdc-slide-toggle--small .mdc-label{font:var(--dsc-typography-text-standard-400);font-feature-settings:\"ss01\"!important}dsc-switch .mat-mdc-slide-toggle--disabled{--mdc-switch-disabled-selected-handle-color: var(--dsc-color-state-bg-disabled-5);--mdc-switch-disabled-unselected-handle-color: var(--dsc-color-state-bg-disabled-5)}dsc-switch .mat-mdc-slide-toggle--disabled .mdc-label{color:var(--dsc-color-state-content-disabled-2)}dsc-switch .mat-mdc-slide-toggle--highlight .mdc-switch{--mdc-switch-selected-pressed-state-layer-color: var(--dsc-color-state-bg-highlight-active);--mdc-switch-selected-focus-state-layer-color: var(--dsc-color-state-bg-highlight-focus);--mdc-switch-selected-hover-state-layer-color: var(--dsc-color-state-bg-highlight-hover);--mdc-switch-selected-handle-color: var(--dsc-color-bg-highlight-5);--mdc-switch-selected-focus-handle-color: var(--dsc-color-bg-highlight-6);--mdc-switch-selected-hover-handle-color: var(--dsc-color-bg-highlight-6);--mdc-switch-selected-pressed-handle-color: var(--dsc-color-bg-highlight-6);--mdc-switch-selected-track-color: var(--dsc-color-bg-highlight-3);--mdc-switch-selected-focus-track-color: var(--dsc-color-bg-highlight-3);--mdc-switch-selected-hover-track-color: var(--dsc-color-bg-highlight-3);--mdc-switch-selected-pressed-track-color: var(--dsc-color-bg-highlight-3)}dsc-switch .mat-mdc-slide-toggle--accent .mdc-switch{--mdc-switch-selected-focus-state-layer-color: var(--dsc-color-state-bg-accent-focus);--mdc-switch-selected-hover-state-layer-color: var(--dsc-color-state-bg-accent-hover);--mdc-switch-selected-pressed-state-layer-color: var(--dsc-color-state-bg-accent-active);--mdc-switch-selected-handle-color: var(--dsc-color-bg-accent-5);--mdc-switch-selected-focus-handle-color: var(--dsc-color-bg-accent-6);--mdc-switch-selected-hover-handle-color: var(--dsc-color-bg-accent-6);--mdc-switch-selected-pressed-handle-color: var(--dsc-color-bg-accent-6);--mdc-switch-selected-track-color: var(--dsc-color-bg-accent-3);--mdc-switch-selected-focus-track-color: var(--dsc-color-bg-accent-3);--mdc-switch-selected-hover-track-color: var(--dsc-color-bg-accent-3);--mdc-switch-selected-pressed-track-color: var(--dsc-color-bg-accent-3)}dsc-switch .mat-mdc-slide-toggle--danger .mdc-switch{--mdc-switch-selected-focus-state-layer-color: var(--dsc-color-state-bg-danger-focus);--mdc-switch-selected-hover-state-layer-color: var(--dsc-color-state-bg-danger-hover);--mdc-switch-selected-pressed-state-layer-color: var(--dsc-color-state-bg-danger-active);--mdc-switch-selected-handle-color: var(--dsc-color-bg-danger-4);--mdc-switch-selected-focus-handle-color: var(--dsc-color-bg-danger-5);--mdc-switch-selected-hover-handle-color: var(--dsc-color-bg-danger-5);--mdc-switch-selected-pressed-handle-color: var(--dsc-color-bg-danger-5);--mdc-switch-selected-track-color: var(--dsc-color-bg-danger-3);--mdc-switch-selected-focus-track-color: var(--dsc-color-bg-danger-3);--mdc-switch-selected-hover-track-color: var(--dsc-color-bg-danger-3);--mdc-switch-selected-pressed-track-color: var(--dsc-color-bg-danger-3);--mdc-switch-unselected-hover-state-layer-color: var(--dsc-color-state-bg-danger-hover);--mdc-switch-unselected-focus-state-layer-color: var(--dsc-color-bg-danger-4);--mdc-switch-unselected-pressed-state-layer-color: var(--dsc-color-state-bg-danger-active);--mdc-switch-unselected-handle-color: var(--dsc-color-bg-danger-4);--mdc-switch-unselected-focus-handle-color: var(--dsc-color-bg-danger-5);--mdc-switch-unselected-hover-handle-color: var(--dsc-color-bg-danger-5);--mdc-switch-unselected-pressed-handle-color: var(--dsc-color-bg-danger-5);--mdc-switch-unselected-track-color: var(--dsc-color-bg-danger-3);--mdc-switch-unselected-focus-track-color: var(--dsc-color-bg-danger-3);--mdc-switch-unselected-hover-track-color: var(--dsc-color-bg-danger-3);--mdc-switch-unselected-pressed-track-color: var(--dsc-color-bg-danger-3)}dsc-switch .mat-mdc-slide-toggle--danger .mdc-label{color:var(--dsc-color-content-danger-2);font:var(--dsc-typography-text-large-600)!important;font-feature-settings:\"ss01\"!important}dsc-switch .mat-mdc-slide-toggle--danger.mat-mdc-slide-toggle--small .mdc-label{color:var(--dsc-color-content-danger-2);font:var(--dsc-typography-text-standard-600)!important;font-feature-settings:\"ss01\"!important}dsc-switch .mat-mdc-slide-toggle--danger.mat-mdc-slide-toggle--standard .mdc-label{color:var(--dsc-color-content-danger-2);font:var(--dsc-typography-text-large-600)!important;font-feature-settings:\"ss01\"!important}dsc-switch .mat-mdc-slide-toggle--danger.mat-mdc-slide-toggle--large .mdc-label{color:var(--dsc-color-content-danger-2);font:var(--dsc-typography-text-big-600)!important;font-feature-settings:\"ss01\"!important}dsc-switch .mdc-form-field>label{padding-left:0!important}dsc-switch .mdc-switch.mdc-switch--selected .mdc-switch__icon{width:var(--dsc-icon-size-nano);height:var(--dsc-icon-size-nano)}dsc-switch .mdc-switch.mdc-switch--unselected .mdc-switch__icon{width:var(--dsc-icon-size-small);height:var(--dsc-icon-size-small)}dsc-switch .mdc-switch.mdc-switch--selected:disabled .mdc-switch__icon{fill:var(--dsc-color-state-bg-disabled-1)}dsc-switch .mdc-switch.mdc-switch--unselected:disabled .mdc-switch__icon{fill:var(--dsc-color-state-bg-disabled-1)}\n"] }]
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
            }], disabled: [{
                type: Input
            }], checked: [{
                type: Input
            }], required: [{
                type: Input
            }], size: [{
                type: Input
            }], variant: [{
                type: Input
            }], hideIcon: [{
                type: Input
            }], change: [{
                type: Output
            }], toggleChange: [{
                type: Output
            }] } });

/**
 * Generated bundle index. Do not edit.
 */

export { DscSwitchComponent };
//# sourceMappingURL=sidsc-components-dsc-switch.mjs.map
