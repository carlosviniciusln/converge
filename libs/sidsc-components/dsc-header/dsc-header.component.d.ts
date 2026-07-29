import { EventEmitter } from '@angular/core';
import { DscHeaderButtonData } from './shared/dsc-header-button-data';
import * as i0 from "@angular/core";
export type AccessLevel = 'publico' | 'confidencial';
export type AccessModifier = 'interno' | 'externo';
export declare class DscHeaderComponent {
    accessModifier: AccessModifier;
    accessLevel?: AccessLevel;
    accessLevelDescription?: string;
    acronym?: string;
    label?: string;
    userName?: string;
    userWorkUnit?: string;
    additionalInfo?: string;
    headerButtons?: DscHeaderButtonData[];
    customClass: string | string[] | Set<string> | {
        [p: string]: any;
    } | null | undefined;
    get toggleButton(): boolean;
    set toggleButton(value: boolean | string);
    private _toggleButton;
    get toggleButtonLabel(): boolean;
    set toggleButtonLabel(value: boolean | string);
    private _toggleButtonLabel;
    get toggleButtonRight(): boolean;
    set toggleButtonRight(value: boolean | string);
    private _toggleButtonRight;
    get brandFull(): boolean;
    set brandFull(value: boolean | string);
    private _brandFull;
    toggle: EventEmitter<void>;
    onToggle(): void;
    buttonClickHandlers: {
        [key: string]: () => void;
    };
    onButtonClick(button: DscHeaderButtonData): void;
    isPressed: boolean;
    isTrademarkPressed: boolean;
    onKeyEnterDown(): void;
    onKeyEnterUp(): void;
    onTrademarkKeyboardActivate(event: Event, el: HTMLElement): void;
    onTrademarkSpaceUp(event: Event): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DscHeaderComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DscHeaderComponent, "dsc-header", never, { "accessModifier": { "alias": "accessModifier"; "required": false; }; "accessLevel": { "alias": "accessLevel"; "required": false; }; "accessLevelDescription": { "alias": "accessLevelDescription"; "required": false; }; "acronym": { "alias": "acronym"; "required": false; }; "label": { "alias": "label"; "required": false; }; "userName": { "alias": "userName"; "required": false; }; "userWorkUnit": { "alias": "userWorkUnit"; "required": false; }; "additionalInfo": { "alias": "additionalInfo"; "required": false; }; "headerButtons": { "alias": "headerButtons"; "required": false; }; "customClass": { "alias": "customClass"; "required": false; }; "toggleButton": { "alias": "toggleButton"; "required": false; }; "toggleButtonLabel": { "alias": "toggleButtonLabel"; "required": false; }; "toggleButtonRight": { "alias": "toggleButtonRight"; "required": false; }; "brandFull": { "alias": "brandFull"; "required": false; }; "buttonClickHandlers": { "alias": "buttonClickHandlers"; "required": false; }; }, { "toggle": "toggle"; }, never, ["*"], true, never>;
}
