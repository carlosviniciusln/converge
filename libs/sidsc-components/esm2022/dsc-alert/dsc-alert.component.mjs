import { Component, EventEmitter, HostBinding, Input, Output, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { NgForOf, NgIf } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/material/icon";
export class DscAlertComponent {
    constructor() {
        this._message = '';
        this._list = [];
        this._showIcon = false;
        this._dismissible = false;
        this._variant = 'info';
        this.linkFunction = new EventEmitter();
        this.display = 'block';
        this._matIconName = 'info';
        this.classes = '';
    }
    get message() {
        return this._message;
    }
    set message(valor) {
        this._message = valor;
    }
    get list() {
        return this._list;
    }
    set list(values) {
        this._list = values;
    }
    get showIcon() {
        return this._showIcon;
    }
    set showIcon(value) {
        this._showIcon = coerceBooleanProperty(value);
    }
    get dismissible() {
        return this._dismissible;
    }
    set dismissible(value) {
        this._dismissible = coerceBooleanProperty(value);
    }
    get variant() {
        return this._variant;
    }
    set variant(variant) {
        this._variant = variant;
        this.matIconName = variant;
    }
    ngOnInit() {
        this.validateMessage();
    }
    ngOnChanges() {
        this.validateMessage();
    }
    get matIconName() {
        return this._matIconName;
    }
    set matIconName(value) {
        switch (value) {
            case 'info':
                this._matIconName = 'info';
                break;
            case 'danger':
                this._matIconName = 'error';
                break;
            case 'success':
                this._matIconName = 'check_circle';
                break;
            case 'warning':
                this._matIconName = 'warning';
                break;
        }
    }
    get ariaLabel() {
        switch (this.variant) {
            case 'info':
                return 'Informação';
            case 'danger':
                return 'Perigo';
            case 'success':
                return 'Sucesso';
            case 'warning':
                return 'Aviso';
        }
    }
    handleClick(event) {
        const target = event.target;
        if (target.tagName === 'A' && target.classList.contains('custom-link')) {
            event.preventDefault();
            this.linkFunction.emit();
        }
    }
    getHeadingTag(level) {
        const valid = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
        return valid.includes(level || '') ? level : 'h3';
    }
    validateMessage() {
        if (!this.message && !this.list?.length) {
            this.display = 'none';
            console.warn("DSC-ALERT: É obrigatório o uso de 'message' ou de 'list'. O atributo não foi enviado.");
        }
        else {
            this.display = 'block';
        }
    }
    getTitleHtml() {
        if (!this.title)
            return '';
        const tag = this.getHeadingTag(this.headingLevelTitle);
        const ariaLevel = tag.startsWith('h') ? tag.replace('h', '') : '';
        return `<${tag} class="dsc-alert-content__title" role="heading" aria-level="${ariaLevel}">
              ${this.title}
            </${tag}>`;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscAlertComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.12", type: DscAlertComponent, isStandalone: true, selector: "dsc-alert", inputs: { title: "title", message: "message", list: "list", showIcon: "showIcon", dismissible: "dismissible", variant: "variant", headingLevelTitle: "headingLevelTitle" }, outputs: { linkFunction: "linkFunction" }, host: { properties: { "style.display": "this.display" } }, usesOnChanges: true, ngImport: i0, template: "<div [class]=\"'dsc-alert dsc-alert-' + variant\">\n  <div class=\"dsc-alert-container\">\n    <mat-icon *ngIf=\"showIcon\"\n              class=\"dsc-alert-icon\"\n              aria-hidden=\"false\"\n              [attr.aria-label]=\"ariaLabel\">\n      {{ matIconName }}\n    </mat-icon>\n    <div class=\"dsc-alert-content\">\n      <span class=\"dsc-alert-content__title\"\n            *ngIf=\"title\" [innerHTML]=\"getTitleHtml()\">\n        {{ title }}\n      </span>\n      <div *ngIf=\"message\">\n        <span class=\"dsc-alert-content__message\">{{ message }}</span>\n      </div>\n\n      <div *ngIf=\"list.length\">\n        <div *ngFor=\"let message of list\">\n          <span class=\"dsc-alert-content__message\" [innerHTML]='message' (click)=\"handleClick($event)\"></span>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n", styles: [".dsc-alert{background:var(--dsc-color-bg-neutral-1);border-radius:var(--dsc-border-radius-nano);padding:var(--dsc-spacing-micro) var(--dsc-spacing-micro) var(--dsc-spacing-micro) var(--dsc-spacing-tiny);position:relative}.dsc-alert-container{display:flex}.dsc-alert-container .alert-icon{height:var(--dsc-icon-size-large);width:var(--dsc-icon-size-large);font-size:var(--dsc-icon-size-large);margin:0 var(--dsc-spacing-tiny) 0 0;display:flex;align-self:center}.dsc-alert-container .alert-close{color:var(--dsc-color-bg-highlight-5)!important;height:var(--dsc-icon-size-medium);width:var(--dsc-icon-size-medium);font-size:var(--dsc-icon-size-medium);cursor:pointer;display:flex;position:relative;right:-5px;top:-5px}.dsc-alert-content{display:flex;flex-direction:column;flex:1;color:var(--dsc-color-content-neutral-4)}.dsc-alert-content__title{font:var(--dsc-typography-text-large-700);font-feature-settings:\"ss01\"}.dsc-alert-content__message{font:var(--dsc-typography-text-standard-400);font-feature-settings:\"ss01\";white-space:pre-line}.dsc-alert-content__message ul{padding-left:20px;margin-block-start:0px;margin-block-end:0px}.dsc-alert-success{border:var(--dsc-border-width-thin) solid var(--dsc-color-border-success-1);border-left:var(--dsc-border-width-strong) solid var(--dsc-color-border-success-1)}.dsc-alert-success .mat-icon{color:var(--dsc-color-bg-success-4);display:flex;align-self:center;margin:0 var(--dsc-spacing-tiny) 0 0}.dsc-alert-danger{border:var(--dsc-border-width-thin) solid var(--dsc-color-border-danger-1);border-left:var(--dsc-border-width-strong) solid var(--dsc-color-border-danger-1)}.dsc-alert-danger .mat-icon{color:var(--dsc-color-bg-danger-4);display:flex;align-self:center;margin:0 var(--dsc-spacing-tiny) 0 0}.dsc-alert-warning{border:var(--dsc-border-width-thin) solid var(--dsc-color-border-warning-1);border-left:var(--dsc-border-width-strong) solid var(--dsc-color-border-warning-1)}.dsc-alert-warning .mat-icon{color:var(--dsc-color-bg-warning-5);display:flex;align-self:center;margin:0 var(--dsc-spacing-tiny) 0 0}.dsc-alert-info{border:var(--dsc-border-width-thin) solid var(--dsc-color-border-information-1);border-left:var(--dsc-border-width-strong) solid var(--dsc-color-border-information-1)}.dsc-alert-info .mat-icon{color:var(--dsc-color-bg-information-4);display:flex;align-self:center;margin:0 var(--dsc-spacing-tiny) 0 0}.dsc-alert .dsc-alert-content .dsc-alert-content__title,.dsc-alert .dsc-alert-content h1.dsc-alert-content__title,.dsc-alert .dsc-alert-content h2.dsc-alert-content__title,.dsc-alert .dsc-alert-content h3.dsc-alert-content__title,.dsc-alert .dsc-alert-content h4.dsc-alert-content__title,.dsc-alert .dsc-alert-content h5.dsc-alert-content__title,.dsc-alert .dsc-alert-content h6.dsc-alert-content__title{all:unset;display:block;margin:0!important;font:var(--dsc-typography-text-large-700)!important;font-feature-settings:\"ss01\"!important;color:var(--dsc-color-content-neutral-4)!important}\n"], dependencies: [{ kind: "ngmodule", type: MatIconModule }, { kind: "component", type: i1.MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }], encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscAlertComponent, decorators: [{
            type: Component,
            args: [{ selector: 'dsc-alert', standalone: true, imports: [MatIconModule, NgIf, NgForOf], encapsulation: ViewEncapsulation.None, template: "<div [class]=\"'dsc-alert dsc-alert-' + variant\">\n  <div class=\"dsc-alert-container\">\n    <mat-icon *ngIf=\"showIcon\"\n              class=\"dsc-alert-icon\"\n              aria-hidden=\"false\"\n              [attr.aria-label]=\"ariaLabel\">\n      {{ matIconName }}\n    </mat-icon>\n    <div class=\"dsc-alert-content\">\n      <span class=\"dsc-alert-content__title\"\n            *ngIf=\"title\" [innerHTML]=\"getTitleHtml()\">\n        {{ title }}\n      </span>\n      <div *ngIf=\"message\">\n        <span class=\"dsc-alert-content__message\">{{ message }}</span>\n      </div>\n\n      <div *ngIf=\"list.length\">\n        <div *ngFor=\"let message of list\">\n          <span class=\"dsc-alert-content__message\" [innerHTML]='message' (click)=\"handleClick($event)\"></span>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n", styles: [".dsc-alert{background:var(--dsc-color-bg-neutral-1);border-radius:var(--dsc-border-radius-nano);padding:var(--dsc-spacing-micro) var(--dsc-spacing-micro) var(--dsc-spacing-micro) var(--dsc-spacing-tiny);position:relative}.dsc-alert-container{display:flex}.dsc-alert-container .alert-icon{height:var(--dsc-icon-size-large);width:var(--dsc-icon-size-large);font-size:var(--dsc-icon-size-large);margin:0 var(--dsc-spacing-tiny) 0 0;display:flex;align-self:center}.dsc-alert-container .alert-close{color:var(--dsc-color-bg-highlight-5)!important;height:var(--dsc-icon-size-medium);width:var(--dsc-icon-size-medium);font-size:var(--dsc-icon-size-medium);cursor:pointer;display:flex;position:relative;right:-5px;top:-5px}.dsc-alert-content{display:flex;flex-direction:column;flex:1;color:var(--dsc-color-content-neutral-4)}.dsc-alert-content__title{font:var(--dsc-typography-text-large-700);font-feature-settings:\"ss01\"}.dsc-alert-content__message{font:var(--dsc-typography-text-standard-400);font-feature-settings:\"ss01\";white-space:pre-line}.dsc-alert-content__message ul{padding-left:20px;margin-block-start:0px;margin-block-end:0px}.dsc-alert-success{border:var(--dsc-border-width-thin) solid var(--dsc-color-border-success-1);border-left:var(--dsc-border-width-strong) solid var(--dsc-color-border-success-1)}.dsc-alert-success .mat-icon{color:var(--dsc-color-bg-success-4);display:flex;align-self:center;margin:0 var(--dsc-spacing-tiny) 0 0}.dsc-alert-danger{border:var(--dsc-border-width-thin) solid var(--dsc-color-border-danger-1);border-left:var(--dsc-border-width-strong) solid var(--dsc-color-border-danger-1)}.dsc-alert-danger .mat-icon{color:var(--dsc-color-bg-danger-4);display:flex;align-self:center;margin:0 var(--dsc-spacing-tiny) 0 0}.dsc-alert-warning{border:var(--dsc-border-width-thin) solid var(--dsc-color-border-warning-1);border-left:var(--dsc-border-width-strong) solid var(--dsc-color-border-warning-1)}.dsc-alert-warning .mat-icon{color:var(--dsc-color-bg-warning-5);display:flex;align-self:center;margin:0 var(--dsc-spacing-tiny) 0 0}.dsc-alert-info{border:var(--dsc-border-width-thin) solid var(--dsc-color-border-information-1);border-left:var(--dsc-border-width-strong) solid var(--dsc-color-border-information-1)}.dsc-alert-info .mat-icon{color:var(--dsc-color-bg-information-4);display:flex;align-self:center;margin:0 var(--dsc-spacing-tiny) 0 0}.dsc-alert .dsc-alert-content .dsc-alert-content__title,.dsc-alert .dsc-alert-content h1.dsc-alert-content__title,.dsc-alert .dsc-alert-content h2.dsc-alert-content__title,.dsc-alert .dsc-alert-content h3.dsc-alert-content__title,.dsc-alert .dsc-alert-content h4.dsc-alert-content__title,.dsc-alert .dsc-alert-content h5.dsc-alert-content__title,.dsc-alert .dsc-alert-content h6.dsc-alert-content__title{all:unset;display:block;margin:0!important;font:var(--dsc-typography-text-large-700)!important;font-feature-settings:\"ss01\"!important;color:var(--dsc-color-content-neutral-4)!important}\n"] }]
        }], propDecorators: { title: [{
                type: Input
            }], message: [{
                type: Input
            }], list: [{
                type: Input
            }], showIcon: [{
                type: Input
            }], dismissible: [{
                type: Input
            }], variant: [{
                type: Input
            }], headingLevelTitle: [{
                type: Input
            }], linkFunction: [{
                type: Output
            }], display: [{
                type: HostBinding,
                args: ['style.display']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHNjLWFsZXJ0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL3NpZHNjLWNvbXBvbmVudHMvZHNjLWFsZXJ0L2RzYy1hbGVydC5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9zaWRzYy1jb21wb25lbnRzL2RzYy1hbGVydC9kc2MtYWxlcnQuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBcUIsTUFBTSxFQUFpQixpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6SSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFnQixxQkFBcUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQzVFLE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0saUJBQWlCLENBQUM7OztBQVloRCxNQUFNLE9BQU8saUJBQWlCO0lBUjlCO1FBc0JFLGFBQVEsR0FBVyxFQUFFLENBQUM7UUFXdEIsVUFBSyxHQUFhLEVBQUUsQ0FBQztRQVdiLGNBQVMsR0FBRyxLQUFLLENBQUM7UUFXbEIsaUJBQVksR0FBRyxLQUFLLENBQUM7UUFjN0IsYUFBUSxHQUFvQixNQUFNLENBQUM7UUFFekIsaUJBQVksR0FBRyxJQUFJLFlBQVksRUFBUSxDQUFDO1FBSWxELFlBQU8sR0FBRyxPQUFPLENBQUM7UUErQmxCLGlCQUFZLEdBQVcsTUFBTSxDQUFDO1FBRTlCLFlBQU8sR0FBRyxFQUFFLENBQUM7S0FnRGQ7SUEvSUMsSUFDSSxPQUFPO1FBQ1QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxJQUFJLE9BQU8sQ0FBQyxLQUFhO1FBQ3ZCLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO0lBQ3hCLENBQUM7SUFJRCxJ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dCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSG9zdEJpbmRpbmcsIElucHV0LCBPbkNoYW5nZXMsIE9uSW5pdCwgT3V0cHV0LCBTaW1wbGVDaGFuZ2VzLCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTWF0SWNvbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2ljb24nO1xuaW1wb3J0IHsgQm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHkgfSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHsgTmdGb3JPZiwgTmdJZiB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmV4cG9ydCB0eXBlIERzY0FsZXJ0VmFyaWFudCA9ICdzdWNjZXNzJyB8ICdkYW5nZXInIHwgJ3dhcm5pbmcnIHwgJ2luZm8nO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdkc2MtYWxlcnQnLFxuICBzdGFuZGFsb25lOiB0cnVlLFxuICBpbXBvcnRzOiBbTWF0SWNvbk1vZHVsZSwgTmdJZiwgTmdGb3JPZl0sXG4gIHRlbXBsYXRlVXJsOiAnLi9kc2MtYWxlcnQuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9kc2MtYWxlcnQuY29tcG9uZW50LnNjc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxufSlcbmV4cG9ydCBjbGFzcyBEc2NBbGVydENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcblxuICBASW5wdXQoKVxuICB0aXRsZT86IHN0cmluZztcblxuICBASW5wdXQoKVxuICBnZXQgbWVzc2FnZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fbWVzc2FnZTtcbiAgfVxuXG4gIHNldCBtZXNzYWdlKHZhbG9yOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9tZXNzYWdlID0gdmFsb3I7XG4gIH1cblxuICBfbWVzc2FnZTogc3RyaW5nID0gJyc7XG5cbiAgQElucHV0KClcbiAgZ2V0IGxpc3QoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xpc3Q7XG4gIH1cblxuICBzZXQgbGlzdCh2YWx1ZXM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5fbGlzdCA9IHZhbHVlcztcbiAgfVxuXG4gIF9saXN0OiBzdHJpbmdbXSA9IFtdO1xuXG4gIEBJbnB1dCgpXG4gIGdldCBzaG93SWNvbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fc2hvd0ljb247XG4gIH1cblxuICBzZXQgc2hvd0ljb24odmFsdWU6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX3Nob3dJY29uID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuXG4gIHByaXZhdGUgX3Nob3dJY29uID0gZmFsc2U7XG5cbiAgQElucHV0KClcbiAgZ2V0IGRpc21pc3NpYmxlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9kaXNtaXNzaWJsZTtcbiAgfVxuXG4gIHNldCBkaXNtaXNzaWJsZSh2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy5fZGlzbWlzc2libGUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG5cbiAgcHJpdmF0ZSBfZGlzbWlzc2libGUgPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICBnZXQgdmFyaWFudCgpOiBEc2NBbGVydFZhcmlhbnQge1xuICAgIHJldHVybiB0aGlzLl92YXJpYW50O1xuICB9XG5cbiAgc2V0IHZhcmlhbnQodmFyaWFudDogRHNjQWxlcnRWYXJpYW50KSB7XG4gICAgdGhpcy5fdmFyaWFudCA9IHZhcmlhbnQ7XG4gICAgdGhpcy5tYXRJY29uTmFtZSA9IHZhcmlhbnQ7XG4gIH1cblxuICBASW5wdXQoKSBoZWFkaW5nTGV2ZWxUaXRsZT86IHN0cmluZztcblxuICBfdmFyaWFudDogRHNjQWxlcnRWYXJpYW50ID0gJ2luZm8nO1xuXG4gIEBPdXRwdXQoKSBsaW5rRnVuY3Rpb24gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgQEhvc3RCaW5kaW5nKCdzdHlsZS5kaXNwbGF5JylcblxuICBkaXNwbGF5ID0gJ2Jsb2NrJztcblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLnZhbGlkYXRlTWVzc2FnZSgpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoKTogdm9pZCB7XG4gICAgdGhpcy52YWxpZGF0ZU1lc3NhZ2UoKTtcbiAgfVxuXG4gIGdldCBtYXRJY29uTmFtZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9tYXRJY29uTmFtZTtcbiAgfVxuXG4gIHNldCBtYXRJY29uTmFtZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgc3dpdGNoICh2YWx1ZSkge1xuICAgICAgY2FzZSAnaW5mbyc6XG4gICAgICAgIHRoaXMuX21hdEljb25OYW1lID0gJ2luZm8nO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2Rhbmdlcic6XG4gICAgICAgIHRoaXMuX21hdEljb25OYW1lID0gJ2Vycm9yJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzdWNjZXNzJzpcbiAgICAgICAgdGhpcy5fbWF0SWNvbk5hbWUgPSAnY2hlY2tfY2lyY2xlJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd3YXJuaW5nJzpcbiAgICAgICAgdGhpcy5fbWF0SWNvbk5hbWUgPSAnd2FybmluZyc7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIF9tYXRJY29uTmFtZTogc3RyaW5nID0gJ2luZm8nO1xuXG4gIGNsYXNzZXMgPSAnJztcblxuICBnZXQgYXJpYUxhYmVsKCk6IHN0cmluZyB7XG4gICAgc3dpdGNoICh0aGlzLnZhcmlhbnQpIHtcbiAgICAgIGNhc2UgJ2luZm8nOlxuICAgICAgICByZXR1cm4gJ0luZm9ybWHDp8Ojbyc7XG4gICAgICBjYXNlICdkYW5nZXInOlxuICAgICAgICByZXR1cm4gJ1Blcmlnbyc7XG4gICAgICBjYXNlICdzdWNjZXNzJzpcbiAgICAgICAgcmV0dXJuICdTdWNlc3NvJztcbiAgICAgIGNhc2UgJ3dhcm5pbmcnOlxuICAgICAgICByZXR1cm4gJ0F2aXNvJztcbiAgICB9XG4gIH1cblxuICBoYW5kbGVDbGljayhldmVudDogRXZlbnQpIHtcbiAgICBjb25zdCB0YXJnZXQgPSBldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XG5cbiAgICBpZiAodGFyZ2V0LnRhZ05hbWUgPT09ICdBJyAmJiB0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjdXN0b20tbGluaycpKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdGhpcy5saW5rRnVuY3Rpb24uZW1pdCgpO1xuICAgIH1cbiAgfVxuXG4gIFxuICBwcml2YXRlIGdldEhlYWRpbmdUYWcobGV2ZWw/OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IHZhbGlkID0gWydoMScsICdoMicsICdoMycsICdoNCcsICdoNScsICdoNiddO1xuICAgIHJldHVybiB2YWxpZC5pbmNsdWRlcyhsZXZlbCB8fCAnJykgPyBsZXZlbCEgOiAnaDMnO1xuICB9XG5cbiAgcHJpdmF0ZSB2YWxpZGF0ZU1lc3NhZ2UoKSB7XG4gICAgaWYgKCF0aGlzLm1lc3NhZ2UgJiYgIXRoaXMubGlzdD8ubGVuZ3RoKSB7XG4gICAgICB0aGlzLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICBjb25zb2xlLndhcm4oXCJEU0MtQUxFUlQ6IMOJIG9icmlnYXTDs3JpbyBvIHVzbyBkZSAnbWVzc2FnZScgb3UgZGUgJ2xpc3QnLiBPIGF0cmlidXRvIG7Do28gZm9pIGVudmlhZG8uXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgIH1cbiAgfVxuXG4gIGdldFRpdGxlSHRtbCgpOiBzdHJpbmcge1xuICAgIGlmICghdGhpcy50aXRsZSkgcmV0dXJuICcnO1xuICAgIGNvbnN0IHRhZyA9IHRoaXMuZ2V0SGVhZGluZ1RhZyh0aGlzLmhlYWRpbmdMZXZlbFRpdGxlKTtcbiAgICBjb25zdCBhcmlhTGV2ZWwgPSB0YWcuc3RhcnRzV2l0aCgnaCcpID8gdGFnLnJlcGxhY2UoJ2gnLCAnJykgOiAnJztcbiAgICByZXR1cm4gYDwke3RhZ30gY2xhc3M9XCJkc2MtYWxlcnQtY29udGVudF9fdGl0bGVcIiByb2xlPVwiaGVhZGluZ1wiIGFyaWEtbGV2ZWw9XCIke2FyaWFMZXZlbH1cIj5cbiAgICAgICAgICAgICAgJHt0aGlzLnRpdGxlfVxuICAgICAgICAgICAgPC8ke3RhZ30+YDtcbiAgfVxuXG59XG4iLCI8ZGl2IFtjbGFzc109XCInZHNjLWFsZXJ0IGRzYy1hbGVydC0nICsgdmFyaWFudFwiPlxuICA8ZGl2IGNsYXNzPVwiZHNjLWFsZXJ0LWNvbnRhaW5lclwiPlxuICAgIDxtYXQtaWNvbiAqbmdJZj1cInNob3dJY29uXCJcbiAgICAgICAgICAgICAgY2xhc3M9XCJkc2MtYWxlcnQtaWNvblwiXG4gICAgICAgICAgICAgIGFyaWEtaGlkZGVuPVwiZmFsc2VcIlxuICAgICAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImFyaWFMYWJlbFwiPlxuICAgICAge3sgbWF0SWNvbk5hbWUgfX1cbiAgICA8L21hdC1pY29uPlxuICAgIDxkaXYgY2xhc3M9XCJkc2MtYWxlcnQtY29udGVudFwiPlxuICAgICAgPHNwYW4gY2xhc3M9XCJkc2MtYWxlcnQtY29udGVudF9fdGl0bGVcIlxuICAgICAgICAgICAgKm5nSWY9XCJ0aXRsZVwiIFtpbm5lckhUTUxdPVwiZ2V0VGl0bGVIdG1sKClcIj5cbiAgICAgICAge3sgdGl0bGUgfX1cbiAgICAgIDwvc3Bhbj5cbiAgICAgIDxkaXYgKm5nSWY9XCJtZXNzYWdlXCI+XG4gICAgICAgIDxzcGFuIGNsYXNzPVwiZHNjLWFsZXJ0LWNvbnRlbnRfX21lc3NhZ2VcIj57eyBtZXNzYWdlIH19PC9zcGFuPlxuICAgICAgPC9kaXY+XG5cbiAgICAgIDxkaXYgKm5nSWY9XCJsaXN0Lmxlbmd0aFwiPlxuICAgICAgICA8ZGl2ICpuZ0Zvcj1cImxldCBtZXNzYWdlIG9mIGxpc3RcIj5cbiAgICAgICAgICA8c3BhbiBjbGFzcz1cImRzYy1hbGVydC1jb250ZW50X19tZXNzYWdlXCIgW2lubmVySFRNTF09J21lc3NhZ2UnIChjbGljayk9XCJoYW5kbGVDbGljaygkZXZlbnQpXCI+PC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbjwvZGl2PlxuIl19