import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DscInputComponent } from 'sidsc-components/dsc-input';
import { isEmptyArray, isNotEmptyArray, replaceAccents } from 'sidsc-components/core';
import { DscSidenavItemComponent } from './dsc-sidenav-item/dsc-sidenav-item.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "@angular/material/sidenav";
import * as i3 from "@angular/material/list";
import * as i4 from "@angular/forms";
export class DscSidenavComponent {
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
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.12", type: DscSidenavComponent, isStandalone: true, selector: "dsc-sidenav", inputs: { customClass: "customClass", coverSrc: "coverSrc", singleExpand: "singleExpand", menu: "menu", opened: "opened", fixedInViewport: "fixedInViewport", fixedTopGap: "fixedTopGap", fixedBottomGap: "fixedBottomGap", mode: "mode", showFilter: "showFilter" }, outputs: { openedChange: "openedChange", onClick: "onClick" }, ngImport: i0, template: "<mat-sidenav-container [ngClass]=\"customClass\">\n  <mat-sidenav class=\"mat-elevation-z2\"\n               [mode]=\"mode\"\n               [opened]=\"opened\"\n               [fixedInViewport]=\"fixedInViewport\"\n               [fixedTopGap]=\"fixedTopGap\"\n               [fixedBottomGap]=\"fixedBottomGap\"\n               (openedChange)=\"this.openedChange.emit($event)\">\n    <div class=\"mat-sidenav-content\">\n      <div class=\"mat-sidenav-header\"\n            *ngIf=\"coverSrc || showFilter\">\n        <div class=\"mat-sidenav-header__cover\"\n             *ngIf=\"coverSrc\">\n          <img [src]=\"coverSrc\" alt=\"\" tabindex=\"-1\">\n        </div>\n        <div class=\"mat-sidenav-header__filter\"\n             *ngIf=\"showFilter\">\n          <dsc-input placeholder=\"Pesquisar\"\n                     iconPrefix=\"search\"\n                     [formControl]=\"search\">\n          </dsc-input>\n        </div>\n      </div>\n      <mat-nav-list role=\"navigation\">\n        <dsc-sidenav-item *ngFor=\"let menu of menuFiltered\"\n                          [menu]=\"menu\"\n                          [expanded]=\"isExpanded(menu)\"\n                          (expandChange)=\"onExpand(menu)\"\n                          (onClick)=\"onMenuClick($event)\">\n        </dsc-sidenav-item>\n      </mat-nav-list>\n    </div>\n  </mat-sidenav>\n  <mat-sidenav-content role=\"main\">\n    <ng-content></ng-content>\n  </mat-sidenav-content>\n</mat-sidenav-container>\n", styles: ["dsc-sidenav .mat-sidenav-container{--mat-sidenav-container-divider-color: var(--dsc-color-bg-neutral-1);--mat-sidenav-container-background-color: var(--dsc-color-bg-neutral-1);--mat-sidenav-content-background-color: var(--dsc-color-bg-neutral-1)}dsc-sidenav .mat-sidenav-container .mat-sidenav{width:260px;box-shadow:4px 0 12px #00000029;border:none}dsc-sidenav .mat-sidenav-container .mat-sidenav-content .mat-sidenav-header{display:flex;flex-direction:column;gap:var(--dsc-spacing-micro);margin:var(--dsc-spacing-micro)}dsc-sidenav .mat-sidenav-container .mat-sidenav-content .mat-sidenav-header__cover img{max-width:236px;max-height:236px}dsc-sidenav .mat-sidenav-container .mat-sidenav-content .mat-sidenav-header__filter .mat-mdc-form-field-subscript-wrapper{height:0}dsc-sidenav .mat-sidenav-container .mat-sidenav-content .mat-mdc-nav-list{display:flex;flex-direction:column;padding:0}dsc-sidenav .mat-sidenav-container .mat-sidenav .mat-drawer-inner-container{overflow-x:hidden}dsc-sidenav .mat-sidenav-container .mat-sidenav .mat-drawer-inner-container::-webkit-scrollbar{display:none}dsc-sidenav .mat-sidenav-container .mat-sidenav-content{background:var(--dsc-color-bg-neutral-1)}\n"], dependencies: [{ kind: "ngmodule", type: MatSidenavModule }, { kind: "component", type: i2.MatSidenav, selector: "mat-sidenav", inputs: ["fixedInViewport", "fixedTopGap", "fixedBottomGap"], exportAs: ["matSidenav"] }, { kind: "component", type: i2.MatSidenavContainer, selector: "mat-sidenav-container", exportAs: ["matSidenavContainer"] }, { kind: "component", type: i2.MatSidenavContent, selector: "mat-sidenav-content" }, { kind: "ngmodule", type: MatListModule }, { kind: "component", type: i3.MatNavList, selector: "mat-nav-list", exportAs: ["matNavList"] }, { kind: "component", type: DscSidenavItemComponent, selector: "dsc-sidenav-item", inputs: ["menu", "depth", "expanded", "selectedKey", "ariaExpanded"], outputs: ["onClick", "expandChange", "selectedKeyChange"] }, { kind: "directive", type: NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "component", type: DscInputComponent, selector: "dsc-input", inputs: ["suffix", "mask", "dropSpecialCharacters", "iconPrefix", "iconSuffix", "iconStyle", "options", "autocompleteControl", "showCharCounter", "showClearButton"], outputs: ["keydown", "search"] }, { kind: "ngmodule", type: ReactiveFormsModule }, { kind: "directive", type: i4.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i4.FormControlDirective, selector: "[formControl]", inputs: ["formControl", "disabled", "ngModel"], outputs: ["ngModelChange"], exportAs: ["ngForm"] }, { kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }], encapsulation: i0.ViewEncapsulation.None }); }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHNjLXNpZGVuYXYuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvc2lkc2MtY29tcG9uZW50cy9kc2Mtc2lkZW5hdi9kc2Mtc2lkZW5hdi5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9zaWRzYy1jb21wb25lbnRzL2RzYy1zaWRlbmF2L2RzYy1zaWRlbmF2LmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBVSxNQUFNLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbEcsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDN0QsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3pELE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxvQkFBb0IsRUFBZSxNQUFNLHVCQUF1QixDQUFDO0FBQ2pHLE9BQU8sRUFBRSxXQUFXLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVsRSxPQUFPLEVBQUUsWUFBWSxFQUFFLG9CQUFvQixFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNwRixPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRS9CLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQy9ELE9BQU8sRUFBRSxZQUFZLEVBQUUsZUFBZSxFQUFFLGNBQWMsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBSXRGLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLCtDQUErQyxDQUFDOzs7Ozs7QUFzQnhGLE1BQU0sT0FBTyxtQkFBbUI7SUFD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ZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25Jbml0LCBPdXRwdXQsIFZpZXdFbmNhcHN1bGF0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNYXRTaWRlbmF2TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvc2lkZW5hdic7XG5pbXBvcnQgeyBNYXRMaXN0TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvbGlzdCc7XG5pbXBvcnQgeyBOZ0NsYXNzLCBOZ0Zvck9mLCBOZ0lmIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSwgY29lcmNlTnVtYmVyUHJvcGVydHksIE51bWJlcklucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7IEZvcm1Db250cm9sLCBSZWFjdGl2ZUZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5pbXBvcnQgeyBkZWJvdW5jZVRpbWUsIGRpc3RpbmN0VW50aWxDaGFuZ2VkLCBtYXAsIHRha2VVbnRpbCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgRHNjSW5wdXRDb21wb25lbnQgfSBmcm9tICdzaWRzYy1jb21wb25lbnRzL2RzYy1pbnB1dCc7XG5pbXBvcnQgeyBpc0VtcHR5QXJyYXksIGlzTm90RW1wdHlBcnJheSwgcmVwbGFjZUFjY2VudHMgfSBmcm9tICdzaWRzYy1jb21wb25lbnRzL2NvcmUnO1xuXG5pbXBvcnQgeyBEc2NDb2xsYXBzaWJsZU1lbnUgfSBmcm9tICcuL3NoYXJlZC9kc2MtY29sbGFwc2libGUtbWVudSc7XG5pbXBvcnQgeyBEc2NNZW51IH0gZnJvbSAnLi9zaGFyZWQvZHNjLW1lbnUnO1xuaW1wb3J0IHsgRHNjU2lkZW5hdkl0ZW1Db21wb25lbnQgfSBmcm9tICcuL2RzYy1zaWRlbmF2LWl0ZW0vZHNjLXNpZGVuYXYtaXRlbS5jb21wb25lbnQnO1xuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcblxuZXhwb3J0IHR5cGUgRHNjU2lkZW5hdkRyYXdlck1vZGUgPSAnb3ZlcicgfCAncHVzaCcgfCAnc2lkZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2RzYy1zaWRlbmF2JyxcbiAgdGVtcGxhdGVVcmw6ICcuL2RzYy1zaWRlbmF2LmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vZHNjLXNpZGVuYXYuY29tcG9uZW50LnNjc3MnXSxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgaW1wb3J0czogW1xuICAgIE1hdFNpZGVuYXZNb2R1bGUsXG4gICAgTWF0TGlzdE1vZHVsZSxcbiAgICBEc2NTaWRlbmF2SXRlbUNvbXBvbmVudCxcbiAgICBOZ0Zvck9mLFxuICAgIE5nQ2xhc3MsXG4gICAgRHNjSW5wdXRDb21wb25lbnQsXG4gICAgUmVhY3RpdmVGb3Jtc01vZHVsZSxcbiAgICBOZ0lmXG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgRHNjU2lkZW5hdkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3JvdXRlcjogUm91dGVyKXt9XG5cbiAgcHJpdmF0ZSBfb25EZXN0cm95ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICBASW5wdXQoKVxuICBjdXN0b21DbGFzczogc3RyaW5nIHwgc3RyaW5nW10gfCBTZXQ8c3RyaW5nPiB8IHtbcDogc3RyaW5nXTogYW55fSB8IG51bGwgfCB1bmRlZmluZWQ7XG5cbiAgQElucHV0KClcbiAgY292ZXJTcmM/OiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSBleHBhbmRlZEl0ZW1zOiBNYXA8c3RyaW5nLCBib29sZWFuPiA9IG5ldyBNYXA8c3RyaW5nLCBib29sZWFuPigpO1xuXG4gIEBJbnB1dCgpIHNpbmdsZUV4cGFuZDogYm9vbGVhbiA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgZ2V0IG1lbnUoKTogRHNjTWVudVtdIHwgRHNjQ29sbGFwc2libGVNZW51W10ge1xuICAgIHJldHVybiB0aGlzLl9tZW51O1xuICB9XG5cbiAgc2V0IG1lbnUodmFsdWU6IERzY01lbnVbXSB8IERzY0NvbGxhcHNpYmxlTWVudVtdKSB7XG4gICAgdGhpcy5fbWVudSA9IHZhbHVlID8gdmFsdWUgOiBbXTtcbiAgICB0aGlzLm1lbnVGaWx0ZXJlZCA9IHRoaXMuX21lbnU7XG4gIH1cblxuICBwcml2YXRlIF9tZW51ITogRHNjTWVudVtdIHwgRHNjQ29sbGFwc2libGVNZW51W107XG5cbiAgQElucHV0KClcbiAgZ2V0IG9wZW5lZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fb3BlbmVkO1xuICB9XG5cbiAgc2V0IG9wZW5lZCh2YWx1ZTogYm9vbGVhbiB8IHN0cmluZykge1xuICAgIHRoaXMuX29wZW5lZCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cblxuICBfb3BlbmVkOiBib29sZWFuID0gdHJ1ZTtcblxuICBASW5wdXQoKVxuICBnZXQgZml4ZWRJblZpZXdwb3J0KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9maXhlZEluVmlld3BvcnQ7XG4gIH1cblxuICBzZXQgZml4ZWRJblZpZXdwb3J0KHZhbHVlOiBib29sZWFuIHwgc3RyaW5nKSB7XG4gICAgdGhpcy5fZml4ZWRJblZpZXdwb3J0ID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuXG4gIF9maXhlZEluVmlld3BvcnQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICBnZXQgZml4ZWRUb3BHYXAoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fZml4ZWRUb3BHYXA7XG4gIH1cbiAgc2V0IGZpeGVkVG9wR2FwKHZhbHVlOiBOdW1iZXJJbnB1dCkge1xuICAgIHRoaXMuX2ZpeGVkVG9wR2FwID0gY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUpO1xuICB9XG5cbiAgcHJpdmF0ZSBfZml4ZWRUb3BHYXAgPSAwO1xuXG4gIEBJbnB1dCgpXG4gIGdldCBmaXhlZEJvdHRvbUdhcCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9maXhlZEJvdHRvbUdhcDtcbiAgfVxuICBzZXQgZml4ZWRCb3R0b21HYXAodmFsdWU6IE51bWJlcklucHV0KSB7XG4gICAgdGhpcy5fZml4ZWRCb3R0b21HYXAgPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cblxuICBwcml2YXRlIF9maXhlZEJvdHRvbUdhcCA9IDA7XG5cbiAgQElucHV0KClcbiAgZ2V0IG1vZGUoKTogRHNjU2lkZW5hdkRyYXdlck1vZGUge1xuICAgIHJldHVybiB0aGlzLl9tb2RlO1xuICB9XG4gIHNldCBtb2RlKHZhbHVlOiBEc2NTaWRlbmF2RHJhd2VyTW9kZSkge1xuICAgIHRoaXMuX21vZGUgPSB2YWx1ZTtcbiAgfVxuXG4gIHByaXZhdGUgX21vZGU6IERzY1NpZGVuYXZEcmF3ZXJNb2RlID0gJ3NpZGUnO1xuXG4gIEBJbnB1dCgpXG4gIGdldCBzaG93RmlsdGVyKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9zaG93RmlsdGVyO1xuICB9XG5cbiAgc2V0IHNob3dGaWx0ZXIodmFsdWU6IGJvb2xlYW4gfCBzdHJpbmcpIHtcbiAgICB0aGlzLl9zaG93RmlsdGVyID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuXG4gIF9zaG93RmlsdGVyOiBib29sZWFuID0gZmFsc2U7XG5cbiAgQE91dHB1dCgpXG4gIG9wZW5lZENoYW5nZTogRXZlbnRFbWl0dGVyPGJvb2xlYW4+ID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuXG4gIEBPdXRwdXQoKVxuICBvbkNsaWNrOiBFdmVudEVtaXR0ZXI8RHNjTWVudT4gPSBuZXcgRXZlbnRFbWl0dGVyPERzY01lbnU+KCk7XG5cbiAgc2VhcmNoOiBGb3JtQ29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCgnJyk7XG5cbiAgbWVudUZpbHRlcmVkITogRHNjTWVudVtdIHwgRHNjQ29sbGFwc2libGVNZW51W107XG5cbiAgcHJpdmF0ZSBleHBhbmRlZEl0ZW0/OiBEc2NNZW51O1xuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuX2ZpbHRlckluaXQoKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuX2FwcGx5RGVmYXVsdFNlbGVjdGlvbigpLDApO1xuICB9XG5cbiAgb25FeHBhbmQobWVudTogRHNjTWVudSk6IHZvaWQge1xuICAgIGlmICh0aGlzLnNpbmdsZUV4cGFuZCkge1xuICAgICAgdGhpcy5leHBhbmRlZEl0ZW1zLmZvckVhY2goKF8sIGtleSkgPT4gdGhpcy5leHBhbmRlZEl0ZW1zLnNldChrZXksIGZhbHNlKSk7XG4gICAgfVxuICAgIHRoaXMuZXhwYW5kZWRJdGVtcy5zZXQobWVudS50aXRsZSwgdHJ1ZSk7XG4gIH1cblxuICBwcml2YXRlIF9hcHBseURlZmF1bHRTZWxlY3Rpb24oKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLm1lbnUgfHwgIXRoaXMubWVudS5sZW5ndGgpIHJldHVybjtcblxuICAgIGNvbnN0IHBhdGg6IERzY01lbnVbXSA9IHRoaXMuX2ZpbmRQYXRoKHRoaXMubWVudSBhcyBEc2NNZW51W10sIG0gPT4gISFtLmRlZmF1bHRTZWxlY3RlZCk7XG4gICAgaWYgKCFwYXRoIHx8ICFwYXRoLmxlbmd0aCkgcmV0dXJuO1xuXG4gICAgY29uc3QgdGFyZ2V0ID0gcGF0aFtwYXRoLmxlbmd0aCAtIDFdO1xuXG4gICAgcGF0aC5zbGljZSgwLC0xKS5mb3JFYWNoKHBhcmVudCA9PiB0aGlzLmV4cGFuZGVkSXRlbXMuc2V0KHBhcmVudC50aXRsZSwgdHJ1ZSkpO1xuXG4gICAgY29uc3QgcGFyZW50T2ZUYXJnZXQgPSBwYXRoLmxlbmd0aCA+IDEgPyBwYXRoW3BhdGgubGVuZ3RoIC0gMl0gOiB1bmRlZmluZWQ7XG4gICAgaWYgKHBhcmVudE9mVGFyZ2V0KSB0aGlzLm9uRXhwYW5kKHBhcmVudE9mVGFyZ2V0KTtcblxuICAgIGlmKHRhcmdldC51cmwpe1xuICAgICAgY29uc3QgY3VycmVudCA9IHRoaXMuX3JvdXRlci51cmwuc3BsaXQoJyMnKVswXTtcbiAgICAgIGlmIChjdXJyZW50ICE9PSB0YXJnZXQudXJsKSB0aGlzLl9yb3V0ZXIubmF2aWdhdGVCeVVybCh0YXJnZXQudXJsKTtcbiAgICB9XG5cbiAgICB0aGlzLm9uQ2xpY2suZW1pdCh0YXJnZXQpO1xuICB9XG5cbiAgb25NZW51Q2xpY2sobWVudTogRHNjTWVudSk6IHZvaWQge1xuICAgIHRoaXMub25DbGljay5lbWl0KG1lbnUpO1xuICB9XG5cbiAgcHJpdmF0ZSBfZmluZFBhdGgobm9kZXM6IERzY01lbnVbXSwgcHJlZGljYXRlOiAobTogRHNjTWVudSkgPT4gYm9vbGVhbik6IERzY01lbnVbXXtcbiAgICBmb3IoY29uc3QgbiBvZiBub2Rlcyl7XG4gICAgICBpZihwcmVkaWNhdGUobikpIHJldHVybiBbbl07XG4gICAgICBpZiAobi5jaGlsZHJlbiAmJiBuLmNoaWxkcmVuLmxlbmd0aCl7XG4gICAgICAgIGNvbnN0IGNoaWxkUGF0aCA9IHRoaXMuX2ZpbmRQYXRoKG4uY2hpbGRyZW4sIHByZWRpY2F0ZSk7XG4gICAgICAgIGlmIChjaGlsZFBhdGgubGVuZ3RoKSByZXR1cm4gW24sIC4uLmNoaWxkUGF0aF07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGlzRXhwYW5kZWQobWVudTogRHNjTWVudSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmV4cGFuZGVkSXRlbXMuZ2V0KG1lbnUudGl0bGUpIHx8IGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSBfZmlsdGVySW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLnNlYXJjaC52YWx1ZUNoYW5nZXNcbiAgICAgIC5waXBlKFxuICAgICAgICBtYXAodGV4dCA9PiAodGV4dCAmJiB0ZXh0Lmxlbmd0aCA+IDMgPyB0ZXh0IDogJycpKSxcbiAgICAgICAgZGlzdGluY3RVbnRpbENoYW5nZWQoKSxcbiAgICAgICAgZGVib3VuY2VUaW1lKDQ1MCksXG4gICAgICAgIHRha2VVbnRpbCh0aGlzLl9vbkRlc3Ryb3kpXG4gICAgICApXG4gICAgICAuc3Vic2NyaWJlKHZhbHVlID0+IHtcbiAgICAgICAgY29uc3QgbWVudUF1eCA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGhpcy5tZW51KSk7XG4gICAgICAgIHRoaXMubWVudUZpbHRlcmVkID0gdmFsdWUgPyB0aGlzLl9kb0ZpbHRlcihtZW51QXV4LCB2YWx1ZSkgOiBtZW51QXV4O1xuICAgICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9kb0ZpbHRlcihtZW51TGlzdDogRHNjTWVudVtdLCB2YWx1ZTogc3RyaW5nKTogRHNjQ29sbGFwc2libGVNZW51W10ge1xuICAgIGxldCBtZW51TGlzdEZpbHRlcmVkOiBEc2NDb2xsYXBzaWJsZU1lbnVbXSA9IFtdO1xuXG4gICAgbWVudUxpc3QuZm9yRWFjaCgobWVudTogRHNjTWVudSkgPT4ge1xuICAgICAgaWYgKCFtZW51LmRpc2FibGVkKSB7XG4gICAgICAgIGlmIChpc0VtcHR5QXJyYXkobWVudS5jaGlsZHJlbikpIHtcbiAgICAgICAgICBpZiAodGhpcy5fY29tcGFyZShtZW51LnRpdGxlLCB2YWx1ZSkpIG1lbnVMaXN0RmlsdGVyZWQucHVzaChtZW51KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBjb2xsYXBzaWJsZU1lbnUgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG1lbnUpKTtcbiAgICAgICAgICBjb2xsYXBzaWJsZU1lbnUuY2hpbGRyZW4gPSB0aGlzLl9kb0ZpbHRlcihjb2xsYXBzaWJsZU1lbnUuY2hpbGRyZW4sIHZhbHVlKTtcbiAgICAgICAgICBjb2xsYXBzaWJsZU1lbnUuZXhwYW5kZWQgPSB0cnVlO1xuICAgICAgICAgIGlmIChpc05vdEVtcHR5QXJyYXkoY29sbGFwc2libGVNZW51LmNoaWxkcmVuKSkgbWVudUxpc3RGaWx0ZXJlZC5wdXNoKGNvbGxhcHNpYmxlTWVudSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBtZW51TGlzdEZpbHRlcmVkO1xuICB9XG5cbiAgcHJpdmF0ZSBfY29tcGFyZShzMTogc3RyaW5nLCBzMjogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHJlcGxhY2VBY2NlbnRzKHMxKS50cmltKCkudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhyZXBsYWNlQWNjZW50cyhzMikudHJpbSgpLnRvTG93ZXJDYXNlKCkpO1xuICB9XG59XG4iLCI8bWF0LXNpZGVuYXYtY29udGFpbmVyIFtuZ0NsYXNzXT1cImN1c3RvbUNsYXNzXCI+XG4gIDxtYXQtc2lkZW5hdiBjbGFzcz1cIm1hdC1lbGV2YXRpb24tejJcIlxuICAgICAgICAgICAgICAgW21vZGVdPVwibW9kZVwiXG4gICAgICAgICAgICAgICBbb3BlbmVkXT1cIm9wZW5lZFwiXG4gICAgICAgICAgICAgICBbZml4ZWRJblZpZXdwb3J0XT1cImZpeGVkSW5WaWV3cG9ydFwiXG4gICAgICAgICAgICAgICBbZml4ZWRUb3BHYXBdPVwiZml4ZWRUb3BHYXBcIlxuICAgICAgICAgICAgICAgW2ZpeGVkQm90dG9tR2FwXT1cImZpeGVkQm90dG9tR2FwXCJcbiAgICAgICAgICAgICAgIChvcGVuZWRDaGFuZ2UpPVwidGhpcy5vcGVuZWRDaGFuZ2UuZW1pdCgkZXZlbnQpXCI+XG4gICAgPGRpdiBjbGFzcz1cIm1hdC1zaWRlbmF2LWNvbnRlbnRcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJtYXQtc2lkZW5hdi1oZWFkZXJcIlxuICAgICAgICAgICAgKm5nSWY9XCJjb3ZlclNyYyB8fCBzaG93RmlsdGVyXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJtYXQtc2lkZW5hdi1oZWFkZXJfX2NvdmVyXCJcbiAgICAgICAgICAgICAqbmdJZj1cImNvdmVyU3JjXCI+XG4gICAgICAgICAgPGltZyBbc3JjXT1cImNvdmVyU3JjXCIgYWx0PVwiXCIgdGFiaW5kZXg9XCItMVwiPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm1hdC1zaWRlbmF2LWhlYWRlcl9fZmlsdGVyXCJcbiAgICAgICAgICAgICAqbmdJZj1cInNob3dGaWx0ZXJcIj5cbiAgICAgICAgICA8ZHNjLWlucHV0IHBsYWNlaG9sZGVyPVwiUGVzcXVpc2FyXCJcbiAgICAgICAgICAgICAgICAgICAgIGljb25QcmVmaXg9XCJzZWFyY2hcIlxuICAgICAgICAgICAgICAgICAgICAgW2Zvcm1Db250cm9sXT1cInNlYXJjaFwiPlxuICAgICAgICAgIDwvZHNjLWlucHV0PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgPG1hdC1uYXYtbGlzdCByb2xlPVwibmF2aWdhdGlvblwiPlxuICAgICAgICA8ZHNjLXNpZGVuYXYtaXRlbSAqbmdGb3I9XCJsZXQgbWVudSBvZiBtZW51RmlsdGVyZWRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICBbbWVudV09XCJtZW51XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgW2V4cGFuZGVkXT1cImlzRXhwYW5kZWQobWVudSlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAoZXhwYW5kQ2hhbmdlKT1cIm9uRXhwYW5kKG1lbnUpXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKG9uQ2xpY2spPVwib25NZW51Q2xpY2soJGV2ZW50KVwiPlxuICAgICAgICA8L2RzYy1zaWRlbmF2LWl0ZW0+XG4gICAgICA8L21hdC1uYXYtbGlzdD5cbiAgICA8L2Rpdj5cbiAgPC9tYXQtc2lkZW5hdj5cbiAgPG1hdC1zaWRlbmF2LWNvbnRlbnQgcm9sZT1cIm1haW5cIj5cbiAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gIDwvbWF0LXNpZGVuYXYtY29udGVudD5cbjwvbWF0LXNpZGVuYXYtY29udGFpbmVyPlxuIl19