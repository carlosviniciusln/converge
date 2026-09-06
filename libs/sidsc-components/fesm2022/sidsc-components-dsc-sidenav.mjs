import * as i0 from '@angular/core';
import { EventEmitter, Component, ViewEncapsulation, Input, Output } from '@angular/core';
import * as i2$1 from '@angular/material/sidenav';
import { MatSidenavModule } from '@angular/material/sidenav';
import * as i2 from '@angular/material/list';
import { MatListModule } from '@angular/material/list';
import { NgClass, NgIf, NgForOf } from '@angular/common';
import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import * as i4 from '@angular/forms';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { map, distinctUntilChanged, debounceTime, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DscInputComponent } from 'sidsc-components/dsc-input';
import { isNotEmptyArray, isEmptyArray, replaceAccents } from 'sidsc-components/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import * as i1 from '@angular/router';
import { RouterLink } from '@angular/router';
import * as i3 from '@angular/material/icon';
import { MatIconModule } from '@angular/material/icon';

class DscSidenavItemComponent {
    constructor(_router) {
        this._router = _router;
        this.isNotEmptyArray = isNotEmptyArray;
        this.expandedMenu = null;
        this.onClick = new EventEmitter();
        this.expandChange = new EventEmitter();
        this.expanded = false;
        this.selectedKey = null;
        this.selectedKeyChange = new EventEmitter();
        if (this.depth === undefined)
            this.depth = 0;
    }
    ngOnInit() {
        this._checkIfSelected(this.menu);
        if ('expanded' in this.menu && isNotEmptyArray(this.menu.children))
            this._expand(!!this.menu.expanded);
    }
    isActive(menu) {
        if (menu?.url) {
            return this._isSelected(menu.url);
        }
        else if (menu?.customActiveCondition) {
            return menu.customActiveCondition(menu);
        }
        return false;
    }
    _checkIfSelected(menu) {
        if (menu.disabled)
            return false;
        if (menu.url) {
            return this._isSelected(menu.url);
        }
        else {
            const isSelected = menu.children?.some(child => this._checkIfSelected(child));
            this._expand(isSelected);
            return isSelected;
        }
    }
    _isSelected(menu) {
        const url = this._router.url;
        const menuUrl = url.split('#')[0].toString();
        return menu === menuUrl;
    }
    expand(item) {
        if (!item.disabled) {
            this._expand(!this.expanded);
            this.expandChange.emit(item);
        }
    }
    _expand(value) {
        this.expanded = value;
        this.ariaExpanded = value;
    }
    onExpandChange(item) {
        this.expandedMenu = this.expandedMenu === item ? null : item;
    }
    onSelected(item) {
        if (!item.disabled && isNotEmptyArray(item.children)) {
            this.expandChange.emit(item);
        }
    }
    onSpace(event, menu) {
        event.preventDefault();
        event.stopPropagation();
        this.expand(menu);
    }
    onMenuItemClick(menu) {
        this.onClick.emit(menu);
    }
    ngOnDestroy() {
        if (this._navSubscription)
            this._navSubscription.unsubscribe();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscSidenavItemComponent, deps: [{ token: i1.Router }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.12", type: DscSidenavItemComponent, isStandalone: true, selector: "dsc-sidenav-item", inputs: { menu: "menu", depth: "depth", expanded: "expanded", selectedKey: "selectedKey", ariaExpanded: "ariaExpanded" }, outputs: { onClick: "onClick", expandChange: "expandChange", selectedKeyChange: "selectedKeyChange" }, ngImport: i0, template: "<a *ngIf=\"isNotEmptyArray(menu.children); else routeTemplate\"\n   (keyup.enter)=\"expand(menu)\"\n   (keydown.space)=\"onSpace($any($event), menu)\"\n   (click)=\"expand(menu); $event.preventDefault(); onMenuItemClick(menu)\"\n   [routerLink]=\"undefined\"\n   [activated]=\"isActive(menu)\"\n   [disabled]=\"menu.disabled\"\n   [ngClass]=\"{\n    'expanded': expanded,\n    'mdc-list-item__second-level': depth === 1\n   }\"\n   [attr.aria-expanded]=\"ariaExpanded\"\n   [class.mdc-list-item__first-level--padding-with-icon]=\"depth === 0 && menu.icon\"\n   [class.mdc-list-item__first-level--padding-without-icon]=\"depth === 0 && !menu.icon\"\n   [class.mdc-list-item__second-level--padding-with-icon]=\"depth === 1 && menu.icon\"\n   [class.mdc-list-item__second-level--padding-without-icon]=\"depth === 1 && !menu.icon\"\n   mat-list-item\n   class=\"mat-mdc-list-item__collapsible\"\n   disableRipple=\"true\"\n   tabindex=\"0\"\n   role=\"button\">\n  <mat-icon class=\"mat-mdc-list-item__icon\"\n            *ngIf=\"menu.icon\">\n    {{ menu.icon }}\n  </mat-icon>\n  <span class=\"mat-mdc-list-item__name\">{{ menu.title }}</span>\n  <span class=\"mat-mdc-list-item__spacer\"></span>\n  <span class=\"mat-mdc-list-item__arrow-icon\">\n    <mat-icon [@indicatorRotate]=\"expanded ? 'expanded' : 'collapsed'\">\n      expand_more\n    </mat-icon>\n  </span>\n</a>\n\n<ng-template #routeTemplate>\n  <a mat-list-item\n     class=\"mat-mdc-list-item\"\n     disableRipple=\"true\"\n     *ngIf=\"menu.url\"\n     [routerLink]=\"!menu.disabled ? menu.url : undefined\"\n     [disabled]=\"menu.disabled\"\n     [activated]=\"isActive(menu)\"\n     (click)=\"onMenuItemClick(menu)\"\n     [attr.aria-expanded]=\"ariaExpanded\"\n     [ngClass]=\"{\n      'mdc-list-item__second-level': depth === 1,\n      'mdc-list-item__third-level': depth === 2\n     }\"\n     [class.mdc-list-item__first-level--padding-with-icon]=\"depth === 0 && menu.icon\"\n     [class.mdc-list-item__first-level--padding-without-icon]=\"depth === 0 && !menu.icon\"\n     [class.mdc-list-item__second-level--padding-with-icon]=\"depth === 1 && menu.icon\"\n     [class.mdc-list-item__second-level--padding-without-icon]=\"depth === 1 && !menu.icon\"\n     tabindex=\"0\"\n     role=\"button\">\n    <mat-icon class=\"mat-mdc-list-item__icon\"\n              *ngIf=\"menu.icon\">\n      {{ menu.icon }}\n    </mat-icon>\n    <span class=\"mat-mdc-list-item__name\">{{ menu.title }}</span>\n  </a>\n\n  <a mat-list-item\n    class=\"mat-mdc-list-item\"\n    disableRipple=\"true\"\n    *ngIf=\"menu.externalUrl\"\n    [href]=\"menu.externalUrl\"\n    target=\"_blank\"\n    (click)=\"onMenuItemClick(menu)\"\n    [attr.aria-expanded]=\"ariaExpanded\"\n    [ngClass]=\"{\n      'mdc-list-item__second-level': depth === 1,\n      'mdc-list-item__third-level': depth === 2\n    }\"\n    [class.mdc-list-item__first-level--padding-with-icon]=\"depth === 0 && menu.icon\"\n    [class.mdc-list-item__first-level--padding-without-icon]=\"depth === 0 && !menu.icon\"\n    [class.mdc-list-item__second-level--padding-with-icon]=\"depth === 1 && menu.icon\"\n    [class.mdc-list-item__second-level--padding-without-icon]=\"depth === 1 && !menu.icon\"\n    role=\"button\">\n    <mat-icon class=\"mat-mdc-list-item__icon\"\n              *ngIf=\"menu.icon\">\n      {{ menu.icon }}\n    </mat-icon>\n    <span class=\"mat-mdc-list-item__name\">{{ menu.title }}</span>\n  </a>\n</ng-template>\n\n<div *ngIf=\"expanded\">\n  <dsc-sidenav-item\n    *ngFor=\"let child of menu.children\"\n    [menu]=\"child\"\n    [depth]=\"depth + 1\"\n    [expanded]=\"expandedMenu === child\"\n    (expandChange)=\"onExpandChange($event)\"\n    (onClick)=\"onMenuItemClick($event)\"\n    [attr.aria-expanded]=\"ariaExpanded\">\n  </dsc-sidenav-item>\n</div>\n", styles: ["dsc-sidenav-item .mdc-list-item{height:auto!important;min-height:2.5rem;width:260px;cursor:pointer;padding-right:var(--dsc-spacing-micro);--mdc-list-list-item-container-color: var(--dsc-color-bg-neutral-1)}dsc-sidenav-item .mdc-list-item .mdc-list-item__primary-text{display:flex;letter-spacing:inherit!important}dsc-sidenav-item .mdc-list-item .mdc-list-item__primary-text .mat-icon{overflow:visible}dsc-sidenav-item .mdc-list-item .mdc-list-item__primary-text .mat-icon.mat-mdc-list-item__icon{align-self:center;color:var(--dsc-color-bg-neutral-6);font-size:var(--dsc-icon-size-nano);width:var(--dsc-icon-size-nano);height:var(--dsc-icon-size-nano);margin-right:var(--dsc-spacing-quark)}dsc-sidenav-item .mdc-list-item .mdc-list-item__primary-text .mat-mdc-list-item__name{font:var(--dsc-typography-text-small-400);font-feature-settings:\"ss01\";color:var(--dsc-color-content-neutral-5);word-wrap:break-word;white-space:normal}dsc-sidenav-item .mdc-list-item .mdc-list-item__primary-text .mat-mdc-list-item__spacer{flex:1 0 1em}dsc-sidenav-item .mdc-list-item .mdc-list-item__primary-text .mat-mdc-list-item__arrow-icon{display:flex;color:var(--dsc-color-bg-highlight-5);align-content:center;flex-wrap:wrap}dsc-sidenav-item .mdc-list-item .mdc-list-item__primary-text .mat-mdc-list-item__arrow-icon .mat-icon{font-size:var(--dsc-icon-size-small);width:var(--dsc-icon-size-small);height:var(--dsc-icon-size-small)}dsc-sidenav-item .mdc-list-item:focus{--mdc-list-list-item-focus-state-layer-color: transparent;--mdc-list-list-item-focus-state-layer-opacity: 0}dsc-sidenav-item .mdc-list-item:focus-visible{outline:var(--dsc-color-state-border-focus-dark) solid var(--dsc-border-width-thick);border-radius:var(--dsc-border-radius-nano);outline-offset:-5px}dsc-sidenav-item .mdc-list-item:focus:not(.mdc-list-item--disabled):hover,dsc-sidenav-item .mdc-list-item:focus-visible:not(.mdc-list-item--disabled):hover{--mdc-list-list-item-focus-state-layer-color: var(--dsc-color-state-bg-highlight-hover);--mdc-list-list-item-focus-state-layer-opacity: var(--dsc-opacity-state-hover-1)}dsc-sidenav-item .mdc-list-item--disabled{--mdc-list-list-item-disabled-state-layer-color: var(--dsc-color-bg-neutral-2);--mdc-list-list-item-disabled-state-layer-opacity: 0}dsc-sidenav-item .mdc-list-item--disabled .mdc-list-item__primary-text .mat-mdc-list-item__icon{color:var(--dsc-color-bg-neutral-6)}dsc-sidenav-item .mdc-list-item--disabled .mdc-list-item__primary-text .mat-mdc-list-item__name{color:var(--dsc-color-content-neutral-2)}dsc-sidenav-item .mdc-list-item--disabled .mdc-list-item__primary-text .mat-mdc-list-item__arrow-icon{color:var(--dsc-color-bg-neutral-6)!important}dsc-sidenav-item .mdc-list-item--activated:not(.mdc-list-item--disabled),dsc-sidenav-item .mdc-list-item:hover:not(.mdc-list-item--disabled){background-color:color-mix(in srgb,var(--dsc-color-state-bg-highlight-selected),transparent 84%)}dsc-sidenav-item .mdc-list-item--activated:not(.mdc-list-item--disabled) .mdc-list-item__primary-text .mat-icon.mat-mdc-list-item__icon,dsc-sidenav-item .mdc-list-item:hover:not(.mdc-list-item--disabled) .mdc-list-item__primary-text .mat-icon.mat-mdc-list-item__icon{color:var(--dsc-color-bg-highlight-6)!important}dsc-sidenav-item .mdc-list-item--activated:not(.mdc-list-item--disabled) .mdc-list-item__primary-text .mat-mdc-list-item__name,dsc-sidenav-item .mdc-list-item:hover:not(.mdc-list-item--disabled) .mdc-list-item__primary-text .mat-mdc-list-item__name{color:var(--dsc-color-content-highlight-2)!important}dsc-sidenav-item .mdc-list-item.expanded .mdc-list-item__primary-text .mat-icon.mat-mdc-list-item__icon{color:var(--dsc-color-bg-highlight-5)}dsc-sidenav-item .mdc-list-item.expanded .mdc-list-item__primary-text .mat-mdc-list-item__name{font:var(--dsc-typography-text-small-600);font-feature-settings:\"ss01\";color:var(--dsc-color-content-highlight-1)}dsc-sidenav-item .mdc-list-item__first-level--padding-with-icon{padding-left:var(--dsc-spacing-nano)}dsc-sidenav-item .mdc-list-item__first-level--padding-without-icon{padding-left:28px}dsc-sidenav-item .mdc-list-item__second-level--padding-with-icon{padding-left:18px}dsc-sidenav-item .mdc-list-item__second-level--padding-without-icon{padding-left:38px}dsc-sidenav-item .mdc-list-item__second-level,dsc-sidenav-item .mdc-list-item__third-level{--mdc-list-list-item-container-color: var(--dsc-color-bg-neutral-2)}dsc-sidenav-item .mdc-list-item__third-level{border:0;padding-left:var(--dsc-spacing-large)}\n"], dependencies: [{ kind: "component", type: DscSidenavItemComponent, selector: "dsc-sidenav-item", inputs: ["menu", "depth", "expanded", "selectedKey", "ariaExpanded"], outputs: ["onClick", "expandChange", "selectedKeyChange"] }, { kind: "ngmodule", type: MatListModule }, { kind: "component", type: i2.MatListItem, selector: "mat-list-item, a[mat-list-item], button[mat-list-item]", inputs: ["activated"], exportAs: ["matListItem"] }, { kind: "directive", type: RouterLink, selector: "[routerLink]", inputs: ["target", "queryParams", "fragment", "queryParamsHandling", "state", "relativeTo", "preserveFragment", "skipLocationChange", "replaceUrl", "routerLink"] }, { kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "ngmodule", type: MatIconModule }, { kind: "component", type: i3.MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }], animations: [
            trigger('indicatorRotate', [
                state('collapsed', style({ transform: 'rotate(0deg)' })),
                state('expanded', style({ transform: 'rotate(180deg)' })),
                transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4,0.0,0.2,1)'))
            ])
        ], encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscSidenavItemComponent, decorators: [{
            type: Component,
            args: [{ selector: 'dsc-sidenav-item', standalone: true, animations: [
                        trigger('indicatorRotate', [
                            state('collapsed', style({ transform: 'rotate(0deg)' })),
                            state('expanded', style({ transform: 'rotate(180deg)' })),
                            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4,0.0,0.2,1)'))
                        ])
                    ], encapsulation: ViewEncapsulation.None, imports: [
                        MatListModule,
                        RouterLink,
                        NgClass,
                        MatIconModule,
                        NgIf,
                        NgForOf
                    ], template: "<a *ngIf=\"isNotEmptyArray(menu.children); else routeTemplate\"\n   (keyup.enter)=\"expand(menu)\"\n   (keydown.space)=\"onSpace($any($event), menu)\"\n   (click)=\"expand(menu); $event.preventDefault(); onMenuItemClick(menu)\"\n   [routerLink]=\"undefined\"\n   [activated]=\"isActive(menu)\"\n   [disabled]=\"menu.disabled\"\n   [ngClass]=\"{\n    'expanded': expanded,\n    'mdc-list-item__second-level': depth === 1\n   }\"\n   [attr.aria-expanded]=\"ariaExpanded\"\n   [class.mdc-list-item__first-level--padding-with-icon]=\"depth === 0 && menu.icon\"\n   [class.mdc-list-item__first-level--padding-without-icon]=\"depth === 0 && !menu.icon\"\n   [class.mdc-list-item__second-level--padding-with-icon]=\"depth === 1 && menu.icon\"\n   [class.mdc-list-item__second-level--padding-without-icon]=\"depth === 1 && !menu.icon\"\n   mat-list-item\n   class=\"mat-mdc-list-item__collapsible\"\n   disableRipple=\"true\"\n   tabindex=\"0\"\n   role=\"button\">\n  <mat-icon class=\"mat-mdc-list-item__icon\"\n            *ngIf=\"menu.icon\">\n    {{ menu.icon }}\n  </mat-icon>\n  <span class=\"mat-mdc-list-item__name\">{{ menu.title }}</span>\n  <span class=\"mat-mdc-list-item__spacer\"></span>\n  <span class=\"mat-mdc-list-item__arrow-icon\">\n    <mat-icon [@indicatorRotate]=\"expanded ? 'expanded' : 'collapsed'\">\n      expand_more\n    </mat-icon>\n  </span>\n</a>\n\n<ng-template #routeTemplate>\n  <a mat-list-item\n     class=\"mat-mdc-list-item\"\n     disableRipple=\"true\"\n     *ngIf=\"menu.url\"\n     [routerLink]=\"!menu.disabled ? menu.url : undefined\"\n     [disabled]=\"menu.disabled\"\n     [activated]=\"isActive(menu)\"\n     (click)=\"onMenuItemClick(menu)\"\n     [attr.aria-expanded]=\"ariaExpanded\"\n     [ngClass]=\"{\n      'mdc-list-item__second-level': depth === 1,\n      'mdc-list-item__third-level': depth === 2\n     }\"\n     [class.mdc-list-item__first-level--padding-with-icon]=\"depth === 0 && menu.icon\"\n     [class.mdc-list-item__first-level--padding-without-icon]=\"depth === 0 && !menu.icon\"\n     [class.mdc-list-item__second-level--padding-with-icon]=\"depth === 1 && menu.icon\"\n     [class.mdc-list-item__second-level--padding-without-icon]=\"depth === 1 && !menu.icon\"\n     tabindex=\"0\"\n     role=\"button\">\n    <mat-icon class=\"mat-mdc-list-item__icon\"\n              *ngIf=\"menu.icon\">\n      {{ menu.icon }}\n    </mat-icon>\n    <span class=\"mat-mdc-list-item__name\">{{ menu.title }}</span>\n  </a>\n\n  <a mat-list-item\n    class=\"mat-mdc-list-item\"\n    disableRipple=\"true\"\n    *ngIf=\"menu.externalUrl\"\n    [href]=\"menu.externalUrl\"\n    target=\"_blank\"\n    (click)=\"onMenuItemClick(menu)\"\n    [attr.aria-expanded]=\"ariaExpanded\"\n    [ngClass]=\"{\n      'mdc-list-item__second-level': depth === 1,\n      'mdc-list-item__third-level': depth === 2\n    }\"\n    [class.mdc-list-item__first-level--padding-with-icon]=\"depth === 0 && menu.icon\"\n    [class.mdc-list-item__first-level--padding-without-icon]=\"depth === 0 && !menu.icon\"\n    [class.mdc-list-item__second-level--padding-with-icon]=\"depth === 1 && menu.icon\"\n    [class.mdc-list-item__second-level--padding-without-icon]=\"depth === 1 && !menu.icon\"\n    role=\"button\">\n    <mat-icon class=\"mat-mdc-list-item__icon\"\n              *ngIf=\"menu.icon\">\n      {{ menu.icon }}\n    </mat-icon>\n    <span class=\"mat-mdc-list-item__name\">{{ menu.title }}</span>\n  </a>\n</ng-template>\n\n<div *ngIf=\"expanded\">\n  <dsc-sidenav-item\n    *ngFor=\"let child of menu.children\"\n    [menu]=\"child\"\n    [depth]=\"depth + 1\"\n    [expanded]=\"expandedMenu === child\"\n    (expandChange)=\"onExpandChange($event)\"\n    (onClick)=\"onMenuItemClick($event)\"\n    [attr.aria-expanded]=\"ariaExpanded\">\n  </dsc-sidenav-item>\n</div>\n", styles: ["dsc-sidenav-item .mdc-list-item{height:auto!important;min-height:2.5rem;width:260px;cursor:pointer;padding-right:var(--dsc-spacing-micro);--mdc-list-list-item-container-color: var(--dsc-color-bg-neutral-1)}dsc-sidenav-item .mdc-list-item .mdc-list-item__primary-text{display:flex;letter-spacing:inherit!important}dsc-sidenav-item .mdc-list-item .mdc-list-item__primary-text .mat-icon{overflow:visible}dsc-sidenav-item .mdc-list-item .mdc-list-item__primary-text .mat-icon.mat-mdc-list-item__icon{align-self:center;color:var(--dsc-color-bg-neutral-6);font-size:var(--dsc-icon-size-nano);width:var(--dsc-icon-size-nano);height:var(--dsc-icon-size-nano);margin-right:var(--dsc-spacing-quark)}dsc-sidenav-item .mdc-list-item .mdc-list-item__primary-text .mat-mdc-list-item__name{font:var(--dsc-typography-text-small-400);font-feature-settings:\"ss01\";color:var(--dsc-color-content-neutral-5);word-wrap:break-word;white-space:normal}dsc-sidenav-item .mdc-list-item .mdc-list-item__primary-text .mat-mdc-list-item__spacer{flex:1 0 1em}dsc-sidenav-item .mdc-list-item .mdc-list-item__primary-text .mat-mdc-list-item__arrow-icon{display:flex;color:var(--dsc-color-bg-highlight-5);align-content:center;flex-wrap:wrap}dsc-sidenav-item .mdc-list-item .mdc-list-item__primary-text .mat-mdc-list-item__arrow-icon .mat-icon{font-size:var(--dsc-icon-size-small);width:var(--dsc-icon-size-small);height:var(--dsc-icon-size-small)}dsc-sidenav-item .mdc-list-item:focus{--mdc-list-list-item-focus-state-layer-color: transparent;--mdc-list-list-item-focus-state-layer-opacity: 0}dsc-sidenav-item .mdc-list-item:focus-visible{outline:var(--dsc-color-state-border-focus-dark) solid var(--dsc-border-width-thick);border-radius:var(--dsc-border-radius-nano);outline-offset:-5px}dsc-sidenav-item .mdc-list-item:focus:not(.mdc-list-item--disabled):hover,dsc-sidenav-item .mdc-list-item:focus-visible:not(.mdc-list-item--disabled):hover{--mdc-list-list-item-focus-state-layer-color: var(--dsc-color-state-bg-highlight-hover);--mdc-list-list-item-focus-state-layer-opacity: var(--dsc-opacity-state-hover-1)}dsc-sidenav-item .mdc-list-item--disabled{--mdc-list-list-item-disabled-state-layer-color: var(--dsc-color-bg-neutral-2);--mdc-list-list-item-disabled-state-layer-opacity: 0}dsc-sidenav-item .mdc-list-item--disabled .mdc-list-item__primary-text .mat-mdc-list-item__icon{color:var(--dsc-color-bg-neutral-6)}dsc-sidenav-item .mdc-list-item--disabled .mdc-list-item__primary-text .mat-mdc-list-item__name{color:var(--dsc-color-content-neutral-2)}dsc-sidenav-item .mdc-list-item--disabled .mdc-list-item__primary-text .mat-mdc-list-item__arrow-icon{color:var(--dsc-color-bg-neutral-6)!important}dsc-sidenav-item .mdc-list-item--activated:not(.mdc-list-item--disabled),dsc-sidenav-item .mdc-list-item:hover:not(.mdc-list-item--disabled){background-color:color-mix(in srgb,var(--dsc-color-state-bg-highlight-selected),transparent 84%)}dsc-sidenav-item .mdc-list-item--activated:not(.mdc-list-item--disabled) .mdc-list-item__primary-text .mat-icon.mat-mdc-list-item__icon,dsc-sidenav-item .mdc-list-item:hover:not(.mdc-list-item--disabled) .mdc-list-item__primary-text .mat-icon.mat-mdc-list-item__icon{color:var(--dsc-color-bg-highlight-6)!important}dsc-sidenav-item .mdc-list-item--activated:not(.mdc-list-item--disabled) .mdc-list-item__primary-text .mat-mdc-list-item__name,dsc-sidenav-item .mdc-list-item:hover:not(.mdc-list-item--disabled) .mdc-list-item__primary-text .mat-mdc-list-item__name{color:var(--dsc-color-content-highlight-2)!important}dsc-sidenav-item .mdc-list-item.expanded .mdc-list-item__primary-text .mat-icon.mat-mdc-list-item__icon{color:var(--dsc-color-bg-highlight-5)}dsc-sidenav-item .mdc-list-item.expanded .mdc-list-item__primary-text .mat-mdc-list-item__name{font:var(--dsc-typography-text-small-600);font-feature-settings:\"ss01\";color:var(--dsc-color-content-highlight-1)}dsc-sidenav-item .mdc-list-item__first-level--padding-with-icon{padding-left:var(--dsc-spacing-nano)}dsc-sidenav-item .mdc-list-item__first-level--padding-without-icon{padding-left:28px}dsc-sidenav-item .mdc-list-item__second-level--padding-with-icon{padding-left:18px}dsc-sidenav-item .mdc-list-item__second-level--padding-without-icon{padding-left:38px}dsc-sidenav-item .mdc-list-item__second-level,dsc-sidenav-item .mdc-list-item__third-level{--mdc-list-list-item-container-color: var(--dsc-color-bg-neutral-2)}dsc-sidenav-item .mdc-list-item__third-level{border:0;padding-left:var(--dsc-spacing-large)}\n"] }]
        }], ctorParameters: function () { return [{ type: i1.Router }]; }, propDecorators: { menu: [{
                type: Input
            }], depth: [{
                type: Input
            }], onClick: [{
                type: Output
            }], expandChange: [{
                type: Output
            }], expanded: [{
                type: Input
            }], selectedKey: [{
                type: Input
            }], ariaExpanded: [{
                type: Input
            }], selectedKeyChange: [{
                type: Output
            }] } });

class DscSidenavComponent {
    constructor(_router) {
        this._router = _router;
        this._onDestroy = new Subject();
        this.expandedItems = new Map();
        this.singleExpand = true;
        this._opened = true;
        this._fixedInViewport = false;
        this._fixedTopGap = 0;
        this._fixedBottomGap = 0;
        this._mode = 'side';
        this._showFilter = false;
        this.openedChange = new EventEmitter();
        this.onClick = new EventEmitter();
        this.search = new FormControl('');
    }
    get menu() {
        return this._menu;
    }
    set menu(value) {
        this._menu = value ? value : [];
        this.menuFiltered = this._menu;
    }
    get opened() {
        return this._opened;
    }
    set opened(value) {
        this._opened = coerceBooleanProperty(value);
    }
    get fixedInViewport() {
        return this._fixedInViewport;
    }
    set fixedInViewport(value) {
        this._fixedInViewport = coerceBooleanProperty(value);
    }
    get fixedTopGap() {
        return this._fixedTopGap;
    }
    set fixedTopGap(value) {
        this._fixedTopGap = coerceNumberProperty(value);
    }
    get fixedBottomGap() {
        return this._fixedBottomGap;
    }
    set fixedBottomGap(value) {
        this._fixedBottomGap = coerceNumberProperty(value);
    }
    get mode() {
        return this._mode;
    }
    set mode(value) {
        this._mode = value;
    }
    get showFilter() {
        return this._showFilter;
    }
    set showFilter(value) {
        this._showFilter = coerceBooleanProperty(value);
    }
    ngOnInit() {
        this._filterInit();
        setTimeout(() => this._applyDefaultSelection(), 0);
    }
    onExpand(menu) {
        if (this.singleExpand) {
            this.expandedItems.forEach((_, key) => this.expandedItems.set(key, false));
        }
        this.expandedItems.set(menu.title, true);
    }
    _applyDefaultSelection() {
        if (!this.menu || !this.menu.length)
            return;
        const path = this._findPath(this.menu, m => !!m.defaultSelected);
        if (!path || !path.length)
            return;
        const target = path[path.length - 1];
        path.slice(0, -1).forEach(parent => this.expandedItems.set(parent.title, true));
        const parentOfTarget = path.length > 1 ? path[path.length - 2] : undefined;
        if (parentOfTarget)
            this.onExpand(parentOfTarget);
        if (target.url) {
            const current = this._router.url.split('#')[0];
            if (current !== target.url)
                this._router.navigateByUrl(target.url);
        }
        this.onClick.emit(target);
    }
    onMenuClick(menu) {
        this.onClick.emit(menu);
    }
    _findPath(nodes, predicate) {
        for (const n of nodes) {
            if (predicate(n))
                return [n];
            if (n.children && n.children.length) {
                const childPath = this._findPath(n.children, predicate);
                if (childPath.length)
                    return [n, ...childPath];
            }
        }
        return [];
    }
    isExpanded(menu) {
        return this.expandedItems.get(menu.title) || false;
    }
    _filterInit() {
        this.search.valueChanges
            .pipe(map(text => (text && text.length > 3 ? text : '')), distinctUntilChanged(), debounceTime(450), takeUntil(this._onDestroy))
            .subscribe(value => {
            const menuAux = JSON.parse(JSON.stringify(this.menu));
            this.menuFiltered = value ? this._doFilter(menuAux, value) : menuAux;
        });
    }
    _doFilter(menuList, value) {
        let menuListFiltered = [];
        menuList.forEach((menu) => {
            if (!menu.disabled) {
                if (isEmptyArray(menu.children)) {
                    if (this._compare(menu.title, value))
                        menuListFiltered.push(menu);
                }
                else {
                    const collapsibleMenu = JSON.parse(JSON.stringify(menu));
                    collapsibleMenu.children = this._doFilter(collapsibleMenu.children, value);
                    collapsibleMenu.expanded = true;
                    if (isNotEmptyArray(collapsibleMenu.children))
                        menuListFiltered.push(collapsibleMenu);
                }
            }
        });
        return menuListFiltered;
    }
    _compare(s1, s2) {
        return replaceAccents(s1).trim().toLowerCase().includes(replaceAccents(s2).trim().toLowerCase());
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscSidenavComponent, deps: [{ token: i1.Router }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.12", type: DscSidenavComponent, isStandalone: true, selector: "dsc-sidenav", inputs: { customClass: "customClass", coverSrc: "coverSrc", singleExpand: "singleExpand", menu: "menu", opened: "opened", fixedInViewport: "fixedInViewport", fixedTopGap: "fixedTopGap", fixedBottomGap: "fixedBottomGap", mode: "mode", showFilter: "showFilter" }, outputs: { openedChange: "openedChange", onClick: "onClick" }, ngImport: i0, template: "<mat-sidenav-container [ngClass]=\"customClass\">\n  <mat-sidenav class=\"mat-elevation-z2\"\n               [mode]=\"mode\"\n               [opened]=\"opened\"\n               [fixedInViewport]=\"fixedInViewport\"\n               [fixedTopGap]=\"fixedTopGap\"\n               [fixedBottomGap]=\"fixedBottomGap\"\n               (openedChange)=\"this.openedChange.emit($event)\">\n    <div class=\"mat-sidenav-content\">\n      <div class=\"mat-sidenav-header\"\n            *ngIf=\"coverSrc || showFilter\">\n        <div class=\"mat-sidenav-header__cover\"\n             *ngIf=\"coverSrc\">\n          <img [src]=\"coverSrc\" alt=\"\" tabindex=\"-1\">\n        </div>\n        <div class=\"mat-sidenav-header__filter\"\n             *ngIf=\"showFilter\">\n          <dsc-input placeholder=\"Pesquisar\"\n                     iconPrefix=\"search\"\n                     [formControl]=\"search\">\n          </dsc-input>\n        </div>\n      </div>\n      <mat-nav-list role=\"navigation\">\n        <dsc-sidenav-item *ngFor=\"let menu of menuFiltered\"\n                          [menu]=\"menu\"\n                          [expanded]=\"isExpanded(menu)\"\n                          (expandChange)=\"onExpand(menu)\"\n                          (onClick)=\"onMenuClick($event)\">\n        </dsc-sidenav-item>\n      </mat-nav-list>\n    </div>\n  </mat-sidenav>\n  <mat-sidenav-content role=\"main\">\n    <ng-content></ng-content>\n  </mat-sidenav-content>\n</mat-sidenav-container>\n", styles: ["dsc-sidenav .mat-sidenav-container{--mat-sidenav-container-divider-color: var(--dsc-color-bg-neutral-1);--mat-sidenav-container-background-color: var(--dsc-color-bg-neutral-1);--mat-sidenav-content-background-color: var(--dsc-color-bg-neutral-1)}dsc-sidenav .mat-sidenav-container .mat-sidenav{width:260px;box-shadow:4px 0 12px #00000029;border:none}dsc-sidenav .mat-sidenav-container .mat-sidenav-content .mat-sidenav-header{display:flex;flex-direction:column;gap:var(--dsc-spacing-micro);margin:var(--dsc-spacing-micro)}dsc-sidenav .mat-sidenav-container .mat-sidenav-content .mat-sidenav-header__cover img{max-width:236px;max-height:236px}dsc-sidenav .mat-sidenav-container .mat-sidenav-content .mat-sidenav-header__filter .mat-mdc-form-field-subscript-wrapper{height:0}dsc-sidenav .mat-sidenav-container .mat-sidenav-content .mat-mdc-nav-list{display:flex;flex-direction:column;padding:0}dsc-sidenav .mat-sidenav-container .mat-sidenav .mat-drawer-inner-container{overflow-x:hidden}dsc-sidenav .mat-sidenav-container .mat-sidenav .mat-drawer-inner-container::-webkit-scrollbar{display:none}dsc-sidenav .mat-sidenav-container .mat-sidenav-content{background:var(--dsc-color-bg-neutral-1)}\n"], dependencies: [{ kind: "ngmodule", type: MatSidenavModule }, { kind: "component", type: i2$1.MatSidenav, selector: "mat-sidenav", inputs: ["fixedInViewport", "fixedTopGap", "fixedBottomGap"], exportAs: ["matSidenav"] }, { kind: "component", type: i2$1.MatSidenavContainer, selector: "mat-sidenav-container", exportAs: ["matSidenavContainer"] }, { kind: "component", type: i2$1.MatSidenavContent, selector: "mat-sidenav-content" }, { kind: "ngmodule", type: MatListModule }, { kind: "component", type: i2.MatNavList, selector: "mat-nav-list", exportAs: ["matNavList"] }, { kind: "component", type: DscSidenavItemComponent, selector: "dsc-sidenav-item", inputs: ["menu", "depth", "expanded", "selectedKey", "ariaExpanded"], outputs: ["onClick", "expandChange", "selectedKeyChange"] }, { kind: "directive", type: NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "component", type: DscInputComponent, selector: "dsc-input", inputs: ["suffix", "mask", "dropSpecialCharacters", "iconPrefix", "iconSuffix", "iconStyle", "options", "autocompleteControl", "showCharCounter", "showClearButton"], outputs: ["keydown", "search"] }, { kind: "ngmodule", type: ReactiveFormsModule }, { kind: "directive", type: i4.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i4.FormControlDirective, selector: "[formControl]", inputs: ["formControl", "disabled", "ngModel"], outputs: ["ngModelChange"], exportAs: ["ngForm"] }, { kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }], encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscSidenavComponent, decorators: [{
            type: Component,
            args: [{ selector: 'dsc-sidenav', standalone: true, encapsulation: ViewEncapsulation.None, imports: [
                        MatSidenavModule,
                        MatListModule,
                        DscSidenavItemComponent,
                        NgForOf,
                        NgClass,
                        DscInputComponent,
                        ReactiveFormsModule,
                        NgIf
                    ], template: "<mat-sidenav-container [ngClass]=\"customClass\">\n  <mat-sidenav class=\"mat-elevation-z2\"\n               [mode]=\"mode\"\n               [opened]=\"opened\"\n               [fixedInViewport]=\"fixedInViewport\"\n               [fixedTopGap]=\"fixedTopGap\"\n               [fixedBottomGap]=\"fixedBottomGap\"\n               (openedChange)=\"this.openedChange.emit($event)\">\n    <div class=\"mat-sidenav-content\">\n      <div class=\"mat-sidenav-header\"\n            *ngIf=\"coverSrc || showFilter\">\n        <div class=\"mat-sidenav-header__cover\"\n             *ngIf=\"coverSrc\">\n          <img [src]=\"coverSrc\" alt=\"\" tabindex=\"-1\">\n        </div>\n        <div class=\"mat-sidenav-header__filter\"\n             *ngIf=\"showFilter\">\n          <dsc-input placeholder=\"Pesquisar\"\n                     iconPrefix=\"search\"\n                     [formControl]=\"search\">\n          </dsc-input>\n        </div>\n      </div>\n      <mat-nav-list role=\"navigation\">\n        <dsc-sidenav-item *ngFor=\"let menu of menuFiltered\"\n                          [menu]=\"menu\"\n                          [expanded]=\"isExpanded(menu)\"\n                          (expandChange)=\"onExpand(menu)\"\n                          (onClick)=\"onMenuClick($event)\">\n        </dsc-sidenav-item>\n      </mat-nav-list>\n    </div>\n  </mat-sidenav>\n  <mat-sidenav-content role=\"main\">\n    <ng-content></ng-content>\n  </mat-sidenav-content>\n</mat-sidenav-container>\n", styles: ["dsc-sidenav .mat-sidenav-container{--mat-sidenav-container-divider-color: var(--dsc-color-bg-neutral-1);--mat-sidenav-container-background-color: var(--dsc-color-bg-neutral-1);--mat-sidenav-content-background-color: var(--dsc-color-bg-neutral-1)}dsc-sidenav .mat-sidenav-container .mat-sidenav{width:260px;box-shadow:4px 0 12px #00000029;border:none}dsc-sidenav .mat-sidenav-container .mat-sidenav-content .mat-sidenav-header{display:flex;flex-direction:column;gap:var(--dsc-spacing-micro);margin:var(--dsc-spacing-micro)}dsc-sidenav .mat-sidenav-container .mat-sidenav-content .mat-sidenav-header__cover img{max-width:236px;max-height:236px}dsc-sidenav .mat-sidenav-container .mat-sidenav-content .mat-sidenav-header__filter .mat-mdc-form-field-subscript-wrapper{height:0}dsc-sidenav .mat-sidenav-container .mat-sidenav-content .mat-mdc-nav-list{display:flex;flex-direction:column;padding:0}dsc-sidenav .mat-sidenav-container .mat-sidenav .mat-drawer-inner-container{overflow-x:hidden}dsc-sidenav .mat-sidenav-container .mat-sidenav .mat-drawer-inner-container::-webkit-scrollbar{display:none}dsc-sidenav .mat-sidenav-container .mat-sidenav-content{background:var(--dsc-color-bg-neutral-1)}\n"] }]
        }], ctorParameters: function () { return [{ type: i1.Router }]; }, propDecorators: { customClass: [{
                type: Input
            }], coverSrc: [{
                type: Input
            }], singleExpand: [{
                type: Input
            }], menu: [{
                type: Input
            }], opened: [{
                type: Input
            }], fixedInViewport: [{
                type: Input
            }], fixedTopGap: [{
                type: Input
            }], fixedBottomGap: [{
                type: Input
            }], mode: [{
                type: Input
            }], showFilter: [{
                type: Input
            }], openedChange: [{
                type: Output
            }], onClick: [{
                type: Output
            }] } });

/**
 * Generated bundle index. Do not edit.
 */

export { DscSidenavComponent };
//# sourceMappingURL=sidsc-components-dsc-sidenav.mjs.map
