import * as i0 from '@angular/core';
import { Injectable, Directive, Input, EventEmitter, Component, ViewEncapsulation, Output, ViewChildren } from '@angular/core';
import * as i4 from '@angular/material/stepper';
import { MatStepperIntl, MatStep, MatStepperModule } from '@angular/material/stepper';
import * as i1 from '@angular/cdk/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import * as i1$1 from '@angular/router';
import { NavigationEnd } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import * as i3 from '@angular/common';
import { CommonModule, NgTemplateOutlet, NgForOf, NgIf } from '@angular/common';
import { DscButtonComponent } from 'sidsc-components/dsc-button';
import { map, filter } from 'rxjs/operators';
import * as i5 from 'sidsc-components/dsc-tooltip';
import { DscTooltipModule } from 'sidsc-components/dsc-tooltip';
import { MatTooltipModule } from '@angular/material/tooltip';
import * as i2 from '@angular/cdk/layout';

class PtBrStepperIntl extends MatStepperIntl {
    constructor() {
        super();
        this.optionalLabel = 'Opcional';
        this.completedLabel = 'Concluído';
        this.editableLabel = 'Editável';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: PtBrStepperIntl, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: PtBrStepperIntl }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: PtBrStepperIntl, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return []; } });

class CdkStepperNext {
    constructor(_stepper) {
        this._stepper = _stepper;
        /** Type of the next button. Defaults to "submit" if not specified. */
        this.type = 'submit';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: CdkStepperNext, deps: [{ token: i1.CdkStepper }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.2.12", type: CdkStepperNext, isStandalone: true, selector: "dsc-button[cdkStepperNext]", inputs: { type: "type" }, host: { listeners: { "click": "_stepper.next()" }, properties: { "type": "type" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: CdkStepperNext, decorators: [{
            type: Directive,
            args: [{
                    selector: 'dsc-button[cdkStepperNext]',
                    standalone: true,
                    host: {
                        '[type]': 'type',
                        '(click)': '_stepper.next()'
                    }
                }]
        }], ctorParameters: function () { return [{ type: i1.CdkStepper }]; }, propDecorators: { type: [{
                type: Input
            }] } });
/** Button that moves to the previous step in a stepper workflow. */
class CdkStepperPrevious {
    constructor(_stepper) {
        this._stepper = _stepper;
        /** Type of the previous button. Defaults to "button" if not specified. */
        this.type = 'button';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: CdkStepperPrevious, deps: [{ token: i1.CdkStepper }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.2.12", type: CdkStepperPrevious, isStandalone: true, selector: "dsc-button[cdkStepperPrevious]", inputs: { type: "type" }, host: { listeners: { "click": "_stepper.previous()" }, properties: { "type": "type" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: CdkStepperPrevious, decorators: [{
            type: Directive,
            args: [{
                    selector: 'dsc-button[cdkStepperPrevious]',
                    standalone: true,
                    host: {
                        '[type]': 'type',
                        '(click)': '_stepper.previous()'
                    }
                }]
        }], ctorParameters: function () { return [{ type: i1.CdkStepper }]; }, propDecorators: { type: [{
                type: Input
            }] } });
class CdkStepperReset {
    constructor(_stepper) {
        this._stepper = _stepper;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: CdkStepperReset, deps: [{ token: i1.CdkStepper }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.2.12", type: CdkStepperReset, isStandalone: true, selector: "dsc-button[cdkStepperReset]", host: { listeners: { "click": "_stepper.reset()" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: CdkStepperReset, decorators: [{
            type: Directive,
            args: [{
                    selector: 'dsc-button[cdkStepperReset]',
                    standalone: true,
                    host: {
                        '(click)': '_stepper.reset()'
                    }
                }]
        }], ctorParameters: function () { return [{ type: i1.CdkStepper }]; } });
class DscStepperNext extends CdkStepperNext {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscStepperNext, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.2.12", type: DscStepperNext, isStandalone: true, selector: "dsc-button[dscStepperNext]", inputs: { type: "type" }, host: { properties: { "type": "type" }, classAttribute: "mat-stepper-next" }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscStepperNext, decorators: [{
            type: Directive,
            args: [{
                    selector: 'dsc-button[dscStepperNext]',
                    host: {
                        'class': 'mat-stepper-next',
                        '[type]': 'type'
                    },
                    standalone: true,
                    inputs: ['type']
                }]
        }] });
/** Button that moves to the previous step in a stepper workflow. */
class DscStepperPrevious extends CdkStepperPrevious {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscStepperPrevious, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.2.12", type: DscStepperPrevious, isStandalone: true, selector: "dsc-button[dscStepperPrevious]", inputs: { type: "type" }, host: { properties: { "type": "type" }, classAttribute: "mat-stepper-previous" }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscStepperPrevious, decorators: [{
            type: Directive,
            args: [{
                    selector: 'dsc-button[dscStepperPrevious]',
                    host: {
                        'class': 'mat-stepper-previous',
                        '[type]': 'type'
                    },
                    standalone: true,
                    inputs: ['type']
                }]
        }] });
class DscStepperReset extends CdkStepperReset {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscStepperReset, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.2.12", type: DscStepperReset, isStandalone: true, selector: "dsc-button[dscStepperReset]", usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscStepperReset, decorators: [{
            type: Directive,
            args: [{
                    standalone: true,
                    selector: 'dsc-button[dscStepperReset]'
                }]
        }] });

/**
 * Componente DSC Stepper baseado no Angular Material.
 * Permite a navegação entre etapas e integração com rotas.
 */
class DscStepperComponent {
    constructor(router, route, breakpointObserver, renderer, cdRef, elRef) {
        this.router = router;
        this.route = route;
        this.breakpointObserver = breakpointObserver;
        this.renderer = renderer;
        this.cdRef = cdRef;
        this.elRef = elRef;
        /** Evento emitido quando há uma mudança na seleção do step */
        this.selectionChange = new EventEmitter();
        /** Evento emitido quando o índice do step selecionado muda */
        this.selectedIndexChange = new EventEmitter();
        this.stepperModelChange = new EventEmitter();
        this.showTooltip$ = this.breakpointObserver.observe('(max-width: 800px)').pipe(map(({ matches }) => matches));
    }
    /** Inicializa o componente e escuta mudanças na rota */
    ngOnInit() {
        this.listenToRouteChanges();
    }
    ngAfterViewInit() {
        if (this.stepper.skipValidSteps) {
            Promise.resolve().then(() => this.skipValidSteps());
        }
    }
    notifyStepperModelChange(newValue) {
        this.stepperModelChange.emit(newValue);
    }
    /** Escuta eventos de navegação para atualizar o índice selecionado */
    listenToRouteChanges() {
        this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => this.updateSelectedIndex());
    }
    skipValidSteps() {
        if (!this.stepper.skipValidSteps)
            return;
        this.stepper.steps.forEach((step, index) => {
            const isValid = step.formGroup?.valid ?? false;
            if (isValid) {
                step.completed = true;
                this.stepper.selectedIndex = index + 1;
            }
            else {
                step.completed = false;
            }
        });
    }
    /** Atualiza o índice do step selecionado com base na rota ativa */
    updateSelectedIndex() {
        const currentRoute = this.route.snapshot.firstChild?.routeConfig?.path;
        const index = this.stepper.steps.findIndex(step => step.route === currentRoute);
        this.stepper.selectedIndex = index !== -1 ? index : 0;
    }
    /**
     * Manipula a mudança de etapa.
     * @param event Evento de seleção do stepper
     */
    onStepChange(event) {
        const prevIndex = event.previouslySelectedIndex;
        const prevStep = this.stepper.steps[prevIndex];
        const isLast = event.selectedIndex === this.stepper.steps.length - 1;
        if (prevStep && !prevStep.formGroup) {
            this.navigateToStep(event.selectedIndex);
            this.applyStepCustomizations(event.selectedIndex);
            this.stepper.selectedIndex = event.selectedIndex;
            this.cdRef.detectChanges();
        }
        this.selectionChange.emit(event);
        this.selectedIndexChange.emit(event.selectedIndex);
        if (isLast) {
            const last = this.stepper.steps[event.selectedIndex];
            last.completed = true;
        }
    }
    /**
     * Navega para a rota correspondente ao step selecionado.
     * @param index Índice do step selecionado
     */
    navigateToStep(index) {
        const selectedStep = this.stepper.steps[index];
        if (selectedStep.route) {
            this.router.navigate([selectedStep.route], {
                relativeTo: this.route,
                replaceUrl: true
            });
        }
    }
    /**
     * Aplica personalizações ao stepper, como ocultar linhas e labels.
     * @param selectedIndex Índice do step selecionado
     */
    applyStepCustomizations(selectedIndex) {
        if (this.stepper.noHorizontalLine) {
            this.toggleElementsVisibility('.mat-stepper-horizontal-line', selectedIndex);
            this.toggleElementsVisibility('.mat-step-label', selectedIndex);
        }
    }
    /**
     * Controla a visibilidade de elementos do DOM com base no índice do step selecionado.
     * Esconde a linha horizontal do stepper apenas se `noHorizontalLine` for `true`
     * e se a etapa anterior (`selectedIndex - 1`) for não editável (`editable = false`).
     *
     * @param selector Seletor CSS dos elementos a serem modificados (exemplo: '.mat-stepper-horizontal-line')
     * @param selectedIndex Índice do step atualmente selecionado
     */
    toggleElementsVisibility(selector, selectedIndex) {
        const stepperElement = this.getStepperElement();
        if (!stepperElement || selectedIndex === 0)
            return;
        if (!this.stepper.noHorizontalLine)
            return;
        const previousStep = this.stepper.steps[selectedIndex - 1];
        if (!previousStep || previousStep.editable !== false)
            return;
        const stepLines = stepperElement.querySelectorAll(selector);
        if (stepLines.length > selectedIndex - 1) {
            this.renderer.setStyle(stepLines[selectedIndex - 1], 'display', 'none');
        }
    }
    /**
     * Obtém o elemento DOM correspondente ao stepper atual.
     */
    getStepperElement() {
        return this.elRef.nativeElement;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscStepperComponent, deps: [{ token: i1$1.Router }, { token: i1$1.ActivatedRoute }, { token: i2.BreakpointObserver }, { token: i0.Renderer2 }, { token: i0.ChangeDetectorRef }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.12", type: DscStepperComponent, isStandalone: true, selector: "dsc-stepper", inputs: { stepper: "stepper" }, outputs: { selectionChange: "selectionChange", selectedIndexChange: "selectedIndexChange", stepperModelChange: "stepperModelChange" }, providers: [
            { provide: MatStepperIntl, useClass: PtBrStepperIntl },
            { provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true } },
        ], viewQueries: [{ propertyName: "matSteps", predicate: MatStep, descendants: true }], ngImport: i0, template: "<mat-stepper [linear]=\"stepper.linear\"\n             [orientation]=\"stepper.orientation || 'horizontal'\"\n             [selectedIndex]=\"stepper.selectedIndex\"\n             [disableRipple]=\"true\"\n             (selectionChange)=\"onStepChange($event)\">\n  <ng-container *ngFor=\"let step of stepper.steps; let i = index\">\n    <mat-step [stepControl]=\"step.formGroup\"\n              [optional]=\"step.optional\"\n              [editable]=\"step.editable !== false\"\n              errorMessage=\"Revisar\"\n              *ngIf=\"step.formGroup\">\n      <ng-template matStepLabel>\n        <div *ngIf=\"showTooltip$ | async\" [dscTooltip]=\"step.label\">\n          {{ step.label }}\n        </div>\n        <div *ngIf=\"!(showTooltip$ | async)\">\n          {{ step.label }}\n        </div>\n      </ng-template>\n\n      <ng-container *ngIf=\"step.contentTemplate\">\n        <ng-container [ngTemplateOutlet]=\"step.contentTemplate\"></ng-container>\n      </ng-container>\n\n      <div\n        class=\"mat-stepper-button-container\"\n        [style.justify-content]=\"stepper.orientation === 'vertical' ? 'flex-start' : 'flex-end'\"\n        *ngIf=\"step.previous || step.next || step.reset\">\n\n        <dsc-button\n          *ngIf=\"step.previous\"\n          [label]=\"step.previous.label\"\n          [iconSuffix]=\"step?.previous?.iconSuffix\"\n          [iconPrefix]=\"step?.previous?.iconPrefix\"\n          [variant]=\"step.previous.variant ?? 'secondary-outlined'\"\n          [size]=\"step.previous.size ?? 'standard'\"\n          dscStepperPrevious>\n        </dsc-button>\n\n        <dsc-button\n          *ngIf=\"step.next\"\n          [label]=\"step.next.label\"\n          [iconSuffix]=\"step?.previous?.iconSuffix\"\n          [iconPrefix]=\"step?.previous?.iconPrefix\"\n          [variant]=\"step.next.variant ?? 'primary'\"\n          [size]=\"step.next.size ?? 'standard'\"\n          type=\"submit\"\n          dscStepperNext>\n        </dsc-button>\n\n        <dsc-button\n          *ngIf=\"step.reset\"\n          [label]=\"step.reset.label\"\n          [iconSuffix]=\"step?.previous?.iconSuffix\"\n          [iconPrefix]=\"step?.previous?.iconPrefix\"\n          [variant]=\"step.reset.variant ?? 'secondary'\"\n          [size]=\"step.reset.size ?? 'standard'\"\n          dscStepperReset>\n        </dsc-button>\n      </div>\n    </mat-step>\n\n    <mat-step *ngIf=\"!step.formGroup\"\n              [optional]=\"step.optional\"\n              [completed]=\"step.completed\"\n              [editable]=\"step.editable !== false\">\n      <ng-template matStepLabel>\n        <div *ngIf=\"showTooltip$ | async\" [dscTooltip]=\"step.label\">\n          {{ step.label }}\n        </div>\n        <div *ngIf=\"!(showTooltip$ | async)\">\n          {{ step.label }}\n        </div>\n      </ng-template>\n\n      <ng-container *ngIf=\"step.contentTemplate\">\n        <ng-container [ngTemplateOutlet]=\"step.contentTemplate\"></ng-container>\n      </ng-container>\n\n      <div\n        class=\"mat-stepper-button-container\"\n        *ngIf=\"step.previous || step.next || step.reset\">\n\n        <dsc-button\n          *ngIf=\"step.previous\"\n          [label]=\"step.previous.label\"\n          [iconSuffix]=\"step?.previous?.iconSuffix\"\n          [iconPrefix]=\"step?.previous?.iconPrefix\"\n          [variant]=\"step.previous.variant ?? 'secondary-outlined'\"\n          [size]=\"step.previous.size ?? 'standard'\"\n          dscStepperPrevious>\n        </dsc-button>\n\n        <dsc-button\n          *ngIf=\"step.next\"\n          [label]=\"step.next.label\"\n          [iconSuffix]=\"step?.previous?.iconSuffix\"\n          [iconPrefix]=\"step?.previous?.iconPrefix\"\n          [variant]=\"step.next.variant ?? 'primary'\"\n          [size]=\"step.next.size ?? 'standard'\"\n          type=\"submit\"\n          dscStepperNext>\n        </dsc-button>\n\n        <dsc-button\n          *ngIf=\"step.reset\"\n          [label]=\"step.reset.label\"\n          [iconSuffix]=\"step?.previous?.iconSuffix\"\n          [iconPrefix]=\"step?.previous?.iconPrefix\"\n          [variant]=\"step.reset.variant ?? 'secondary'\"\n          [size]=\"step.reset.size ?? 'standard'\"\n          dscStepperReset>\n        </dsc-button>\n      </div>\n    </mat-step>\n  </ng-container>\n</mat-stepper>\n", styles: ["mat-stepper{--mat-stepper-container-color: transparent}.mat-step-header{--mat-stepper-container-color: var(--dsc-color-bg-neutral-1);--mat-stepper-header-hover-state-layer-color: color-mix(in srgb,var(--dsc-color-state-bg-neutral-hover-on-light),transparent 92%);--mat-stepper-header-focus-state-layer-color: transparent;--mat-stepper-header-height: 56px !important;--mat-stepper-header-label-text-color: var(--dsc-color-content-neutral-5);--mat-stepper-header-optional-label-text-color: var(--dsc-color-content-neutral-4);--mat-stepper-header-selected-state-label-text-color: var(--dsc-color-content-neutral-5);--mat-stepper-header-error-state-label-text-color: var(--dsc-color-content-danger-2);--mat-stepper-header-icon-foreground-color: var(--dsc-color-content-neutral-1);--mat-stepper-header-icon-background-color: var(--dsc-color-bg-neutral-6);--mat-stepper-header-selected-state-icon-background-color: var(--dsc-color-bg-highlight-5) !important;--mat-stepper-header-selected-state-icon-foreground-color: var(--dsc-color-content-neutral-1);--mat-stepper-header-done-state-icon-background-color: var(--dsc-color-bg-highlight-5);--mat-stepper-header-done-state-icon-foreground-color: var(--dsc-color-bg-neutral-1);--mat-stepper-header-edit-state-icon-background-color: var(--dsc-color-bg-highlight-5) !important;--mat-stepper-header-edit-state-icon-foreground-color: var(--dsc-color-bg-neutral-1);--mat-stepper-header-error-state-icon-background-color: transparent;--mat-stepper-header-error-state-icon-foreground-color: var(--dsc-color-bg-danger-4);border-radius:var(--dsc-border-radius-nano)}.mat-step-header.cdk-keyboard-focused{border:var(--dsc-border-width-thick) var(--dsc-color-state-border-focus-dark) solid;border-radius:var(--dsc-border-radius-nano)}.mat-step-header:active{background-color:color-mix(in srgb,var(--dsc-color-state-bg-neutral-active-on-light),transparent 84%)!important}.mat-step-header .mat-step-icon{margin-right:var(--dsc-spacing-nano)!important;height:24px;width:24px}.mat-step-header .mat-step-icon .mat-step-icon-content span{font:var(--dsc-typography-text-standard-400);font-feature-settings:\"ss01\";color:var(--dsc-color-bg-neutral-1)}.mat-step-header .mat-step-icon .mat-step-icon-content .mat-icon{font-size:var(--dsc-icon-size-nano);height:var(--dsc-icon-size-nano);width:var(--dsc-icon-size-nano)}.mat-step-header .mat-step-icon-selected{background-color:var(--dsc-color-bg-highlight-5)}.mat-step-header .mat-step-icon-selected span{font:var(--dsc-typography-text-standard-700)!important;font-feature-settings:\"ss01\"!important}.mat-step-header mat-step-icon-state-edit{background-color:var(--dsc-color-bg-highlight-5)}.mat-step-header .mat-step-label{min-width:0!important;font:var(--dsc-typography-text-standard-400);font-feature-settings:\"ss01\"}.mat-step-header .mat-step-label .mat-step-optional,.mat-step-header .mat-step-label .mat-step-sub-label-error{font:var(--dsc-typography-text-small-400);font-feature-settings:\"ss01\"}.mat-step-header .mat-step-label-error{font:var(--dsc-typography-text-standard-600);font-feature-settings:\"ss01\"}.mat-step-header .mat-step-label-error .mat-step-sub-label-error{color:var(--dsc-color-content-neutral-4)}.mat-horizontal-stepper-header{padding:0 11px 0 0!important;min-width:24px}.mat-stepper-horizontal-line{border-top-width:var(--dsc-border-width-hairline)!important;border-top-color:var(--dsc-color-border-neutral-5)!important;margin:0 15px 0 3px!important}.mat-vertical-content-container{margin:var(--dsc-spacing-micro) 0 var(--dsc-spacing-micro) 36px!important}.mat-vertical-content-container:before{border-left-width:var(--dsc-border-width-hairline)!important;border-left-color:var(--dsc-color-border-neutral-5)!important}.mat-vertical-stepper-header.cdk-keyboard-focused{padding:12px 20px}.mat-stepper-button-container{display:flex;justify-content:flex-end;gap:var(--dsc-spacing-tiny);margin-top:var(--dsc-spacing-smaller)}.mat-horizontal-content-container,.mat-vertical-content{padding:var(--dsc-spacing-smaller)!important}.mat-step-header .mat-step-label-selected .mat-step-text-label{font:var(--dsc-typography-text-standard-600)!important;color:var(--dsc-color-content-neutral-5)!important}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i3.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i3.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "pipe", type: i3.AsyncPipe, name: "async" }, { kind: "ngmodule", type: MatStepperModule }, { kind: "component", type: i4.MatStep, selector: "mat-step", inputs: ["color"], exportAs: ["matStep"] }, { kind: "directive", type: i4.MatStepLabel, selector: "[matStepLabel]" }, { kind: "component", type: i4.MatStepper, selector: "mat-stepper, mat-vertical-stepper, mat-horizontal-stepper, [matStepper]", inputs: ["selectedIndex", "disableRipple", "color", "labelPosition", "headerPosition", "animationDuration"], outputs: ["animationDone"], exportAs: ["matStepper", "matVerticalStepper", "matHorizontalStepper"] }, { kind: "ngmodule", type: MatTooltipModule }, { kind: "ngmodule", type: ReactiveFormsModule }, { kind: "ngmodule", type: MatIconModule }, { kind: "ngmodule", type: FormsModule }, { kind: "component", type: DscButtonComponent, selector: "dsc-button", inputs: ["type", "label", "iconSuffix", "iconPrefix", "icon", "tabIndex", "dscTooltip", "ariaLabel", "ariaExpanded", "ariaControls", "iconStyle", "variant", "size", "disabled", "iconButton"] }, { kind: "directive", type: DscStepperPrevious, selector: "dsc-button[dscStepperPrevious]", inputs: ["type"] }, { kind: "directive", type: DscStepperNext, selector: "dsc-button[dscStepperNext]", inputs: ["type"] }, { kind: "directive", type: DscStepperReset, selector: "dsc-button[dscStepperReset]" }, { kind: "ngmodule", type: DscTooltipModule }, { kind: "directive", type: i5.DscTooltipDirective, selector: "[dscTooltip]", inputs: ["dscTooltipPosition", "dscTooltipVariant", "dscTooltipPositionAtOrigin", "dscTooltipDisabled", "dscTooltipShowDelay", "dscTooltipHideDelay", "dscTooltip"] }], encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscStepperComponent, decorators: [{
            type: Component,
            args: [{ selector: 'dsc-stepper', standalone: true, encapsulation: ViewEncapsulation.None, imports: [
                        CommonModule,
                        MatStepperModule,
                        MatTooltipModule,
                        NgTemplateOutlet,
                        NgForOf,
                        NgIf,
                        ReactiveFormsModule,
                        MatIconModule,
                        FormsModule,
                        DscButtonComponent,
                        DscStepperPrevious,
                        DscStepperNext,
                        DscStepperReset,
                        DscTooltipModule
                    ], providers: [
                        { provide: MatStepperIntl, useClass: PtBrStepperIntl },
                        { provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true } },
                    ], template: "<mat-stepper [linear]=\"stepper.linear\"\n             [orientation]=\"stepper.orientation || 'horizontal'\"\n             [selectedIndex]=\"stepper.selectedIndex\"\n             [disableRipple]=\"true\"\n             (selectionChange)=\"onStepChange($event)\">\n  <ng-container *ngFor=\"let step of stepper.steps; let i = index\">\n    <mat-step [stepControl]=\"step.formGroup\"\n              [optional]=\"step.optional\"\n              [editable]=\"step.editable !== false\"\n              errorMessage=\"Revisar\"\n              *ngIf=\"step.formGroup\">\n      <ng-template matStepLabel>\n        <div *ngIf=\"showTooltip$ | async\" [dscTooltip]=\"step.label\">\n          {{ step.label }}\n        </div>\n        <div *ngIf=\"!(showTooltip$ | async)\">\n          {{ step.label }}\n        </div>\n      </ng-template>\n\n      <ng-container *ngIf=\"step.contentTemplate\">\n        <ng-container [ngTemplateOutlet]=\"step.contentTemplate\"></ng-container>\n      </ng-container>\n\n      <div\n        class=\"mat-stepper-button-container\"\n        [style.justify-content]=\"stepper.orientation === 'vertical' ? 'flex-start' : 'flex-end'\"\n        *ngIf=\"step.previous || step.next || step.reset\">\n\n        <dsc-button\n          *ngIf=\"step.previous\"\n          [label]=\"step.previous.label\"\n          [iconSuffix]=\"step?.previous?.iconSuffix\"\n          [iconPrefix]=\"step?.previous?.iconPrefix\"\n          [variant]=\"step.previous.variant ?? 'secondary-outlined'\"\n          [size]=\"step.previous.size ?? 'standard'\"\n          dscStepperPrevious>\n        </dsc-button>\n\n        <dsc-button\n          *ngIf=\"step.next\"\n          [label]=\"step.next.label\"\n          [iconSuffix]=\"step?.previous?.iconSuffix\"\n          [iconPrefix]=\"step?.previous?.iconPrefix\"\n          [variant]=\"step.next.variant ?? 'primary'\"\n          [size]=\"step.next.size ?? 'standard'\"\n          type=\"submit\"\n          dscStepperNext>\n        </dsc-button>\n\n        <dsc-button\n          *ngIf=\"step.reset\"\n          [label]=\"step.reset.label\"\n          [iconSuffix]=\"step?.previous?.iconSuffix\"\n          [iconPrefix]=\"step?.previous?.iconPrefix\"\n          [variant]=\"step.reset.variant ?? 'secondary'\"\n          [size]=\"step.reset.size ?? 'standard'\"\n          dscStepperReset>\n        </dsc-button>\n      </div>\n    </mat-step>\n\n    <mat-step *ngIf=\"!step.formGroup\"\n              [optional]=\"step.optional\"\n              [completed]=\"step.completed\"\n              [editable]=\"step.editable !== false\">\n      <ng-template matStepLabel>\n        <div *ngIf=\"showTooltip$ | async\" [dscTooltip]=\"step.label\">\n          {{ step.label }}\n        </div>\n        <div *ngIf=\"!(showTooltip$ | async)\">\n          {{ step.label }}\n        </div>\n      </ng-template>\n\n      <ng-container *ngIf=\"step.contentTemplate\">\n        <ng-container [ngTemplateOutlet]=\"step.contentTemplate\"></ng-container>\n      </ng-container>\n\n      <div\n        class=\"mat-stepper-button-container\"\n        *ngIf=\"step.previous || step.next || step.reset\">\n\n        <dsc-button\n          *ngIf=\"step.previous\"\n          [label]=\"step.previous.label\"\n          [iconSuffix]=\"step?.previous?.iconSuffix\"\n          [iconPrefix]=\"step?.previous?.iconPrefix\"\n          [variant]=\"step.previous.variant ?? 'secondary-outlined'\"\n          [size]=\"step.previous.size ?? 'standard'\"\n          dscStepperPrevious>\n        </dsc-button>\n\n        <dsc-button\n          *ngIf=\"step.next\"\n          [label]=\"step.next.label\"\n          [iconSuffix]=\"step?.previous?.iconSuffix\"\n          [iconPrefix]=\"step?.previous?.iconPrefix\"\n          [variant]=\"step.next.variant ?? 'primary'\"\n          [size]=\"step.next.size ?? 'standard'\"\n          type=\"submit\"\n          dscStepperNext>\n        </dsc-button>\n\n        <dsc-button\n          *ngIf=\"step.reset\"\n          [label]=\"step.reset.label\"\n          [iconSuffix]=\"step?.previous?.iconSuffix\"\n          [iconPrefix]=\"step?.previous?.iconPrefix\"\n          [variant]=\"step.reset.variant ?? 'secondary'\"\n          [size]=\"step.reset.size ?? 'standard'\"\n          dscStepperReset>\n        </dsc-button>\n      </div>\n    </mat-step>\n  </ng-container>\n</mat-stepper>\n", styles: ["mat-stepper{--mat-stepper-container-color: transparent}.mat-step-header{--mat-stepper-container-color: var(--dsc-color-bg-neutral-1);--mat-stepper-header-hover-state-layer-color: color-mix(in srgb,var(--dsc-color-state-bg-neutral-hover-on-light),transparent 92%);--mat-stepper-header-focus-state-layer-color: transparent;--mat-stepper-header-height: 56px !important;--mat-stepper-header-label-text-color: var(--dsc-color-content-neutral-5);--mat-stepper-header-optional-label-text-color: var(--dsc-color-content-neutral-4);--mat-stepper-header-selected-state-label-text-color: var(--dsc-color-content-neutral-5);--mat-stepper-header-error-state-label-text-color: var(--dsc-color-content-danger-2);--mat-stepper-header-icon-foreground-color: var(--dsc-color-content-neutral-1);--mat-stepper-header-icon-background-color: var(--dsc-color-bg-neutral-6);--mat-stepper-header-selected-state-icon-background-color: var(--dsc-color-bg-highlight-5) !important;--mat-stepper-header-selected-state-icon-foreground-color: var(--dsc-color-content-neutral-1);--mat-stepper-header-done-state-icon-background-color: var(--dsc-color-bg-highlight-5);--mat-stepper-header-done-state-icon-foreground-color: var(--dsc-color-bg-neutral-1);--mat-stepper-header-edit-state-icon-background-color: var(--dsc-color-bg-highlight-5) !important;--mat-stepper-header-edit-state-icon-foreground-color: var(--dsc-color-bg-neutral-1);--mat-stepper-header-error-state-icon-background-color: transparent;--mat-stepper-header-error-state-icon-foreground-color: var(--dsc-color-bg-danger-4);border-radius:var(--dsc-border-radius-nano)}.mat-step-header.cdk-keyboard-focused{border:var(--dsc-border-width-thick) var(--dsc-color-state-border-focus-dark) solid;border-radius:var(--dsc-border-radius-nano)}.mat-step-header:active{background-color:color-mix(in srgb,var(--dsc-color-state-bg-neutral-active-on-light),transparent 84%)!important}.mat-step-header .mat-step-icon{margin-right:var(--dsc-spacing-nano)!important;height:24px;width:24px}.mat-step-header .mat-step-icon .mat-step-icon-content span{font:var(--dsc-typography-text-standard-400);font-feature-settings:\"ss01\";color:var(--dsc-color-bg-neutral-1)}.mat-step-header .mat-step-icon .mat-step-icon-content .mat-icon{font-size:var(--dsc-icon-size-nano);height:var(--dsc-icon-size-nano);width:var(--dsc-icon-size-nano)}.mat-step-header .mat-step-icon-selected{background-color:var(--dsc-color-bg-highlight-5)}.mat-step-header .mat-step-icon-selected span{font:var(--dsc-typography-text-standard-700)!important;font-feature-settings:\"ss01\"!important}.mat-step-header mat-step-icon-state-edit{background-color:var(--dsc-color-bg-highlight-5)}.mat-step-header .mat-step-label{min-width:0!important;font:var(--dsc-typography-text-standard-400);font-feature-settings:\"ss01\"}.mat-step-header .mat-step-label .mat-step-optional,.mat-step-header .mat-step-label .mat-step-sub-label-error{font:var(--dsc-typography-text-small-400);font-feature-settings:\"ss01\"}.mat-step-header .mat-step-label-error{font:var(--dsc-typography-text-standard-600);font-feature-settings:\"ss01\"}.mat-step-header .mat-step-label-error .mat-step-sub-label-error{color:var(--dsc-color-content-neutral-4)}.mat-horizontal-stepper-header{padding:0 11px 0 0!important;min-width:24px}.mat-stepper-horizontal-line{border-top-width:var(--dsc-border-width-hairline)!important;border-top-color:var(--dsc-color-border-neutral-5)!important;margin:0 15px 0 3px!important}.mat-vertical-content-container{margin:var(--dsc-spacing-micro) 0 var(--dsc-spacing-micro) 36px!important}.mat-vertical-content-container:before{border-left-width:var(--dsc-border-width-hairline)!important;border-left-color:var(--dsc-color-border-neutral-5)!important}.mat-vertical-stepper-header.cdk-keyboard-focused{padding:12px 20px}.mat-stepper-button-container{display:flex;justify-content:flex-end;gap:var(--dsc-spacing-tiny);margin-top:var(--dsc-spacing-smaller)}.mat-horizontal-content-container,.mat-vertical-content{padding:var(--dsc-spacing-smaller)!important}.mat-step-header .mat-step-label-selected .mat-step-text-label{font:var(--dsc-typography-text-standard-600)!important;color:var(--dsc-color-content-neutral-5)!important}\n"] }]
        }], ctorParameters: function () { return [{ type: i1$1.Router }, { type: i1$1.ActivatedRoute }, { type: i2.BreakpointObserver }, { type: i0.Renderer2 }, { type: i0.ChangeDetectorRef }, { type: i0.ElementRef }]; }, propDecorators: { stepper: [{
                type: Input
            }], selectionChange: [{
                type: Output
            }], selectedIndexChange: [{
                type: Output
            }], stepperModelChange: [{
                type: Output
            }], matSteps: [{
                type: ViewChildren,
                args: [MatStep]
            }] } });

/**
 * Generated bundle index. Do not edit.
 */

export { DscStepperComponent };
//# sourceMappingURL=sidsc-components-dsc-stepper.mjs.map
