import * as i0 from '@angular/core';
import { EventEmitter, Component, ViewEncapsulation, Input, Output, HostBinding } from '@angular/core';
import * as i1 from '@angular/material/icon';
import { MatIconModule } from '@angular/material/icon';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { NgIf, NgForOf } from '@angular/common';

class DscAlertComponent {
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

/**
 * Generated bundle index. Do not edit.
 */

export { DscAlertComponent };
//# sourceMappingURL=sidsc-components-dsc-alert.mjs.map
