import * as i0 from '@angular/core';
import { Component, ViewEncapsulation, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgIf, CommonModule, NgTemplateOutlet, NgForOf } from '@angular/common';
import { PortalModule } from '@angular/cdk/portal';
import * as i1 from '@angular/material/progress-spinner';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

class DscProgressSpinnerComponent {
    constructor() {
        this.progress = 0;
        this.indeterminate = false;
        this.size = 90;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscProgressSpinnerComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.12", type: DscProgressSpinnerComponent, isStandalone: true, selector: "dsc-progress-spinner", inputs: { progress: "progress", label: "label", indeterminate: "indeterminate", size: "size" }, ngImport: i0, template: "<div class=\"progress-spinner-container\">\n  <mat-progress-spinner\n    [attr.aria-label]=\"'Carregando'\"\n    role=\"progressspinner\"\n    *ngIf=\"indeterminate\"\n    mode=\"indeterminate\"\n    [style.width.px]=\"size\"\n    [style.height.px]=\"size\">\n  </mat-progress-spinner>\n\n  <mat-progress-spinner\n    [attr.aria-label]=\"'Carregando, ' + progress + '%'\"\n    role=\"progressspinner\"\n    *ngIf=\"!indeterminate\"\n    mode=\"determinate\"\n    [value]=\"progress\"\n    tabindex=\"0\"\n    max=\"100\"\n    [style.width.px]=\"size\"\n    [style.height.px]=\"size\">\n  </mat-progress-spinner>\n\n  <span class=\"progress-label\" *ngIf=\"label\" [attr.aria-label]=\"label\">{{ label }}</span>\n</div>", styles: [".progress-spinner-container{display:flex;flex-direction:column;align-items:center}.progress-spinner-container .mat-mdc-progress-spinner{width:100%;height:4px;border-radius:4px;overflow:hidden;--mdc-circular-progress-active-indicator-color: var(--dsc-color-bg-highlight-5);margin-bottom:var(--dsc-spacing-nano)}.progress-spinner-container .progress-label{text-align:center;font:var(--dsc-typography-text-large-400);color:var(--dsc-color-content-neutral-5)}\n"], dependencies: [{ kind: "ngmodule", type: MatIconModule }, { kind: "ngmodule", type: MatExpansionModule }, { kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "ngmodule", type: PortalModule }, { kind: "ngmodule", type: CommonModule }, { kind: "ngmodule", type: MatProgressSpinnerModule }, { kind: "component", type: i1.MatProgressSpinner, selector: "mat-progress-spinner, mat-spinner", inputs: ["color", "mode", "value", "diameter", "strokeWidth"], exportAs: ["matProgressSpinner"] }], encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscProgressSpinnerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'dsc-progress-spinner', standalone: true, imports: [MatIconModule, MatExpansionModule, NgIf, PortalModule, NgTemplateOutlet, NgForOf, CommonModule, MatProgressSpinnerModule], encapsulation: ViewEncapsulation.None, template: "<div class=\"progress-spinner-container\">\n  <mat-progress-spinner\n    [attr.aria-label]=\"'Carregando'\"\n    role=\"progressspinner\"\n    *ngIf=\"indeterminate\"\n    mode=\"indeterminate\"\n    [style.width.px]=\"size\"\n    [style.height.px]=\"size\">\n  </mat-progress-spinner>\n\n  <mat-progress-spinner\n    [attr.aria-label]=\"'Carregando, ' + progress + '%'\"\n    role=\"progressspinner\"\n    *ngIf=\"!indeterminate\"\n    mode=\"determinate\"\n    [value]=\"progress\"\n    tabindex=\"0\"\n    max=\"100\"\n    [style.width.px]=\"size\"\n    [style.height.px]=\"size\">\n  </mat-progress-spinner>\n\n  <span class=\"progress-label\" *ngIf=\"label\" [attr.aria-label]=\"label\">{{ label }}</span>\n</div>", styles: [".progress-spinner-container{display:flex;flex-direction:column;align-items:center}.progress-spinner-container .mat-mdc-progress-spinner{width:100%;height:4px;border-radius:4px;overflow:hidden;--mdc-circular-progress-active-indicator-color: var(--dsc-color-bg-highlight-5);margin-bottom:var(--dsc-spacing-nano)}.progress-spinner-container .progress-label{text-align:center;font:var(--dsc-typography-text-large-400);color:var(--dsc-color-content-neutral-5)}\n"] }]
        }], propDecorators: { progress: [{
                type: Input
            }], label: [{
                type: Input
            }], indeterminate: [{
                type: Input
            }], size: [{
                type: Input
            }] } });

/**
 * Generated bundle index. Do not edit.
 */

export { DscProgressSpinnerComponent };
//# sourceMappingURL=sidsc-components-dsc-progress-spinner.mjs.map
