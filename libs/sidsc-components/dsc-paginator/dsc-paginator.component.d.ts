import { AfterViewInit, ChangeDetectorRef, OnInit } from '@angular/core';
import { _MatPaginatorBase, MatPaginatorIntl } from '@angular/material/paginator';
import { BooleanInput } from '@angular/cdk/coercion';
import { Observable } from 'rxjs';
import { Option } from 'sidsc-components/dsc-select';
import { BreakpointMatcherService } from 'sidsc-components/core';
import * as i0 from "@angular/core";
export type DscPaginatorOptions = {
    /** Number of items to display on a page. By default set to 50. */
    pageSize?: number;
    /** The set of provided page size options to display to the user. */
    pageSizeOptions?: number[];
    /** Whether to hide the page size selection UI from the user. */
    hidePageSize?: boolean;
    /** Whether to show the first/last buttons UI to the user. */
    showFirstLastButtons?: boolean;
};
export declare class DscPaginatorComponent extends _MatPaginatorBase<DscPaginatorOptions> implements OnInit, AfterViewInit {
    private _breakpointMatcher;
    options: Option[];
    readonly _pageSizeLabelId: string;
    size$: Observable<string>;
    constructor(intl: MatPaginatorIntl, changeDetectorRef: ChangeDetectorRef, _breakpointMatcher: BreakpointMatcherService, defaults?: DscPaginatorOptions);
    get hidePaginatorRangeLabel(): boolean;
    set hidePaginatorRangeLabel(value: BooleanInput);
    private _hidePaginatorRangeLabel;
    ngOnInit(): void;
    ngAfterViewInit(): void;
    get actualPageDescription(): {
        current: number;
        total: number;
    };
    static ɵfac: i0.ɵɵFactoryDeclaration<DscPaginatorComponent, [null, null, null, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DscPaginatorComponent, "dsc-paginator", never, { "disabled": { "alias": "disabled"; "required": false; }; "hidePaginatorRangeLabel": { "alias": "hidePaginatorRangeLabel"; "required": false; }; }, {}, never, never, true, never>;
}
