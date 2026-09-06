import * as i0 from '@angular/core';
import { Component, ViewEncapsulation, ViewChild, Input, EventEmitter, ContentChildren, Output } from '@angular/core';
import * as i1 from '@angular/material/tabs';
import { MatTab, MatTabsModule, MatTabGroup } from '@angular/material/tabs';
import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import * as i2 from '@angular/material/icon';
import { MatIconModule } from '@angular/material/icon';
import { NgClass, NgIf, CommonModule, NgFor, NgTemplateOutlet, NgComponentOutlet } from '@angular/common';
import { DscBadgeDirective } from 'sidsc-components/dsc-badge';

class DscTabComponent {
    constructor() {
        this.label = '';
        this.iconStyle = 'filled';
        this.dscBadgeSize = 'standard';
        this._disabled = false;
    }
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        this._disabled = coerceBooleanProperty(value);
    }
    getIconClass() {
        if (this.iconStyle === 'filled')
            return 'material-icons';
        if (this.iconStyle === 'rounded')
            return 'material-icons-round';
        return `material-icons-${this.iconStyle}`;
    }
    isImage(icon) {
        if (typeof icon !== 'string')
            return false;
        const lower = icon.toLowerCase();
        return lower.endsWith('.svg') || lower.endsWith('.png');
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscTabComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.12", type: DscTabComponent, isStandalone: true, selector: "dsc-tab", inputs: { label: "label", icon: "icon", iconStyle: "iconStyle", dscBadge: "dscBadge", dscBadgeSize: "dscBadgeSize", disabled: "disabled" }, viewQueries: [{ propertyName: "matTab", first: true, predicate: MatTab, descendants: true }], ngImport: i0, template: "<mat-tab [disabled]=\"disabled\">\n  <ng-template mat-tab-label>\n    <mat-icon *ngIf=\"icon\" [ngClass]=\"getIconClass()\">\n      <img *ngIf=\"isImage(icon)\" src=\"{{icon}}\" alt=\"\">\n      {{ icon }}\n    </mat-icon>\n    {{ label }}\n    <div class=\"badge\" [ngClass]=\"{\n      'badge-standard': dscBadgeSize === 'standard',\n      'badge-other': dscBadgeSize !== 'standard'\n    }\"\n     *ngIf=\"dscBadge\" [dscBadge]=\"dscBadge\" [dscBadgeSize]=\"dscBadgeSize\"></div>\n  </ng-template>\n  <ng-content></ng-content>\n</mat-tab>\n", styles: [".badge-standard{right:-12px;top:24px}.badge-other{right:-12px;align-items:center}\n"], dependencies: [{ kind: "ngmodule", type: MatTabsModule }, { kind: "directive", type: i1.MatTabLabel, selector: "[mat-tab-label], [matTabLabel]" }, { kind: "component", type: i1.MatTab, selector: "mat-tab", inputs: ["disabled"], exportAs: ["matTab"] }, { kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "ngmodule", type: CommonModule }, { kind: "ngmodule", type: MatIconModule }, { kind: "component", type: i2.MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "directive", type: DscBadgeDirective, selector: "[dscBadge]", inputs: ["dscBadgeDisabled", "dscBadgeSize", "dscBadgeVariant", "dscBadgeVariantDark", "dscBadgeOverlap", "dscBadgePosition", "dscBadge", "dscBadgeDescription", "dscBadgeHidden"] }], encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscTabComponent, decorators: [{
            type: Component,
            args: [{ selector: 'dsc-tab', standalone: true, imports: [MatTabsModule, NgClass, NgFor, NgIf, NgTemplateOutlet, NgComponentOutlet, CommonModule, MatIconModule, DscBadgeDirective], encapsulation: ViewEncapsulation.None, template: "<mat-tab [disabled]=\"disabled\">\n  <ng-template mat-tab-label>\n    <mat-icon *ngIf=\"icon\" [ngClass]=\"getIconClass()\">\n      <img *ngIf=\"isImage(icon)\" src=\"{{icon}}\" alt=\"\">\n      {{ icon }}\n    </mat-icon>\n    {{ label }}\n    <div class=\"badge\" [ngClass]=\"{\n      'badge-standard': dscBadgeSize === 'standard',\n      'badge-other': dscBadgeSize !== 'standard'\n    }\"\n     *ngIf=\"dscBadge\" [dscBadge]=\"dscBadge\" [dscBadgeSize]=\"dscBadgeSize\"></div>\n  </ng-template>\n  <ng-content></ng-content>\n</mat-tab>\n", styles: [".badge-standard{right:-12px;top:24px}.badge-other{right:-12px;align-items:center}\n"] }]
        }], propDecorators: { matTab: [{
                type: ViewChild,
                args: [MatTab]
            }], label: [{
                type: Input
            }], icon: [{
                type: Input
            }], iconStyle: [{
                type: Input
            }], dscBadge: [{
                type: Input
            }], dscBadgeSize: [{
                type: Input
            }], disabled: [{
                type: Input
            }] } });

class DscTabGroupComponent {
    set dynamicTabs(value) {
        this._dynamicTabs = value ?? [];
        queueMicrotask(() => this.remergeProjectedTabs());
    }
    get dynamicTabs() {
        return this._dynamicTabs;
    }
    get selectedIndex() {
        return this._selectedIndex;
    }
    set selectedIndex(value) {
        this._selectedIndex = coerceNumberProperty(value);
        if (this.matTabGroup) {
            this.matTabGroup.selectedIndex = this._selectedIndex;
        }
    }
    constructor(cdr) {
        this.cdr = cdr;
        this.animationDuration = "600ms";
        this.tabSize = 'standard';
        this._selectedIndex = 0;
        this._dynamicTabs = [];
        this.selectedIndexChange = new EventEmitter;
        this.selectedTabChange = new EventEmitter;
        this.focusChange = new EventEmitter;
    }
    // The QueryList is initialized only before the ngAfterViewInit lifecycle hook, therefore, is available only from this point.
    // ngAfterViewInit(): void {
    //   const matTabsFromQueryList: MatTab[] = this.tabs.map((tab: DscTabComponent) => tab.matTab);
    //   this.matTabGroup._tabs.reset([matTabsFromQueryList]);
    //   this.matTabGroup._tabs.notifyOnChanges();
    // }
    ngAfterViewInit() {
        this.remergeProjectedTabs();
        this.tabs.changes?.subscribe(() => this.remergeProjectedTabs());
        this.matTabGroup._tabs?.changes?.subscribe(() => this.remergeProjectedTabs());
    }
    ngAfterContentInit() {
        setTimeout(() => {
            if (this.matTabGroup) {
                this.matTabGroup.selectedIndex = this._selectedIndex;
            }
        });
    }
    remergeProjectedTabs() {
        if (!this.matTabGroup)
            return;
        const ql = this.matTabGroup._tabs;
        if (!ql)
            return;
        const current = ql.toArray();
        const projected = (this.tabs ?? []).map(t => t.matTab).filter(Boolean);
        const missing = projected.filter(p => !current.includes(p));
        if (missing.length === 0)
            return;
        ql.reset([...current, ...missing]);
        ql.notifyOnChanges();
        this.cdr.detectChanges();
    }
    iconClass(style) {
        if (style === 'filled')
            return 'material-icons';
        if (style === 'rounded')
            return 'material-icons-round';
        return `material-icons-${style}`;
    }
    isImage(icon) {
        if (typeof icon !== 'string')
            return false;
        const lower = icon.toLowerCase();
        return lower.endsWith('.svg') || lower.endsWith('.png');
    }
    onSelectedIndexChange(event) {
        this.selectedIndexChange.emit(event);
    }
    onSelectedTabChange(event) {
        this.selectedTabChange.emit(event);
    }
    onFocusChange(event) {
        this.focusChange.emit(event);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscTabGroupComponent, deps: [{ token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.12", type: DscTabGroupComponent, isStandalone: true, selector: "dsc-tab-group", inputs: { animationDuration: "animationDuration", tabSize: "tabSize", dynamicTabs: "dynamicTabs", selectedIndex: "selectedIndex" }, outputs: { selectedIndexChange: "selectedIndexChange", selectedTabChange: "selectedTabChange", focusChange: "focusChange" }, queries: [{ propertyName: "tabs", predicate: DscTabComponent }], viewQueries: [{ propertyName: "matTabGroup", first: true, predicate: MatTabGroup, descendants: true }], ngImport: i0, template: "  <mat-tab-group\n    [animationDuration]=\"animationDuration\"\n    [selectedIndex]=\"selectedIndex\"\n    (selectedIndexChange)=\"onSelectedIndexChange($event)\"\n    (selectedTabChange)=\"onSelectedTabChange($event)\"\n    (focusChange)=\"onFocusChange($event)\"\n    [ngClass]=\"{ 'mat-mdc-tab-group--large': tabSize === 'large',\n    'mat-mdc-tab-group--standard': tabSize === 'standard' }\"\n  >\n  \n    <ng-container *ngFor=\"let t of dynamicTabs; let i = index\">\n      <mat-tab [disabled]=\"t.disabled\">\n        <ng-template mat-tab-label>\n          <mat-icon *ngIf=\"t.icon\" [class]=\"iconClass(t.iconStyle ?? 'filled')\">{{ t.icon }}</mat-icon>\n          <img *ngIf=\"isImage(t.icon)\" src=\"{{t.icon}}\" alt=\"\">\n          {{ t.label }}\n        </ng-template>\n\n        <ng-container\n          *ngTemplateOutlet=\"t.content\"\n        ></ng-container>\n      </mat-tab>\n    </ng-container>\n\n    <ng-content select=\"dsc-tab\">\n    </ng-content>\n\n  </mat-tab-group>\n", styles: ["dsc-tab-group .mat-mdc-tab-group{--mdc-tab-indicator-active-indicator-color: var(--dsc-color-border-highlight-1);--mat-tab-header-pagination-icon-color: var(--dsc-color-bg-highlight-6);--mat-tab-header-inactive-label-text-color: var(--dsc-color-content-neutral-4);--mat-tab-header-inactive-focus-label-text-color: var(--dsc-color-content-neutral-4);--mat-tab-header-inactive-hover-label-text-color: var(--dsc-color-content-neutral-4);--mat-tab-header-active-label-text-color: var(--dsc-color-content-highlight-1);--mat-tab-header-active-focus-label-text-color: var(--dsc-color-content-highlight-1);--mat-tab-header-active-focus-indicator-color: var(--dsc-color-border-highlight-1);--mat-tab-header-active-hover-label-text-color: var(--dsc-color-content-highlight-1);--mat-tab-header-active-hover-indicator-color: var(--dsc-color-content-highlight-1);--mat-tab-header-active-ripple-color: transparent;--mat-tab-header-inactive-ripple-color: transparent;--mat-tab-header-disabled-ripple-color: transparent}dsc-tab-group .mat-mdc-tab-group .mat-mdc-tab-header{--mdc-tab-indicator-active-indicator-height: var(--dsc-border-width-thin);--mdc-secondary-navigation-tab-container-height: 40px}dsc-tab-group .mat-mdc-tab-group .mat-mdc-tab-header .mat-mdc-tab-labels:before{content:\"\";bottom:0;position:absolute;border-bottom:2px solid var(--dsc-color-border-neutral-3);width:100%}dsc-tab-group .mat-mdc-tab-group .mat-mdc-tab-header .mdc-tab{display:flex;align-items:center;justify-content:center;background-color:var(--dsc-color-bg-neutral-1);padding:var(--dsc-spacing-nano) var(--dsc-spacing-small);flex-grow:0!important}dsc-tab-group .mat-mdc-tab-group .mat-mdc-tab-header .mdc-tab__text-label{font-feature-settings:\"ss01\";gap:var(--dsc-spacing-nano)}dsc-tab-group .mat-mdc-tab-group .mat-mdc-tab-header .mdc-tab__text-label .mat-icon{font-size:var(--dsc-icon-size-nano);height:var(--dsc-icon-size-nano);width:var(--dsc-icon-size-nano)}dsc-tab-group .mat-mdc-tab-group .mat-mdc-tab-header .mdc-tab__text-label img{width:var(--dsc-icon-size-nano);height:var(--dsc-icon-size-nano);object-fit:contain}dsc-tab-group .mat-mdc-tab-group .mat-mdc-tab-header .mdc-tab-indicator__content--underline{border-color:var(--dsc-color-border-neutral-3);opacity:1}dsc-tab-group .mat-mdc-tab-group .mat-mdc-tab-header .mdc-tab--active .mdc-tab__text-label{font-feature-settings:\"ss01\"}dsc-tab-group .mat-mdc-tab-group .mat-mdc-tab-header .mdc-tab--active .mdc-tab-indicator__content--underline{border-color:var(--mdc-tab-indicator-active-indicator-color)}dsc-tab-group .mat-mdc-tab-group .mat-mdc-tab-header .mdc-tab:hover{background-color:color-mix(in srgb,var(--dsc-color-state-bg-highlight-hover),transparent 92%)}dsc-tab-group .mat-mdc-tab-group .mat-mdc-tab-header .mdc-tab.cdk-keyboard-focused:not(.mat-mdc-tab-disabled){outline:var(--dsc-border-width-thick) solid var(--dsc-color-state-border-focus-dark);outline-offset:-4px;border-radius:var(--dsc-border-radius-nano)}dsc-tab-group .mat-mdc-tab-group .mat-mdc-tab-header .mdc-tab.mat-mdc-tab-disabled .mdc-tab__text-label{color:var(--dsc-color-content-neutral-2);font:var(--dsc-typography-text-large-400)}dsc-tab-group .mat-mdc-tab-group .mat-mdc-tab-header .mdc-tab.mat-mdc-tab-disabled .mdc-tab-indicator__content--underline{border-color:var(--dsc-color-border-neutral-3)}dsc-tab-group .mat-mdc-tab-group .mat-mdc-tab-header .mdc-tab.mat-mdc-tab-disabled .mat-icon{color:var(--dsc-color-bg-neutral-5)}dsc-tab-group .mat-mdc-tab-group--large .mdc-tab__text-label{font:var(--dsc-typography-text-large-400)!important}dsc-tab-group .mat-mdc-tab-group--large .mdc-tab__text-label .mat-icon{font-size:var(--dsc-icon-size-small)!important;height:var(--dsc-icon-size-small)!important;width:var(--dsc-icon-size-small)!important}dsc-tab-group .mat-mdc-tab-group--large .mdc-tab--active .mdc-tab__text-label{font:var(--dsc-typography-text-large-600)!important}dsc-tab-group .mat-mdc-tab-group--standard .mdc-tab__text-label{font:var(--dsc-typography-text-standard-400)}dsc-tab-group .mat-mdc-tab-group--standard .mdc-tab__text-label .mat-icon{font-size:var(--dsc-icon-size-nano);height:var(--dsc-icon-size-nano);width:var(--dsc-icon-size-nano)}dsc-tab-group .mat-mdc-tab-group--standard .mdc-tab--active .mdc-tab__text-label{font:var(--dsc-typography-text-standard-600)}.mdc-tab:active{background-color:color-mix(in srgb,var(--dsc-color-state-bg-highlight-active),transparent 84%)!important}\n"], dependencies: [{ kind: "ngmodule", type: MatTabsModule }, { kind: "directive", type: i1.MatTabLabel, selector: "[mat-tab-label], [matTabLabel]" }, { kind: "component", type: i1.MatTab, selector: "mat-tab", inputs: ["disabled"], exportAs: ["matTab"] }, { kind: "component", type: i1.MatTabGroup, selector: "mat-tab-group", inputs: ["color", "disableRipple", "fitInkBarToContent", "mat-stretch-tabs"], exportAs: ["matTabGroup"] }, { kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: NgFor, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "ngmodule", type: CommonModule }, { kind: "ngmodule", type: MatIconModule }, { kind: "component", type: i2.MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }], encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscTabGroupComponent, decorators: [{
            type: Component,
            args: [{ selector: 'dsc-tab-group', standalone: true, imports: [MatTabsModule, NgClass, NgFor, NgIf, NgTemplateOutlet, NgComponentOutlet, CommonModule, MatIconModule, DscBadgeDirective], encapsulation: ViewEncapsulation.None, template: "  <mat-tab-group\n    [animationDuration]=\"animationDuration\"\n    [selectedIndex]=\"selectedIndex\"\n    (selectedIndexChange)=\"onSelectedIndexChange($event)\"\n    (selectedTabChange)=\"onSelectedTabChange($event)\"\n    (focusChange)=\"onFocusChange($event)\"\n    [ngClass]=\"{ 'mat-mdc-tab-group--large': tabSize === 'large',\n    'mat-mdc-tab-group--standard': tabSize === 'standard' }\"\n  >\n  \n    <ng-container *ngFor=\"let t of dynamicTabs; let i = index\">\n      <mat-tab [disabled]=\"t.disabled\">\n        <ng-template mat-tab-label>\n          <mat-icon *ngIf=\"t.icon\" [class]=\"iconClass(t.iconStyle ?? 'filled')\">{{ t.icon }}</mat-icon>\n          <img *ngIf=\"isImage(t.icon)\" src=\"{{t.icon}}\" alt=\"\">\n          {{ t.label }}\n        </ng-template>\n\n        <ng-container\n          *ngTemplateOutlet=\"t.content\"\n        ></ng-container>\n      </mat-tab>\n    </ng-container>\n\n    <ng-content select=\"dsc-tab\">\n    </ng-content>\n\n  </mat-tab-group>\n", styles: ["dsc-tab-group .mat-mdc-tab-group{--mdc-tab-indicator-active-indicator-color: var(--dsc-color-border-highlight-1);--mat-tab-header-pagination-icon-color: var(--dsc-color-bg-highlight-6);--mat-tab-header-inactive-label-text-color: var(--dsc-color-content-neutral-4);--mat-tab-header-inactive-focus-label-text-color: var(--dsc-color-content-neutral-4);--mat-tab-header-inactive-hover-label-text-color: var(--dsc-color-content-neutral-4);--mat-tab-header-active-label-text-color: var(--dsc-color-content-highlight-1);--mat-tab-header-active-focus-label-text-color: var(--dsc-color-content-highlight-1);--mat-tab-header-active-focus-indicator-color: var(--dsc-color-border-highlight-1);--mat-tab-header-active-hover-label-text-color: var(--dsc-color-content-highlight-1);--mat-tab-header-active-hover-indicator-color: var(--dsc-color-content-highlight-1);--mat-tab-header-active-ripple-color: transparent;--mat-tab-header-inactive-ripple-color: transparent;--mat-tab-header-disabled-ripple-color: transparent}dsc-tab-group .mat-mdc-tab-group .mat-mdc-tab-header{--mdc-tab-indicator-active-indicator-height: var(--dsc-border-width-thin);--mdc-secondary-navigation-tab-container-height: 40px}dsc-tab-group .mat-mdc-tab-group .mat-mdc-tab-header .mat-mdc-tab-labels:before{content:\"\";bottom:0;position:absolute;border-bottom:2px solid var(--dsc-color-border-neutral-3);width:100%}dsc-tab-group .mat-mdc-tab-group .mat-mdc-tab-header .mdc-tab{display:flex;align-items:center;justify-content:center;background-color:var(--dsc-color-bg-neutral-1);padding:var(--dsc-spacing-nano) var(--dsc-spacing-small);flex-grow:0!important}dsc-tab-group .mat-mdc-tab-group .mat-mdc-tab-header .mdc-tab__text-label{font-feature-settings:\"ss01\";gap:var(--dsc-spacing-nano)}dsc-tab-group .mat-mdc-tab-group .mat-mdc-tab-header .mdc-tab__text-label .mat-icon{font-size:var(--dsc-icon-size-nano);height:var(--dsc-icon-size-nano);width:var(--dsc-icon-size-nano)}dsc-tab-group .mat-mdc-tab-group .mat-mdc-tab-header .mdc-tab__text-label img{width:var(--dsc-icon-size-nano);height:var(--dsc-icon-size-nano);object-fit:contain}dsc-tab-group .mat-mdc-tab-group .mat-mdc-tab-header .mdc-tab-indicator__content--underline{border-color:var(--dsc-color-border-neutral-3);opacity:1}dsc-tab-group .mat-mdc-tab-group .mat-mdc-tab-header .mdc-tab--active .mdc-tab__text-label{font-feature-settings:\"ss01\"}dsc-tab-group .mat-mdc-tab-group .mat-mdc-tab-header .mdc-tab--active .mdc-tab-indicator__content--underline{border-color:var(--mdc-tab-indicator-active-indicator-color)}dsc-tab-group .mat-mdc-tab-group .mat-mdc-tab-header .mdc-tab:hover{background-color:color-mix(in srgb,var(--dsc-color-state-bg-highlight-hover),transparent 92%)}dsc-tab-group .mat-mdc-tab-group .mat-mdc-tab-header .mdc-tab.cdk-keyboard-focused:not(.mat-mdc-tab-disabled){outline:var(--dsc-border-width-thick) solid var(--dsc-color-state-border-focus-dark);outline-offset:-4px;border-radius:var(--dsc-border-radius-nano)}dsc-tab-group .mat-mdc-tab-group .mat-mdc-tab-header .mdc-tab.mat-mdc-tab-disabled .mdc-tab__text-label{color:var(--dsc-color-content-neutral-2);font:var(--dsc-typography-text-large-400)}dsc-tab-group .mat-mdc-tab-group .mat-mdc-tab-header .mdc-tab.mat-mdc-tab-disabled .mdc-tab-indicator__content--underline{border-color:var(--dsc-color-border-neutral-3)}dsc-tab-group .mat-mdc-tab-group .mat-mdc-tab-header .mdc-tab.mat-mdc-tab-disabled .mat-icon{color:var(--dsc-color-bg-neutral-5)}dsc-tab-group .mat-mdc-tab-group--large .mdc-tab__text-label{font:var(--dsc-typography-text-large-400)!important}dsc-tab-group .mat-mdc-tab-group--large .mdc-tab__text-label .mat-icon{font-size:var(--dsc-icon-size-small)!important;height:var(--dsc-icon-size-small)!important;width:var(--dsc-icon-size-small)!important}dsc-tab-group .mat-mdc-tab-group--large .mdc-tab--active .mdc-tab__text-label{font:var(--dsc-typography-text-large-600)!important}dsc-tab-group .mat-mdc-tab-group--standard .mdc-tab__text-label{font:var(--dsc-typography-text-standard-400)}dsc-tab-group .mat-mdc-tab-group--standard .mdc-tab__text-label .mat-icon{font-size:var(--dsc-icon-size-nano);height:var(--dsc-icon-size-nano);width:var(--dsc-icon-size-nano)}dsc-tab-group .mat-mdc-tab-group--standard .mdc-tab--active .mdc-tab__text-label{font:var(--dsc-typography-text-standard-600)}.mdc-tab:active{background-color:color-mix(in srgb,var(--dsc-color-state-bg-highlight-active),transparent 84%)!important}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }]; }, propDecorators: { matTabGroup: [{
                type: ViewChild,
                args: [MatTabGroup]
            }], tabs: [{
                type: ContentChildren,
                args: [DscTabComponent]
            }], animationDuration: [{
                type: Input
            }], tabSize: [{
                type: Input
            }], dynamicTabs: [{
                type: Input
            }], selectedIndex: [{
                type: Input
            }], selectedIndexChange: [{
                type: Output
            }], selectedTabChange: [{
                type: Output
            }], focusChange: [{
                type: Output
            }] } });

/**
 * Generated bundle index. Do not edit.
 */

export { DscTabComponent, DscTabGroupComponent };
//# sourceMappingURL=sidsc-components-dsc-tab-group.mjs.map
