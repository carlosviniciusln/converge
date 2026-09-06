import { Directive, Inject, Input, Optional } from '@angular/core';
import { _MatTooltipBase, MAT_TOOLTIP_DEFAULT_OPTIONS, MAT_TOOLTIP_SCROLL_STRATEGY } from '@angular/material/tooltip';
import { DOCUMENT } from '@angular/common';
import { DscTooltipComponent } from './dsc-tooltip.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/overlay";
import * as i2 from "@angular/cdk/platform";
import * as i3 from "@angular/cdk/a11y";
import * as i4 from "@angular/cdk/bidi";
export class DscTooltipDirective extends _MatTooltipBase {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscTooltipDirective, deps: [{ token: i1.Overlay }, { token: i0.ElementRef }, { token: i1.ScrollDispatcher }, { token: i0.ViewContainerRef }, { token: i0.NgZone }, { token: i2.Platform }, { token: i3.AriaDescriber }, { token: i3.FocusMonitor }, { token: MAT_TOOLTIP_SCROLL_STRATEGY }, { token: i4.Directionality, optional: true }, { token: MAT_TOOLTIP_DEFAULT_OPTIONS, optional: true }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.2.12", type: DscTooltipDirective, selector: "[dscTooltip]", inputs: { placement: ["dscTooltipPosition", "placement"], variant: ["dscTooltipVariant", "variant"], positionAtOrigin: ["dscTooltipPositionAtOrigin", "positionAtOrigin"], disabled: ["dscTooltipDisabled", "disabled"], showDelay: ["dscTooltipShowDelay", "showDelay"], hideDelay: ["dscTooltipHideDelay", "hideDelay"], message: ["dscTooltip", "message"] }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscTooltipDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[dscTooltip]'
                }]
        }], ctorParameters: function () { return [{ type: i1.Overlay }, { type: i0.ElementRef }, { type: i1.ScrollDispatcher }, { type: i0.ViewContainerRef }, { type: i0.NgZone }, { type: i2.Platform }, { type: i3.AriaDescriber }, { type: i3.FocusMonitor }, { type: undefined, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHNjLXRvb2x0aXAuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvc2lkc2MtY29tcG9uZW50cy9kc2MtdG9vbHRpcC9kc2MtdG9vbHRpcC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVMLFNBQVMsRUFFVCxNQUFNLEVBQ04sS0FBSyxFQUdMLFFBQVEsRUFFVCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQ0wsZUFBZSxFQUNmLDJCQUEyQixFQUMzQiwyQkFBMkIsRUFFNUIsTUFBTSwyQkFBMkIsQ0FBQztBQUtuQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFHM0MsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0seUJBQXlCLENBQUM7Ozs7OztBQVM5RCxNQUFNLE9BQU8sbUJBQW9CLFNBQVEsZUFBb0M7SUFJM0UsSUFDSSxTQUFTO1FBQ1gsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxJQUFJLFNBQVMsQ0FBQyxLQUF5QjtRQUNyQyxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssSUFBSSxPQUFPLENBQUM7UUFDbkMsS0FBSyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQ25DLENBQUM7SUFJRCxJQUNJLE9BQU87UUFDVCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDdkIsQ0FBQztJQUVELElBQUksT0FBTyxDQUFDLEtBQXdCO1FBQ2xDLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ3RCLEtBQUssQ0FBQyxZQUFZLEdBQUc7WUFDbkIsd0JBQXdCLEVBQUUsSUFBSSxDQUFDLE9BQU8sS0FBSyxXQUFXO1NBQ3ZELENBQUM7SUFDSixDQUFDO0lBSUQsSUFDYSxnQkFBZ0I7UUFDM0IsT0FBTyxLQUFLLENBQUMsZ0JBQWdCLENBQUM7SUFDaEMsQ0FBQztJQUVELElBQWEsZ0JBQWdCLENBQUMsS0FBbUI7UUFDL0MsS0FBSyxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQztJQUNqQyxDQUFDO0lBRUQsSUFDYSxRQUFRO1FBQ25CLE9BQU8sS0FBSyxDQUFDLFFBQVEsQ0FBQztJQUN4QixDQUFDO0lBRUQsSUFBYSxRQUFRLENBQUMsS0FBbUI7UUFDdkMsS0FBSyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7SUFDekIsQ0FBQztJQUVELElBQ2EsU0FBUztRQUNwQixPQUFPLEtBQUssQ0FBQyxTQUFTLENBQUM7SUFDekIsQ0FBQztJQUVELElBQWEsU0FBUyxDQUFDLEtBQWtCO1FBQ3ZDLEtBQUssQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQzFCLENBQUM7SUFFRCxJQUNhLFNBQVM7UUFDcEIsT0FBTyxLQUFLLENBQUMsU0FBUyxDQUFDO0lBQ3pCLENBQUM7SUFFRCxJQUFhLFNBQVMsQ0FBQyxLQUFrQjtRQUN2QyxLQUFLLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztJQUMxQixDQUFDO0lBRUQsSUFDYSxPQUFPO1FBQ2xCLE9BQU8sS0FBSyxDQUFDLE9BQU8sQ0FBQztJQUN2QixDQUFDO0lBRUQsSUFBYSxPQUFPLENBQUMsS0FBYTtRQUNoQyxLQUFLLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztJQUN4QixDQUFDO0lBRUQsWUFDRSxPQUFnQixFQUNoQixVQUFtQyxFQUNuQyxnQkFBa0MsRUFDbEMsZ0JBQWtDLEVBQ2xDLE1BQWMsRUFDZCxRQUFrQixFQUNsQixhQUE0QixFQUM1QixZQUEwQixFQUNXLGNBQW1CLEVBQzVDLEdBQW1CLEVBQ2tCLGNBQXdDLEVBQ3ZFLFNBQWM7UUFFaEMsS0FBSyxDQUNILE9BQU8sRUFDUCxVQUFVLEVBQ1YsZ0JBQWdCLEVBQ2hCLGdCQUFnQixFQUNoQixNQUFNLEVBQ04sUUFBUSxFQUNSLGFBQWEsRUFDYixZQUFZLEVBQ1osY0FBYyxFQUNkLEdBQUcsRUFDSCxjQUFjLEVBQ2QsU0FBUyxDQUNWLENBQUM7UUFyR3dCLHNCQUFpQixHQUFHLG1CQUFtQixDQUFDO1FBQ3hDLG9CQUFlLEdBQUcsU0FBUyxDQUFDO1FBMEJoRCxhQUFRLEdBQXNCLFNBQVMsQ0FBQztRQTJFOUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUM7UUFDekIsS0FBSyxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7SUFDM0IsQ0FBQztJQUVRLGVBQWU7UUFDdEIsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFFUSxXQUFXO1FBQ2xCLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUN0QixDQUFDOytHQWpIVSxtQkFBbUIsME9Bb0ZwQiwyQkFBMkIsMkRBRWYsMkJBQTJCLDZCQUN2QyxRQUFRO21HQXZGUCxtQkFBbUI7OzRGQUFuQixtQkFBbUI7a0JBSC9CLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGNBQWM7aUJBQ3pCOzswQkFxRkksTUFBTTsyQkFBQywyQkFBMkI7OzBCQUNsQyxRQUFROzswQkFDUixRQUFROzswQkFBSSxNQUFNOzJCQUFDLDJCQUEyQjs7MEJBQzlDLE1BQU07MkJBQUMsUUFBUTs0Q0FsRmQsU0FBUztzQkFEWixLQUFLO3VCQUFDLG9CQUFvQjtnQkFhdkIsT0FBTztzQkFEVixLQUFLO3VCQUFDLG1CQUFtQjtnQkFlYixnQkFBZ0I7c0JBRDVCLEtBQUs7dUJBQUMsNEJBQTRCO2dCQVV0QixRQUFRO3NCQURwQixLQUFLO3VCQUFDLG9CQUFvQjtnQkFVZCxTQUFTO3NCQURyQixLQUFLO3VCQUFDLHFCQUFxQjtnQkFVZixTQUFTO3NCQURyQixLQUFLO3VCQUFDLHFCQUFxQjtnQkFVZixPQUFPO3NCQURuQixLQUFLO3VCQUFDLFlBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgVmlld0NvbnRhaW5lclJlZlxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIF9NYXRUb29sdGlwQmFzZSxcbiAgTUFUX1RPT0xUSVBfREVGQVVMVF9PUFRJT05TLFxuICBNQVRfVE9PTFRJUF9TQ1JPTExfU1RSQVRFR1ksXG4gIE1hdFRvb2x0aXBEZWZhdWx0T3B0aW9uc1xufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC90b29sdGlwJztcbmltcG9ydCB7IE92ZXJsYXksIFNjcm9sbERpc3BhdGNoZXIgfSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQgeyBQbGF0Zm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQgeyBBcmlhRGVzY3JpYmVyLCBGb2N1c01vbml0b3IgfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQgeyBEaXJlY3Rpb25hbGl0eSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEJvb2xlYW5JbnB1dCwgTnVtYmVySW5wdXQgfSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuXG5pbXBvcnQgeyBEc2NUb29sdGlwQ29tcG9uZW50IH0gZnJvbSAnLi9kc2MtdG9vbHRpcC5jb21wb25lbnQnO1xuXG5leHBvcnQgdHlwZSBEc2NUb29sdGlwUG9zaXRpb24gPSAnYWZ0ZXInIHwgJ2JlZm9yZScgfCAnYWJvdmUnIHwgJ2JlbG93JyB8ICdsZWZ0JyB8ICdyaWdodCc7XG5cbmV4cG9ydCB0eXBlIERzY1Rvb2x0aXBWYXJpYW50ID0gJ2hpZ2hsaWdodCcgfCAnbmV1dHJhbCc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tkc2NUb29sdGlwXSdcbn0pXG5leHBvcnQgY2xhc3MgRHNjVG9vbHRpcERpcmVjdGl2ZSBleHRlbmRzIF9NYXRUb29sdGlwQmFzZTxEc2NUb29sdGlwQ29tcG9uZW50PiBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gIHByb3RlY3RlZCBvdmVycmlkZSByZWFkb25seSBfdG9vbHRpcENvbXBvbmVudCA9IERzY1Rvb2x0aXBDb21wb25lbnQ7XG4gIHByb3RlY3RlZCBvdmVycmlkZSByZWFkb25seSBfY3NzQ2xhc3NQcmVmaXggPSAnbWF0LW1kYyc7XG5cbiAgQElucHV0KCdkc2NUb29sdGlwUG9zaXRpb24nKVxuICBnZXQgcGxhY2VtZW50KCk6IERzY1Rvb2x0aXBQb3NpdGlvbiB7XG4gICAgcmV0dXJuIHRoaXMuX3BsYWNlbWVudDtcbiAgfVxuXG4gIHNldCBwbGFjZW1lbnQodmFsdWU6IERzY1Rvb2x0aXBQb3NpdGlvbikge1xuICAgIHRoaXMuX3BsYWNlbWVudCA9IHZhbHVlID8/ICdhYm92ZSc7XG4gICAgc3VwZXIucG9zaXRpb24gPSB0aGlzLl9wbGFjZW1lbnQ7XG4gIH1cblxuICBwcml2YXRlIF9wbGFjZW1lbnQhOiBEc2NUb29sdGlwUG9zaXRpb247XG5cbiAgQElucHV0KCdkc2NUb29sdGlwVmFyaWFudCcpXG4gIGdldCB2YXJpYW50KCk6IERzY1Rvb2x0aXBWYXJpYW50IHtcbiAgICByZXR1cm4gdGhpcy5fdmFyaWFudDtcbiAgfVxuXG4gIHNldCB2YXJpYW50KHZhbHVlOiBEc2NUb29sdGlwVmFyaWFudCkge1xuICAgIHRoaXMuX3ZhcmlhbnQgPSB2YWx1ZTtcbiAgICBzdXBlci50b29sdGlwQ2xhc3MgPSB7XG4gICAgICAnbWF0LXRvb2x0aXAtLWhpZ2hsaWdodCc6IHRoaXMudmFyaWFudCA9PT0gJ2hpZ2hsaWdodCdcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBfdmFyaWFudDogRHNjVG9vbHRpcFZhcmlhbnQgPSAnbmV1dHJhbCc7XG5cbiAgQElucHV0KCdkc2NUb29sdGlwUG9zaXRpb25BdE9yaWdpbicpXG4gIG92ZXJyaWRlIGdldCBwb3NpdGlvbkF0T3JpZ2luKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBzdXBlci5wb3NpdGlvbkF0T3JpZ2luO1xuICB9XG5cbiAgb3ZlcnJpZGUgc2V0IHBvc2l0aW9uQXRPcmlnaW4odmFsdWU6IEJvb2xlYW5JbnB1dCkge1xuICAgIHN1cGVyLnBvc2l0aW9uQXRPcmlnaW4gPSB2YWx1ZTtcbiAgfVxuXG4gIEBJbnB1dCgnZHNjVG9vbHRpcERpc2FibGVkJylcbiAgb3ZlcnJpZGUgZ2V0IGRpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBzdXBlci5kaXNhYmxlZDtcbiAgfVxuXG4gIG92ZXJyaWRlIHNldCBkaXNhYmxlZCh2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgc3VwZXIuZGlzYWJsZWQgPSB2YWx1ZTtcbiAgfVxuXG4gIEBJbnB1dCgnZHNjVG9vbHRpcFNob3dEZWxheScpXG4gIG92ZXJyaWRlIGdldCBzaG93RGVsYXkoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gc3VwZXIuc2hvd0RlbGF5O1xuICB9XG5cbiAgb3ZlcnJpZGUgc2V0IHNob3dEZWxheSh2YWx1ZTogTnVtYmVySW5wdXQpIHtcbiAgICBzdXBlci5zaG93RGVsYXkgPSB2YWx1ZTtcbiAgfVxuXG4gIEBJbnB1dCgnZHNjVG9vbHRpcEhpZGVEZWxheScpXG4gIG92ZXJyaWRlIGdldCBoaWRlRGVsYXkoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gc3VwZXIuaGlkZURlbGF5O1xuICB9XG5cbiAgb3ZlcnJpZGUgc2V0IGhpZGVEZWxheSh2YWx1ZTogTnVtYmVySW5wdXQpIHtcbiAgICBzdXBlci5oaWRlRGVsYXkgPSB2YWx1ZTtcbiAgfVxuXG4gIEBJbnB1dCgnZHNjVG9vbHRpcCcpXG4gIG92ZXJyaWRlIGdldCBtZXNzYWdlKCkge1xuICAgIHJldHVybiBzdXBlci5tZXNzYWdlO1xuICB9XG5cbiAgb3ZlcnJpZGUgc2V0IG1lc3NhZ2UodmFsdWU6IHN0cmluZykge1xuICAgIHN1cGVyLm1lc3NhZ2UgPSB2YWx1ZTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIG92ZXJsYXk6IE92ZXJsYXksXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgc2Nyb2xsRGlzcGF0Y2hlcjogU2Nyb2xsRGlzcGF0Y2hlcixcbiAgICB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIG5nWm9uZTogTmdab25lLFxuICAgIHBsYXRmb3JtOiBQbGF0Zm9ybSxcbiAgICBhcmlhRGVzY3JpYmVyOiBBcmlhRGVzY3JpYmVyLFxuICAgIGZvY3VzTW9uaXRvcjogRm9jdXNNb25pdG9yLFxuICAgIEBJbmplY3QoTUFUX1RPT0xUSVBfU0NST0xMX1NUUkFURUdZKSBzY3JvbGxTdHJhdGVneTogYW55LFxuICAgIEBPcHRpb25hbCgpIGRpcjogRGlyZWN0aW9uYWxpdHksXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfVE9PTFRJUF9ERUZBVUxUX09QVElPTlMpIGRlZmF1bHRPcHRpb25zOiBNYXRUb29sdGlwRGVmYXVsdE9wdGlvbnMsXG4gICAgQEluamVjdChET0NVTUVOVCkgX2RvY3VtZW50OiBhbnksXG4gICkge1xuICAgIHN1cGVyKFxuICAgICAgb3ZlcmxheSxcbiAgICAgIGVsZW1lbnRSZWYsXG4gICAgICBzY3JvbGxEaXNwYXRjaGVyLFxuICAgICAgdmlld0NvbnRhaW5lclJlZixcbiAgICAgIG5nWm9uZSxcbiAgICAgIHBsYXRmb3JtLFxuICAgICAgYXJpYURlc2NyaWJlcixcbiAgICAgIGZvY3VzTW9uaXRvcixcbiAgICAgIHNjcm9sbFN0cmF0ZWd5LFxuICAgICAgZGlyLFxuICAgICAgZGVmYXVsdE9wdGlvbnMsXG4gICAgICBfZG9jdW1lbnRcbiAgICApO1xuICAgIHRoaXMuX3ZpZXdwb3J0TWFyZ2luID0gODtcbiAgICBzdXBlci5wb3NpdGlvbiA9ICdhYm92ZSc7XG4gIH1cblxuICBvdmVycmlkZSBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgc3VwZXIubmdBZnRlclZpZXdJbml0KCk7XG4gIH1cblxuICBvdmVycmlkZSBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBzdXBlci5uZ09uRGVzdHJveSgpO1xuICB9XG59XG5cbiJdfQ==