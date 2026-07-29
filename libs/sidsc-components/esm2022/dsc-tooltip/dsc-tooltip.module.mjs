import { MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER } from '@angular/material/tooltip';
import { NgModule } from '@angular/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { DscTooltipDirective } from './dsc-tooltip.directive';
import { DscTooltipComponent } from './dsc-tooltip.component';
import * as i0 from "@angular/core";
export class DscTooltipModule {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHNjLXRvb2x0aXAubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvc2lkc2MtY29tcG9uZW50cy9kc2MtdG9vbHRpcC9kc2MtdG9vbHRpcC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLDRDQUE0QyxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDekYsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRXJELE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQzlELE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHlCQUF5QixDQUFDOztBQVE5RCxNQUFNLE9BQU8sZ0JBQWdCOytHQUFoQixnQkFBZ0I7Z0hBQWhCLGdCQUFnQixpQkFMWixtQkFBbUIsRUFBRSxtQkFBbUIsYUFDN0MsT0FBTyxFQUFFLFNBQVMsYUFDbEIsbUJBQW1CO2dIQUdsQixnQkFBZ0IsYUFGaEIsQ0FBQyw0Q0FBNEMsQ0FBQzs7NEZBRTlDLGdCQUFnQjtrQkFONUIsUUFBUTttQkFBQztvQkFDUixZQUFZLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxtQkFBbUIsQ0FBQztvQkFDeEQsT0FBTyxFQUFFLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQztvQkFDN0IsT0FBTyxFQUFFLENBQUMsbUJBQW1CLENBQUM7b0JBQzlCLFNBQVMsRUFBRSxDQUFDLDRDQUE0QyxDQUFDO2lCQUMxRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1BVF9UT09MVElQX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZX1BST1ZJREVSIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvdG9vbHRpcCc7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQXN5bmNQaXBlLCBOZ0NsYXNzIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuaW1wb3J0IHsgRHNjVG9vbHRpcERpcmVjdGl2ZSB9IGZyb20gJy4vZHNjLXRvb2x0aXAuZGlyZWN0aXZlJztcbmltcG9ydCB7IERzY1Rvb2x0aXBDb21wb25lbnQgfSBmcm9tICcuL2RzYy10b29sdGlwLmNvbXBvbmVudCc7XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW0RzY1Rvb2x0aXBEaXJlY3RpdmUsIERzY1Rvb2x0aXBDb21wb25lbnRdLFxuICBpbXBvcnRzOiBbTmdDbGFzcywgQXN5bmNQaXBlXSxcbiAgZXhwb3J0czogW0RzY1Rvb2x0aXBEaXJlY3RpdmVdLFxuICBwcm92aWRlcnM6IFtNQVRfVE9PTFRJUF9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWV9QUk9WSURFUl1cbn0pXG5leHBvcnQgY2xhc3MgRHNjVG9vbHRpcE1vZHVsZSB7fVxuIl19