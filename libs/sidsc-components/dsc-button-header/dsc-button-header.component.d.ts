import { EventEmitter } from '@angular/core';
import * as i0 from "@angular/core";
export declare class DscButtonHeaderComponent {
    icon?: string;
    label?: string;
    tabIndex: number;
    dscTooltip?: string;
    ariaLabel?: string;
    get disabled(): boolean;
    set disabled(value: boolean | string);
    private _disabled;
    get isDisabled(): true | null;
    buttonClick: EventEmitter<void>;
    onClick(): void;
    isPressed: boolean;
    onKeyEnterDown(): void;
    onKeyEnterUp(): void;
    onBlur(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DscButtonHeaderComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DscButtonHeaderComponent, "dsc-button-header", never, { "icon": { "alias": "icon"; "required": false; }; "label": { "alias": "label"; "required": false; }; "tabIndex": { "alias": "tabIndex"; "required": false; }; "dscTooltip": { "alias": "dscTooltip"; "required": false; }; "ariaLabel": { "alias": "ariaLabel"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; }, { "buttonClick": "buttonClick"; }, never, never, true, never>;
}
