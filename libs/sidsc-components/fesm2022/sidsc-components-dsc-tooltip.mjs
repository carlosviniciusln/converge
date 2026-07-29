import * as i0 from '@angular/core';
import { ANIMATION_MODULE_TYPE, Component, ViewEncapsulation, ChangeDetectionStrategy, Optional, Inject, ViewChild, Directive, Input, NgModule } from '@angular/core';
import { _TooltipComponentBase, _MatTooltipBase, MAT_TOOLTIP_SCROLL_STRATEGY, MAT_TOOLTIP_DEFAULT_OPTIONS, MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER } from '@angular/material/tooltip';
import * as i2 from '@angular/common';
import { DOCUMENT, NgClass, AsyncPipe } from '@angular/common';
import * as i1 from '@angular/cdk/layout';
import { Breakpoints } from '@angular/cdk/layout';
import * as i1$1 from '@angular/cdk/overlay';
import * as i2$1 from '@angular/cdk/platform';
import * as i3 from '@angular/cdk/a11y';
import * as i4 from '@angular/cdk/bidi';

const MIN_HEIGHT = 24;
const MAX_WIDTH = 200;
class DscTooltipComponent extends _TooltipComponentBase {
    constructor(changeDetectorRef, breakpointObserver, _elementRef, animationMode) {
        super(changeDetectorRef, animationMode);
        this._elementRef = _elementRef;
        this._showAnimation = 'mat-mdc-tooltip-show';
        this._hideAnimation = 'mat-mdc-tooltip-hide';
        this._isMultiline = false;
        this._isHandset = breakpointObserver.observe(Breakpoints.Handset);
    }
    _onShow() {
        this._isMultiline = this._isTooltipMultiline();
        this._markForCheck();
    }
    _isTooltipMultiline() {
        const rect = this._elementRef.nativeElement.getBoundingClientRect();
        return rect.height > MIN_HEIGHT && rect.width >= MAX_WIDTH;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscTooltipComponent, deps: [{ token: i0.ChangeDetectorRef }, { token: i1.BreakpointObserver }, { token: i0.ElementRef }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.12", type: DscTooltipComponent, selector: "dsc-tooltip", host: { attributes: { "aria-hidden": "true" }, listeners: { "mouseleave": "_handleMouseLeave($event)" }, properties: { "style.zoom": "isVisible() ? 1 : null" } }, viewQueries: [{ propertyName: "_tooltip", first: true, predicate: ["tooltip"], descendants: true, static: true }], usesInheritance: true, ngImport: i0, template: "<div #tooltip\n     class=\"mat-tooltip mat-elevation-z2\"\n     [ngClass]=\"tooltipClass\"\n     (animationend)=\"_handleAnimationEnd($event)\"\n     [class.mdc-tooltip--multiline]=\"_isMultiline\"\n     [class.mat-tooltip-handset]=\"(_isHandset | async)?.matches\">\n  {{ message }}\n</div>\n", styles: [".mat-tooltip{border-radius:var(--dsc-border-radius-nano);margin:0;max-width:240px;padding:var(--dsc-spacing-quark) var(--dsc-spacing-nano);overflow:hidden;text-overflow:ellipsis;transform:scale(0);background:var(--dsc-color-bg-neutral-1);color:var(--dsc-color-content-neutral-5);font:var(--dsc-typography-text-small-400);font-feature-settings:\"ss01\"}.mat-tooltip--highlight{background:var(--dsc-color-bg-highlight-6);color:var(--dsc-color-content-neutral-1)}.mat-tooltip._mat-animation-noopable{animation:none;transform:scale(1)}.mat-mdc-tooltip-panel .mat-tooltip:after{width:0;height:0;content:\"\";position:absolute;border-left:.4rem solid transparent;border-right:.4rem solid transparent;border-bottom:.4rem solid var(--dsc-color-bg-neutral-1)}.mat-mdc-tooltip-panel .mat-tooltip--highlight:after{border-bottom:.4rem solid var(--dsc-color-bg-highlight-6)}.mat-mdc-tooltip-panel-below .mat-tooltip{overflow:initial;margin-top:1rem}.mat-mdc-tooltip-panel-below .mat-tooltip:after{top:-6px;right:calc(50% - .5rem);transform:rotate(0);filter:drop-shadow(0 0 .2px rgba(0,0,0,.14))}.mat-mdc-tooltip-panel-above .mat-tooltip{overflow:initial;margin-bottom:1rem}.mat-mdc-tooltip-panel-above .mat-tooltip:after{bottom:-6px;right:calc(50% - .5rem);transform:rotate(180deg);filter:drop-shadow(0 -1.4px .7px rgba(0,0,0,.14))}.mat-mdc-tooltip-panel-right .mat-tooltip{overflow:initial;margin-left:1rem}.mat-mdc-tooltip-panel-right .mat-tooltip:after{left:-9px;top:calc(50% - .2rem);transform:rotate(270deg);filter:drop-shadow(-.7px -.6px .5px rgba(0,0,0,.14))}.mat-mdc-tooltip-panel-left .mat-tooltip{overflow:initial;margin-right:1rem}.mat-mdc-tooltip-panel-left .mat-tooltip:after{right:-9px;top:calc(50% - .2rem);transform:rotate(90deg);filter:drop-shadow(.7px -.6px .5px rgba(0,0,0,.14))}.mat-tooltip-panel-non-interactive{pointer-events:none}@keyframes mat-tooltip-show{0%{opacity:0;transform:scale(0)}50%{opacity:.5;transform:scale(.99)}to{opacity:1;transform:scale(1)}}@keyframes mat-tooltip-hide{0%{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(1);display:none}}.mat-mdc-tooltip-show{animation:mat-tooltip-show .2s cubic-bezier(0,0,.2,1) forwards}.mat-mdc-tooltip-hide{animation:mat-tooltip-hide .1s cubic-bezier(0,0,.2,1) forwards}\n"], dependencies: [{ kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "pipe", type: i2.AsyncPipe, name: "async" }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscTooltipComponent, decorators: [{
            type: Component,
            args: [{ selector: 'dsc-tooltip', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, host: {
                        '[style.zoom]': 'isVisible() ? 1 : null',
                        '(mouseleave)': '_handleMouseLeave($event)',
                        'aria-hidden': 'true',
                    }, template: "<div #tooltip\n     class=\"mat-tooltip mat-elevation-z2\"\n     [ngClass]=\"tooltipClass\"\n     (animationend)=\"_handleAnimationEnd($event)\"\n     [class.mdc-tooltip--multiline]=\"_isMultiline\"\n     [class.mat-tooltip-handset]=\"(_isHandset | async)?.matches\">\n  {{ message }}\n</div>\n", styles: [".mat-tooltip{border-radius:var(--dsc-border-radius-nano);margin:0;max-width:240px;padding:var(--dsc-spacing-quark) var(--dsc-spacing-nano);overflow:hidden;text-overflow:ellipsis;transform:scale(0);background:var(--dsc-color-bg-neutral-1);color:var(--dsc-color-content-neutral-5);font:var(--dsc-typography-text-small-400);font-feature-settings:\"ss01\"}.mat-tooltip--highlight{background:var(--dsc-color-bg-highlight-6);color:var(--dsc-color-content-neutral-1)}.mat-tooltip._mat-animation-noopable{animation:none;transform:scale(1)}.mat-mdc-tooltip-panel .mat-tooltip:after{width:0;height:0;content:\"\";position:absolute;border-left:.4rem solid transparent;border-right:.4rem solid transparent;border-bottom:.4rem solid var(--dsc-color-bg-neutral-1)}.mat-mdc-tooltip-panel .mat-tooltip--highlight:after{border-bottom:.4rem solid var(--dsc-color-bg-highlight-6)}.mat-mdc-tooltip-panel-below .mat-tooltip{overflow:initial;margin-top:1rem}.mat-mdc-tooltip-panel-below .mat-tooltip:after{top:-6px;right:calc(50% - .5rem);transform:rotate(0);filter:drop-shadow(0 0 .2px rgba(0,0,0,.14))}.mat-mdc-tooltip-panel-above .mat-tooltip{overflow:initial;margin-bottom:1rem}.mat-mdc-tooltip-panel-above .mat-tooltip:after{bottom:-6px;right:calc(50% - .5rem);transform:rotate(180deg);filter:drop-shadow(0 -1.4px .7px rgba(0,0,0,.14))}.mat-mdc-tooltip-panel-right .mat-tooltip{overflow:initial;margin-left:1rem}.mat-mdc-tooltip-panel-right .mat-tooltip:after{left:-9px;top:calc(50% - .2rem);transform:rotate(270deg);filter:drop-shadow(-.7px -.6px .5px rgba(0,0,0,.14))}.mat-mdc-tooltip-panel-left .mat-tooltip{overflow:initial;margin-right:1rem}.mat-mdc-tooltip-panel-left .mat-tooltip:after{right:-9px;top:calc(50% - .2rem);transform:rotate(90deg);filter:drop-shadow(.7px -.6px .5px rgba(0,0,0,.14))}.mat-tooltip-panel-non-interactive{pointer-events:none}@keyframes mat-tooltip-show{0%{opacity:0;transform:scale(0)}50%{opacity:.5;transform:scale(.99)}to{opacity:1;transform:scale(1)}}@keyframes mat-tooltip-hide{0%{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(1);display:none}}.mat-mdc-tooltip-show{animation:mat-tooltip-show .2s cubic-bezier(0,0,.2,1) forwards}.mat-mdc-tooltip-hide{animation:mat-tooltip-hide .1s cubic-bezier(0,0,.2,1) forwards}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i1.BreakpointObserver }, { type: i0.ElementRef }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }]; }, propDecorators: { _tooltip: [{
                type: ViewChild,
                args: ['tooltip', { static: true }]
            }] } });

class DscTooltipDirective extends _MatTooltipBase {
    get placement() {
        return this._placement;
    }
    set placement(value) {
        this._placement = value ?? 'above';
        super.position = this._placement;
    }
    get variant() {
        return this._variant;
    }
    set variant(value) {
        this._variant = value;
        super.tooltipClass = {
            'mat-tooltip--highlight': this.variant === 'highlight'
        };
    }
    get positionAtOrigin() {
        return super.positionAtOrigin;
    }
    set positionAtOrigin(value) {
        super.positionAtOrigin = value;
    }
    get disabled() {
        return super.disabled;
    }
    set disabled(value) {
        super.disabled = value;
    }
    get showDelay() {
        return super.showDelay;
    }
    set showDelay(value) {
        super.showDelay = value;
    }
    get hideDelay() {
        return super.hideDelay;
    }
    set hideDelay(value) {
        super.hideDelay = value;
    }
    get message() {
        return super.message;
    }
    set message(value) {
        super.message = value;
    }
    constructor(overlay, elementRef, scrollDispatcher, viewContainerRef, ngZone, platform, ariaDescriber, focusMonitor, scrollStrategy, dir, defaultOptions, _document) {
        super(overlay, elementRef, scrollDispatcher, viewContainerRef, ngZone, platform, ariaDescriber, focusMonitor, scrollStrategy, dir, defaultOptions, _document);
        this._tooltipComponent = DscTooltipComponent;
        this._cssClassPrefix = 'mat-mdc';
        this._variant = 'neutral';
        this._viewportMargin = 8;
        super.position = 'above';
    }
    ngAfterViewInit() {
        super.ngAfterViewInit();
    }
    ngOnDestroy() {
        super.ngOnDestroy();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscTooltipDirective, deps: [{ token: i1$1.Overlay }, { token: i0.ElementRef }, { token: i1$1.ScrollDispatcher }, { token: i0.ViewContainerRef }, { token: i0.NgZone }, { token: i2$1.Platform }, { token: i3.AriaDescriber }, { token: i3.FocusMonitor }, { token: MAT_TOOLTIP_SCROLL_STRATEGY }, { token: i4.Directionality, optional: true }, { token: MAT_TOOLTIP_DEFAULT_OPTIONS, optional: true }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.2.12", type: DscTooltipDirective, selector: "[dscTooltip]", inputs: { placement: ["dscTooltipPosition", "placement"], variant: ["dscTooltipVariant", "variant"], positionAtOrigin: ["dscTooltipPositionAtOrigin", "positionAtOrigin"], disabled: ["dscTooltipDisabled", "disabled"], showDelay: ["dscTooltipShowDelay", "showDelay"], hideDelay: ["dscTooltipHideDelay", "hideDelay"], message: ["dscTooltip", "message"] }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscTooltipDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[dscTooltip]'
                }]
        }], ctorParameters: function () { return [{ type: i1$1.Overlay }, { type: i0.ElementRef }, { type: i1$1.ScrollDispatcher }, { type: i0.ViewContainerRef }, { type: i0.NgZone }, { type: i2$1.Platform }, { type: i3.AriaDescriber }, { type: i3.FocusMonitor }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_TOOLTIP_SCROLL_STRATEGY]
                }] }, { type: i4.Directionality, decorators: [{
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_TOOLTIP_DEFAULT_OPTIONS]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; }, propDecorators: { placement: [{
                type: Input,
                args: ['dscTooltipPosition']
            }], variant: [{
                type: Input,
                args: ['dscTooltipVariant']
            }], positionAtOrigin: [{
                type: Input,
                args: ['dscTooltipPositionAtOrigin']
            }], disabled: [{
                type: Input,
                args: ['dscTooltipDisabled']
            }], showDelay: [{
                type: Input,
                args: ['dscTooltipShowDelay']
            }], hideDelay: [{
                type: Input,
                args: ['dscTooltipHideDelay']
            }], message: [{
                type: Input,
                args: ['dscTooltip']
            }] } });

class DscTooltipModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscTooltipModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.2.12", ngImport: i0, type: DscTooltipModule, declarations: [DscTooltipDirective, DscTooltipComponent], imports: [NgClass, AsyncPipe], exports: [DscTooltipDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscTooltipModule, providers: [MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscTooltipModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [DscTooltipDirective, DscTooltipComponent],
                    imports: [NgClass, AsyncPipe],
                    exports: [DscTooltipDirective],
                    providers: [MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { DscTooltipDirective, DscTooltipModule };
//# sourceMappingURL=sidsc-components-dsc-tooltip.mjs.map
