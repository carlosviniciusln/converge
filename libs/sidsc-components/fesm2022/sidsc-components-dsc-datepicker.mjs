import * as i0 from '@angular/core';
import { EventEmitter, ElementRef, Component, ViewEncapsulation, Optional, Self, Inject, ViewChild, Input, Output } from '@angular/core';
import * as i1 from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import * as i3 from '@angular/material/form-field';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { NgIf, NgClass } from '@angular/common';
import * as i4 from '@angular/material/icon';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import * as i7 from '@angular/material/datepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import * as i2 from '@angular/material/core';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import { DateFnsAdapter } from '@angular/material-date-fns-adapter';
import * as i6 from '@angular/material/input';
import { MatInput, MatInputModule } from '@angular/material/input';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import * as i8 from '@angular/cdk/a11y';
import { A11yModule } from '@angular/cdk/a11y';
import { ptBR } from 'date-fns/locale';
import Inputmask from 'inputmask/dist/inputmask.es6.js';
import { BaseComponent } from 'sidsc-components/core';
import * as i5 from 'sidsc-components/dsc-tooltip';
import { DscTooltipModule } from 'sidsc-components/dsc-tooltip';

const DEFAULT_DATE_FORMATS = {
    parse: { dateInput: 'dd/MM/yyyy' },
    display: {
        dateInput: 'dd/MM/yyyy',
        monthYearLabel: 'MMM yyyy',
        dateA11yLabel: 'dd/MM/yyyy',
        monthYearA11yLabel: 'MMMM yyyy',
    },
};
const MONTH_YEAR_DATE_FORMATS = {
    parse: { dateInput: 'MM/yyyy' },
    display: {
        dateInput: 'MM/yyyy',
        monthYearLabel: 'MMM yyyy',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM yyyy',
    },
};
function dateFormatsFactory() {
    return {
        parse: { ...DEFAULT_DATE_FORMATS.parse },
        display: { ...DEFAULT_DATE_FORMATS.display }
    };
}
function getDateFormats(component) {
    const format = component.effectiveDateFormat;
    return {
        parse: { dateInput: format },
        display: {
            dateInput: format,
            monthYearLabel: 'MMM yyyy',
            dateA11yLabel: 'dd/MM/yyyy',
            monthYearA11yLabel: 'MMMM yyyy',
        },
    };
}
class DscDatepickerComponent extends BaseComponent {
    get customDateFormat() {
        return this._customDateFormat;
    }
    set customDateFormat(value) {
        this._customDateFormat = value;
        this._updateDateFormats();
        this._maskInit();
    }
    get effectiveDateFormat() {
        if (this._customDateFormat)
            return this._customDateFormat;
        return this._monthYear ? 'MM/yyyy' : 'dd/MM/yyyy';
    }
    get monthYear() {
        return this._monthYear;
    }
    set monthYear(value) {
        this._monthYear = coerceBooleanProperty(value);
        this._updateDateFormats();
        this._maskInit();
    }
    get touchUi() {
        return this._touchUi;
    }
    set touchUi(value) {
        this._touchUi = coerceBooleanProperty(value);
    }
    constructor(ngControl, parentForm, parentFormGroup, _dateAdapter, _dateFormats) {
        super(ngControl, parentForm, parentFormGroup);
        this.ngControl = ngControl;
        this._dateAdapter = _dateAdapter;
        this._dateFormats = _dateFormats;
        this._customDateFormat = null;
        this._monthYear = false;
        this._touchUi = false;
        this.isActive = false;
        this.tooltipId = `tt-${cryptoRandom()}`;
        this.dateChange = new EventEmitter();
        this.dateInput = new EventEmitter();
        this.opened = new EventEmitter();
        this.closed = new EventEmitter();
        this._filterValidator = (control) => {
            const controlValue = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(control.value));
            return !controlValue || this._matchesFilter(controlValue)
                ? null
                : { 'matDatepickerFilter': true };
        };
        this._minValidator = (control) => {
            const controlValue = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(control.value));
            const min = this.minDate;
            return !min || !controlValue || this._dateAdapter.compareDate(min, controlValue) <= 0
                ? null : { 'matDatepickerMin': { 'min': min, 'actual': controlValue } };
        };
        this._maxValidator = (control) => {
            const controlValue = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(control.value));
            const max = this.maxDate;
            return !max || !controlValue || this._dateAdapter.compareDate(max, controlValue) >= 0
                ? null : { 'matDatepickerMax': { 'max': max, 'actual': controlValue } };
        };
        if (this.ngControl)
            this.ngControl.valueAccessor = this;
        if (!this._dateAdapter)
            throw Error('MatDatepicker: No provider found for DateAdapter.');
    }
    ngOnInit() {
        this._initValidators();
        this._updateDateFormats();
    }
    _initValidators() {
        if (this.ngControl) {
            const control = this.ngControl.control;
            control?.addValidators(this._getValidators());
            control?.updateValueAndValidity();
        }
    }
    ngAfterViewInit() {
        this._maskInit();
    }
    _updateDateFormats() {
        const fmt = this.effectiveDateFormat;
        this._dateFormats.parse.dateInput = fmt;
        this._dateFormats.display.dateInput = fmt;
    }
    get computedPlaceholder() {
        if (this.placeholder)
            return this.placeholder;
        if (this.customDateFormat) {
            return this.customDateFormat.replace(/d/gi, 'D').replace(/M/g, 'M').replace(/y/gi, 'A');
        }
        return this.monthYear ? 'MM/AAAA' : 'DD/MM/AAAA';
    }
    _maskInit() {
        if (!this.dateInputElement || !this.dateInputElement.nativeElement)
            return;
        const input = this.dateInputElement.nativeElement;
        const currentValue = input.value;
        Inputmask.remove(input);
        const format = this.effectiveDateFormat;
        const tokens = format.match(/(d+|M+|y+)/g) || [];
        const separators = format.split(/d+|M+|y+/).filter(Boolean);
        const maskPattern = this._generateMaskPattern(tokens, separators);
        const definitions = this._createDefinitions(tokens, separators);
        this._applyInputMask(input, maskPattern, definitions);
        if (currentValue)
            input.value = currentValue;
    }
    _generateMaskPattern(tokens, separators) {
        return tokens.map((token, i) => '9'.repeat(token.length) + (separators[i] || '')).join('');
    }
    _createDefinitions(tokens, separators) {
        return {
            '9': {
                validator: (chrs, maskset, pos) => {
                    let charIndex = 0;
                    for (let i = 0; i < tokens.length; i++) {
                        const token = tokens[i];
                        const start = charIndex;
                        const end = charIndex + token.length - 1;
                        if (pos >= start && pos <= end) {
                            if (token.startsWith('d'))
                                return this._validateDay(chrs, pos, start, maskset);
                            if (token.startsWith('M'))
                                return this._validateMonth(chrs, pos, start, maskset);
                            return this._validateYear(chrs, pos, start, maskset, token.length);
                        }
                        charIndex += token.length + (separators[i]?.length || 0);
                    }
                    return /^\d$/.test(chrs);
                }
            }
        };
    }
    _validateDay(chrs, pos, start, maskset) {
        if (pos === start)
            return /^[0-3]$/.test(chrs);
        if (pos === start + 1) {
            const firstDigit = maskset.buffer[start];
            if (firstDigit === '0')
                return /^[1-9]$/.test(chrs); // Bloqueia 00
            if (firstDigit === '3')
                return /^[0-1]$/.test(chrs);
            return /^[0-9]$/.test(chrs);
        }
        return /^[0-9]$/.test(chrs);
    }
    _validateMonth(chrs, pos, start, maskset) {
        if (pos === start) {
            return /^[0-1]$/.test(chrs);
        }
        if (pos === start + 1) {
            const firstDigit = maskset.buffer[start];
            if (firstDigit === '0' && !/^[1-9]$/.test(chrs))
                return false;
            if (firstDigit === '1' && !/^[0-2]$/.test(chrs))
                return false;
            const dayMeta = this._getTokenMeta('d');
            let day = null;
            if (dayMeta) {
                day = this._readNumberFromBuffer(maskset.buffer, dayMeta.start, dayMeta.len);
            }
            if (day !== null) {
                const month = parseInt(`${firstDigit}${chrs}`, 10);
                this.monthValidation(month);
                this.dayValidation(day, month);
                if (this.isInvalidDayForMonth(day, month))
                    return false;
                if (month === 2 && day > 29)
                    return false;
            }
            return true;
        }
        return /^[0-9]$/.test(chrs);
    }
    isInvalidDayForMonth(day, month) {
        const monthsWith30OrLess = [2, 4, 6, 9, 11];
        return day === 31 && monthsWith30OrLess.includes(month);
    }
    monthValidation(month) {
        return month >= 1 && month <= 12;
    }
    dayValidation(day, month) {
        return day === 30 && month === 2;
    }
    _validateYear(chrs, pos, start, maskset, yearLen) {
        if (!this._isDigit(chrs))
            return false;
        if (!this._isLastYearDigit(pos, start, yearLen))
            return true;
        const day = this._readDay(maskset);
        const month = this._readMonth(maskset);
        if (day == null || month == null)
            return true;
        const year = this._buildProvisionalYear(chrs, pos, start, yearLen, maskset);
        if (year == null)
            return true;
        return this._isValidDateConsideringLeapYear(day, month, year);
    }
    _isDigit(ch) {
        return /^\d$/.test(ch);
    }
    _isLastYearDigit(pos, start, yearLen) {
        return pos === start + yearLen - 1;
    }
    _readDay(maskset) {
        const meta = this._getTokenMeta('d');
        return meta ? this._readNumberFromBuffer(maskset.buffer, meta.start, meta.len) : null;
    }
    _readMonth(maskset) {
        const meta = this._getTokenMeta('M');
        return meta ? this._readNumberFromBuffer(maskset.buffer, meta.start, meta.len) : null;
    }
    _buildProvisionalYear(chrs, pos, start, len, maskset) {
        const digits = [...maskset.buffer.slice(start, start + len)];
        digits[pos - start] = chrs;
        if (digits.some(d => !this._isDigit(d)))
            return null;
        return parseInt(digits.join(''), 10);
    }
    _isValidDateConsideringLeapYear(day, month, year) {
        return month !== 2 || (day <= 29 && (day !== 29 || this._isLeapYear(year)));
    }
    _isLeapYear(y) {
        return (y % 400 === 0) || (y % 4 === 0 && y % 100 !== 0);
    }
    _getTokenMeta(tokenChar) {
        const format = this.effectiveDateFormat;
        const tokens = format.match(/(d+|M+|y+)/g) || [];
        const separators = format.split(/d+|M+|y+/).filter(Boolean);
        let index = 0;
        for (let i = 0; i < tokens.length; i++) {
            const t = tokens[i];
            const len = t.length;
            if (t.startsWith(tokenChar)) {
                return { start: index, len };
            }
            index += len + (separators[i]?.length || 0);
        }
        return null;
    }
    _readNumberFromBuffer(buffer, start, len) {
        const str = buffer.slice(start, start + len).join('');
        const onlyDigits = new RegExp(`^\\d{${len}}$`);
        return onlyDigits.test(str) ? parseInt(str, 10) : null;
    }
    _applyInputMask(input, maskPattern, definitions) {
        const maskSkeleton = this.customDateFormat
            ? this.customDateFormat.replace(/d/gi, 'D').replace(/y/gi, 'A')
            : (this.monthYear ? 'MM/AAAA' : 'DD/MM/AAAA');
        const im = new Inputmask({
            mask: maskPattern,
            placeholder: maskSkeleton,
            clearIncomplete: true,
            showMaskOnHover: false,
            showMaskOnFocus: true,
            definitions,
            oncomplete: () => {
                const value = input.value;
                const yearMatch = value.match(/(\d{4})$/);
                if (yearMatch && yearMatch[1] === '0000') {
                    input.value = value.replace(/0000$/, '2000');
                }
            }
        });
        im.mask(input);
    }
    onDateSelection(date) {
        if (this.monthYear) {
            const format = this.customDateFormat || MONTH_YEAR_DATE_FORMATS.display.dateInput;
            const formattedValue = this._dateAdapter.format(date, format);
            this.dateInputElement.nativeElement.value = formattedValue;
            this.val = date;
            this.dateChange.emit(date);
            this.picker.close();
        }
    }
    _getValidators() {
        return [this._minValidator, this._maxValidator, this._filterValidator];
    }
    _matchesFilter(value) {
        const filter = this.datepickerFilter;
        return !filter || filter(value);
    }
    get formFieldClasses() {
        return [
            this.ngControl && this.ngControl.value?.length
                ? 'mat-mdc-form-field--filled'
                : 'mat-mdc-form-field--empty',
            this.readOnly ? 'mat-mdc-form-field--readonly' : '',
            this.ngControl &&
                this.ngControl.invalid &&
                (this.ngControl.touched || this.ngControl.dirty) &&
                !this.readOnly
                ? 'error-field'
                : '',
            (this.isActive && !this.errorText) || (this.ngControl && this.ngControl.value?.length)
                ? 'active-field'
                : ''
        ].filter(Boolean);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscDatepickerComponent, deps: [{ token: i1.NgControl, optional: true, self: true }, { token: i1.NgForm, optional: true }, { token: i1.FormGroupDirective, optional: true }, { token: i2.DateAdapter, optional: true }, { token: MAT_DATE_FORMATS }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.12", type: DscDatepickerComponent, isStandalone: true, selector: "dsc-datepicker", inputs: { maxDate: "maxDate", minDate: "minDate", customDateFormat: "customDateFormat", monthYear: "monthYear", datepickerFilter: "datepickerFilter", touchUi: "touchUi" }, outputs: { dateChange: "dateChange", dateInput: "dateInput", opened: "opened", closed: "closed" }, providers: [
            { provide: MAT_DATE_LOCALE, useValue: ptBR },
            { provide: DateAdapter, useClass: DateFnsAdapter, deps: [MAT_DATE_LOCALE] },
            {
                provide: MAT_DATE_FORMATS,
                useFactory: dateFormatsFactory
            },
            { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }
        ], viewQueries: [{ propertyName: "matInput", first: true, predicate: MatInput, descendants: true, static: true }, { propertyName: "dateInputElement", first: true, predicate: ["dateInputRef"], descendants: true, read: ElementRef, static: true }, { propertyName: "picker", first: true, predicate: ["picker"], descendants: true }], usesInheritance: true, ngImport: i0, template: "<mat-label class=\"mat-label\"\n           [class]=\"formFieldLabelSize\"\n           [ngClass]=\"{\n           'error-label': this.ngControl &&\n           (this.ngControl.invalid && (ngControl.touched || ngControl.dirty)) &&\n           !readOnly\n           }\">\n  {{ label }}\n  <span *ngIf=\"labelHint\"\n        class=\"mat-label__hint\">{{ labelHint }}</span>\n  <mat-icon *ngIf=\"labelHintTooltip\"\n            [ngClass]=\"{'disabled-tooltip': disabled, 'readonly-tooltip': readOnly}\"\n            [dscTooltip]=\"labelHintTooltip\"\n            [dscTooltipDisabled]=\"disabled || readOnly\"\n            dscTooltipVariant='highlight'\n            dscTooltipPosition=\"right\">\n    info_outline\n  </mat-icon>\n</mat-label>\n<mat-form-field cdkMonitorSubtreeFocus\n                [hintLabel]=\"formFieldHint\"\n                [class]=\"formFieldSize\"\n                [ngClass]=\"formFieldClasses\">\n  <input matInput #dateInputRef\n         [name]=\"name\"\n         [placeholder]=\"computedPlaceholder\"\n         [errorStateMatcher]=\"matcher\"\n         [disabled]=\"disabled\"\n         [readonly]=\"readOnly\"\n         [(ngModel)]=\"val\"\n         [matDatepicker]=\"picker\"\n         [min]=\"minDate\"\n         [max]=\"maxDate\"\n         [matDatepickerFilter]=\"datepickerFilter\"\n         (focus)=\"isActive = true\"\n         (blur)=\"onTouched()\"\n         (dateChange)=\"dateChange.emit($event)\"\n         (dateInput)=\"dateInput.emit($event)\">\n         \n        <mat-hint *ngIf=\"labelHintTooltip\"\n          [id]=\"tooltipId\"\n          class=\"cdk-visually-hidden\">\n          {{ labelHintTooltip }}\n        </mat-hint>\n\n  <mat-datepicker-toggle matIconSuffix\n                         [disabled]=\"disabled || readOnly\"\n                         [disableRipple]=\"true\"\n                         [for]=\"picker\">\n  </mat-datepicker-toggle>\n  <mat-datepicker [touchUi]=\"touchUi\"\n                  [startView]=\"monthYear ? 'multi-year' : 'month'\"\n                  [panelClass]=\"monthYear ? 'month-year-picker' : ''\"\n                  (monthSelected)=\"onDateSelection($event)\"\n                  (opened)=\"opened.emit($event)\"\n                  (closed)=\"closed.emit($event)\"\n                  #picker>\n  </mat-datepicker>\n  <mat-error *ngIf='!readOnly'>\n    <mat-icon inline=\"true\">warning</mat-icon>\n    {{ errorText }}\n  </mat-error>\n</mat-form-field>\n", styles: ["dsc-datepicker .mat-label{display:flex;gap:var(--dsc-spacing-nano);margin-bottom:var(--dsc-spacing-quark);color:var(--dsc-color-content-neutral-5)}dsc-datepicker .mat-label__hint{color:var(--dsc-color-content-neutral-3)}dsc-datepicker .mat-label .mat-icon{font-size:var(--dsc-icon-size-small);height:var(--dsc-icon-size-small);width:var(--dsc-icon-size-small);color:var(--dsc-color-bg-neutral-7)}dsc-datepicker .mat-label--small{font:var(--dsc-typography-text-small-600);font-feature-settings:\"ss01\"}dsc-datepicker .mat-label--small .mat-label__hint{font:var(--dsc-typography-text-small-400)}dsc-datepicker .mat-label--standard{font:var(--dsc-typography-text-standard-600);font-feature-settings:\"ss01\"}dsc-datepicker .mat-label--standard .mat-label__hint{font:var(--dsc-typography-text-standard-400)}dsc-datepicker .mat-label--large{font:var(--dsc-typography-text-large-600);font-feature-settings:\"ss01\"}dsc-datepicker .mat-label--large .mat-label__hint{font:var(--dsc-typography-text-large-400)}dsc-datepicker .mat-mdc-form-field{display:flex;flex-direction:column;width:100%;--dsc-label-row-height: 24px}dsc-datepicker .mat-mdc-form-field--large .mdc-text-field{height:var(--dsc-input-height-large)}dsc-datepicker .mat-mdc-form-field--large .mdc-text-field .mat-mdc-form-field-infix{height:var(--dsc-input-height-large)}dsc-datepicker .mat-mdc-form-field--large .mdc-text-field .mat-mdc-form-field-infix .mat-mdc-input-element{font:var(--dsc-typography-text-large-400);font-feature-settings:\"ss01\";height:var(--dsc-input-height-large);padding:0 var(--dsc-spacing-nano)!important}dsc-datepicker .mat-mdc-form-field--large .mdc-text-field .mat-mdc-form-field-infix .mat-mdc-select{display:flex;height:var(--dsc-input-height-large)}dsc-datepicker .mat-mdc-form-field--large .mdc-text-field .mat-mdc-form-field-infix .mat-mdc-select .mat-mdc-select-value{padding:0 var(--dsc-spacing-nano)!important}dsc-datepicker .mat-mdc-form-field--large .mdc-text-field .mat-mdc-form-field-infix .mat-mdc-select .mat-mdc-select-value .mat-mdc-select-value-text,dsc-datepicker .mat-mdc-form-field--large .mdc-text-field .mat-mdc-form-field-infix .mat-mdc-select .mat-mdc-select-value .mat-mdc-select-placeholder{font:var(--dsc-typography-text-large-400);font-feature-settings:\"ss01\";color:var(--dsc-color-content-neutral-5)}dsc-datepicker .mat-mdc-form-field--large .mdc-text-field .mat-mdc-form-field-icon-suffix .mat-icon,dsc-datepicker .mat-mdc-form-field--large .mdc-text-field .mat-mdc-form-field-icon-suffix .mat-datepicker-toggle-default-icon,dsc-datepicker .mat-mdc-form-field--large .mdc-text-field .mat-mdc-form-field-icon-prefix .mat-icon,dsc-datepicker .mat-mdc-form-field--large .mdc-text-field .mat-mdc-form-field-icon-prefix .mat-datepicker-toggle-default-icon{font-size:var(--dsc-icon-size-large)!important;height:var(--dsc-icon-size-large)!important;width:var(--dsc-icon-size-large)!important}dsc-datepicker .mat-mdc-form-field--large .mdc-text-field .mat-mdc-form-field-icon-suffix .mdc-icon-button,dsc-datepicker .mat-mdc-form-field--large .mdc-text-field .mat-mdc-form-field-icon-prefix .mdc-icon-button{height:var(--dsc-input-height-large);width:var(--dsc-input-height-large)}dsc-datepicker .mat-mdc-form-field--large .mdc-text-field .mat-mdc-form-field-icon-suffix .mdc-icon-button .mat-mdc-button-touch-target,dsc-datepicker .mat-mdc-form-field--large .mdc-text-field .mat-mdc-form-field-icon-prefix .mdc-icon-button .mat-mdc-button-touch-target{height:var(--dsc-input-height-large);width:var(--dsc-input-height-large)}dsc-datepicker .mat-mdc-form-field--large .mdc-text-field .mat-mdc-form-field-icon-suffix .mdc-icon-button .mat-icon,dsc-datepicker .mat-mdc-form-field--large .mdc-text-field .mat-mdc-form-field-icon-prefix .mdc-icon-button .mat-icon{font-size:var(--dsc-icon-size-large);height:var(--dsc-icon-size-large);width:var(--dsc-icon-size-large)}dsc-datepicker .mat-mdc-form-field--standard .mdc-text-field{height:var(--dsc-input-height-standard)}dsc-datepicker .mat-mdc-form-field--standard .mdc-text-field .mat-mdc-form-field-infix{height:var(--dsc-input-height-standard)}dsc-datepicker .mat-mdc-form-field--standard .mdc-text-field .mat-mdc-form-field-infix .mat-mdc-input-element{font:var(--dsc-typography-text-standard-400);font-feature-settings:\"ss01\";height:var(--dsc-input-height-standard);padding:0 var(--dsc-spacing-nano)!important}dsc-datepicker .mat-mdc-form-field--standard .mdc-text-field .mat-mdc-form-field-infix .mat-mdc-select{display:flex;height:var(--dsc-input-height-standard)}dsc-datepicker .mat-mdc-form-field--standard .mdc-text-field .mat-mdc-form-field-infix .mat-mdc-select .mat-mdc-select-value{padding:0 var(--dsc-spacing-nano)!important}dsc-datepicker .mat-mdc-form-field--standard .mdc-text-field .mat-mdc-form-field-infix .mat-mdc-select .mat-mdc-select-value .mat-mdc-select-value-text,dsc-datepicker .mat-mdc-form-field--standard .mdc-text-field .mat-mdc-form-field-infix .mat-mdc-select .mat-mdc-select-value .mat-mdc-select-placeholder{font:var(--dsc-typography-text-standard-400);font-feature-settings:\"ss01\";color:var(--dsc-color-content-neutral-5)}dsc-datepicker .mat-mdc-form-field--standard .mdc-text-field .mat-mdc-form-field-icon-suffix .mat-icon,dsc-datepicker .mat-mdc-form-field--standard .mdc-text-field .mat-mdc-form-field-icon-suffix .mat-datepicker-toggle-default-icon,dsc-datepicker .mat-mdc-form-field--standard .mdc-text-field .mat-mdc-form-field-icon-prefix .mat-icon,dsc-datepicker .mat-mdc-form-field--standard .mdc-text-field .mat-mdc-form-field-icon-prefix .mat-datepicker-toggle-default-icon{font-size:var(--dsc-icon-size-medium)!important;height:var(--dsc-icon-size-medium)!important;width:var(--dsc-icon-size-medium)!important}dsc-datepicker .mat-mdc-form-field--standard .mdc-text-field .mat-mdc-form-field-icon-suffix .mdc-icon-button,dsc-datepicker .mat-mdc-form-field--standard .mdc-text-field .mat-mdc-form-field-icon-prefix .mdc-icon-button{height:var(--dsc-input-height-standard);width:var(--dsc-input-height-standard)}dsc-datepicker .mat-mdc-form-field--standard .mdc-text-field .mat-mdc-form-field-icon-suffix .mdc-icon-button .mat-mdc-button-touch-target,dsc-datepicker .mat-mdc-form-field--standard .mdc-text-field .mat-mdc-form-field-icon-prefix .mdc-icon-button .mat-mdc-button-touch-target{height:var(--dsc-input-height-standard);width:var(--dsc-input-height-standard)}dsc-datepicker .mat-mdc-form-field--standard .mdc-text-field .mat-mdc-form-field-icon-suffix .mdc-icon-button .mat-icon,dsc-datepicker .mat-mdc-form-field--standard .mdc-text-field .mat-mdc-form-field-icon-prefix .mdc-icon-button .mat-icon{font-size:var(--dsc-icon-size-medium);height:var(--dsc-icon-size-medium);width:var(--dsc-icon-size-medium)}dsc-datepicker .mat-mdc-form-field--small .mdc-text-field{height:var(--dsc-input-height-small)}dsc-datepicker .mat-mdc-form-field--small .mdc-text-field .mat-mdc-form-field-infix{height:var(--dsc-input-height-small)}dsc-datepicker .mat-mdc-form-field--small .mdc-text-field .mat-mdc-form-field-infix .mat-mdc-input-element{font:var(--dsc-typography-text-small-400);font-feature-settings:\"ss01\";height:var(--dsc-input-height-small);padding:0 var(--dsc-spacing-nano)!important}dsc-datepicker .mat-mdc-form-field--small .mdc-text-field .mat-mdc-form-field-infix .mat-mdc-select{display:flex;height:var(--dsc-input-height-small)}dsc-datepicker .mat-mdc-form-field--small .mdc-text-field .mat-mdc-form-field-infix .mat-mdc-select .mat-mdc-select-value{padding:0 var(--dsc-spacing-nano)!important}dsc-datepicker .mat-mdc-form-field--small .mdc-text-field .mat-mdc-form-field-infix .mat-mdc-select .mat-mdc-select-value .mat-mdc-select-value-text,dsc-datepicker .mat-mdc-form-field--small .mdc-text-field .mat-mdc-form-field-infix .mat-mdc-select .mat-mdc-select-value .mat-mdc-select-placeholder{font:var(--dsc-typography-text-small-400);font-feature-settings:\"ss01\";color:var(--dsc-color-content-neutral-5)}dsc-datepicker .mat-mdc-form-field--small .mdc-text-field .mat-mdc-form-field-icon-suffix .mat-icon,dsc-datepicker .mat-mdc-form-field--small .mdc-text-field .mat-mdc-form-field-icon-suffix .mat-datepicker-toggle-default-icon,dsc-datepicker .mat-mdc-form-field--small .mdc-text-field .mat-mdc-form-field-icon-prefix .mat-icon,dsc-datepicker .mat-mdc-form-field--small .mdc-text-field .mat-mdc-form-field-icon-prefix .mat-datepicker-toggle-default-icon{font-size:var(--dsc-icon-size-small)!important;height:var(--dsc-icon-size-small)!important;width:var(--dsc-icon-size-small)!important}dsc-datepicker .mat-mdc-form-field--small .mdc-text-field .mat-mdc-form-field-icon-suffix .mdc-icon-button,dsc-datepicker .mat-mdc-form-field--small .mdc-text-field .mat-mdc-form-field-icon-prefix .mdc-icon-button{height:var(--dsc-input-height-small);width:var(--dsc-input-height-small)}dsc-datepicker .mat-mdc-form-field--small .mdc-text-field .mat-mdc-form-field-icon-suffix .mdc-icon-button .mat-mdc-button-touch-target,dsc-datepicker .mat-mdc-form-field--small .mdc-text-field .mat-mdc-form-field-icon-prefix .mdc-icon-button .mat-mdc-button-touch-target{height:var(--dsc-input-height-small);width:var(--dsc-input-height-small)}dsc-datepicker .mat-mdc-form-field--small .mdc-text-field .mat-mdc-form-field-icon-suffix .mdc-icon-button .mat-icon,dsc-datepicker .mat-mdc-form-field--small .mdc-text-field .mat-mdc-form-field-icon-prefix .mdc-icon-button .mat-icon{font-size:var(--dsc-icon-size-small);height:var(--dsc-icon-size-small);width:var(--dsc-icon-size-small)}dsc-datepicker .mat-mdc-form-field--small{--dsc-label-row-height: 18px}dsc-datepicker .mat-mdc-form-field--large{--dsc-label-row-height: 27px}dsc-datepicker .mat-mdc-form-field-subscript-wrapper{padding:var(--dsc-spacing-quark) 0 0 0;min-height:var(--dsc-label-row-height);line-height:var(--dsc-label-row-height)}dsc-datepicker .mat-mdc-form-field.cdk-keyboard-focused .mdc-text-field{outline:var(--dsc-border-width-thick) solid var(--dsc-color-state-border-focus-dark);outline-offset:-4px;border-radius:var(--dsc-border-radius-nano)!important}dsc-datepicker .mat-mdc-form-field .cdk-text-field-autofilled{height:100%!important;position:fixed!important;z-index:-1!important}dsc-datepicker .mat-mdc-form-field--filled .mdc-text-field{border-color:var(--dsc-color-bg-neutral-6)}dsc-datepicker .mat-mdc-form-field--filled .mdc-text-field .mat-mdc-input-element{color:var(--dsc-color-content-neutral-5)}dsc-datepicker .mat-mdc-form-field--filled .mdc-text-field .mat-mdc-select .mat-mdc-select-trigger .mat-mdc-select-arrow,dsc-datepicker .mat-mdc-form-field--filled .mdc-text-field .mat-mdc-select .mat-mdc-select-trigger .mat-mdc-select-placeholder,dsc-datepicker .mat-mdc-form-field--filled .mdc-text-field .mat-mdc-select .mat-mdc-select-trigger .mat-mdc-select-value-text{color:var(--dsc-color-content-neutral-7)}dsc-datepicker .mat-mdc-form-field--readonly{pointer-events:none!important}dsc-datepicker .mat-mdc-form-field--readonly .mdc-text-field{background-color:var(--dsc-color-state-bg-readonly-1)!important;border-color:var(--dsc-color-state-border-readonly-1)!important}dsc-datepicker .mat-mdc-form-field--readonly .mdc-text-field .mat-mdc-input-element{color:var(--dsc-color-state-content-readonly-1)!important}dsc-datepicker .mat-mdc-form-field--readonly .mdc-text-field .mat-mdc-select .mat-mdc-select-trigger .mat-mdc-select-arrow{color:var(--dsc-color-state-bg-readonly-2)!important}dsc-datepicker .mat-mdc-form-field--readonly .mdc-text-field .mat-mdc-select .mat-mdc-select-trigger .mat-mdc-select-placeholder,dsc-datepicker .mat-mdc-form-field--readonly .mdc-text-field .mat-mdc-select .mat-mdc-select-trigger .mat-mdc-select-value-text{color:var(--dsc-color-state-content-readonly-1)!important}dsc-datepicker .mat-mdc-form-field--readonly .mdc-text-field .mat-mdc-form-field-icon-suffix .mat-icon,dsc-datepicker .mat-mdc-form-field--readonly .mdc-text-field .mat-mdc-form-field-icon-prefix .mat-icon{color:var(--dsc-color-state-bg-readonly-2)!important}dsc-datepicker .mat-mdc-form-field--readonly .mdc-text-field .mat-mdc-form-field-icon-suffix .mat-datepicker-toggle .mdc-icon-button,dsc-datepicker .mat-mdc-form-field--readonly .mdc-text-field .mat-mdc-form-field-icon-prefix .mat-datepicker-toggle .mdc-icon-button{pointer-events:none!important;color:var(--dsc-color-state-bg-readonly-2)!important}dsc-datepicker .mat-mdc-form-field--readonly .mdc-text-field .mat-mdc-form-field-infix{padding:0;min-height:unset}dsc-datepicker .mat-mdc-form-field--readonly .mdc-text-field .mat-mdc-form-field-infix .mat-mdc-input-element::placeholder{color:var(--dsc-color-state-content-readonly-1)!important}dsc-datepicker .mat-mdc-form-field .mdc-text-field{border:var(--dsc-border-width-hairline) solid var(--dsc-color-border-neutral-4);background-color:var(--dsc-color-bg-neutral-1);border-radius:var(--dsc-border-radius-nano);padding:0}dsc-datepicker .mat-mdc-form-field .mdc-text-field .mdc-notched-outline__leading,dsc-datepicker .mat-mdc-form-field .mdc-text-field .mdc-notched-outline__notch,dsc-datepicker .mat-mdc-form-field .mdc-text-field .mdc-notched-outline__trailing{border:none!important}dsc-datepicker .mat-mdc-form-field .mdc-text-field .mdc-notched-outline__leading:focus,dsc-datepicker .mat-mdc-form-field .mdc-text-field .mdc-notched-outline__notch:focus,dsc-datepicker .mat-mdc-form-field .mdc-text-field .mdc-notched-outline__trailing:focus{border:none!important}dsc-datepicker .mat-mdc-form-field .mdc-text-field .mat-mdc-form-field-infix{padding:0;min-height:unset}dsc-datepicker .mat-mdc-form-field .mdc-text-field .mat-mdc-form-field-infix .mat-mdc-input-element::placeholder{color:var(--dsc-color-content-neutral-3)}dsc-datepicker .mat-mdc-form-field .mdc-text-field .mat-mdc-form-field-infix .mat-mdc-select .mat-mdc-select-trigger .mat-mdc-select-arrow{color:var(--dsc-color-bg-neutral-7)}dsc-datepicker .mat-mdc-form-field .mdc-text-field .mat-mdc-form-field-infix .mat-mdc-select .mat-mdc-select-trigger .mat-mdc-select-arrow-wrapper{height:var(--dsc-icon-size-medium);padding:var(--dsc-spacing-nano)!important;margin-right:var(--dsc-spacing-nano)!important}dsc-datepicker .mat-mdc-form-field .mdc-text-field .mat-mdc-form-field-infix .mat-mdc-select .mat-mdc-select-trigger .mat-mdc-select-placeholder{color:var(--dsc-color-content-neutral-3)}dsc-datepicker .mat-mdc-form-field .mdc-text-field .mat-mdc-form-field-infix input::-ms-reveal{display:none}dsc-datepicker .mat-mdc-form-field .mdc-text-field .mat-mdc-form-field-icon-suffix,dsc-datepicker .mat-mdc-form-field .mdc-text-field .mat-mdc-form-field-icon-prefix{display:flex;align-items:center;justify-content:center;padding:0;margin-left:var(--dsc-spacing-nano)}dsc-datepicker .mat-mdc-form-field .mdc-text-field .mat-mdc-form-field-icon-suffix .mat-icon,dsc-datepicker .mat-mdc-form-field .mdc-text-field .mat-mdc-form-field-icon-prefix .mat-icon{padding:0;color:var(--dsc-color-bg-neutral-6)}dsc-datepicker .mat-mdc-form-field .mdc-text-field .mat-mdc-form-field-icon-suffix button .mat-icon,dsc-datepicker .mat-mdc-form-field .mdc-text-field .mat-mdc-form-field-icon-prefix button .mat-icon{color:var(--dsc-color-bg-neutral-7)!important}dsc-datepicker .mat-mdc-form-field .mdc-text-field .mat-mdc-form-field-icon-suffix .mdc-icon-button,dsc-datepicker .mat-mdc-form-field .mdc-text-field .mat-mdc-form-field-icon-prefix .mdc-icon-button{display:flex;align-items:center;justify-content:center;padding:0}dsc-datepicker .mat-mdc-form-field .mdc-text-field .mat-mdc-form-field-icon-suffix .mat-datepicker-toggle .mdc-icon-button,dsc-datepicker .mat-mdc-form-field .mdc-text-field .mat-mdc-form-field-icon-prefix .mat-datepicker-toggle .mdc-icon-button{color:var(--dsc-color-bg-neutral-7)}dsc-datepicker .mat-mdc-form-field .mdc-text-field--disabled{border-color:var(--dsc-color-state-border-disabled-1);background-color:var(--dsc-color-state-bg-disabled-2)}dsc-datepicker .mat-mdc-form-field .mdc-text-field--disabled .mat-mdc-input-element::placeholder{color:var(--dsc-color-state-content-disabled-1)!important}dsc-datepicker .mat-mdc-form-field .mdc-text-field--disabled .mat-mdc-input-element{color:var(--dsc-color-state-content-disabled-1)!important}dsc-datepicker .mat-mdc-form-field .mdc-text-field--disabled .mat-mdc-select .mat-mdc-select-trigger .mat-mdc-select-arrow{color:var(--dsc-color-state-bg-disabled-5)!important}dsc-datepicker .mat-mdc-form-field .mdc-text-field--disabled .mat-mdc-select .mat-mdc-select-trigger .mat-mdc-select-placeholder,dsc-datepicker .mat-mdc-form-field .mdc-text-field--disabled .mat-mdc-select .mat-mdc-select-trigger .mat-mdc-select-value-text{color:var(--dsc-color-state-content-disabled-1)!important}dsc-datepicker .mat-mdc-form-field .mdc-text-field--disabled .mat-mdc-form-field-icon-suffix .mat-icon,dsc-datepicker .mat-mdc-form-field .mdc-text-field--disabled .mat-mdc-form-field-icon-prefix .mat-icon{color:var(--dsc-color-state-bg-disabled-5)}dsc-datepicker .mat-mdc-form-field .mdc-text-field--disabled .mat-mdc-form-field-icon-suffix .mat-datepicker-toggle .mdc-icon-button,dsc-datepicker .mat-mdc-form-field .mdc-text-field--disabled .mat-mdc-form-field-icon-prefix .mat-datepicker-toggle .mdc-icon-button{color:var(--dsc-color-state-bg-disabled-5)}dsc-datepicker .mat-mdc-form-field .mdc-text-field:not(.mdc-text-field--disabled):not(.mdc-text-field--invalid):hover{border-color:var(--dsc-color-border-highlight-1)}dsc-datepicker .mat-mdc-form-field .mdc-text-field:not(.mdc-text-field--disabled):not(.mdc-text-field--invalid):active{border-color:var(--dsc-color-border-neutral-6)}dsc-datepicker .mat-mdc-form-field .mdc-text-field:not(.mdc-text-field--disabled).mdc-text-field--invalid.mat-mdc-form-field--readonly{border-color:var(--dsc-color-border-danger-1)!important;border-radius:var(--dsc-border-radius-nano)}dsc-datepicker .mat-mdc-form-field .mdc-text-field:not(.mdc-text-field--disabled).mdc-text-field--invalid.mat-mdc-form-field--readonly .mat-mdc-select .mat-mdc-select-arrow{color:var(--dsc-color-bg-neutral-5)}dsc-datepicker .mat-mdc-form-field-hint-wrapper,dsc-datepicker .mat-mdc-form-field-error-wrapper{font:var(--dsc-typography-text-small-400);font-feature-settings:\"ss01\";padding:var(--dsc-spacing-quark) 0 0 0!important}dsc-datepicker .mat-mdc-form-field-error-wrapper{border-radius:var(--dsc-border-radius-nano)}dsc-datepicker .mat-mdc-form-field-error-wrapper .mat-mdc-form-field-error{display:flex;gap:var(--dsc-spacing-nano);color:var(--dsc-color-content-danger-2);min-height:20px;align-items:center}dsc-datepicker .mat-mdc-form-field-error-wrapper .mat-mdc-form-field-error .mat-label{color:var(--dsc-color-content-danger-2)}dsc-datepicker .mat-mdc-form-field-error-wrapper .mat-mdc-form-field-error .mat-icon{color:var(--dsc-color-bg-danger-4);min-height:var(--dsc-icon-size-nano);min-width:var(--dsc-icon-size-nano);font-size:var(--dsc-icon-size-nano);align-self:baseline}dsc-datepicker .mat-mdc-form-field-hint-wrapper .mat-mdc-form-field-hint{color:var(--dsc-color-content-neutral-3)}dsc-datepicker .mat-mdc-form-field .month-year-picker .mat-calendar-period-button{display:none!important}.error-label{font:var(--dsc-typography-text-standard-600);font-feature-settings:\"ss01\";color:var(--dsc-color-content-danger-2)!important}.error-field .mdc-text-field{border-color:var(--dsc-color-content-danger-2)!important}.active-field .mdc-text-field{border-color:var(--dsc-color-border-neutral-6)!important}.disabled-tooltip{color:var(--dsc-color-state-bg-disabled-5)!important}.readonly-tooltip{color:var(--dsc-color-state-bg-readonly-2)!important}.cdk-program-focused:not(.cdk-mouse-focused) .mat-calendar-body-active.mat-calendar-body-disabled>.mat-calendar-body-cell-content{background-color:var(--dsc-color-bg-neutral-1)!important;border-color:var(--dsc-color-state-border-focus-dark)}.cdk-program-focused:not(.cdk-mouse-focused)>.mat-calendar-body-cell-content{background-color:var(--dsc-color-bg-neutral-1)!important;border-color:var(--dsc-color-state-border-focus-dark)}.cdk-visually-hidden{border:0!important;clip:rect(0 0 0 0)!important;height:1px!important;margin:-1px!important;overflow:hidden!important;padding:0!important;position:absolute!important;white-space:nowrap!important;width:1px!important}.mat-calendar .mat-calendar-header .mat-calendar-controls .mdc-button__label .mat-calendar-arrow{fill:var(--dsc-color-bg-neutral-7)}.mat-calendar .mat-calendar-header .mat-calendar-controls .mat-mdc-icon-button{--mat-mdc-button-persistent-ripple-color: var(--dsc-color-bg-neutral-7) !important}.mat-calendar .mat-calendar-header .mat-calendar-controls .mat-mdc-icon-button.mat-mdc-button-base{width:var(--dsc-icon-size-quark)!important;height:var(--dsc-icon-size-quark)!important;padding:20px!important}.mat-calendar .mat-calendar-header .mat-calendar-controls .mat-mdc-icon-button:not([disabled]):hover{background-color:color-mix(in srgb,var(--dsc-color-state-bg-neutral-hover-on-light),var(--dsc-opacity-state-hover-1))}.mat-calendar .mat-calendar-header .mat-calendar-controls .mat-mdc-icon-button:not([disabled]):active{background-color:color-mix(in srgb,var(--dsc-color-state-bg-neutral-active-on-light),var(--dsc-opacity-state-active-1))}.mat-calendar .mat-calendar-header .mat-calendar-controls .mat-mdc-button.mat-mdc-button-base{height:40px;border-radius:var(--dsc-border-radius-nano)}.mat-calendar .mat-calendar-header .mat-calendar-controls .mat-mdc-button.mat-mdc-outlined-button{--mat-mdc-button-persistent-ripple-color: var(--dsc-color-bg-neutral-7)}.mat-calendar .mat-calendar-header .mat-calendar-controls .mat-calendar-period-button{font:var(--dsc-typography-text-small-600);font-feature-settings:\"ss01\";color:var(--dsc-color-content-neutral-4)!important}.mat-calendar .mat-calendar-header .mat-calendar-controls .mat-calendar-period-button:not([disabled]):hover{background-color:color-mix(in srgb,var(--dsc-color-state-bg-neutral-hover-on-light),var(--dsc-opacity-state-hover-1))}.mat-calendar .mat-calendar-header .mat-calendar-controls .mat-calendar-period-button:not([disabled]):active{background-color:color-mix(in srgb,var(--dsc-color-state-bg-neutral-active-on-light),var(--dsc-opacity-state-active-1))}.mat-calendar .mat-calendar-header .mat-calendar-controls .mat-calendar-period-button[disabled]{background:var(--dsc-color-bg-neutral-2)!important;color:var(--dsc-color-content-neutral-2)!important}.mat-calendar .mat-calendar-header .mat-calendar-controls .mat-calendar-previous-button,.mat-calendar .mat-calendar-header .mat-calendar-controls .mat-calendar-next-button{color:var(--dsc-color-bg-neutral-7)!important}.mat-calendar .mat-calendar-table-header th{color:var(--dsc-color-content-neutral-3)}.mat-calendar .mat-calendar-table-header-divider:after{color:var(--dsc-color-border-neutral-3)}.mat-calendar .mat-calendar-content{font:var(--dsc-typography-text-small-400);font-feature-settings:\"ss01\"}.mat-calendar .mat-calendar-content .mat-calendar-body-label{color:var(--dsc-color-content-neutral-5)}.mat-calendar .mat-calendar-content .mat-calendar-body-cell .mat-calendar-body-cell-content{color:var(--dsc-color-content-neutral-5);background-color:var(--dsc-color-bg-neutral-1);border-width:var(--dsc-border-width-hairline);border-radius:var(--dsc-border-radius-pill)}.mat-calendar .mat-calendar-content .mat-calendar-body-cell:not(.mat-calendar-body-disabled) .mat-calendar-body-cell-content.mat-calendar-body-selected{background-color:var(--dsc-color-bg-highlight-5);color:var(--dsc-color-content-neutral-1)}.mat-calendar .mat-calendar-content .mat-calendar-body-cell:not(.mat-calendar-body-disabled) .mat-calendar-body-cell-content.mat-calendar-body-selected.mat-calendar-body-today{box-shadow:none}.mat-calendar .mat-calendar-content .mat-calendar-body-cell:not(.mat-calendar-body-disabled) .mat-calendar-body-cell-content.mat-calendar-body-today:not(.mat-calendar-body-selected){background-color:var(--dsc-color-bg-neutral-1);border-color:var(--dsc-color-bg-neutral-4)}.mat-calendar .mat-calendar-content .mat-calendar-body-cell:not(.mat-calendar-body-disabled):hover .mat-calendar-body-cell-content:not(.mat-calendar-body-selected){background-color:var(--dsc-color-bg-highlight-1)!important}.mat-calendar .mat-calendar-content .mat-calendar-body-cell:not(.mat-calendar-body-disabled).mat-calendar-body-active .mat-calendar-body-cell-content:not(.mat-calendar-body-selected){background-color:transparent!important}.mat-calendar .mat-calendar-content .mat-calendar-body-cell.mat-calendar-body-disabled .mat-calendar-body-cell-content{background-color:var(--dsc-color-bg-neutral-2);color:var(--dsc-color-content-neutral-2)!important}\n"], dependencies: [{ kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i1.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "ngmodule", type: MatFormFieldModule }, { kind: "component", type: i3.MatFormField, selector: "mat-form-field", inputs: ["hideRequiredMarker", "color", "floatLabel", "appearance", "subscriptSizing", "hintLabel"], exportAs: ["matFormField"] }, { kind: "directive", type: i3.MatLabel, selector: "mat-label" }, { kind: "directive", type: i3.MatHint, selector: "mat-hint", inputs: ["align", "id"] }, { kind: "directive", type: i3.MatError, selector: "mat-error, [matError]", inputs: ["id"] }, { kind: "directive", type: i3.MatSuffix, selector: "[matSuffix], [matIconSuffix], [matTextSuffix]", inputs: ["matTextSuffix"] }, { kind: "ngmodule", type: MatButtonModule }, { kind: "ngmodule", type: MatIconModule }, { kind: "component", type: i4.MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "ngmodule", type: MatTooltipModule }, { kind: "ngmodule", type: DscTooltipModule }, { kind: "directive", type: i5.DscTooltipDirective, selector: "[dscTooltip]", inputs: ["dscTooltipPosition", "dscTooltipVariant", "dscTooltipPositionAtOrigin", "dscTooltipDisabled", "dscTooltipShowDelay", "dscTooltipHideDelay", "dscTooltip"] }, { kind: "ngmodule", type: MatInputModule }, { kind: "directive", type: i6.MatInput, selector: "input[matInput], textarea[matInput], select[matNativeControl],      input[matNativeControl], textarea[matNativeControl]", inputs: ["disabled", "id", "placeholder", "name", "required", "type", "errorStateMatcher", "aria-describedby", "value", "readonly"], exportAs: ["matInput"] }, { kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "ngmodule", type: MatDatepickerModule }, { kind: "component", type: i7.MatDatepicker, selector: "mat-datepicker", exportAs: ["matDatepicker"] }, { kind: "directive", type: i7.MatDatepickerInput, selector: "input[matDatepicker]", inputs: ["matDatepicker", "min", "max", "matDatepickerFilter"], exportAs: ["matDatepickerInput"] }, { kind: "component", type: i7.MatDatepickerToggle, selector: "mat-datepicker-toggle", inputs: ["for", "tabIndex", "aria-label", "disabled", "disableRipple"], exportAs: ["matDatepickerToggle"] }, { kind: "ngmodule", type: A11yModule }, { kind: "directive", type: i8.CdkMonitorFocus, selector: "[cdkMonitorElementFocus], [cdkMonitorSubtreeFocus]", outputs: ["cdkFocusChange"], exportAs: ["cdkMonitorFocus"] }], encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscDatepickerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'dsc-datepicker', standalone: true, encapsulation: ViewEncapsulation.None, imports: [
                        FormsModule,
                        MatFormFieldModule,
                        MatButtonModule,
                        MatIconModule,
                        MatTooltipModule,
                        DscTooltipModule,
                        MatInputModule,
                        NgIf,
                        NgClass,
                        MatDatepickerModule,
                        A11yModule
                    ], providers: [
                        { provide: MAT_DATE_LOCALE, useValue: ptBR },
                        { provide: DateAdapter, useClass: DateFnsAdapter, deps: [MAT_DATE_LOCALE] },
                        {
                            provide: MAT_DATE_FORMATS,
                            useFactory: dateFormatsFactory
                        },
                        { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }
                    ], template: "<mat-label class=\"mat-label\"\n           [class]=\"formFieldLabelSize\"\n           [ngClass]=\"{\n           'error-label': this.ngControl &&\n           (this.ngControl.invalid && (ngControl.touched || ngControl.dirty)) &&\n           !readOnly\n           }\">\n  {{ label }}\n  <span *ngIf=\"labelHint\"\n        class=\"mat-label__hint\">{{ labelHint }}</span>\n  <mat-icon *ngIf=\"labelHintTooltip\"\n            [ngClass]=\"{'disabled-tooltip': disabled, 'readonly-tooltip': readOnly}\"\n            [dscTooltip]=\"labelHintTooltip\"\n            [dscTooltipDisabled]=\"disabled || readOnly\"\n            dscTooltipVariant='highlight'\n            dscTooltipPosition=\"right\">\n    info_outline\n  </mat-icon>\n</mat-label>\n<mat-form-field cdkMonitorSubtreeFocus\n                [hintLabel]=\"formFieldHint\"\n                [class]=\"formFieldSize\"\n                [ngClass]=\"formFieldClasses\">\n  <input matInput #dateInputRef\n         [name]=\"name\"\n         [placeholder]=\"computedPlaceholder\"\n         [errorStateMatcher]=\"matcher\"\n         [disabled]=\"disabled\"\n         [readonly]=\"readOnly\"\n         [(ngModel)]=\"val\"\n         [matDatepicker]=\"picker\"\n         [min]=\"minDate\"\n         [max]=\"maxDate\"\n         [matDatepickerFilter]=\"datepickerFilter\"\n         (focus)=\"isActive = true\"\n         (blur)=\"onTouched()\"\n         (dateChange)=\"dateChange.emit($event)\"\n         (dateInput)=\"dateInput.emit($event)\">\n         \n        <mat-hint *ngIf=\"labelHintTooltip\"\n          [id]=\"tooltipId\"\n          class=\"cdk-visually-hidden\">\n          {{ labelHintTooltip }}\n        </mat-hint>\n\n  <mat-datepicker-toggle matIconSuffix\n                         [disabled]=\"disabled || readOnly\"\n                         [disableRipple]=\"true\"\n                         [for]=\"picker\">\n  </mat-datepicker-toggle>\n  <mat-datepicker [touchUi]=\"touchUi\"\n                  [startView]=\"monthYear ? 'multi-year' : 'month'\"\n                  [panelClass]=\"monthYear ? 'month-year-picker' : ''\"\n                  (monthSelected)=\"onDateSelection($event)\"\n                  (opened)=\"opened.emit($event)\"\n                  (closed)=\"closed.emit($event)\"\n                  #picker>\n  </mat-datepicker>\n  <mat-error *ngIf='!readOnly'>\n    <mat-icon inline=\"true\">warning</mat-icon>\n    {{ errorText }}\n  </mat-error>\n</mat-form-field>\n", styles: ["dsc-datepicker .mat-label{display:flex;gap:var(--dsc-spacing-nano);margin-bottom:var(--dsc-spacing-quark);color:var(--dsc-color-content-neutral-5)}dsc-datepicker .mat-label__hint{color:var(--dsc-color-content-neutral-3)}dsc-datepicker .mat-label .mat-icon{font-size:var(--dsc-icon-size-small);height:var(--dsc-icon-size-small);width:var(--dsc-icon-size-small);color:var(--dsc-color-bg-neutral-7)}dsc-datepicker .mat-label--small{font:var(--dsc-typography-text-small-600);font-feature-settings:\"ss01\"}dsc-datepicker .mat-label--small .mat-label__hint{font:var(--dsc-typography-text-small-400)}dsc-datepicker .mat-label--standard{font:var(--dsc-typography-text-standard-600);font-feature-settings:\"ss01\"}dsc-datepicker .mat-label--standard .mat-label__hint{font:var(--dsc-typography-text-standard-400)}dsc-datepicker .mat-label--large{font:var(--dsc-typography-text-large-600);font-feature-settings:\"ss01\"}dsc-datepicker .mat-label--large .mat-label__hint{font:var(--dsc-typography-text-large-400)}dsc-datepicker .mat-mdc-form-field{display:flex;flex-direction:column;width:100%;--dsc-label-row-height: 24px}dsc-datepicker .mat-mdc-form-field--large .mdc-text-field{height:var(--dsc-input-height-large)}dsc-datepicker .mat-mdc-form-field--large .mdc-text-field .mat-mdc-form-field-infix{height:var(--dsc-input-height-large)}dsc-datepicker .mat-mdc-form-field--large .mdc-text-field .mat-mdc-form-field-infix .mat-mdc-input-element{font:var(--dsc-typography-text-large-400);font-feature-settings:\"ss01\";height:var(--dsc-input-height-large);padding:0 var(--dsc-spacing-nano)!important}dsc-datepicker .mat-mdc-form-field--large .mdc-text-field .mat-mdc-form-field-infix .mat-mdc-select{display:flex;height:var(--dsc-input-height-large)}dsc-datepicker .mat-mdc-form-field--large .mdc-text-field .mat-mdc-form-field-infix .mat-mdc-select .mat-mdc-select-value{padding:0 var(--dsc-spacing-nano)!important}dsc-datepicker .mat-mdc-form-field--large .mdc-text-field .mat-mdc-form-field-infix .mat-mdc-select .mat-mdc-select-value .mat-mdc-select-value-text,dsc-datepicker .mat-mdc-form-field--large .mdc-text-field .mat-mdc-form-field-infix .mat-mdc-select .mat-mdc-select-value .mat-mdc-select-placeholder{font:var(--dsc-typography-text-large-400);font-feature-settings:\"ss01\";color:var(--dsc-color-content-neutral-5)}dsc-datepicker .mat-mdc-form-field--large .mdc-text-field .mat-mdc-form-field-icon-suffix .mat-icon,dsc-datepicker .mat-mdc-form-field--large .mdc-text-field .mat-mdc-form-field-icon-suffix .mat-datepicker-toggle-default-icon,dsc-datepicker .mat-mdc-form-field--large .mdc-text-field .mat-mdc-form-field-icon-prefix .mat-icon,dsc-datepicker .mat-mdc-form-field--large .mdc-text-field .mat-mdc-form-field-icon-prefix .mat-datepicker-toggle-default-icon{font-size:var(--dsc-icon-size-large)!important;height:var(--dsc-icon-size-large)!important;width:var(--dsc-icon-size-large)!important}dsc-datepicker .mat-mdc-form-field--large .mdc-text-field .mat-mdc-form-field-icon-suffix .mdc-icon-button,dsc-datepicker .mat-mdc-form-field--large .mdc-text-field .mat-mdc-form-field-icon-prefix .mdc-icon-button{height:var(--dsc-input-height-large);width:var(--dsc-input-height-large)}dsc-datepicker .mat-mdc-form-field--large .mdc-text-field .mat-mdc-form-field-icon-suffix .mdc-icon-button .mat-mdc-button-touch-target,dsc-datepicker .mat-mdc-form-field--large .mdc-text-field .mat-mdc-form-field-icon-prefix .mdc-icon-button .mat-mdc-button-touch-target{height:var(--dsc-input-height-large);width:var(--dsc-input-height-large)}dsc-datepicker .mat-mdc-form-field--large .mdc-text-field .mat-mdc-form-field-icon-suffix .mdc-icon-button .mat-icon,dsc-datepicker .mat-mdc-form-field--large .mdc-text-field .mat-mdc-form-field-icon-prefix .mdc-icon-button .mat-icon{font-size:var(--dsc-icon-size-large);height:var(--dsc-icon-size-large);width:var(--dsc-icon-size-large)}dsc-datepicker .mat-mdc-form-field--standard .mdc-text-field{height:var(--dsc-input-height-standard)}dsc-datepicker .mat-mdc-form-field--standard .mdc-text-field .mat-mdc-form-field-infix{height:var(--dsc-input-height-standard)}dsc-datepicker .mat-mdc-form-field--standard .mdc-text-field .mat-mdc-form-field-infix .mat-mdc-input-element{font:var(--dsc-typography-text-standard-400);font-feature-settings:\"ss01\";height:var(--dsc-input-height-standard);padding:0 var(--dsc-spacing-nano)!important}dsc-datepicker .mat-mdc-form-field--standard .mdc-text-field .mat-mdc-form-field-infix .mat-mdc-select{display:flex;height:var(--dsc-input-height-standard)}dsc-datepicker .mat-mdc-form-field--standard .mdc-text-field .mat-mdc-form-field-infix .mat-mdc-select .mat-mdc-select-value{padding:0 var(--dsc-spacing-nano)!important}dsc-datepicker .mat-mdc-form-field--standard .mdc-text-field .mat-mdc-form-field-infix .mat-mdc-select .mat-mdc-select-value .mat-mdc-select-value-text,dsc-datepicker .mat-mdc-form-field--standard .mdc-text-field .mat-mdc-form-field-infix .mat-mdc-select .mat-mdc-select-value .mat-mdc-select-placeholder{font:var(--dsc-typography-text-standard-400);font-feature-settings:\"ss01\";color:var(--dsc-color-content-neutral-5)}dsc-datepicker .mat-mdc-form-field--standard .mdc-text-field .mat-mdc-form-field-icon-suffix .mat-icon,dsc-datepicker .mat-mdc-form-field--standard .mdc-text-field .mat-mdc-form-field-icon-suffix .mat-datepicker-toggle-default-icon,dsc-datepicker .mat-mdc-form-field--standard .mdc-text-field .mat-mdc-form-field-icon-prefix .mat-icon,dsc-datepicker .mat-mdc-form-field--standard .mdc-text-field .mat-mdc-form-field-icon-prefix .mat-datepicker-toggle-default-icon{font-size:var(--dsc-icon-size-medium)!important;height:var(--dsc-icon-size-medium)!important;width:var(--dsc-icon-size-medium)!important}dsc-datepicker .mat-mdc-form-field--standard .mdc-text-field .mat-mdc-form-field-icon-suffix .mdc-icon-button,dsc-datepicker .mat-mdc-form-field--standard .mdc-text-field .mat-mdc-form-field-icon-prefix .mdc-icon-button{height:var(--dsc-input-height-standard);width:var(--dsc-input-height-standard)}dsc-datepicker .mat-mdc-form-field--standard .mdc-text-field .mat-mdc-form-field-icon-suffix .mdc-icon-button .mat-mdc-button-touch-target,dsc-datepicker .mat-mdc-form-field--standard .mdc-text-field .mat-mdc-form-field-icon-prefix .mdc-icon-button .mat-mdc-button-touch-target{height:var(--dsc-input-height-standard);width:var(--dsc-input-height-standard)}dsc-datepicker .mat-mdc-form-field--standard .mdc-text-field .mat-mdc-form-field-icon-suffix .mdc-icon-button .mat-icon,dsc-datepicker .mat-mdc-form-field--standard .mdc-text-field .mat-mdc-form-field-icon-prefix .mdc-icon-button .mat-icon{font-size:var(--dsc-icon-size-medium);height:var(--dsc-icon-size-medium);width:var(--dsc-icon-size-medium)}dsc-datepicker .mat-mdc-form-field--small .mdc-text-field{height:var(--dsc-input-height-small)}dsc-datepicker .mat-mdc-form-field--small .mdc-text-field .mat-mdc-form-field-infix{height:var(--dsc-input-height-small)}dsc-datepicker .mat-mdc-form-field--small .mdc-text-field .mat-mdc-form-field-infix .mat-mdc-input-element{font:var(--dsc-typography-text-small-400);font-feature-settings:\"ss01\";height:var(--dsc-input-height-small);padding:0 var(--dsc-spacing-nano)!important}dsc-datepicker .mat-mdc-form-field--small .mdc-text-field .mat-mdc-form-field-infix .mat-mdc-select{display:flex;height:var(--dsc-input-height-small)}dsc-datepicker .mat-mdc-form-field--small .mdc-text-field .mat-mdc-form-field-infix .mat-mdc-select .mat-mdc-select-value{padding:0 var(--dsc-spacing-nano)!important}dsc-datepicker .mat-mdc-form-field--small .mdc-text-field .mat-mdc-form-field-infix .mat-mdc-select .mat-mdc-select-value .mat-mdc-select-value-text,dsc-datepicker .mat-mdc-form-field--small .mdc-text-field .mat-mdc-form-field-infix .mat-mdc-select .mat-mdc-select-value .mat-mdc-select-placeholder{font:var(--dsc-typography-text-small-400);font-feature-settings:\"ss01\";color:var(--dsc-color-content-neutral-5)}dsc-datepicker .mat-mdc-form-field--small .mdc-text-field .mat-mdc-form-field-icon-suffix .mat-icon,dsc-datepicker .mat-mdc-form-field--small .mdc-text-field .mat-mdc-form-field-icon-suffix .mat-datepicker-toggle-default-icon,dsc-datepicker .mat-mdc-form-field--small .mdc-text-field .mat-mdc-form-field-icon-prefix .mat-icon,dsc-datepicker .mat-mdc-form-field--small .mdc-text-field .mat-mdc-form-field-icon-prefix .mat-datepicker-toggle-default-icon{font-size:var(--dsc-icon-size-small)!important;height:var(--dsc-icon-size-small)!important;width:var(--dsc-icon-size-small)!important}dsc-datepicker .mat-mdc-form-field--small .mdc-text-field .mat-mdc-form-field-icon-suffix .mdc-icon-button,dsc-datepicker .mat-mdc-form-field--small .mdc-text-field .mat-mdc-form-field-icon-prefix .mdc-icon-button{height:var(--dsc-input-height-small);width:var(--dsc-input-height-small)}dsc-datepicker .mat-mdc-form-field--small .mdc-text-field .mat-mdc-form-field-icon-suffix .mdc-icon-button .mat-mdc-button-touch-target,dsc-datepicker .mat-mdc-form-field--small .mdc-text-field .mat-mdc-form-field-icon-prefix .mdc-icon-button .mat-mdc-button-touch-target{height:var(--dsc-input-height-small);width:var(--dsc-input-height-small)}dsc-datepicker .mat-mdc-form-field--small .mdc-text-field .mat-mdc-form-field-icon-suffix .mdc-icon-button .mat-icon,dsc-datepicker .mat-mdc-form-field--small .mdc-text-field .mat-mdc-form-field-icon-prefix .mdc-icon-button .mat-icon{font-size:var(--dsc-icon-size-small);height:var(--dsc-icon-size-small);width:var(--dsc-icon-size-small)}dsc-datepicker .mat-mdc-form-field--small{--dsc-label-row-height: 18px}dsc-datepicker .mat-mdc-form-field--large{--dsc-label-row-height: 27px}dsc-datepicker .mat-mdc-form-field-subscript-wrapper{padding:var(--dsc-spacing-quark) 0 0 0;min-height:var(--dsc-label-row-height);line-height:var(--dsc-label-row-height)}dsc-datepicker .mat-mdc-form-field.cdk-keyboard-focused .mdc-text-field{outline:var(--dsc-border-width-thick) solid var(--dsc-color-state-border-focus-dark);outline-offset:-4px;border-radius:var(--dsc-border-radius-nano)!important}dsc-datepicker .mat-mdc-form-field .cdk-text-field-autofilled{height:100%!important;position:fixed!important;z-index:-1!important}dsc-datepicker .mat-mdc-form-field--filled .mdc-text-field{border-color:var(--dsc-color-bg-neutral-6)}dsc-datepicker .mat-mdc-form-field--filled .mdc-text-field .mat-mdc-input-element{color:var(--dsc-color-content-neutral-5)}dsc-datepicker .mat-mdc-form-field--filled .mdc-text-field .mat-mdc-select .mat-mdc-select-trigger .mat-mdc-select-arrow,dsc-datepicker .mat-mdc-form-field--filled .mdc-text-field .mat-mdc-select .mat-mdc-select-trigger .mat-mdc-select-placeholder,dsc-datepicker .mat-mdc-form-field--filled .mdc-text-field .mat-mdc-select .mat-mdc-select-trigger .mat-mdc-select-value-text{color:var(--dsc-color-content-neutral-7)}dsc-datepicker .mat-mdc-form-field--readonly{pointer-events:none!important}dsc-datepicker .mat-mdc-form-field--readonly .mdc-text-field{background-color:var(--dsc-color-state-bg-readonly-1)!important;border-color:var(--dsc-color-state-border-readonly-1)!important}dsc-datepicker .mat-mdc-form-field--readonly .mdc-text-field .mat-mdc-input-element{color:var(--dsc-color-state-content-readonly-1)!important}dsc-datepicker .mat-mdc-form-field--readonly .mdc-text-field .mat-mdc-select .mat-mdc-select-trigger .mat-mdc-select-arrow{color:var(--dsc-color-state-bg-readonly-2)!important}dsc-datepicker .mat-mdc-form-field--readonly .mdc-text-field .mat-mdc-select .mat-mdc-select-trigger .mat-mdc-select-placeholder,dsc-datepicker .mat-mdc-form-field--readonly .mdc-text-field .mat-mdc-select .mat-mdc-select-trigger .mat-mdc-select-value-text{color:var(--dsc-color-state-content-readonly-1)!important}dsc-datepicker .mat-mdc-form-field--readonly .mdc-text-field .mat-mdc-form-field-icon-suffix .mat-icon,dsc-datepicker .mat-mdc-form-field--readonly .mdc-text-field .mat-mdc-form-field-icon-prefix .mat-icon{color:var(--dsc-color-state-bg-readonly-2)!important}dsc-datepicker .mat-mdc-form-field--readonly .mdc-text-field .mat-mdc-form-field-icon-suffix .mat-datepicker-toggle .mdc-icon-button,dsc-datepicker .mat-mdc-form-field--readonly .mdc-text-field .mat-mdc-form-field-icon-prefix .mat-datepicker-toggle .mdc-icon-button{pointer-events:none!important;color:var(--dsc-color-state-bg-readonly-2)!important}dsc-datepicker .mat-mdc-form-field--readonly .mdc-text-field .mat-mdc-form-field-infix{padding:0;min-height:unset}dsc-datepicker .mat-mdc-form-field--readonly .mdc-text-field .mat-mdc-form-field-infix .mat-mdc-input-element::placeholder{color:var(--dsc-color-state-content-readonly-1)!important}dsc-datepicker .mat-mdc-form-field .mdc-text-field{border:var(--dsc-border-width-hairline) solid var(--dsc-color-border-neutral-4);background-color:var(--dsc-color-bg-neutral-1);border-radius:var(--dsc-border-radius-nano);padding:0}dsc-datepicker .mat-mdc-form-field .mdc-text-field .mdc-notched-outline__leading,dsc-datepicker .mat-mdc-form-field .mdc-text-field .mdc-notched-outline__notch,dsc-datepicker .mat-mdc-form-field .mdc-text-field .mdc-notched-outline__trailing{border:none!important}dsc-datepicker .mat-mdc-form-field .mdc-text-field .mdc-notched-outline__leading:focus,dsc-datepicker .mat-mdc-form-field .mdc-text-field .mdc-notched-outline__notch:focus,dsc-datepicker .mat-mdc-form-field .mdc-text-field .mdc-notched-outline__trailing:focus{border:none!important}dsc-datepicker .mat-mdc-form-field .mdc-text-field .mat-mdc-form-field-infix{padding:0;min-height:unset}dsc-datepicker .mat-mdc-form-field .mdc-text-field .mat-mdc-form-field-infix .mat-mdc-input-element::placeholder{color:var(--dsc-color-content-neutral-3)}dsc-datepicker .mat-mdc-form-field .mdc-text-field .mat-mdc-form-field-infix .mat-mdc-select .mat-mdc-select-trigger .mat-mdc-select-arrow{color:var(--dsc-color-bg-neutral-7)}dsc-datepicker .mat-mdc-form-field .mdc-text-field .mat-mdc-form-field-infix .mat-mdc-select .mat-mdc-select-trigger .mat-mdc-select-arrow-wrapper{height:var(--dsc-icon-size-medium);padding:var(--dsc-spacing-nano)!important;margin-right:var(--dsc-spacing-nano)!important}dsc-datepicker .mat-mdc-form-field .mdc-text-field .mat-mdc-form-field-infix .mat-mdc-select .mat-mdc-select-trigger .mat-mdc-select-placeholder{color:var(--dsc-color-content-neutral-3)}dsc-datepicker .mat-mdc-form-field .mdc-text-field .mat-mdc-form-field-infix input::-ms-reveal{display:none}dsc-datepicker .mat-mdc-form-field .mdc-text-field .mat-mdc-form-field-icon-suffix,dsc-datepicker .mat-mdc-form-field .mdc-text-field .mat-mdc-form-field-icon-prefix{display:flex;align-items:center;justify-content:center;padding:0;margin-left:var(--dsc-spacing-nano)}dsc-datepicker .mat-mdc-form-field .mdc-text-field .mat-mdc-form-field-icon-suffix .mat-icon,dsc-datepicker .mat-mdc-form-field .mdc-text-field .mat-mdc-form-field-icon-prefix .mat-icon{padding:0;color:var(--dsc-color-bg-neutral-6)}dsc-datepicker .mat-mdc-form-field .mdc-text-field .mat-mdc-form-field-icon-suffix button .mat-icon,dsc-datepicker .mat-mdc-form-field .mdc-text-field .mat-mdc-form-field-icon-prefix button .mat-icon{color:var(--dsc-color-bg-neutral-7)!important}dsc-datepicker .mat-mdc-form-field .mdc-text-field .mat-mdc-form-field-icon-suffix .mdc-icon-button,dsc-datepicker .mat-mdc-form-field .mdc-text-field .mat-mdc-form-field-icon-prefix .mdc-icon-button{display:flex;align-items:center;justify-content:center;padding:0}dsc-datepicker .mat-mdc-form-field .mdc-text-field .mat-mdc-form-field-icon-suffix .mat-datepicker-toggle .mdc-icon-button,dsc-datepicker .mat-mdc-form-field .mdc-text-field .mat-mdc-form-field-icon-prefix .mat-datepicker-toggle .mdc-icon-button{color:var(--dsc-color-bg-neutral-7)}dsc-datepicker .mat-mdc-form-field .mdc-text-field--disabled{border-color:var(--dsc-color-state-border-disabled-1);background-color:var(--dsc-color-state-bg-disabled-2)}dsc-datepicker .mat-mdc-form-field .mdc-text-field--disabled .mat-mdc-input-element::placeholder{color:var(--dsc-color-state-content-disabled-1)!important}dsc-datepicker .mat-mdc-form-field .mdc-text-field--disabled .mat-mdc-input-element{color:var(--dsc-color-state-content-disabled-1)!important}dsc-datepicker .mat-mdc-form-field .mdc-text-field--disabled .mat-mdc-select .mat-mdc-select-trigger .mat-mdc-select-arrow{color:var(--dsc-color-state-bg-disabled-5)!important}dsc-datepicker .mat-mdc-form-field .mdc-text-field--disabled .mat-mdc-select .mat-mdc-select-trigger .mat-mdc-select-placeholder,dsc-datepicker .mat-mdc-form-field .mdc-text-field--disabled .mat-mdc-select .mat-mdc-select-trigger .mat-mdc-select-value-text{color:var(--dsc-color-state-content-disabled-1)!important}dsc-datepicker .mat-mdc-form-field .mdc-text-field--disabled .mat-mdc-form-field-icon-suffix .mat-icon,dsc-datepicker .mat-mdc-form-field .mdc-text-field--disabled .mat-mdc-form-field-icon-prefix .mat-icon{color:var(--dsc-color-state-bg-disabled-5)}dsc-datepicker .mat-mdc-form-field .mdc-text-field--disabled .mat-mdc-form-field-icon-suffix .mat-datepicker-toggle .mdc-icon-button,dsc-datepicker .mat-mdc-form-field .mdc-text-field--disabled .mat-mdc-form-field-icon-prefix .mat-datepicker-toggle .mdc-icon-button{color:var(--dsc-color-state-bg-disabled-5)}dsc-datepicker .mat-mdc-form-field .mdc-text-field:not(.mdc-text-field--disabled):not(.mdc-text-field--invalid):hover{border-color:var(--dsc-color-border-highlight-1)}dsc-datepicker .mat-mdc-form-field .mdc-text-field:not(.mdc-text-field--disabled):not(.mdc-text-field--invalid):active{border-color:var(--dsc-color-border-neutral-6)}dsc-datepicker .mat-mdc-form-field .mdc-text-field:not(.mdc-text-field--disabled).mdc-text-field--invalid.mat-mdc-form-field--readonly{border-color:var(--dsc-color-border-danger-1)!important;border-radius:var(--dsc-border-radius-nano)}dsc-datepicker .mat-mdc-form-field .mdc-text-field:not(.mdc-text-field--disabled).mdc-text-field--invalid.mat-mdc-form-field--readonly .mat-mdc-select .mat-mdc-select-arrow{color:var(--dsc-color-bg-neutral-5)}dsc-datepicker .mat-mdc-form-field-hint-wrapper,dsc-datepicker .mat-mdc-form-field-error-wrapper{font:var(--dsc-typography-text-small-400);font-feature-settings:\"ss01\";padding:var(--dsc-spacing-quark) 0 0 0!important}dsc-datepicker .mat-mdc-form-field-error-wrapper{border-radius:var(--dsc-border-radius-nano)}dsc-datepicker .mat-mdc-form-field-error-wrapper .mat-mdc-form-field-error{display:flex;gap:var(--dsc-spacing-nano);color:var(--dsc-color-content-danger-2);min-height:20px;align-items:center}dsc-datepicker .mat-mdc-form-field-error-wrapper .mat-mdc-form-field-error .mat-label{color:var(--dsc-color-content-danger-2)}dsc-datepicker .mat-mdc-form-field-error-wrapper .mat-mdc-form-field-error .mat-icon{color:var(--dsc-color-bg-danger-4);min-height:var(--dsc-icon-size-nano);min-width:var(--dsc-icon-size-nano);font-size:var(--dsc-icon-size-nano);align-self:baseline}dsc-datepicker .mat-mdc-form-field-hint-wrapper .mat-mdc-form-field-hint{color:var(--dsc-color-content-neutral-3)}dsc-datepicker .mat-mdc-form-field .month-year-picker .mat-calendar-period-button{display:none!important}.error-label{font:var(--dsc-typography-text-standard-600);font-feature-settings:\"ss01\";color:var(--dsc-color-content-danger-2)!important}.error-field .mdc-text-field{border-color:var(--dsc-color-content-danger-2)!important}.active-field .mdc-text-field{border-color:var(--dsc-color-border-neutral-6)!important}.disabled-tooltip{color:var(--dsc-color-state-bg-disabled-5)!important}.readonly-tooltip{color:var(--dsc-color-state-bg-readonly-2)!important}.cdk-program-focused:not(.cdk-mouse-focused) .mat-calendar-body-active.mat-calendar-body-disabled>.mat-calendar-body-cell-content{background-color:var(--dsc-color-bg-neutral-1)!important;border-color:var(--dsc-color-state-border-focus-dark)}.cdk-program-focused:not(.cdk-mouse-focused)>.mat-calendar-body-cell-content{background-color:var(--dsc-color-bg-neutral-1)!important;border-color:var(--dsc-color-state-border-focus-dark)}.cdk-visually-hidden{border:0!important;clip:rect(0 0 0 0)!important;height:1px!important;margin:-1px!important;overflow:hidden!important;padding:0!important;position:absolute!important;white-space:nowrap!important;width:1px!important}.mat-calendar .mat-calendar-header .mat-calendar-controls .mdc-button__label .mat-calendar-arrow{fill:var(--dsc-color-bg-neutral-7)}.mat-calendar .mat-calendar-header .mat-calendar-controls .mat-mdc-icon-button{--mat-mdc-button-persistent-ripple-color: var(--dsc-color-bg-neutral-7) !important}.mat-calendar .mat-calendar-header .mat-calendar-controls .mat-mdc-icon-button.mat-mdc-button-base{width:var(--dsc-icon-size-quark)!important;height:var(--dsc-icon-size-quark)!important;padding:20px!important}.mat-calendar .mat-calendar-header .mat-calendar-controls .mat-mdc-icon-button:not([disabled]):hover{background-color:color-mix(in srgb,var(--dsc-color-state-bg-neutral-hover-on-light),var(--dsc-opacity-state-hover-1))}.mat-calendar .mat-calendar-header .mat-calendar-controls .mat-mdc-icon-button:not([disabled]):active{background-color:color-mix(in srgb,var(--dsc-color-state-bg-neutral-active-on-light),var(--dsc-opacity-state-active-1))}.mat-calendar .mat-calendar-header .mat-calendar-controls .mat-mdc-button.mat-mdc-button-base{height:40px;border-radius:var(--dsc-border-radius-nano)}.mat-calendar .mat-calendar-header .mat-calendar-controls .mat-mdc-button.mat-mdc-outlined-button{--mat-mdc-button-persistent-ripple-color: var(--dsc-color-bg-neutral-7)}.mat-calendar .mat-calendar-header .mat-calendar-controls .mat-calendar-period-button{font:var(--dsc-typography-text-small-600);font-feature-settings:\"ss01\";color:var(--dsc-color-content-neutral-4)!important}.mat-calendar .mat-calendar-header .mat-calendar-controls .mat-calendar-period-button:not([disabled]):hover{background-color:color-mix(in srgb,var(--dsc-color-state-bg-neutral-hover-on-light),var(--dsc-opacity-state-hover-1))}.mat-calendar .mat-calendar-header .mat-calendar-controls .mat-calendar-period-button:not([disabled]):active{background-color:color-mix(in srgb,var(--dsc-color-state-bg-neutral-active-on-light),var(--dsc-opacity-state-active-1))}.mat-calendar .mat-calendar-header .mat-calendar-controls .mat-calendar-period-button[disabled]{background:var(--dsc-color-bg-neutral-2)!important;color:var(--dsc-color-content-neutral-2)!important}.mat-calendar .mat-calendar-header .mat-calendar-controls .mat-calendar-previous-button,.mat-calendar .mat-calendar-header .mat-calendar-controls .mat-calendar-next-button{color:var(--dsc-color-bg-neutral-7)!important}.mat-calendar .mat-calendar-table-header th{color:var(--dsc-color-content-neutral-3)}.mat-calendar .mat-calendar-table-header-divider:after{color:var(--dsc-color-border-neutral-3)}.mat-calendar .mat-calendar-content{font:var(--dsc-typography-text-small-400);font-feature-settings:\"ss01\"}.mat-calendar .mat-calendar-content .mat-calendar-body-label{color:var(--dsc-color-content-neutral-5)}.mat-calendar .mat-calendar-content .mat-calendar-body-cell .mat-calendar-body-cell-content{color:var(--dsc-color-content-neutral-5);background-color:var(--dsc-color-bg-neutral-1);border-width:var(--dsc-border-width-hairline);border-radius:var(--dsc-border-radius-pill)}.mat-calendar .mat-calendar-content .mat-calendar-body-cell:not(.mat-calendar-body-disabled) .mat-calendar-body-cell-content.mat-calendar-body-selected{background-color:var(--dsc-color-bg-highlight-5);color:var(--dsc-color-content-neutral-1)}.mat-calendar .mat-calendar-content .mat-calendar-body-cell:not(.mat-calendar-body-disabled) .mat-calendar-body-cell-content.mat-calendar-body-selected.mat-calendar-body-today{box-shadow:none}.mat-calendar .mat-calendar-content .mat-calendar-body-cell:not(.mat-calendar-body-disabled) .mat-calendar-body-cell-content.mat-calendar-body-today:not(.mat-calendar-body-selected){background-color:var(--dsc-color-bg-neutral-1);border-color:var(--dsc-color-bg-neutral-4)}.mat-calendar .mat-calendar-content .mat-calendar-body-cell:not(.mat-calendar-body-disabled):hover .mat-calendar-body-cell-content:not(.mat-calendar-body-selected){background-color:var(--dsc-color-bg-highlight-1)!important}.mat-calendar .mat-calendar-content .mat-calendar-body-cell:not(.mat-calendar-body-disabled).mat-calendar-body-active .mat-calendar-body-cell-content:not(.mat-calendar-body-selected){background-color:transparent!important}.mat-calendar .mat-calendar-content .mat-calendar-body-cell.mat-calendar-body-disabled .mat-calendar-body-cell-content{background-color:var(--dsc-color-bg-neutral-2);color:var(--dsc-color-content-neutral-2)!important}\n"] }]
        }], ctorParameters: function () { return [{ type: i1.NgControl, decorators: [{
                    type: Optional
                }, {
                    type: Self
                }] }, { type: i1.NgForm, decorators: [{
                    type: Optional
                }] }, { type: i1.FormGroupDirective, decorators: [{
                    type: Optional
                }] }, { type: i2.DateAdapter, decorators: [{
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_DATE_FORMATS]
                }] }]; }, propDecorators: { matInput: [{
                type: ViewChild,
                args: [MatInput, { static: true }]
            }], dateInputElement: [{
                type: ViewChild,
                args: ['dateInputRef', { static: true, read: ElementRef }]
            }], maxDate: [{
                type: Input
            }], minDate: [{
                type: Input
            }], customDateFormat: [{
                type: Input
            }], picker: [{
                type: ViewChild,
                args: ['picker']
            }], monthYear: [{
                type: Input
            }], datepickerFilter: [{
                type: Input
            }], touchUi: [{
                type: Input
            }], dateChange: [{
                type: Output
            }], dateInput: [{
                type: Output
            }], opened: [{
                type: Output
            }], closed: [{
                type: Output
            }] } });
function cryptoRandom() {
    return Math.random().toString(36).slice(2);
}

/**
 * Generated bundle index. Do not edit.
 */

export { DEFAULT_DATE_FORMATS, DscDatepickerComponent, MONTH_YEAR_DATE_FORMATS, dateFormatsFactory, getDateFormats };
//# sourceMappingURL=sidsc-components-dsc-datepicker.mjs.map
