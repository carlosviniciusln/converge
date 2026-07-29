import * as i0 from '@angular/core';
import { Injectable, inject, EventEmitter, LOCALE_ID, Component, Output, Input, Pipe } from '@angular/core';
import { formatCurrency, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import * as i1 from '@angular/forms';
import * as i1$1 from '@angular/cdk/layout';
import { Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

function replaceAccents(value) {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
function isEmpty(value) {
    return value === null || value === undefined || value.length === 0;
}
function isNotEmpty(value) {
    return !isEmpty(value);
}

function isNotEmptyArray(value) {
    return Array.isArray(value) && value.length > 0;
}
function isEmptyArray(value) {
    return !isNotEmptyArray(value);
}

class FieldErrorMessengerService {
    getErrorMessage(formField, customErrorMessage) {
        if (!formField)
            return customErrorMessage || '';
        const errorMessages = {
            required: 'Campo obrigatório.',
            email: 'Email inválido.',
            pattern: 'Formato inválido.',
            minlength: (error) => `O tamanho mínimo é ${error.requiredLength}.`,
            maxlength: (error) => `O tamanho máximo é ${error.requiredLength}.`,
            min: (error) => `O valor mínimo é ${formatCurrency(error.min, 'pt-br', 'R$')}.`,
            max: (error) => `O valor máximo é ${formatCurrency(error.max, 'pt-br', 'R$')}.`,
            matDatepickerFilter: 'Data não permitida.',
            matDatepickerMin: 'Data inferior ao mínimo.',
            matDatepickerMax: 'Data superior ao máximo.',
            notAllowedFile: 'Formato de arquivo inválido.',
            fileSizeOverLimit: (error) => `O tamanho máximo é ${error.maxSizeFriendly}.`,
        };
        for (const error in formField.errors) {
            const message = errorMessages[error];
            if (message) {
                return typeof message === 'function' ? message(formField.errors[error]) : message;
            }
        }
        return customErrorMessage || '';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: FieldErrorMessengerService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: FieldErrorMessengerService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: FieldErrorMessengerService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });

class BaseControlValueAccessor {
    constructor() {
        this._disabled = false;
        this.onChange = (_) => { };
        this.onTouched = () => { };
    }
    get val() {
        return this._val;
    }
    set val(value) {
        if (this._val !== value) {
            this._val = value;
            if (this.updateOn === 'change') {
                this.onChange(value);
                this.onTouched();
            }
        }
    }
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        this._disabled = coerceBooleanProperty(value);
    }
    get updateOn() {
        return this._updateOn ?? 'change';
    }
    set updateOn(value) {
        this._updateOn = value;
    }
    writeValue(value) {
        this.val = value;
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    setDisabledState(value) {
        this.disabled = value;
    }
    emitValueOn() {
        this.onChange(this._val);
        this.onTouched();
    }
}

class CustomErrorStateMatcher {
    constructor(_control, _parentForm, _parentFormGroup) {
        this._control = _control;
        this._parentForm = _parentForm;
        this._parentFormGroup = _parentFormGroup;
    }
    isErrorState(control, form) {
        const isSubmitted = ((this._parentForm && this._parentForm.submitted)
            || (this._parentFormGroup && this._parentFormGroup.submitted));
        return !!(this._control && this._control.invalid && (this._control.touched || isSubmitted));
    }
}

registerLocaleData(localePt, 'pt');
class BaseComponent extends BaseControlValueAccessor {
    get type() {
        return this._type;
    }
    set type(value) {
        this.isPasswordField = value === 'password';
        this._type = value;
    }
    get size() {
        return this._size;
    }
    set size(value) {
        this._size = value;
        this.formFieldLabelSize = `mat-label--${value}`;
        this.formFieldSize = `mat-mdc-form-field--${value}`;
        this.selectOptionSize = `mat-mdc-select-panel--${value}`;
        this.selectOption = `mat-mdc-option--${value}`;
    }
    get maxlength() {
        return this._maxlength;
    }
    set maxlength(value) {
        const length = typeof value === 'string' ? parseInt(value) : value;
        if (!Number.isNaN(length) && Number.isInteger(length))
            this._maxlength = length;
    }
    constructor(_ngControl, _parentForm, _parentFormGroup) {
        super();
        this._ngControl = _ngControl;
        this._parentForm = _parentForm;
        this._parentFormGroup = _parentFormGroup;
        this.errorMessageService = inject(FieldErrorMessengerService);
        this.blur = new EventEmitter();
        this.formFieldHint = '';
        this.showIconPassword = true;
        this.readOnly = false;
        this._type = 'text';
        this.isPasswordField = false;
        this._size = 'standard';
        this.formFieldLabelSize = 'mat-label--standard';
        this.formFieldSize = 'mat-mdc-form-field--standard';
        this.selectOptionSize = 'mat-mdc-select-panel--standard';
        this.selectOption = 'mat-mdc-option--standard';
        this._maxlength = 45;
        this.matcher = new CustomErrorStateMatcher(this._ngControl, this._parentForm, this._parentFormGroup);
    }
    get errorText() {
        return this.errorMessageService.getErrorMessage(this._ngControl, this.errorMessage);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: BaseComponent, deps: [{ token: i1.NgControl }, { token: i1.NgForm }, { token: i1.FormGroupDirective }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.12", type: BaseComponent, isStandalone: true, selector: "ng-component", inputs: { label: "label", labelHint: "labelHint", labelHintTooltip: "labelHintTooltip", name: "name", placeholder: "placeholder", formFieldHint: "formFieldHint", errorMessage: "errorMessage", showIconPassword: "showIconPassword", readOnly: "readOnly", ariaDescribedby: ["aria-describedby", "ariaDescribedby"], ariaLabel: ["aria-label", "ariaLabel"], ariaLabelledby: ["aria-labelledby", "ariaLabelledby"], type: "type", size: "size", maxlength: "maxlength" }, outputs: { blur: "blur" }, providers: [{ provide: LOCALE_ID, useValue: 'pt' }], usesInheritance: true, ngImport: i0, template: '', isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: BaseComponent, decorators: [{
            type: Component,
            args: [{
                    template: '',
                    standalone: true,
                    providers: [{ provide: LOCALE_ID, useValue: 'pt' }]
                }]
        }], ctorParameters: function () { return [{ type: i1.NgControl }, { type: i1.NgForm }, { type: i1.FormGroupDirective }]; }, propDecorators: { blur: [{
                type: Output
            }], label: [{
                type: Input
            }], labelHint: [{
                type: Input
            }], labelHintTooltip: [{
                type: Input
            }], name: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], formFieldHint: [{
                type: Input
            }], errorMessage: [{
                type: Input
            }], showIconPassword: [{
                type: Input
            }], readOnly: [{
                type: Input
            }], ariaDescribedby: [{
                type: Input,
                args: ['aria-describedby']
            }], ariaLabel: [{
                type: Input,
                args: ['aria-label']
            }], ariaLabelledby: [{
                type: Input,
                args: ['aria-labelledby']
            }], type: [{
                type: Input
            }], size: [{
                type: Input
            }], maxlength: [{
                type: Input
            }] } });

class BreakpointMatcherService {
    constructor(_breakpointObserver) {
        this._breakpointObserver = _breakpointObserver;
        this._breakpoints = {
            xs: Breakpoints.XSmall,
            sm: Breakpoints.Small,
            md: Breakpoints.Medium,
            lg: Breakpoints.Large,
            xl: Breakpoints.XLarge
        };
    }
    getSize$() {
        return this._breakpointObserver.observe(Object.values(this._breakpoints)).pipe(map(result => {
            const matchingBreakpoints = Object.keys(this._breakpoints).filter(
            // @ts-ignore
            i => result.breakpoints[this._breakpoints[i]]);
            return matchingBreakpoints[0] || 'unknown';
        }));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: BreakpointMatcherService, deps: [{ token: i1$1.BreakpointObserver }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: BreakpointMatcherService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: BreakpointMatcherService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1$1.BreakpointObserver }]; } });

function formatDataStorageUnits(numberOfBytes) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const exponent = Math.min(Math.floor(getBaseLog(1024, numberOfBytes)), units.length - 1);
    const approximateValue = numberOfBytes / 1024 ** exponent;
    return exponent === 0 ? `${numberOfBytes} bytes` : `${approximateValue.toFixed(2)} ${units[exponent]}`;
}
function getBaseLog(x, y) {
    return Math.log(y) / Math.log(x);
}

function formatCpfCnpj(value) {
    if (value) {
        value = value.replace(/\D/g, '');
        if (value.length > 14)
            value = value.substring(0, 14);
        switch (value.length) {
            case 4:
                value = value.replace(/(\d{3})(\d+)/, '$1.$2');
                break;
            case 5:
                value = value.replace(/(\d{3})(\d+)/, '$1.$2');
                break;
            case 6:
                value = value.replace(/(\d{3})(\d+)/, '$1.$2');
                break;
            case 7:
                value = value.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
                break;
            case 8:
                value = value.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
                break;
            case 9:
                value = value.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
                break;
            case 10:
                value = value.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, '$1.$2.$3-$4');
                break;
            case 11:
                value = value.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, '$1.$2.$3-$4');
                break;
            case 12:
                value = value.replace(/(\d{2})(\d{3})(\d{3})(\d+)/, '$1.$2.$3/$4');
                break;
            case 13:
            case 14:
                value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d+)/, '$1.$2.$3/$4-$5');
                break;
            default:
                return value;
        }
    }
    return value;
}

function formatPhone(value) {
    if (value) {
        value = value.toString().replace(/\D/g, '');
        if (value.length > 12) {
            value = value.replace(/(\d{2})?(\d{2})?(\d{5})?(\d{4})/, '+$1 ($2) $3-$4');
        }
        else if (value.length > 11) {
            value = value.replace(/(\d{2})?(\d{2})?(\d{4})?(\d{4})/, '+$1 ($2) $3-$4');
        }
        else if (value.length > 10) {
            value = value.replace(/(\d{2})?(\d{5})?(\d{4})/, '($1) $2-$3');
        }
        else if (value.length > 9) {
            value = value.replace(/(\d{2})?(\d{4})?(\d{4})/, '($1) $2-$3');
        }
        else if (value.length > 5) {
            value = value.replace(/^(\d{2})?(\d{4})?(\d{0,4})/, '($1) $2-$3');
        }
        else if (value.length > 1) {
            value = value.replace(/^(\d{2})?(\d{0,5})/, '($1) $2');
        }
        else {
            if (value !== '') {
                value = value.replace(/^(\d*)/, '($1');
            }
        }
    }
    return value;
}

function formatZipCode(value) {
    if (value) {
        value = value.replace(/\D/g, '');
        if (value.length > 8)
            value = value.substring(0, 8);
        switch (value.length) {
            case 3:
                value = value.replace(/(\d{2})(\d+)/, '$1.$2');
                break;
            case 4:
                value = value.replace(/(\d{2})(\d+)/, '$1.$2');
                break;
            case 5:
                value = value.replace(/(\d{2})(\d+)/, '$1.$2');
                break;
            case 6:
                value = value.replace(/(\d{2})(\d{3})(\d+)/, '$1.$2-$3');
                break;
            case 7:
                value = value.replace(/(\d{2})(\d{3})(\d+)/, '$1.$2-$3');
                break;
            case 8:
                value = value.replace(/(\d{2})(\d{3})(\d+)/, '$1.$2-$3');
                break;
            default:
                return value;
        }
    }
    return value;
}

class CpfCnpjPipe {
    transform(value, ...args) {
        return formatCpfCnpj(value);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: CpfCnpjPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "16.2.12", ngImport: i0, type: CpfCnpjPipe, isStandalone: true, name: "cpfCnpj" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: CpfCnpjPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'cpfCnpj',
                    standalone: true
                }]
        }] });

class PhonePipe {
    transform(value, ...args) {
        return formatPhone(value);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: PhonePipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "16.2.12", ngImport: i0, type: PhonePipe, isStandalone: true, name: "phone" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: PhonePipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'phone',
                    standalone: true
                }]
        }] });

class ZipCodePipe {
    transform(value, ...args) {
        return formatZipCode(value);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: ZipCodePipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "16.2.12", ngImport: i0, type: ZipCodePipe, isStandalone: true, name: "zipCode" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: ZipCodePipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'zipCode',
                    standalone: true
                }]
        }] });

var FileUploadTypes;
(function (FileUploadTypes) {
    FileUploadTypes["arc"] = "application/octet-stream";
    FileUploadTypes["midi"] = "audio/midi";
    FileUploadTypes["ts"] = "application/typescript";
    FileUploadTypes["woff2"] = "font/woff2";
    FileUploadTypes["evy"] = "application/envoy";
    FileUploadTypes["fif"] = "application/fractals";
    FileUploadTypes["hta"] = "application/hta";
    FileUploadTypes["acx"] = "application/internet-property-stream";
    FileUploadTypes["dot"] = "application/msword";
    FileUploadTypes["dms"] = "application/octet-stream";
    FileUploadTypes["eps"] = "application/postscript";
    FileUploadTypes["ps"] = "application/postscript";
    FileUploadTypes["xla"] = "application/vnd.ms-excel";
    FileUploadTypes["xlc"] = "application/vnd.ms-excel";
    FileUploadTypes["xlm"] = "application/vnd.ms-excel";
    FileUploadTypes["xlt"] = "application/vnd.ms-excel";
    FileUploadTypes["xlw"] = "application/vnd.ms-excel";
    FileUploadTypes["msg"] = "application/vnd.ms-outlook";
    FileUploadTypes["sst"] = "application/vnd.ms-pkicertstore";
    FileUploadTypes["pot"] = "application/vnd.ms-powerpoint";
    FileUploadTypes["pps"] = "application/vnd.ms-powerpoint";
    FileUploadTypes["wcm"] = "application/vnd.ms-works";
    FileUploadTypes["wdb"] = "application/vnd.ms-works";
    FileUploadTypes["wks"] = "application/vnd.ms-works";
    FileUploadTypes["cdf"] = "application/x-cdf";
    FileUploadTypes["tgz"] = "application/x-compressed";
    FileUploadTypes["dcr"] = "application/x-director";
    FileUploadTypes["dxr"] = "application/x-director";
    FileUploadTypes["gz"] = "application/x-gzip";
    FileUploadTypes["ins"] = "application/x-internet-signup";
    FileUploadTypes["isp"] = "application/x-internet-signup";
    FileUploadTypes["iii"] = "application/x-iphone";
    FileUploadTypes["dll"] = "application/x-msdownload";
    FileUploadTypes["m13"] = "application/x-msmediaview";
    FileUploadTypes["m14"] = "application/x-msmediaview";
    FileUploadTypes["pma"] = "application/x-perfmon";
    FileUploadTypes["pmc"] = "application/x-perfmon";
    FileUploadTypes["pmr"] = "application/x-perfmon";
    FileUploadTypes["pmw"] = "application/x-perfmon";
    FileUploadTypes["pfx"] = "application/x-pkcs12";
    FileUploadTypes["spc"] = "application/x-pkcs7-certificates";
    FileUploadTypes["p7c"] = "application/x-pkcs7-mime";
    FileUploadTypes["texi"] = "application/x-texinfo";
    FileUploadTypes["roff"] = "application/x-troff";
    FileUploadTypes["tr"] = "application/x-troff";
    FileUploadTypes["man"] = "application/x-troff-man";
    FileUploadTypes["me"] = "application/x-troff-me";
    FileUploadTypes["ms"] = "application/x-troff-ms";
    FileUploadTypes["crt"] = "application/x-x509-ca-cert";
    FileUploadTypes["pko"] = "application/ynd.ms-pkipko";
    FileUploadTypes["snd"] = "audio/basic";
    FileUploadTypes["rmi"] = "audio/mid";
    FileUploadTypes["mp3"] = "audio/mpeg";
    FileUploadTypes["aifc"] = "audio/x-aiff";
    FileUploadTypes["aiff"] = "audio/x-aiff";
    FileUploadTypes["ra"] = "audio/x-pn-realaudio";
    FileUploadTypes["jpe"] = "image/jpeg";
    FileUploadTypes["jpeg"] = "image/jpeg";
    FileUploadTypes["jfif"] = "image/pipeg";
    FileUploadTypes["tif"] = "image/tiff";
    FileUploadTypes["mht"] = "message/rfc822";
    FileUploadTypes["mhtml"] = "message/rfc822";
    FileUploadTypes["nws"] = "message/rfc822";
    FileUploadTypes["htm"] = "text/html";
    FileUploadTypes["stm"] = "text/html";
    FileUploadTypes["uls"] = "text/iuls";
    FileUploadTypes["sct"] = "text/scriptlet";
    FileUploadTypes["htt"] = "text/webviewhtml";
    FileUploadTypes["htc"] = "text/x-component";
    FileUploadTypes["mp2"] = "video/mpeg";
    FileUploadTypes["mpa"] = "video/mpeg";
    FileUploadTypes["mpe"] = "video/mpeg";
    FileUploadTypes["mpg"] = "video/mpeg";
    FileUploadTypes["mpv2"] = "video/mpeg";
    FileUploadTypes["mov"] = "video/quicktime";
    FileUploadTypes["lsf"] = "video/x-la-asf";
    FileUploadTypes["lsx"] = "video/x-la-asf";
    FileUploadTypes["asr"] = "video/x-ms-asf";
    FileUploadTypes["asx"] = "video/x-ms-asf";
    FileUploadTypes["flr"] = "x-world/x-vrml";
    FileUploadTypes["vrml"] = "x-world/x-vrml";
    FileUploadTypes["wrz"] = "x-world/x-vrml";
    FileUploadTypes["xaf"] = "x-world/x-vrml";
    FileUploadTypes["xof"] = "x-world/x-vrml";
    FileUploadTypes["x3d"] = "application/vnd.hzn-3d-crossword";
    FileUploadTypes["3gp"] = "video/3gpp";
    FileUploadTypes["3g2"] = "video/3gpp2";
    FileUploadTypes["mseq"] = "application/vnd.mseq";
    FileUploadTypes["pwn"] = "application/vnd.3m.post-it-notes";
    FileUploadTypes["plb"] = "application/vnd.3gpp.pic-bw-large";
    FileUploadTypes["psb"] = "application/vnd.3gpp.pic-bw-small";
    FileUploadTypes["pvb"] = "application/vnd.3gpp.pic-bw-var";
    FileUploadTypes["tcap"] = "application/vnd.3gpp2.tcap";
    FileUploadTypes["7z"] = "application/x-7z-compressed";
    FileUploadTypes["abw"] = "application/x-abiword";
    FileUploadTypes["ace"] = "application/x-ace-compressed";
    FileUploadTypes["acc"] = "application/vnd.americandynamics.acc";
    FileUploadTypes["acu"] = "application/vnd.acucobol";
    FileUploadTypes["atc"] = "application/vnd.acucorp";
    FileUploadTypes["adp"] = "audio/adpcm";
    FileUploadTypes["aab"] = "application/x-authorware-bin";
    FileUploadTypes["aam"] = "application/x-authorware-map";
    FileUploadTypes["aas"] = "application/x-authorware-seg";
    FileUploadTypes["air"] = "application/vnd.adobe.air-application-installer-package+zip";
    FileUploadTypes["swf"] = "application/x-shockwave-flash";
    FileUploadTypes["fxp"] = "application/vnd.adobe.fxp";
    FileUploadTypes["pdf"] = "application/pdf";
    FileUploadTypes["ppd"] = "application/vnd.cups-ppd";
    FileUploadTypes["dir"] = "application/x-director";
    FileUploadTypes["xdp"] = "application/vnd.adobe.xdp+xml";
    FileUploadTypes["xfdf"] = "application/vnd.adobe.xfdf";
    FileUploadTypes["aac"] = "audio/x-aac";
    FileUploadTypes["ahead"] = "application/vnd.ahead.space";
    FileUploadTypes["azf"] = "application/vnd.airzip.filesecure.azf";
    FileUploadTypes["azs"] = "application/vnd.airzip.filesecure.azs";
    FileUploadTypes["azw"] = "application/vnd.amazon.ebook";
    FileUploadTypes["ami"] = "application/vnd.amiga.ami";
    FileUploadTypes["apk"] = "application/vnd.android.package-archive";
    FileUploadTypes["cii"] = "application/vnd.anser-web-certificate-issue-initiation";
    FileUploadTypes["fti"] = "application/vnd.anser-web-funds-transfer-initiation";
    FileUploadTypes["atx"] = "application/vnd.antix.game-component";
    FileUploadTypes["dmg"] = "application/x-apple-diskimage";
    FileUploadTypes["mpkg"] = "application/vnd.apple.installer+xml";
    FileUploadTypes["aw"] = "application/applixware";
    FileUploadTypes["les"] = "application/vnd.hhe.lesson-player";
    FileUploadTypes["swi"] = "application/vnd.aristanetworks.swi";
    FileUploadTypes["s"] = "text/x-asm";
    FileUploadTypes["atomcat"] = "application/atomcat+xml";
    FileUploadTypes["atomsvc"] = "application/atomsvc+xml";
    FileUploadTypes["atom"] = "application/atom+xml";
    FileUploadTypes["ac"] = "application/pkix-attr-cert";
    FileUploadTypes["aif"] = "audio/x-aiff";
    FileUploadTypes["avi"] = "video/x-msvideo";
    FileUploadTypes["aep"] = "application/vnd.audiograph";
    FileUploadTypes["dxf"] = "image/vnd.dxf";
    FileUploadTypes["dwf"] = "model/vnd.dwf";
    FileUploadTypes["par"] = "text/plain-bas";
    FileUploadTypes["bcpio"] = "application/x-bcpio";
    FileUploadTypes["bin"] = "application/octet-stream";
    FileUploadTypes["bmp"] = "image/bmp";
    FileUploadTypes["torrent"] = "application/x-bittorrent";
    FileUploadTypes["cod"] = "application/vnd.rim.cod";
    FileUploadTypes["mpm"] = "application/vnd.blueice.multipass";
    FileUploadTypes["bmi"] = "application/vnd.bmi";
    FileUploadTypes["sh"] = "application/x-sh";
    FileUploadTypes["btif"] = "image/prs.btif";
    FileUploadTypes["rep"] = "application/vnd.businessobjects";
    FileUploadTypes["bz"] = "application/x-bzip";
    FileUploadTypes["bz2"] = "application/x-bzip2";
    FileUploadTypes["csh"] = "application/x-csh";
    FileUploadTypes["c"] = "text/x-c";
    FileUploadTypes["cdxml"] = "application/vnd.chemdraw+xml";
    FileUploadTypes["css"] = "text/css";
    FileUploadTypes["cdx"] = "chemical/x-cdx";
    FileUploadTypes["cml"] = "chemical/x-cml";
    FileUploadTypes["csml"] = "chemical/x-csml";
    FileUploadTypes["cdbcmsg"] = "application/vnd.contact.cmsg";
    FileUploadTypes["cla"] = "application/vnd.claymore";
    FileUploadTypes["c4g"] = "application/vnd.clonk.c4group";
    FileUploadTypes["sub"] = "image/vnd.dvb.subtitle";
    FileUploadTypes["cdmia"] = "application/cdmi-capability";
    FileUploadTypes["cdmic"] = "application/cdmi-container";
    FileUploadTypes["cdmid"] = "application/cdmi-domain";
    FileUploadTypes["cdmio"] = "application/cdmi-object";
    FileUploadTypes["cdmiq"] = "application/cdmi-queue";
    FileUploadTypes["c11amc"] = "application/vnd.cluetrust.cartomobile-config";
    FileUploadTypes["c11amz"] = "application/vnd.cluetrust.cartomobile-config-pkg";
    FileUploadTypes["ras"] = "image/x-cmu-raster";
    FileUploadTypes["dae"] = "model/vnd.collada+xml";
    FileUploadTypes["csv"] = "text/csv";
    FileUploadTypes["cpt"] = "application/mac-compactpro";
    FileUploadTypes["wmlc"] = "application/vnd.wap.wmlc";
    FileUploadTypes["cgm"] = "image/cgm";
    FileUploadTypes["ice"] = "x-conference/x-cooltalk";
    FileUploadTypes["cmx"] = "image/x-cmx";
    FileUploadTypes["xar"] = "application/vnd.xara";
    FileUploadTypes["cmc"] = "application/vnd.cosmocaller";
    FileUploadTypes["cpio"] = "application/x-cpio";
    FileUploadTypes["clkx"] = "application/vnd.crick.clicker";
    FileUploadTypes["clkk"] = "application/vnd.crick.clicker.keyboard";
    FileUploadTypes["clkp"] = "application/vnd.crick.clicker.palette";
    FileUploadTypes["clkt"] = "application/vnd.crick.clicker.template";
    FileUploadTypes["clkw"] = "application/vnd.crick.clicker.wordbank";
    FileUploadTypes["wbs"] = "application/vnd.criticaltools.wbs+xml";
    FileUploadTypes["cryptonote"] = "application/vnd.rig.cryptonote";
    FileUploadTypes["cif"] = "chemical/x-cif";
    FileUploadTypes["cmdf"] = "chemical/x-cmdf";
    FileUploadTypes["cu"] = "application/cu-seeme";
    FileUploadTypes["cww"] = "application/prs.cww";
    FileUploadTypes["curl"] = "text/vnd.curl";
    FileUploadTypes["dcurl"] = "text/vnd.curl.dcurl";
    FileUploadTypes["mcurl"] = "text/vnd.curl.mcurl";
    FileUploadTypes["scurl"] = "text/vnd.curl.scurl";
    FileUploadTypes["car"] = "application/vnd.curl.car";
    FileUploadTypes["pcurl"] = "application/vnd.curl.pcurl";
    FileUploadTypes["cmp"] = "application/vnd.yellowriver-custom-menu";
    FileUploadTypes["dssc"] = "application/dssc+der";
    FileUploadTypes["xdssc"] = "application/dssc+xml";
    FileUploadTypes["deb"] = "application/x-debian-package";
    FileUploadTypes["uva"] = "audio/vnd.dece.audio";
    FileUploadTypes["uvi"] = "image/vnd.dece.graphic";
    FileUploadTypes["uvh"] = "video/vnd.dece.hd";
    FileUploadTypes["uvm"] = "video/vnd.dece.mobile";
    FileUploadTypes["uvu"] = "video/vnd.uvvu.mp4";
    FileUploadTypes["uvp"] = "video/vnd.dece.pd";
    FileUploadTypes["uvs"] = "video/vnd.dece.sd";
    FileUploadTypes["uvv"] = "video/vnd.dece.video";
    FileUploadTypes["dvi"] = "application/x-dvi";
    FileUploadTypes["seed"] = "application/vnd.fdsn.seed";
    FileUploadTypes["dtb"] = "application/x-dtbook+xml";
    FileUploadTypes["res"] = "application/x-dtbresource+xml";
    FileUploadTypes["ait"] = "application/vnd.dvb.ait";
    FileUploadTypes["svc"] = "application/vnd.dvb.service";
    FileUploadTypes["eol"] = "audio/vnd.digital-winds";
    FileUploadTypes["djvu"] = "image/vnd.djvu";
    FileUploadTypes["dtd"] = "application/xml-dtd";
    FileUploadTypes["mlp"] = "application/vnd.dolby.mlp";
    FileUploadTypes["wad"] = "application/x-doom";
    FileUploadTypes["dpg"] = "application/vnd.dpgraph";
    FileUploadTypes["dra"] = "audio/vnd.dra";
    FileUploadTypes["dfac"] = "application/vnd.dreamfactory";
    FileUploadTypes["dts"] = "audio/vnd.dts";
    FileUploadTypes["dtshd"] = "audio/vnd.dts.hd";
    FileUploadTypes["dwg"] = "image/vnd.dwg";
    FileUploadTypes["geo"] = "application/vnd.dynageo";
    FileUploadTypes["es"] = "application/ecmascript";
    FileUploadTypes["mag"] = "application/vnd.ecowin.chart";
    FileUploadTypes["mmr"] = "image/vnd.fujixerox.edmics-mmr";
    FileUploadTypes["rlc"] = "image/vnd.fujixerox.edmics-rlc";
    FileUploadTypes["exi"] = "application/exi";
    FileUploadTypes["mgz"] = "application/vnd.proteus.magazine";
    FileUploadTypes["epub"] = "application/epub+zip";
    FileUploadTypes["eml"] = "message/rfc822";
    FileUploadTypes["nml"] = "application/vnd.enliven";
    FileUploadTypes["xpr"] = "application/vnd.is-xpr";
    FileUploadTypes["xif"] = "image/vnd.xiff";
    FileUploadTypes["xfdl"] = "application/vnd.xfdl";
    FileUploadTypes["emma"] = "application/emma+xml";
    FileUploadTypes["ez2"] = "application/vnd.ezpix-album";
    FileUploadTypes["ez3"] = "application/vnd.ezpix-package";
    FileUploadTypes["fst"] = "image/vnd.fst";
    FileUploadTypes["fvt"] = "video/vnd.fvt";
    FileUploadTypes["fbs"] = "image/vnd.fastbidsheet";
    FileUploadTypes["fe_launch"] = "application/vnd.denovo.fcselayout-link";
    FileUploadTypes["f4v"] = "video/x-f4v";
    FileUploadTypes["flv"] = "video/x-flv";
    FileUploadTypes["fpx"] = "image/vnd.fpx";
    FileUploadTypes["npx"] = "image/vnd.net-fpx";
    FileUploadTypes["flx"] = "text/vnd.fmi.flexstor";
    FileUploadTypes["fli"] = "video/x-fli";
    FileUploadTypes["ftc"] = "application/vnd.fluxtime.clip";
    FileUploadTypes["fdf"] = "application/vnd.fdf";
    FileUploadTypes["f"] = "text/x-fortran";
    FileUploadTypes["mif"] = "application/vnd.mif";
    FileUploadTypes["fm"] = "application/vnd.framemaker";
    FileUploadTypes["fh"] = "image/x-freehand";
    FileUploadTypes["fsc"] = "application/vnd.fsc.weblaunch";
    FileUploadTypes["fnc"] = "application/vnd.frogans.fnc";
    FileUploadTypes["ltf"] = "application/vnd.frogans.ltf";
    FileUploadTypes["ddd"] = "application/vnd.fujixerox.ddd";
    FileUploadTypes["xdw"] = "application/vnd.fujixerox.docuworks";
    FileUploadTypes["xbd"] = "application/vnd.fujixerox.docuworks.binder";
    FileUploadTypes["oas"] = "application/vnd.fujitsu.oasys";
    FileUploadTypes["oa2"] = "application/vnd.fujitsu.oasys2";
    FileUploadTypes["oa3"] = "application/vnd.fujitsu.oasys3";
    FileUploadTypes["fg5"] = "application/vnd.fujitsu.oasysgp";
    FileUploadTypes["bh2"] = "application/vnd.fujitsu.oasysprs";
    FileUploadTypes["spl"] = "application/x-futuresplash";
    FileUploadTypes["fzs"] = "application/vnd.fuzzysheet";
    FileUploadTypes["g3"] = "image/g3fax";
    FileUploadTypes["gmx"] = "application/vnd.gmx";
    FileUploadTypes["gtw"] = "model/vnd.gtw";
    FileUploadTypes["txd"] = "application/vnd.genomatix.tuxedo";
    FileUploadTypes["ggb"] = "application/vnd.geogebra.file";
    FileUploadTypes["ggt"] = "application/vnd.geogebra.tool";
    FileUploadTypes["gdl"] = "model/vnd.gdl";
    FileUploadTypes["gex"] = "application/vnd.geometry-explorer";
    FileUploadTypes["gxt"] = "application/vnd.geonext";
    FileUploadTypes["g2w"] = "application/vnd.geoplan";
    FileUploadTypes["g3w"] = "application/vnd.geospace";
    FileUploadTypes["gsf"] = "application/x-font-ghostscript";
    FileUploadTypes["bdf"] = "application/x-font-bdf";
    FileUploadTypes["gtar"] = "application/x-gtar";
    FileUploadTypes["texinfo"] = "application/x-texinfo";
    FileUploadTypes["gnumeric"] = "application/x-gnumeric";
    FileUploadTypes["kml"] = "application/vnd.google-earth.kml+xml";
    FileUploadTypes["kmz"] = "application/vnd.google-earth.kmz";
    FileUploadTypes["gqf"] = "application/vnd.grafeq";
    FileUploadTypes["gif"] = "image/gif";
    FileUploadTypes["gv"] = "text/vnd.graphviz";
    FileUploadTypes["gac"] = "application/vnd.groove-account";
    FileUploadTypes["ghf"] = "application/vnd.groove-help";
    FileUploadTypes["gim"] = "application/vnd.groove-identity-message";
    FileUploadTypes["grv"] = "application/vnd.groove-injector";
    FileUploadTypes["gtm"] = "application/vnd.groove-tool-message";
    FileUploadTypes["tpl"] = "application/vnd.groove-tool-template";
    FileUploadTypes["vcg"] = "application/vnd.groove-vcard";
    FileUploadTypes["h261"] = "video/h261";
    FileUploadTypes["h263"] = "video/h263";
    FileUploadTypes["h264"] = "video/h264";
    FileUploadTypes["hpid"] = "application/vnd.hp-hpid";
    FileUploadTypes["hps"] = "application/vnd.hp-hps";
    FileUploadTypes["hdf"] = "application/x-hdf";
    FileUploadTypes["rip"] = "audio/vnd.rip";
    FileUploadTypes["hbci"] = "application/vnd.hbci";
    FileUploadTypes["jlt"] = "application/vnd.hp-jlyt";
    FileUploadTypes["pcl"] = "application/vnd.hp-pcl";
    FileUploadTypes["hpgl"] = "application/vnd.hp-hpgl";
    FileUploadTypes["hvs"] = "application/vnd.yamaha.hv-script";
    FileUploadTypes["hvd"] = "application/vnd.yamaha.hv-dic";
    FileUploadTypes["hvp"] = "application/vnd.yamaha.hv-voice";
    FileUploadTypes["sfd-hdstx"] = "application/vnd.hydrostatix.sof-data";
    FileUploadTypes["stk"] = "application/hyperstudio";
    FileUploadTypes["hal"] = "application/vnd.hal+xml";
    FileUploadTypes["html"] = "text/html";
    FileUploadTypes["irm"] = "application/vnd.ibm.rights-management";
    FileUploadTypes["sc"] = "application/vnd.ibm.secure-container";
    FileUploadTypes["ics"] = "text/calendar";
    FileUploadTypes["icc"] = "application/vnd.iccprofile";
    FileUploadTypes["ico"] = "image/x-icon";
    FileUploadTypes["igl"] = "application/vnd.igloader";
    FileUploadTypes["ief"] = "image/ief";
    FileUploadTypes["ivp"] = "application/vnd.immervision-ivp";
    FileUploadTypes["ivu"] = "application/vnd.immervision-ivu";
    FileUploadTypes["rif"] = "application/reginfo+xml";
    FileUploadTypes["3dml"] = "text/vnd.in3d.3dml";
    FileUploadTypes["spot"] = "text/vnd.in3d.spot";
    FileUploadTypes["igs"] = "model/iges";
    FileUploadTypes["i2g"] = "application/vnd.intergeo";
    FileUploadTypes["cdy"] = "application/vnd.cinderella";
    FileUploadTypes["xpw"] = "application/vnd.intercon.formnet";
    FileUploadTypes["fcs"] = "application/vnd.isac.fcs";
    FileUploadTypes["ipfix"] = "application/ipfix";
    FileUploadTypes["cer"] = "application/pkix-cert";
    FileUploadTypes["pki"] = "application/pkixcmp";
    FileUploadTypes["crl"] = "application/pkix-crl";
    FileUploadTypes["pkipath"] = "application/pkix-pkipath";
    FileUploadTypes["igm"] = "application/vnd.insors.igm";
    FileUploadTypes["rcprofile"] = "application/vnd.ipunplugged.rcprofile";
    FileUploadTypes["irp"] = "application/vnd.irepository.package+xml";
    FileUploadTypes["jad"] = "text/vnd.sun.j2me.app-descriptor";
    FileUploadTypes["jar"] = "application/java-archive";
    FileUploadTypes["class"] = "application/java-vm";
    FileUploadTypes["jnlp"] = "application/x-java-jnlp-file";
    FileUploadTypes["ser"] = "application/java-serialized-object";
    FileUploadTypes["java"] = "text/x-java-source,java";
    FileUploadTypes["js"] = "application/javascript";
    FileUploadTypes["json"] = "application/json";
    FileUploadTypes["joda"] = "application/vnd.joost.joda-archive";
    FileUploadTypes["jpm"] = "video/jpm";
    FileUploadTypes["jpg"] = "image/jpeg";
    FileUploadTypes["pjpeg"] = "image/pjpeg";
    FileUploadTypes["jpgv"] = "video/jpeg";
    FileUploadTypes["ktz"] = "application/vnd.kahootz";
    FileUploadTypes["mmd"] = "application/vnd.chipnuts.karaoke-mmd";
    FileUploadTypes["karbon"] = "application/vnd.kde.karbon";
    FileUploadTypes["chrt"] = "application/vnd.kde.kchart";
    FileUploadTypes["kfo"] = "application/vnd.kde.kformula";
    FileUploadTypes["flw"] = "application/vnd.kde.kivio";
    FileUploadTypes["kon"] = "application/vnd.kde.kontour";
    FileUploadTypes["kpr"] = "application/vnd.kde.kpresenter";
    FileUploadTypes["ksp"] = "application/vnd.kde.kspread";
    FileUploadTypes["kwd"] = "application/vnd.kde.kword";
    FileUploadTypes["htke"] = "application/vnd.kenameaapp";
    FileUploadTypes["kia"] = "application/vnd.kidspiration";
    FileUploadTypes["kne"] = "application/vnd.kinar";
    FileUploadTypes["sse"] = "application/vnd.kodak-descriptor";
    FileUploadTypes["lasxml"] = "application/vnd.las.las+xml";
    FileUploadTypes["latex"] = "application/x-latex";
    FileUploadTypes["lbd"] = "application/vnd.llamagraphics.life-balance.desktop";
    FileUploadTypes["lbe"] = "application/vnd.llamagraphics.life-balance.exchange+xml";
    FileUploadTypes["jam"] = "application/vnd.jam";
    FileUploadTypes["apr"] = "application/vnd.lotus-approach";
    FileUploadTypes["pre"] = "application/vnd.lotus-freelance";
    FileUploadTypes["nsf"] = "application/vnd.lotus-notes";
    FileUploadTypes["org"] = "application/vnd.lotus-organizer";
    FileUploadTypes["scm"] = "application/vnd.lotus-screencam";
    FileUploadTypes["lwp"] = "application/vnd.lotus-wordpro";
    FileUploadTypes["lvp"] = "audio/vnd.lucent.voice";
    FileUploadTypes["m3u"] = "audio/x-mpegurl";
    FileUploadTypes["m4v"] = "video/x-m4v";
    FileUploadTypes["hqx"] = "application/mac-binhex40";
    FileUploadTypes["portpkg"] = "application/vnd.macports.portpkg";
    FileUploadTypes["mgp"] = "application/vnd.osgeo.mapguide.package";
    FileUploadTypes["mrc"] = "application/marc";
    FileUploadTypes["mrcx"] = "application/marcxml+xml";
    FileUploadTypes["mxf"] = "application/mxf";
    FileUploadTypes["nbp"] = "application/vnd.wolfram.player";
    FileUploadTypes["ma"] = "application/mathematica";
    FileUploadTypes["mathml"] = "application/mathml+xml";
    FileUploadTypes["mbox"] = "application/mbox";
    FileUploadTypes["mc1"] = "application/vnd.medcalcdata";
    FileUploadTypes["mscml"] = "application/mediaservercontrol+xml";
    FileUploadTypes["cdkey"] = "application/vnd.mediastation.cdkey";
    FileUploadTypes["mwf"] = "application/vnd.mfer";
    FileUploadTypes["mfm"] = "application/vnd.mfmp";
    FileUploadTypes["msh"] = "model/mesh";
    FileUploadTypes["mads"] = "application/mads+xml";
    FileUploadTypes["mets"] = "application/mets+xml";
    FileUploadTypes["mods"] = "application/mods+xml";
    FileUploadTypes["meta4"] = "application/metalink4+xml";
    FileUploadTypes["mcd"] = "application/vnd.mcd";
    FileUploadTypes["flo"] = "application/vnd.micrografx.flo";
    FileUploadTypes["igx"] = "application/vnd.micrografx.igx";
    FileUploadTypes["es3"] = "application/vnd.eszigno3+xml";
    FileUploadTypes["mdb"] = "application/x-msaccess";
    FileUploadTypes["asf"] = "video/x-ms-asf";
    FileUploadTypes["exe"] = "application/x-msdownload";
    FileUploadTypes["cil"] = "application/vnd.ms-artgalry";
    FileUploadTypes["cab"] = "application/vnd.ms-cab-compressed";
    FileUploadTypes["ims"] = "application/vnd.ms-ims";
    FileUploadTypes["application"] = "application/x-ms-application";
    FileUploadTypes["clp"] = "application/x-msclip";
    FileUploadTypes["mdi"] = "image/vnd.ms-modi";
    FileUploadTypes["eot"] = "application/vnd.ms-fontobject";
    FileUploadTypes["xls"] = "application/vnd.ms-excel";
    FileUploadTypes["xlam"] = "application/vnd.ms-excel.addin.macroenabled.12";
    FileUploadTypes["xlsb"] = "application/vnd.ms-excel.sheet.binary.macroenabled.12";
    FileUploadTypes["xltm"] = "application/vnd.ms-excel.template.macroenabled.12";
    FileUploadTypes["xlsm"] = "application/vnd.ms-excel.sheet.macroenabled.12";
    FileUploadTypes["chm"] = "application/vnd.ms-htmlhelp";
    FileUploadTypes["crd"] = "application/x-mscardfile";
    FileUploadTypes["lrm"] = "application/vnd.ms-lrm";
    FileUploadTypes["mvb"] = "application/x-msmediaview";
    FileUploadTypes["mny"] = "application/x-msmoney";
    FileUploadTypes["pptx"] = "application/vnd.openxmlformats-officedocument.presentationml.presentation";
    FileUploadTypes["sldx"] = "application/vnd.openxmlformats-officedocument.presentationml.slide";
    FileUploadTypes["ppsx"] = "application/vnd.openxmlformats-officedocument.presentationml.slideshow";
    FileUploadTypes["potx"] = "application/vnd.openxmlformats-officedocument.presentationml.template";
    FileUploadTypes["xlsx"] = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    FileUploadTypes["xltx"] = "application/vnd.openxmlformats-officedocument.spreadsheetml.template";
    FileUploadTypes["docx"] = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    FileUploadTypes["dotx"] = "application/vnd.openxmlformats-officedocument.wordprocessingml.template";
    FileUploadTypes["obd"] = "application/x-msbinder";
    FileUploadTypes["thmx"] = "application/vnd.ms-officetheme";
    FileUploadTypes["onetoc"] = "application/onenote";
    FileUploadTypes["pya"] = "audio/vnd.ms-playready.media.pya";
    FileUploadTypes["pyv"] = "video/vnd.ms-playready.media.pyv";
    FileUploadTypes["ppt"] = "application/vnd.ms-powerpoint";
    FileUploadTypes["ppa"] = "application/vnd.ms-powerpoint";
    FileUploadTypes["ppam"] = "application/vnd.ms-powerpoint.addin.macroenabled.12";
    FileUploadTypes["sldm"] = "application/vnd.ms-powerpoint.slide.macroenabled.12";
    FileUploadTypes["pptm"] = "application/vnd.ms-powerpoint.presentation.macroenabled.12";
    FileUploadTypes["ppsm"] = "application/vnd.ms-powerpoint.slideshow.macroenabled.12";
    FileUploadTypes["potm"] = "application/vnd.ms-powerpoint.template.macroenabled.12";
    FileUploadTypes["mpp"] = "application/vnd.ms-project";
    FileUploadTypes["pub"] = "application/x-mspublisher";
    FileUploadTypes["scd"] = "application/x-msschedule";
    FileUploadTypes["xap"] = "application/x-silverlight-app";
    FileUploadTypes["stl"] = "application/vnd.ms-pki.stl";
    FileUploadTypes["cat"] = "application/vnd.ms-pki.seccat";
    FileUploadTypes["vsd"] = "application/vnd.visio";
    FileUploadTypes["vsdx"] = "application/vnd.visio2013";
    FileUploadTypes["wm"] = "video/x-ms-wm";
    FileUploadTypes["wma"] = "audio/x-ms-wma";
    FileUploadTypes["wax"] = "audio/x-ms-wax";
    FileUploadTypes["wmx"] = "video/x-ms-wmx";
    FileUploadTypes["wmd"] = "application/x-ms-wmd";
    FileUploadTypes["wpl"] = "application/vnd.ms-wpl";
    FileUploadTypes["wmz"] = "application/x-ms-wmz";
    FileUploadTypes["wmv"] = "video/x-ms-wmv";
    FileUploadTypes["wvx"] = "video/x-ms-wvx";
    FileUploadTypes["wmf"] = "application/x-msmetafile";
    FileUploadTypes["trm"] = "application/x-msterminal";
    FileUploadTypes["doc"] = "application/msword";
    FileUploadTypes["docm"] = "application/vnd.ms-word.document.macroenabled.12";
    FileUploadTypes["dotm"] = "application/vnd.ms-word.template.macroenabled.12";
    FileUploadTypes["wri"] = "application/x-mswrite";
    FileUploadTypes["wps"] = "application/vnd.ms-works";
    FileUploadTypes["xbap"] = "application/x-ms-xbap";
    FileUploadTypes["xps"] = "application/vnd.ms-xpsdocument";
    FileUploadTypes["mid"] = "audio/midi";
    FileUploadTypes["mpy"] = "application/vnd.ibm.minipay";
    FileUploadTypes["afp"] = "application/vnd.ibm.modcap";
    FileUploadTypes["rms"] = "application/vnd.jcp.javame.midlet-rms";
    FileUploadTypes["tmo"] = "application/vnd.tmobile-livetv";
    FileUploadTypes["prc"] = "application/x-mobipocket-ebook";
    FileUploadTypes["mbk"] = "application/vnd.mobius.mbk";
    FileUploadTypes["dis"] = "application/vnd.mobius.dis";
    FileUploadTypes["plc"] = "application/vnd.mobius.plc";
    FileUploadTypes["mqy"] = "application/vnd.mobius.mqy";
    FileUploadTypes["msl"] = "application/vnd.mobius.msl";
    FileUploadTypes["txf"] = "application/vnd.mobius.txf";
    FileUploadTypes["daf"] = "application/vnd.mobius.daf";
    FileUploadTypes["fly"] = "text/vnd.fly";
    FileUploadTypes["mpc"] = "application/vnd.mophun.certificate";
    FileUploadTypes["mpn"] = "application/vnd.mophun.application";
    FileUploadTypes["mj2"] = "video/mj2";
    FileUploadTypes["mpga"] = "audio/mpeg";
    FileUploadTypes["mxu"] = "video/vnd.mpegurl";
    FileUploadTypes["mpeg"] = "video/mpeg";
    FileUploadTypes["m21"] = "application/mp21";
    FileUploadTypes["mp4a"] = "audio/mp4";
    FileUploadTypes["mp4"] = "video/mp4";
    FileUploadTypes["m3u8"] = "application/vnd.apple.mpegurl";
    FileUploadTypes["mus"] = "application/vnd.musician";
    FileUploadTypes["msty"] = "application/vnd.muvee.style";
    FileUploadTypes["mxml"] = "application/xv+xml";
    FileUploadTypes["ngdat"] = "application/vnd.nokia.n-gage.data";
    FileUploadTypes["n-gage"] = "application/vnd.nokia.n-gage.symbian.install";
    FileUploadTypes["ncx"] = "application/x-dtbncx+xml";
    FileUploadTypes["nc"] = "application/x-netcdf";
    FileUploadTypes["nlu"] = "application/vnd.neurolanguage.nlu";
    FileUploadTypes["dna"] = "application/vnd.dna";
    FileUploadTypes["nnd"] = "application/vnd.noblenet-directory";
    FileUploadTypes["nns"] = "application/vnd.noblenet-sealer";
    FileUploadTypes["nnw"] = "application/vnd.noblenet-web";
    FileUploadTypes["rpst"] = "application/vnd.nokia.radio-preset";
    FileUploadTypes["rpss"] = "application/vnd.nokia.radio-presets";
    FileUploadTypes["n3"] = "text/n3";
    FileUploadTypes["edm"] = "application/vnd.novadigm.edm";
    FileUploadTypes["edx"] = "application/vnd.novadigm.edx";
    FileUploadTypes["ext"] = "application/vnd.novadigm.ext";
    FileUploadTypes["gph"] = "application/vnd.flographit";
    FileUploadTypes["ecelp4800"] = "audio/vnd.nuera.ecelp4800";
    FileUploadTypes["ecelp7470"] = "audio/vnd.nuera.ecelp7470";
    FileUploadTypes["ecelp9600"] = "audio/vnd.nuera.ecelp9600";
    FileUploadTypes["oda"] = "application/oda";
    FileUploadTypes["ogx"] = "application/ogg";
    FileUploadTypes["oga"] = "audio/ogg";
    FileUploadTypes["ogv"] = "video/ogg";
    FileUploadTypes["dd2"] = "application/vnd.oma.dd2+xml";
    FileUploadTypes["oth"] = "application/vnd.oasis.opendocument.text-web";
    FileUploadTypes["opf"] = "application/oebps-package+xml";
    FileUploadTypes["qbo"] = "application/vnd.intu.qbo";
    FileUploadTypes["oxt"] = "application/vnd.openofficeorg.extension";
    FileUploadTypes["osf"] = "application/vnd.yamaha.openscoreformat";
    FileUploadTypes["weba"] = "audio/webm";
    FileUploadTypes["webm"] = "video/webm";
    FileUploadTypes["odc"] = "application/vnd.oasis.opendocument.chart";
    FileUploadTypes["otc"] = "application/vnd.oasis.opendocument.chart-template";
    FileUploadTypes["odb"] = "application/vnd.oasis.opendocument.database";
    FileUploadTypes["odf"] = "application/vnd.oasis.opendocument.formula";
    FileUploadTypes["odft"] = "application/vnd.oasis.opendocument.formula-template";
    FileUploadTypes["odg"] = "application/vnd.oasis.opendocument.graphics";
    FileUploadTypes["otg"] = "application/vnd.oasis.opendocument.graphics-template";
    FileUploadTypes["odi"] = "application/vnd.oasis.opendocument.image";
    FileUploadTypes["oti"] = "application/vnd.oasis.opendocument.image-template";
    FileUploadTypes["odp"] = "application/vnd.oasis.opendocument.presentation";
    FileUploadTypes["otp"] = "application/vnd.oasis.opendocument.presentation-template";
    FileUploadTypes["ods"] = "application/vnd.oasis.opendocument.spreadsheet";
    FileUploadTypes["ots"] = "application/vnd.oasis.opendocument.spreadsheet-template";
    FileUploadTypes["odt"] = "application/vnd.oasis.opendocument.text";
    FileUploadTypes["odm"] = "application/vnd.oasis.opendocument.text-master";
    FileUploadTypes["ott"] = "application/vnd.oasis.opendocument.text-template";
    FileUploadTypes["ktx"] = "image/ktx";
    FileUploadTypes["sxc"] = "application/vnd.sun.xml.calc";
    FileUploadTypes["stc"] = "application/vnd.sun.xml.calc.template";
    FileUploadTypes["sxd"] = "application/vnd.sun.xml.draw";
    FileUploadTypes["std"] = "application/vnd.sun.xml.draw.template";
    FileUploadTypes["sxi"] = "application/vnd.sun.xml.impress";
    FileUploadTypes["sti"] = "application/vnd.sun.xml.impress.template";
    FileUploadTypes["sxm"] = "application/vnd.sun.xml.math";
    FileUploadTypes["sxw"] = "application/vnd.sun.xml.writer";
    FileUploadTypes["sxg"] = "application/vnd.sun.xml.writer.global";
    FileUploadTypes["stw"] = "application/vnd.sun.xml.writer.template";
    FileUploadTypes["otf"] = "application/x-font-otf";
    FileUploadTypes["osfpvg"] = "application/vnd.yamaha.openscoreformat.osfpvg+xml";
    FileUploadTypes["dp"] = "application/vnd.osgi.dp";
    FileUploadTypes["pdb"] = "application/vnd.palm";
    FileUploadTypes["p"] = "text/x-pascal";
    FileUploadTypes["paw"] = "application/vnd.pawaafile";
    FileUploadTypes["pclxl"] = "application/vnd.hp-pclxl";
    FileUploadTypes["efif"] = "application/vnd.picsel";
    FileUploadTypes["pcx"] = "image/x-pcx";
    FileUploadTypes["psd"] = "image/vnd.adobe.photoshop";
    FileUploadTypes["prf"] = "application/pics-rules";
    FileUploadTypes["pic"] = "image/x-pict";
    FileUploadTypes["chat"] = "application/x-chat";
    FileUploadTypes["p10"] = "application/pkcs10";
    FileUploadTypes["p12"] = "application/x-pkcs12";
    FileUploadTypes["p7m"] = "application/pkcs7-mime";
    FileUploadTypes["p7s"] = "application/pkcs7-signature";
    FileUploadTypes["p7r"] = "application/x-pkcs7-certreqresp";
    FileUploadTypes["p7b"] = "application/x-pkcs7-certificates";
    FileUploadTypes["p8"] = "application/pkcs8";
    FileUploadTypes["plf"] = "application/vnd.pocketlearn";
    FileUploadTypes["pnm"] = "image/x-portable-anymap";
    FileUploadTypes["pbm"] = "image/x-portable-bitmap";
    FileUploadTypes["pcf"] = "application/x-font-pcf";
    FileUploadTypes["pfr"] = "application/font-tdpfr";
    FileUploadTypes["pgn"] = "application/x-chess-pgn";
    FileUploadTypes["pgm"] = "image/x-portable-graymap";
    FileUploadTypes["png"] = "image/png";
    FileUploadTypes["ppm"] = "image/x-portable-pixmap";
    FileUploadTypes["pskcxml"] = "application/pskc+xml";
    FileUploadTypes["pml"] = "application/vnd.ctc-posml";
    FileUploadTypes["ai"] = "application/postscript";
    FileUploadTypes["pfa"] = "application/x-font-type1";
    FileUploadTypes["pbd"] = "application/vnd.powerbuilder6";
    FileUploadTypes["pgp"] = "application/pgp-encrypted";
    FileUploadTypes["box"] = "application/vnd.previewsystems.box";
    FileUploadTypes["ptid"] = "application/vnd.pvi.ptid1";
    FileUploadTypes["pls"] = "application/pls+xml";
    FileUploadTypes["str"] = "application/vnd.pg.format";
    FileUploadTypes["ei6"] = "application/vnd.pg.osasli";
    FileUploadTypes["dsc"] = "text/prs.lines.tag";
    FileUploadTypes["psf"] = "application/x-font-linux-psf";
    FileUploadTypes["qps"] = "application/vnd.publishare-delta-tree";
    FileUploadTypes["wg"] = "application/vnd.pmi.widget";
    FileUploadTypes["qxd"] = "application/vnd.quark.quarkxpress";
    FileUploadTypes["esf"] = "application/vnd.epson.esf";
    FileUploadTypes["msf"] = "application/vnd.epson.msf";
    FileUploadTypes["ssf"] = "application/vnd.epson.ssf";
    FileUploadTypes["qam"] = "application/vnd.epson.quickanime";
    FileUploadTypes["qfx"] = "application/vnd.intu.qfx";
    FileUploadTypes["qt"] = "video/quicktime";
    FileUploadTypes["rar"] = "application/x-rar-compressed";
    FileUploadTypes["ram"] = "audio/x-pn-realaudio";
    FileUploadTypes["rmp"] = "audio/x-pn-realaudio-plugin";
    FileUploadTypes["rsd"] = "application/rsd+xml";
    FileUploadTypes["rm"] = "application/vnd.rn-realmedia";
    FileUploadTypes["bed"] = "application/vnd.realvnc.bed";
    FileUploadTypes["mxl"] = "application/vnd.recordare.musicxml";
    FileUploadTypes["musicxml"] = "application/vnd.recordare.musicxml+xml";
    FileUploadTypes["rnc"] = "application/relax-ng-compact-syntax";
    FileUploadTypes["rdz"] = "application/vnd.data-vision.rdz";
    FileUploadTypes["rdf"] = "application/rdf+xml";
    FileUploadTypes["rp9"] = "application/vnd.cloanto.rp9";
    FileUploadTypes["jisp"] = "application/vnd.jisp";
    FileUploadTypes["rtf"] = "application/rtf";
    FileUploadTypes["rtx"] = "text/richtext";
    FileUploadTypes["link66"] = "application/vnd.route66.link66+xml";
    FileUploadTypes["rss"] = "application/rss+xml,";
    FileUploadTypes["shf"] = "application/shf+xml";
    FileUploadTypes["st"] = "application/vnd.sailingtracker.track";
    FileUploadTypes["svg"] = "image/svg+xml";
    FileUploadTypes["sus"] = "application/vnd.sus-calendar";
    FileUploadTypes["sru"] = "application/sru+xml";
    FileUploadTypes["setpay"] = "application/set-payment-initiation";
    FileUploadTypes["setreg"] = "application/set-registration-initiation";
    FileUploadTypes["sema"] = "application/vnd.sema";
    FileUploadTypes["semd"] = "application/vnd.semd";
    FileUploadTypes["semf"] = "application/vnd.semf";
    FileUploadTypes["see"] = "application/vnd.seemail";
    FileUploadTypes["snf"] = "application/x-font-snf";
    FileUploadTypes["spq"] = "application/scvp-vp-request";
    FileUploadTypes["spp"] = "application/scvp-vp-response";
    FileUploadTypes["scq"] = "application/scvp-cv-request";
    FileUploadTypes["scs"] = "application/scvp-cv-response";
    FileUploadTypes["sdp"] = "application/sdp";
    FileUploadTypes["etx"] = "text/x-setext";
    FileUploadTypes["movie"] = "video/x-sgi-movie";
    FileUploadTypes["ifm"] = "application/vnd.shana.informed.formdata";
    FileUploadTypes["itp"] = "application/vnd.shana.informed.formtemplate";
    FileUploadTypes["iif"] = "application/vnd.shana.informed.interchange";
    FileUploadTypes["ipk"] = "application/vnd.shana.informed.package";
    FileUploadTypes["tfi"] = "application/thraud+xml";
    FileUploadTypes["shar"] = "application/x-shar";
    FileUploadTypes["rgb"] = "image/x-rgb";
    FileUploadTypes["slt"] = "application/vnd.epson.salt";
    FileUploadTypes["aso"] = "application/vnd.accpac.simply.aso";
    FileUploadTypes["imp"] = "application/vnd.accpac.simply.imp";
    FileUploadTypes["twd"] = "application/vnd.simtech-mindmapper";
    FileUploadTypes["csp"] = "application/vnd.commonspace";
    FileUploadTypes["saf"] = "application/vnd.yamaha.smaf-audio";
    FileUploadTypes["mmf"] = "application/vnd.smaf";
    FileUploadTypes["spf"] = "application/vnd.yamaha.smaf-phrase";
    FileUploadTypes["teacher"] = "application/vnd.smart.teacher";
    FileUploadTypes["svd"] = "application/vnd.svd";
    FileUploadTypes["rq"] = "application/sparql-query";
    FileUploadTypes["srx"] = "application/sparql-results+xml";
    FileUploadTypes["gram"] = "application/srgs";
    FileUploadTypes["grxml"] = "application/srgs+xml";
    FileUploadTypes["ssml"] = "application/ssml+xml";
    FileUploadTypes["skp"] = "application/vnd.koan";
    FileUploadTypes["sgml"] = "text/sgml";
    FileUploadTypes["sdc"] = "application/vnd.stardivision.calc";
    FileUploadTypes["sda"] = "application/vnd.stardivision.draw";
    FileUploadTypes["sdd"] = "application/vnd.stardivision.impress";
    FileUploadTypes["smf"] = "application/vnd.stardivision.math";
    FileUploadTypes["sdw"] = "application/vnd.stardivision.writer";
    FileUploadTypes["sgl"] = "application/vnd.stardivision.writer-global";
    FileUploadTypes["sm"] = "application/vnd.stepmania.stepchart";
    FileUploadTypes["sit"] = "application/x-stuffit";
    FileUploadTypes["sitx"] = "application/x-stuffitx";
    FileUploadTypes["sdkm"] = "application/vnd.solent.sdkm+xml";
    FileUploadTypes["xo"] = "application/vnd.olpc-sugar";
    FileUploadTypes["au"] = "audio/basic";
    FileUploadTypes["wqd"] = "application/vnd.wqd";
    FileUploadTypes["sis"] = "application/vnd.symbian.install";
    FileUploadTypes["smi"] = "application/smil+xml";
    FileUploadTypes["xsm"] = "application/vnd.syncml+xml";
    FileUploadTypes["bdm"] = "application/vnd.syncml.dm+wbxml";
    FileUploadTypes["xdm"] = "application/vnd.syncml.dm+xml";
    FileUploadTypes["sv4cpio"] = "application/x-sv4cpio";
    FileUploadTypes["sv4crc"] = "application/x-sv4crc";
    FileUploadTypes["sbml"] = "application/sbml+xml";
    FileUploadTypes["tsv"] = "text/tab-separated-values";
    FileUploadTypes["tiff"] = "image/tiff";
    FileUploadTypes["tao"] = "application/vnd.tao.intent-module-archive";
    FileUploadTypes["tar"] = "application/x-tar";
    FileUploadTypes["tcl"] = "application/x-tcl";
    FileUploadTypes["tex"] = "application/x-tex";
    FileUploadTypes["tfm"] = "application/x-tex-tfm";
    FileUploadTypes["tei"] = "application/tei+xml";
    FileUploadTypes["txt"] = "text/plain";
    FileUploadTypes["dxp"] = "application/vnd.spotfire.dxp";
    FileUploadTypes["sfs"] = "application/vnd.spotfire.sfs";
    FileUploadTypes["tsd"] = "application/timestamped-data";
    FileUploadTypes["tpt"] = "application/vnd.trid.tpt";
    FileUploadTypes["mxs"] = "application/vnd.triscape.mxs";
    FileUploadTypes["t"] = "text/troff";
    FileUploadTypes["tra"] = "application/vnd.trueapp";
    FileUploadTypes["ttf"] = "application/x-font-ttf";
    FileUploadTypes["ttl"] = "text/turtle";
    FileUploadTypes["umj"] = "application/vnd.umajin";
    FileUploadTypes["uoml"] = "application/vnd.uoml+xml";
    FileUploadTypes["unityweb"] = "application/vnd.unity";
    FileUploadTypes["ufd"] = "application/vnd.ufdl";
    FileUploadTypes["uri"] = "text/uri-list";
    FileUploadTypes["utz"] = "application/vnd.uiq.theme";
    FileUploadTypes["ustar"] = "application/x-ustar";
    FileUploadTypes["uu"] = "text/x-uuencode";
    FileUploadTypes["vcs"] = "text/x-vcalendar";
    FileUploadTypes["vcf"] = "text/x-vcard";
    FileUploadTypes["vcd"] = "application/x-cdlink";
    FileUploadTypes["vsf"] = "application/vnd.vsf";
    FileUploadTypes["wrl"] = "model/vrml";
    FileUploadTypes["vcx"] = "application/vnd.vcx";
    FileUploadTypes["mts"] = "model/vnd.mts";
    FileUploadTypes["vtu"] = "model/vnd.vtu";
    FileUploadTypes["vis"] = "application/vnd.visionary";
    FileUploadTypes["viv"] = "video/vnd.vivo";
    FileUploadTypes["ccxml"] = "application/ccxml+xml,";
    FileUploadTypes["vxml"] = "application/voicexml+xml";
    FileUploadTypes["src"] = "application/x-wais-source";
    FileUploadTypes["wbxml"] = "application/vnd.wap.wbxml";
    FileUploadTypes["wbmp"] = "image/vnd.wap.wbmp";
    FileUploadTypes["wav"] = "audio/x-wav";
    FileUploadTypes["davmount"] = "application/davmount+xml";
    FileUploadTypes["woff"] = "application/x-font-woff";
    FileUploadTypes["wspolicy"] = "application/wspolicy+xml";
    FileUploadTypes["webp"] = "image/webp";
    FileUploadTypes["wtb"] = "application/vnd.webturbo";
    FileUploadTypes["wgt"] = "application/widget";
    FileUploadTypes["hlp"] = "application/winhlp";
    FileUploadTypes["wml"] = "text/vnd.wap.wml";
    FileUploadTypes["wmls"] = "text/vnd.wap.wmlscript";
    FileUploadTypes["wmlsc"] = "application/vnd.wap.wmlscriptc";
    FileUploadTypes["wpd"] = "application/vnd.wordperfect";
    FileUploadTypes["stf"] = "application/vnd.wt.stf";
    FileUploadTypes["wsdl"] = "application/wsdl+xml";
    FileUploadTypes["xbm"] = "image/x-xbitmap";
    FileUploadTypes["xpm"] = "image/x-xpixmap";
    FileUploadTypes["xwd"] = "image/x-xwindowdump";
    FileUploadTypes["der"] = "application/x-x509-ca-cert";
    FileUploadTypes["fig"] = "application/x-xfig";
    FileUploadTypes["xhtml"] = "application/xhtml+xml";
    FileUploadTypes["xml"] = "application/xml";
    FileUploadTypes["xdf"] = "application/xcap-diff+xml";
    FileUploadTypes["xenc"] = "application/xenc+xml";
    FileUploadTypes["xer"] = "application/patch-ops-error+xml";
    FileUploadTypes["rl"] = "application/resource-lists+xml";
    FileUploadTypes["rs"] = "application/rls-services+xml";
    FileUploadTypes["rld"] = "application/resource-lists-diff+xml";
    FileUploadTypes["xslt"] = "application/xslt+xml";
    FileUploadTypes["xop"] = "application/xop+xml";
    FileUploadTypes["xpi"] = "application/x-xpinstall";
    FileUploadTypes["xspf"] = "application/xspf+xml";
    FileUploadTypes["xul"] = "application/vnd.mozilla.xul+xml";
    FileUploadTypes["xyz"] = "chemical/x-xyz";
    FileUploadTypes["yaml"] = "text/yaml";
    FileUploadTypes["yang"] = "application/yang";
    FileUploadTypes["yin"] = "application/yin+xml";
    FileUploadTypes["zir"] = "application/vnd.zul";
    FileUploadTypes["zip"] = "application/zip";
})(FileUploadTypes || (FileUploadTypes = {}));

class DscValidators {
    static min(min) {
        return minValidator(min);
    }
    static max(max) {
        return maxValidator(max);
    }
    static maxTotalFileSize(maxTotalSize) {
        return maxTotalFileSizeValidator(maxTotalSize);
    }
}
function minValidator(min) {
    return (control) => {
        if (isEmpty(control.value) || isNaN(min))
            return null;
        const value = parseFloat(control.value);
        return !isNaN(value) && value < min
            ? { 'min': { 'min': min, 'actual': control.value } }
            : null;
    };
}
function maxValidator(max) {
    return (control) => {
        if (isEmpty(control.value) || isNaN(max))
            return null;
        const value = parseFloat(control.value);
        return !isNaN(value) && value > max
            ? { 'max': { 'max': max, 'actual': control.value } }
            : null;
    };
}
function acceptValidator(accept) {
    return (control) => {
        if (!accept)
            return null;
        const value = control.value;
        const accepts = acceptResolver(accept);
        if (Array.isArray(value)) {
            return handleFileArray(value, accepts);
        }
        else {
            return handleSingleFile(value, accepts);
        }
    };
}
function handleFileArray(files, accepts) {
    if (isEmptyArray(files))
        return null;
    const notAllowedFiles = files.map(file => checkFileTypes(file, accepts)).filter(Boolean);
    return notAllowedFiles.length > 0 ? { 'notAllowedFile': notAllowedFiles } : null;
}
function handleSingleFile(file, accepts) {
    if (!file)
        return null;
    const notAllowedFile = checkFileTypes(file, accepts);
    return notAllowedFile ? { 'notAllowedFile': notAllowedFile } : null;
}
function acceptResolver(accept) {
    const values = accept.replace(/\s/g, '').split(',');
    return isNotEmptyArray(values) ? values.slice() : [];
}
function checkFileTypes(file, accepts) {
    if (!file)
        return null;
    const FILE_EXT_REG = /(^[.]\w*)$/m;
    // @ts-ignore
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const fileType = getFileType(file, fileExtension);
    // @ts-ignore
    const isFound = accepts.some(type => FILE_EXT_REG.test(type) ? type === `.${fileExtension}` : new RegExp(type).test(fileType));
    return isFound ? null : { allowedTypes: accepts, actual: fileType, file };
}
function getFileType(file, fileExtension) {
    const type = file.type;
    if (isNotEmpty(type))
        return type;
    // @ts-ignore
    return FileUploadTypes[fileExtension];
}
function maxTotalFileSizeValidator(maxTotalSize) {
    return (control) => {
        const value = control.value;
        let sum = 0;
        if (Array.isArray(value)) {
            if (isEmptyArray(value))
                return null;
            sum = value.map(file => file.size).reduce((a, b) => a + b, 0);
        }
        else {
            if (!value)
                return null;
            sum = value.size;
        }
        // @ts-ignore
        const toLargeFile = checkFileSize(sum, maxTotalSize);
        return toLargeFile ? { 'fileSizeOverLimit': toLargeFile } : null;
    };
}
function checkFileSize(actualSize, maxSize) {
    return (Number.isInteger(maxSize) && actualSize > maxSize)
        ? { maxSize, actualSize, actualSizeFriendly: formatDataStorageUnits(actualSize), maxSizeFriendly: formatDataStorageUnits(maxSize) }
        : null;
}

/**
 * Generated bundle index. Do not edit.
 */

export { BaseComponent, BaseControlValueAccessor, BreakpointMatcherService, CpfCnpjPipe, DscValidators, PhonePipe, ZipCodePipe, acceptValidator, formatCpfCnpj, formatDataStorageUnits, formatPhone, formatZipCode, isEmpty, isEmptyArray, isNotEmpty, isNotEmptyArray, maxTotalFileSizeValidator, maxValidator, minValidator, replaceAccents };
//# sourceMappingURL=sidsc-components-core.mjs.map
