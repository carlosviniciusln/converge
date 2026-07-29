import { AfterViewInit, ElementRef, OnDestroy } from "@angular/core";
import * as i0 from "@angular/core";
export type DscTagSize = 'standard' | 'small';
export type DscTagVariant = 'highlight' | 'accent' | 'ceu' | 'danger' | 'neutral' | 'success' | 'uva' | 'information' | 'warning' | 'limao';
export declare class DscTagsComponent implements AfterViewInit, OnDestroy {
    private _tagSize;
    private _tagDarkVariant;
    showTooltip: boolean;
    get size(): DscTagSize;
    set size(value: DscTagSize);
    maxWidth?: string;
    icon?: string;
    label: string;
    variant: DscTagVariant;
    get darkVariant(): boolean;
    set darkVariant(value: boolean | string);
    labelEl: ElementRef<HTMLElement>;
    private resizeObserver?;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    getComputedClass(tag: DscTagVariant): string;
    private checkTruncation;
    static ɵfac: i0.ɵɵFactoryDeclaration<DscTagsComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DscTagsComponent, "dsc-tags", never, { "size": { "alias": "size"; "required": false; }; "maxWidth": { "alias": "maxWidth"; "required": false; }; "icon": { "alias": "icon"; "required": false; }; "label": { "alias": "label"; "required": false; }; "variant": { "alias": "variant"; "required": false; }; "darkVariant": { "alias": "darkVariant"; "required": false; }; }, {}, never, never, true, never>;
}
