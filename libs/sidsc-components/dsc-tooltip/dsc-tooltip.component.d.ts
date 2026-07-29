import { ChangeDetectorRef, ElementRef } from '@angular/core';
import { _TooltipComponentBase } from '@angular/material/tooltip';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare class DscTooltipComponent extends _TooltipComponentBase {
    private _elementRef;
    _tooltip: ElementRef<HTMLElement>;
    _showAnimation: string;
    _hideAnimation: string;
    _isHandset: Observable<BreakpointState>;
    _isMultiline: boolean;
    constructor(changeDetectorRef: ChangeDetectorRef, breakpointObserver: BreakpointObserver, _elementRef: ElementRef<HTMLElement>, animationMode?: string);
    protected _onShow(): void;
    private _isTooltipMultiline;
    static ɵfac: i0.ɵɵFactoryDeclaration<DscTooltipComponent, [null, null, null, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DscTooltipComponent, "dsc-tooltip", never, {}, {}, never, never, false, never>;
}
