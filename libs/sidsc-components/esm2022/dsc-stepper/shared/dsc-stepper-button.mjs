import { Directive, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/stepper";
export class CdkStepperNext {
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
export class CdkStepperPrevious {
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
export class CdkStepperReset {
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
export class DscStepperNext extends CdkStepperNext {
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
export class DscStepperPrevious extends CdkStepperPrevious {
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
export class DscStepperReset extends CdkStepperReset {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHNjLXN0ZXBwZXItYnV0dG9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvc2lkc2MtY29tcG9uZW50cy9kc2Mtc3RlcHBlci9zaGFyZWQvZHNjLXN0ZXBwZXItYnV0dG9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7QUFXakQsTUFBTSxPQUFPLGNBQWM7SUFJekIsWUFBbUIsUUFBb0I7UUFBcEIsYUFBUSxHQUFSLFFBQVEsQ0FBWTtRQUh2QyxzRUFBc0U7UUFDN0QsU0FBSSxHQUFXLFFBQVEsQ0FBQztJQUVTLENBQUM7K0dBSmhDLGNBQWM7bUdBQWQsY0FBYzs7NEZBQWQsY0FBYztrQkFSMUIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsNEJBQTRCO29CQUN0QyxVQUFVLEVBQUUsSUFBSTtvQkFDaEIsSUFBSSxFQUFFO3dCQUNKLFFBQVEsRUFBRSxNQUFNO3dCQUNoQixTQUFTLEVBQUUsaUJBQWlCO3FCQUM3QjtpQkFDRjtpR0FHVSxJQUFJO3NCQUFaLEtBQUs7O0FBS1Isb0VBQW9FO0FBU3BFLE1BQU0sT0FBTyxrQkFBa0I7SUFJN0IsWUFBbUIsUUFBb0I7UUFBcEIsYUFBUSxHQUFSLFFBQVEsQ0FBWTtRQUh2QywwRUFBMEU7UUFDakUsU0FBSSxHQUFXLFFBQVEsQ0FBQztJQUVTLENBQUM7K0dBSmhDLGtCQUFrQjttR0FBbEIsa0JBQWtCOzs0RkFBbEIsa0JBQWtCO2tCQVI5QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxnQ0FBZ0M7b0JBQzFDLFVBQVUsRUFBRSxJQUFJO29CQUNoQixJQUFJLEVBQUU7d0JBQ0osUUFBUSxFQUFFLE1BQU07d0JBQ2hCLFNBQVMsRUFBRSxxQkFBcUI7cUJBQ2pDO2lCQUNGO2lHQUdVLElBQUk7c0JBQVosS0FBSzs7QUFZUixNQUFNLE9BQU8sZUFBZTtJQUMxQixZQUFtQixRQUFvQjtRQUFwQixhQUFRLEdBQVIsUUFBUSxDQUFZO0lBQUcsQ0FBQzsrR0FEaEMsZUFBZTttR0FBZixlQUFlOzs0RkFBZixlQUFlO2tCQVAzQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSw2QkFBNkI7b0JBQ3ZDLFVBQVUsRUFBRSxJQUFJO29CQUNoQixJQUFJLEVBQUU7d0JBQ0osU0FBUyxFQUFFLGtCQUFrQjtxQkFDOUI7aUJBQ0Y7O0FBY0QsTUFBTSxPQUFPLGNBQWUsU0FBUSxjQUFjOytHQUFyQyxjQUFjO21HQUFkLGNBQWM7OzRGQUFkLGNBQWM7a0JBVDFCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLDRCQUE0QjtvQkFDdEMsSUFBSSxFQUFFO3dCQUNKLE9BQU8sRUFBRSxrQkFBa0I7d0JBQzNCLFFBQVEsRUFBRSxNQUFNO3FCQUNqQjtvQkFDRCxVQUFVLEVBQUUsSUFBSTtvQkFDaEIsTUFBTSxFQUFFLENBQUMsTUFBTSxDQUFDO2lCQUNqQjs7QUFHRCxvRUFBb0U7QUFVcEUsTUFBTSxPQUFPLGtCQUFtQixTQUFRLGtCQUFrQjsrR0FBN0Msa0JBQWtCO21HQUFsQixrQkFBa0I7OzRGQUFsQixrQkFBa0I7a0JBVDlCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGdDQUFnQztvQkFDMUMsSUFBSSxFQUFFO3dCQUNKLE9BQU8sRUFBRSxzQkFBc0I7d0JBQy9CLFFBQVEsRUFBRSxNQUFNO3FCQUNqQjtvQkFDRCxVQUFVLEVBQUUsSUFBSTtvQkFDaEIsTUFBTSxFQUFFLENBQUMsTUFBTSxDQUFDO2lCQUNqQjs7QUFPRCxNQUFNLE9BQU8sZUFBZ0IsU0FBUSxlQUFlOytHQUF2QyxlQUFlO21HQUFmLGVBQWU7OzRGQUFmLGVBQWU7a0JBSjNCLFNBQVM7bUJBQUM7b0JBQ1QsVUFBVSxFQUFFLElBQUk7b0JBQ2hCLFFBQVEsRUFBRSw2QkFBNkI7aUJBQ3hDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2RrU3RlcHBlciB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zdGVwcGVyJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnZHNjLWJ1dHRvbltjZGtTdGVwcGVyTmV4dF0nLFxuICBzdGFuZGFsb25lOiB0cnVlLFxuICBob3N0OiB7XG4gICAgJ1t0eXBlXSc6ICd0eXBlJyxcbiAgICAnKGNsaWNrKSc6ICdfc3RlcHBlci5uZXh0KCknXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgQ2RrU3RlcHBlck5leHQge1xuICAvKiogVHlwZSBvZiB0aGUgbmV4dCBidXR0b24uIERlZmF1bHRzIHRvIFwic3VibWl0XCIgaWYgbm90IHNwZWNpZmllZC4gKi9cbiAgQElucHV0KCkgdHlwZTogc3RyaW5nID0gJ3N1Ym1pdCc7XG5cbiAgY29uc3RydWN0b3IocHVibGljIF9zdGVwcGVyOiBDZGtTdGVwcGVyKSB7fVxufVxuXG4vKiogQnV0dG9uIHRoYXQgbW92ZXMgdG8gdGhlIHByZXZpb3VzIHN0ZXAgaW4gYSBzdGVwcGVyIHdvcmtmbG93LiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnZHNjLWJ1dHRvbltjZGtTdGVwcGVyUHJldmlvdXNdJyxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbiAgaG9zdDoge1xuICAgICdbdHlwZV0nOiAndHlwZScsXG4gICAgJyhjbGljayknOiAnX3N0ZXBwZXIucHJldmlvdXMoKSdcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBDZGtTdGVwcGVyUHJldmlvdXMge1xuICAvKiogVHlwZSBvZiB0aGUgcHJldmlvdXMgYnV0dG9uLiBEZWZhdWx0cyB0byBcImJ1dHRvblwiIGlmIG5vdCBzcGVjaWZpZWQuICovXG4gIEBJbnB1dCgpIHR5cGU6IHN0cmluZyA9ICdidXR0b24nO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBfc3RlcHBlcjogQ2RrU3RlcHBlcikge31cbn1cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnZHNjLWJ1dHRvbltjZGtTdGVwcGVyUmVzZXRdJyxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbiAgaG9zdDoge1xuICAgICcoY2xpY2spJzogJ19zdGVwcGVyLnJlc2V0KCknXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgQ2RrU3RlcHBlclJlc2V0IHtcbiAgY29uc3RydWN0b3IocHVibGljIF9zdGVwcGVyOiBDZGtTdGVwcGVyKSB7fVxufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdkc2MtYnV0dG9uW2RzY1N0ZXBwZXJOZXh0XScsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LXN0ZXBwZXItbmV4dCcsXG4gICAgJ1t0eXBlXSc6ICd0eXBlJ1xuICB9LFxuICBzdGFuZGFsb25lOiB0cnVlLFxuICBpbnB1dHM6IFsndHlwZSddXG59KVxuZXhwb3J0IGNsYXNzIERzY1N0ZXBwZXJOZXh0IGV4dGVuZHMgQ2RrU3RlcHBlck5leHQge31cblxuLyoqIEJ1dHRvbiB0aGF0IG1vdmVzIHRvIHRoZSBwcmV2aW91cyBzdGVwIGluIGEgc3RlcHBlciB3b3JrZmxvdy4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2RzYy1idXR0b25bZHNjU3RlcHBlclByZXZpb3VzXScsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LXN0ZXBwZXItcHJldmlvdXMnLFxuICAgICdbdHlwZV0nOiAndHlwZSdcbiAgfSxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbiAgaW5wdXRzOiBbJ3R5cGUnXVxufSlcbmV4cG9ydCBjbGFzcyBEc2NTdGVwcGVyUHJldmlvdXMgZXh0ZW5kcyBDZGtTdGVwcGVyUHJldmlvdXMge31cblxuQERpcmVjdGl2ZSh7XG4gIHN0YW5kYWxvbmU6IHRydWUsXG4gIHNlbGVjdG9yOiAnZHNjLWJ1dHRvbltkc2NTdGVwcGVyUmVzZXRdJ1xufSlcbmV4cG9ydCBjbGFzcyBEc2NTdGVwcGVyUmVzZXQgZXh0ZW5kcyBDZGtTdGVwcGVyUmVzZXQge31cbiJdfQ==