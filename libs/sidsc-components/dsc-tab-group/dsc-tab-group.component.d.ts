import { AfterViewInit, ChangeDetectorRef, EventEmitter, QueryList, TemplateRef } from '@angular/core';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { NumberInput } from '@angular/cdk/coercion';
import { DscTabComponent } from './dsc-tab/dsc-tab.component';
import * as i0 from "@angular/core";
export type DscTabGroupSize = 'large' | 'standard';
export type DscIconStyle = 'outlined' | 'filled' | 'rounded' | 'sharp' | 'two-tone';
export interface DscTabModel {
    label: string;
    icon?: string;
    iconStyle?: DscIconStyle;
    disabled?: boolean;
    content: TemplateRef<any>;
}
export declare class DscTabGroupComponent implements AfterViewInit {
    private cdr;
    matTabGroup: MatTabGroup;
    tabs: QueryList<DscTabComponent>;
    animationDuration: string;
    tabSize: 'large' | 'standard';
    set dynamicTabs(value: DscTabModel[]);
    get dynamicTabs(): DscTabModel[];
    get selectedIndex(): number;
    set selectedIndex(value: NumberInput);
    private _selectedIndex;
    private _dynamicTabs;
    selectedIndexChange: EventEmitter<number>;
    selectedTabChange: EventEmitter<MatTabChangeEvent>;
    focusChange: EventEmitter<MatTabChangeEvent>;
    constructor(cdr: ChangeDetectorRef);
    ngAfterViewInit(): void;
    ngAfterContentInit(): void;
    private remergeProjectedTabs;
    iconClass(style: DscIconStyle): string;
    isImage(icon: any): boolean;
    onSelectedIndexChange(event: number): void;
    onSelectedTabChange(event: MatTabChangeEvent): void;
    onFocusChange(event: MatTabChangeEvent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DscTabGroupComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DscTabGroupComponent, "dsc-tab-group", never, { "animationDuration": { "alias": "animationDuration"; "required": false; }; "tabSize": { "alias": "tabSize"; "required": false; }; "dynamicTabs": { "alias": "dynamicTabs"; "required": false; }; "selectedIndex": { "alias": "selectedIndex"; "required": false; }; }, { "selectedIndexChange": "selectedIndexChange"; "selectedTabChange": "selectedTabChange"; "focusChange": "focusChange"; }, ["tabs"], ["dsc-tab"], true, never>;
}
