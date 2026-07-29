import { EventEmitter } from '@angular/core';
import { DscAccordionItem } from './shared/dsc-accordion-item';
import * as i0 from "@angular/core";
export declare class DscAccordionComponent {
    get multi(): boolean;
    set multi(value: boolean | string);
    private _multi;
    accordionItems?: DscAccordionItem[];
    iconStyle: 'outlined' | 'filled' | 'rounded' | 'sharp' | 'two-tone';
    sizeTitle: 'standard' | 'small' | 'large';
    itemExpanded: EventEmitter<void>;
    afterCollapse: EventEmitter<void>;
    afterExpand: EventEmitter<void>;
    closed: EventEmitter<void>;
    opened: EventEmitter<void>;
    onClick(item: any, $event: any): void;
    getIconClass(): string;
    getTitleSizeClass(): string;
    getHeadingTag(level?: string): string;
    getTitleHtml(item: DscAccordionItem): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<DscAccordionComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DscAccordionComponent, "dsc-accordion", never, { "multi": { "alias": "multi"; "required": false; }; "accordionItems": { "alias": "accordionItems"; "required": false; }; "iconStyle": { "alias": "iconStyle"; "required": false; }; "sizeTitle": { "alias": "sizeTitle"; "required": false; }; }, { "itemExpanded": "itemExpanded"; "afterCollapse": "afterCollapse"; "afterExpand": "afterExpand"; "closed": "closed"; "opened": "opened"; }, never, never, true, never>;
}
