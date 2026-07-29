import { Component, EventEmitter, inject, Input, LOCALE_ID, Output } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { FieldErrorMessengerService } from './services/field-error-messenger.service';
import { BaseControlValueAccessor } from './base-control-value-accessor';
import { CustomErrorStateMatcher } from './custom-error-state-matcher';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
registerLocaleData(localePt, 'pt');
export class BaseComponent extends BaseControlValueAccessor {
    get type() {
        return this._type;
    }
    set type(value) {
        this.isPasswordField = value === 'password';
        this._type = value;
    }
    get size() {
        return this._size;
    }
    set size(value) {
        this._size = value;
        this.formFieldLabelSize = `mat-label--${value}`;
        this.formFieldSize = `mat-mdc-form-field--${value}`;
        this.selectOptionSize = `mat-mdc-select-panel--${value}`;
        this.selectOption = `mat-mdc-option--${value}`;
    }
    get maxlength() {
        return this._maxlength;
    }
    set maxlength(value) {
        const length = typeof value === 'string' ? parseInt(value) : value;
        if (!Number.isNaN(length) && Number.isInteger(length))
            this._maxlength = length;
    }
    constructor(_ngControl, _parentForm, _parentFormGroup) {
        super();
        this._ngControl = _ngControl;
        this._parentForm = _parentForm;
        this._parentFormGroup = _parentFormGroup;
        this.errorMessageService = inject(FieldErrorMessengerService);
        this.blur = new EventEmitter();
        this.formFieldHint = '';
        this.showIconPassword = true;
        this.readOnly = false;
        this._type = 'text';
        this.isPasswordField = false;
        this._size = 'standard';
        this.formFieldLabelSize = 'mat-label--standard';
        this.formFieldSize = 'mat-mdc-form-field--standard';
        this.selectOptionSize = 'mat-mdc-select-panel--standard';
        this.selectOption = 'mat-mdc-option--standard';
        this._maxlength = 45;
        this.matcher = new CustomErrorStateMatcher(this._ngControl, this._parentForm, this._parentFormGroup);
    }
    get errorText() {
        return this.errorMessageService.getErrorMessage(this._ngControl, this.errorMessage);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: BaseComponent, deps: [{ token: i1.NgControl }, { token: i1.NgForm }, { token: i1.FormGroupDirective }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.12", type: BaseComponent, isStandalone: true, selector: "ng-component", inputs: { label: "label", labelHint: "labelHint", labelHintTooltip: "labelHintTooltip", name: "name", placeholder: "placeholder", formFieldHint: "formFieldHint", errorMessage: "errorMessage", showIconPassword: "showIconPassword", readOnly: "readOnly", ariaDescribedby: ["aria-describedby", "ariaDescribedby"], ariaLabel: ["aria-label", "ariaLabel"], ariaLabelledby: ["aria-labelledby", "ariaLabelledby"], type: "type", size: "size", maxlength: "maxlength" }, outputs: { blur: "blur" }, providers: [{ provide: LOCALE_ID, useValue: 'pt' }], usesInheritance: true, ngImport: i0, template: '', isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: BaseComponent, decorators: [{
            type: Component,
            args: [{
                    template: '',
                    standalone: true,
                    providers: [{ provide: LOCALE_ID, useValue: 'pt' }]
                }]
        }], ctorParameters: function () { return [{ type: i1.NgControl }, { type: i1.NgForm }, { type: i1.FormGroupDirective }]; }, propDecorators: { blur: [{
                type: Output
            }], label: [{
                type: Input
            }], labelHint: [{
                type: Input
            }], labelHintTooltip: [{
                type: Input
            }], name: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], formFieldHint: [{
                type: Input
            }], errorMessage: [{
                type: Input
            }], showIconPassword: [{
                type: Input
            }], readOnly: [{
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
            }], type: [{
                type: Input
            }], size: [{
                type: Input
            }], maxlength: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1jb21wb25lbnQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvc2lkc2MtY29tcG9uZW50cy9jb3JlL2Jhc2UtY29tcG9uZW50LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFMUYsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFckQsT0FBTyxRQUFRLE1BQU0sNEJBQTRCLENBQUM7QUFFbEQsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0sMENBQTBDLENBQUM7QUFDdEYsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDekUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sOEJBQThCLENBQUM7OztBQUV2RSxrQkFBa0IsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFXbkMsTUFBTSxPQUFPLGFBQWlCLFNBQVEsd0JBQTJCO0lBNkIvRCxJQUNJLElBQUk7UUFDTixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDcEIsQ0FBQztJQUVELElBQUksSUFBSSxDQUFDLEtBQVc7UUFDbEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLEtBQUssVUFBVSxDQUFDO1FBQzVDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ3JCLENBQUM7SUFNRCxJQUNJLElBQUk7UUFDTixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDcEIsQ0FBQztJQUVELElBQUksSUFBSSxDQUFDLEtBQVc7UUFDbEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLGtCQUFrQixHQUFHLGNBQWMsS0FBSyxFQUFFLENBQUM7UUFD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QWlCO2dCQUdwQixJQUFJO3NCQURQLEtBQUs7Z0JBZUYsSUFBSTtzQkFEUCxLQUFLO2dCQXdCRixTQUFTO3NCQURaLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgaW5qZWN0LCBJbnB1dCwgTE9DQUxFX0lELCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1Hcm91cERpcmVjdGl2ZSwgTmdDb250cm9sLCBOZ0Zvcm0gfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyByZWdpc3RlckxvY2FsZURhdGEgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5pbXBvcnQgbG9jYWxlUHQgZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2xvY2FsZXMvcHQnO1xuXG5pbXBvcnQgeyBGaWVsZEVycm9yTWVzc2VuZ2VyU2VydmljZSB9IGZyb20gJy4vc2VydmljZXMvZmllbGQtZXJyb3ItbWVzc2VuZ2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgQmFzZUNvbnRyb2xWYWx1ZUFjY2Vzc29yIH0gZnJvbSAnLi9iYXNlLWNvbnRyb2wtdmFsdWUtYWNjZXNzb3InO1xuaW1wb3J0IHsgQ3VzdG9tRXJyb3JTdGF0ZU1hdGNoZXIgfSBmcm9tICcuL2N1c3RvbS1lcnJvci1zdGF0ZS1tYXRjaGVyJztcblxucmVnaXN0ZXJMb2NhbGVEYXRhKGxvY2FsZVB0LCAncHQnKTtcblxudHlwZSBTaXplID0gJ2xhcmdlJyB8ICdzdGFuZGFyZCcgfCAnc21hbGwnO1xuXG50eXBlIFR5cGUgPSAndGV4dCcgfCAncGFzc3dvcmQnIHwgJ251bWJlcic7XG5cbkBDb21wb25lbnQoe1xuICB0ZW1wbGF0ZTogJycsXG4gIHN0YW5kYWxvbmU6IHRydWUsXG4gIHByb3ZpZGVyczogW3sgcHJvdmlkZTogTE9DQUxFX0lELCB1c2VWYWx1ZTogJ3B0JyB9XVxufSlcbmV4cG9ydCBjbGFzcyBCYXNlQ29tcG9uZW50PFQ+IGV4dGVuZHMgQmFzZUNvbnRyb2xWYWx1ZUFjY2Vzc29yPFQ+IHtcbiAgcHJvdGVjdGVkIGVycm9yTWVzc2FnZVNlcnZpY2UgPSBpbmplY3QoRmllbGRFcnJvck1lc3NlbmdlclNlcnZpY2UpO1xuXG4gIEBPdXRwdXQoKSBibHVyOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIEBJbnB1dCgpIGxhYmVsPzogc3RyaW5nO1xuXG4gIEBJbnB1dCgpIGxhYmVsSGludD86IHN0cmluZztcblxuICBASW5wdXQoKSBsYWJlbEhpbnRUb29sdGlwPzogc3RyaW5nO1xuXG4gIEBJbnB1dCgpIG5hbWUhOiBzdHJpbmc7XG5cbiAgQElucHV0KCkgcGxhY2Vob2xkZXIhOiBzdHJpbmc7XG5cbiAgQElucHV0KCkgZm9ybUZpZWxkSGludCA9ICcnO1xuXG4gIEBJbnB1dCgpIGVycm9yTWVzc2FnZT86IHN0cmluZztcblxuICBASW5wdXQoKSBzaG93SWNvblBhc3N3b3JkOiBib29sZWFuID0gdHJ1ZTtcblxuICBASW5wdXQoKSByZWFkT25seTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIEBJbnB1dCgnYXJpYS1kZXNjcmliZWRieScpIGFyaWFEZXNjcmliZWRieSE6IHN0cmluZ1xuXG4gIEBJbnB1dCgnYXJpYS1sYWJlbCcpIGFyaWFMYWJlbCE6IHN0cmluZ1xuXG4gIEBJbnB1dCgnYXJpYS1sYWJlbGxlZGJ5JykgYXJpYUxhYmVsbGVkYnkhOiBzdHJpbmcgfCBudWxsXG5cbiAgQElucHV0KClcbiAgZ2V0IHR5cGUoKTogVHlwZSB7XG4gICAgcmV0dXJuIHRoaXMuX3R5cGU7XG4gIH1cblxuICBzZXQgdHlwZSh2YWx1ZTogVHlwZSkge1xuICAgIHRoaXMuaXNQYXNzd29yZEZpZWxkID0gdmFsdWUgPT09ICdwYXNzd29yZCc7XG4gICAgdGhpcy5fdHlwZSA9IHZhbHVlO1xuICB9XG5cbiAgcHJpdmF0ZSBfdHlwZTogVHlwZSA9ICd0ZXh0JztcblxuICBwcm90ZWN0ZWQgaXNQYXNzd29yZEZpZWxkID0gZmFsc2U7XG5cbiAgQElucHV0KClcbiAgZ2V0IHNpemUoKTogU2l6ZSB7XG4gICAgcmV0dXJuIHRoaXMuX3NpemU7XG4gIH1cblxuICBzZXQgc2l6ZSh2YWx1ZTogU2l6ZSkge1xuICAgIHRoaXMuX3NpemUgPSB2YWx1ZTtcbiAgICB0aGlzLmZvcm1GaWVsZExhYmVsU2l6ZSA9IGBtYXQtbGFiZWwtLSR7dmFsdWV9YDtcbiAgICB0aGlzLmZvcm1GaWVsZFNpemUgPSBgbWF0LW1kYy1mb3JtLWZpZWxkLS0ke3ZhbHVlfWA7XG4gICAgdGhpcy5zZWxlY3RPcHRpb25TaXplID0gYG1hdC1tZGMtc2VsZWN0LXBhbmVsLS0ke3ZhbHVlfWA7XG4gICAgdGhpcy5zZWxlY3RPcHRpb24gPSBgbWF0LW1kYy1vcHRpb24tLSR7dmFsdWV9YDtcbiAgfVxuXG4gIHByaXZhdGUgX3NpemU6IFNpemUgPSAnc3RhbmRhcmQnO1xuXG4gIHByb3RlY3RlZCBmb3JtRmllbGRMYWJlbFNpemUgPSAnbWF0LWxhYmVsLS1zdGFuZGFyZCc7XG5cbiAgcHJvdGVjdGVkIGZvcm1GaWVsZFNpemUgPSAnbWF0LW1kYy1mb3JtLWZpZWxkLS1zdGFuZGFyZCc7XG5cbiAgcHJvdGVjdGVkIHNlbGVjdE9wdGlvblNpemUgPSAnbWF0LW1kYy1zZWxlY3QtcGFuZWwtLXN0YW5kYXJkJztcblxuICBwcm90ZWN0ZWQgc2VsZWN0T3B0aW9uID0gJ21hdC1tZGMtb3B0aW9uLS1zdGFuZGFyZCc7XG5cbiAgQElucHV0KClcbiAgZ2V0IG1heGxlbmd0aCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9tYXhsZW5ndGg7XG4gIH1cbiAgc2V0IG1heGxlbmd0aCh2YWx1ZTogbnVtYmVyIHwgc3RyaW5nKSB7XG4gICAgY29uc3QgbGVuZ3RoID0gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyA/IHBhcnNlSW50KHZhbHVlKSA6IHZhbHVlO1xuICAgIGlmICghTnVtYmVyLmlzTmFOKGxlbmd0aCkgJiYgTnVtYmVyLmlzSW50ZWdlcihsZW5ndGgpKSB0aGlzLl9tYXhsZW5ndGggPSBsZW5ndGg7XG4gIH1cblxuICBwcml2YXRlIF9tYXhsZW5ndGggPSA0NTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9uZ0NvbnRyb2w6IE5nQ29udHJvbCwgcHJpdmF0ZSBfcGFyZW50Rm9ybTogTmdGb3JtLCBwcml2YXRlIF9wYXJlbnRGb3JtR3JvdXA6IEZvcm1Hcm91cERpcmVjdGl2ZSkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgbWF0Y2hlciA9IG5ldyBDdXN0b21FcnJvclN0YXRlTWF0Y2hlcih0aGlzLl9uZ0NvbnRyb2wsIHRoaXMuX3BhcmVudEZvcm0sIHRoaXMuX3BhcmVudEZvcm1Hcm91cCk7XG5cbiAgZ2V0IGVycm9yVGV4dCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmVycm9yTWVzc2FnZVNlcnZpY2UuZ2V0RXJyb3JNZXNzYWdlKHRoaXMuX25nQ29udHJvbCwgdGhpcy5lcnJvck1lc3NhZ2UpO1xuICB9XG59XG4iXX0=