import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTab, MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { NgIf, NgClass, NgFor, NgTemplateOutlet, NgComponentOutlet, CommonModule } from '@angular/common';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { DscBadgeDirective } from 'sidsc-components/dsc-badge';
import * as i0 from "@angular/core";
import * as i1 from "@angular/material/tabs";
import * as i2 from "@angular/material/icon";
export class DscTabComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHNjLXRhYi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9zaWRzYy1jb21wb25lbnRzL2RzYy10YWItZ3JvdXAvZHNjLXRhYi9kc2MtdGFiLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3NpZHNjLWNvbXBvbmVudHMvZHNjLXRhYi1ncm91cC9kc2MtdGFiL2RzYy10YWIuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQy9FLE9BQU8sRUFBRSxNQUFNLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDL0QsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxnQkFBZ0IsRUFBRSxpQkFBaUIsRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMxRyxPQUFPLEVBQWdCLHFCQUFxQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDNUUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7Ozs7QUFZL0QsTUFBTSxPQUFPLGVBQWU7SUFSNUI7UUFZVyxVQUFLLEdBQVcsRUFBRSxDQUFDO1FBSW5CLGNBQVMsR0FBOEQsUUFBUSxDQUFDO1FBSWhGLGlCQUFZLEdBQW1DLFVBQVUsQ0FBQztRQVczRCxjQUFTLEdBQVksS0FBSyxDQUFDO0tBY3BDO0lBdkJDLElBQ0ksUUFBUTtRQUNWLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUN4QixDQUFDO0lBRUQsSUFBSSxRQUFRLENBQUMsS0FBbUI7UUFDOUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBSUQsWUFBWTtRQUNWLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxRQUFRO1lBQUUsT0FBTyxnQkFBZ0IsQ0FBQztRQUN6RCxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssU0FBUztZQUFFLE9BQU8sc0JBQXNCLENBQUM7UUFDaEUsT0FBTyxrQkFBa0IsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQzVDLENBQUM7SUFFRCxPQUFPLENBQUMsSUFBUztRQUNmLElBQUksT0FBTyxJQUFJLEtBQUssUUFBUTtZQUFFLE9BQU8sS0FBSyxDQUFDO1FBQzNDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNqQyxPQUFPLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMxRCxDQUFDOytHQW5DVSxlQUFlO21HQUFmLGVBQWUsdVBBQ2YsTUFBTSxnRENsQm5CLCtoQkFlQSw0SURIWSxhQUFhLGlPQUFFLE9BQU8sb0ZBQVMsSUFBSSw0RkFBdUMsWUFBWSw4QkFBRSxhQUFhLG9MQUFFLGlCQUFpQjs7NEZBS3ZILGVBQWU7a0JBUjNCLFNBQVM7K0JBQ0UsU0FBUyxjQUNQLElBQUksV0FDUCxDQUFDLGFBQWEsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxpQkFBaUIsRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLGlCQUFpQixDQUFDLGlCQUNwSCxpQkFBaUIsQ0FBQyxJQUFJOzhCQU1yQyxNQUFNO3NCQURMLFNBQVM7dUJBQUMsTUFBTTtnQkFHUixLQUFLO3NCQUFiLEtBQUs7Z0JBRUcsSUFBSTtzQkFBWixLQUFLO2dCQUVHLFNBQVM7c0JBQWpCLEtBQUs7Z0JBRUcsUUFBUTtzQkFBaEIsS0FBSztnQkFFRyxZQUFZO3NCQUFwQixLQUFLO2dCQUdGLFFBQVE7c0JBRFgsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIFZpZXdDaGlsZCwgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1hdFRhYiwgTWF0VGFic01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3RhYnMnO1xuaW1wb3J0IHsgTWF0SWNvbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2ljb24nO1xuaW1wb3J0IHsgTmdJZiwgTmdDbGFzcywgTmdGb3IsIE5nVGVtcGxhdGVPdXRsZXQsIE5nQ29tcG9uZW50T3V0bGV0LCBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgQm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHkgfSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHsgRHNjQmFkZ2VEaXJlY3RpdmUgfSBmcm9tICdzaWRzYy1jb21wb25lbnRzL2RzYy1iYWRnZSc7XG5cblxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdkc2MtdGFiJyxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbiAgaW1wb3J0czogW01hdFRhYnNNb2R1bGUsIE5nQ2xhc3MsIE5nRm9yLCBOZ0lmLCBOZ1RlbXBsYXRlT3V0bGV0LCBOZ0NvbXBvbmVudE91dGxldCwgQ29tbW9uTW9kdWxlLCBNYXRJY29uTW9kdWxlLCBEc2NCYWRnZURpcmVjdGl2ZV0sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIHRlbXBsYXRlVXJsOiAnLi9kc2MtdGFiLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vZHNjLXRhYi5jb21wb25lbnQuc2NzcyddXG59KVxuZXhwb3J0IGNsYXNzIERzY1RhYkNvbXBvbmVudCB7XG4gIEBWaWV3Q2hpbGQoTWF0VGFiKVxuICBtYXRUYWIhOiBNYXRUYWI7XG5cbiAgQElucHV0KCkgbGFiZWw6IHN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpIGljb24/OiBzdHJpbmc7XG5cbiAgQElucHV0KCkgaWNvblN0eWxlPzogJ291dGxpbmVkJyB8ICdmaWxsZWQnIHwgJ3JvdW5kZWQnIHwgJ3NoYXJwJyB8ICd0d28tdG9uZScgPSAnZmlsbGVkJztcblxuICBASW5wdXQoKSBkc2NCYWRnZT86IHN0cmluZztcblxuICBASW5wdXQoKSBkc2NCYWRnZVNpemU6ICdzbWFsbCcgfCAnc3RhbmRhcmQnIHwgJ2xhcmdlJyA9ICdzdGFuZGFyZCc7XG5cbiAgQElucHV0KClcbiAgZ2V0IGRpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9kaXNhYmxlZDtcbiAgfVxuXG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy5fZGlzYWJsZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG5cbiAgcHJpdmF0ZSBfZGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBnZXRJY29uQ2xhc3MoKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy5pY29uU3R5bGUgPT09ICdmaWxsZWQnKSByZXR1cm4gJ21hdGVyaWFsLWljb25zJztcbiAgICBpZiAodGhpcy5pY29uU3R5bGUgPT09ICdyb3VuZGVkJykgcmV0dXJuICdtYXRlcmlhbC1pY29ucy1yb3VuZCc7XG4gICAgcmV0dXJuIGBtYXRlcmlhbC1pY29ucy0ke3RoaXMuaWNvblN0eWxlfWA7XG4gIH1cblxuICBpc0ltYWdlKGljb246IGFueSk6IGJvb2xlYW4ge1xuICAgIGlmICh0eXBlb2YgaWNvbiAhPT0gJ3N0cmluZycpIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBsb3dlciA9IGljb24udG9Mb3dlckNhc2UoKTtcbiAgICByZXR1cm4gbG93ZXIuZW5kc1dpdGgoJy5zdmcnKSB8fCBsb3dlci5lbmRzV2l0aCgnLnBuZycpO1xuICB9XG5cbn1cbiIsIjxtYXQtdGFiIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiPlxuICA8bmctdGVtcGxhdGUgbWF0LXRhYi1sYWJlbD5cbiAgICA8bWF0LWljb24gKm5nSWY9XCJpY29uXCIgW25nQ2xhc3NdPVwiZ2V0SWNvbkNsYXNzKClcIj5cbiAgICAgIDxpbWcgKm5nSWY9XCJpc0ltYWdlKGljb24pXCIgc3JjPVwie3tpY29ufX1cIiBhbHQ9XCJcIj5cbiAgICAgIHt7IGljb24gfX1cbiAgICA8L21hdC1pY29uPlxuICAgIHt7IGxhYmVsIH19XG4gICAgPGRpdiBjbGFzcz1cImJhZGdlXCIgW25nQ2xhc3NdPVwie1xuICAgICAgJ2JhZGdlLXN0YW5kYXJkJzogZHNjQmFkZ2VTaXplID09PSAnc3RhbmRhcmQnLFxuICAgICAgJ2JhZGdlLW90aGVyJzogZHNjQmFkZ2VTaXplICE9PSAnc3RhbmRhcmQnXG4gICAgfVwiXG4gICAgICpuZ0lmPVwiZHNjQmFkZ2VcIiBbZHNjQmFkZ2VdPVwiZHNjQmFkZ2VcIiBbZHNjQmFkZ2VTaXplXT1cImRzY0JhZGdlU2l6ZVwiPjwvZGl2PlxuICA8L25nLXRlbXBsYXRlPlxuICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG48L21hdC10YWI+XG4iXX0=