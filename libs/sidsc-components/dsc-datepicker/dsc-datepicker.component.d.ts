import { AfterViewInit, ElementRef, EventEmitter, OnInit } from '@angular/core';
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { BaseComponent } from 'sidsc-components/core';
import * as i0 from "@angular/core";
export declare const DEFAULT_DATE_FORMATS: {
    parse: {
        dateInput: string;
    };
    display: {
        dateInput: string;
        monthYearLabel: string;
        dateA11yLabel: string;
        monthYearA11yLabel: string;
    };
};
export declare const MONTH_YEAR_DATE_FORMATS: {
    parse: {
        dateInput: string;
    };
    display: {
        dateInput: string;
        monthYearLabel: string;
        dateA11yLabel: string;
        monthYearA11yLabel: string;
    };
};
export declare function dateFormatsFactory(): {
    parse: {
        dateInput: string;
    };
    display: {
        dateInput: string;
        monthYearLabel: string;
        dateA11yLabel: string;
        monthYearA11yLabel: string;
    };
};
export declare function getDateFormats(component: DscDatepickerComponent): {
    parse: {
        dateInput: string;
    };
    display: {
        dateInput: string;
        monthYearLabel: string;
        dateA11yLabel: string;
        monthYearA11yLabel: string;
    };
};
export declare class DscDatepickerComponent extends BaseComponent<Date> implements OnInit, AfterViewInit {
    ngControl: NgControl;
    private _dateAdapter;
    private _dateFormats;
    matInput: MatInput;
    dateInputElement: ElementRef<HTMLInputElement>;
    maxDate: Date | null;
    minDate: Date | null;
    private _customDateFormat;
    get customDateFormat(): string | null;
    set customDateFormat(value: string | null);
    get effectiveDateFormat(): string;
    picker: any;
    private _monthYear;
    get monthYear(): boolean;
    set monthYear(value: boolean);
    datepickerFilter: (date: Date | null) => boolean;
    get touchUi(): boolean;
    set touchUi(value: boolean | string);
    private _touchUi;
    isActive: boolean;
    tooltipId: string;
    dateChange: EventEmitter<any>;
    dateInput: EventEmitter<any>;
    opened: EventEmitter<any>;
    closed: EventEmitter<any>;
    constructor(ngControl: NgControl, parentForm: NgForm, parentFormGroup: FormGroupDirective, _dateAdapter: DateAdapter<Date>, _dateFormats: any);
    ngOnInit(): void;
    private _initValidators;
    ngAfterViewInit(): void;
    private _updateDateFormats;
    get computedPlaceholder(): string;
    private _maskInit;
    private _generateMaskPattern;
    private _createDefinitions;
    private _validateDay;
    private _validateMonth;
    private isInvalidDayForMonth;
    private monthValidation;
    private dayValidation;
    private _validateYear;
    private _isDigit;
    private _isLastYearDigit;
    private _readDay;
    private _readMonth;
    private _buildProvisionalYear;
    private _isValidDateConsideringLeapYear;
    private _isLeapYear;
    private _getTokenMeta;
    private _readNumberFromBuffer;
    private _applyInputMask;
    onDateSelection(date: Date): void;
    private _getValidators;
    private _filterValidator;
    private _matchesFilter;
    private _minValidator;
    private _maxValidator;
    get formFieldClasses(): string[];
    static ɵfac: i0.ɵɵFactoryDeclaration<DscDatepickerComponent, [{ optional: true; self: true; }, { optional: true; }, { optional: true; }, { optional: true; }, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DscDatepickerComponent, "dsc-datepicker", never, { "maxDate": { "alias": "maxDate"; "required": false; }; "minDate": { "alias": "minDate"; "required": false; }; "customDateFormat": { "alias": "customDateFormat"; "required": false; }; "monthYear": { "alias": "monthYear"; "required": false; }; "datepickerFilter": { "alias": "datepickerFilter"; "required": false; }; "touchUi": { "alias": "touchUi"; "required": false; }; }, { "dateChange": "dateChange"; "dateInput": "dateInput"; "opened": "opened"; "closed": "closed"; }, never, never, true, never>;
}
