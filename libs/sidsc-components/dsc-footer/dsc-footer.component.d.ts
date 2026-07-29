import { OnDestroy } from '@angular/core';
import * as i0 from "@angular/core";
export declare class DscFooterComponent implements OnDestroy {
    theme: 'highlight' | 'neutral';
    model: 'model1' | 'model2' | 'model3' | 'model4';
    showLogo: boolean;
    showCGC: boolean;
    showSigla: boolean;
    showAdditionalText: boolean;
    showVersion: boolean;
    version: string;
    cgc: string;
    sigla: string;
    additionalText: string;
    sectionTitleText: string;
    sectionText: string;
    internalLinkTitle: string;
    externalLinkTitle: string;
    internalLinks: {
        text: string;
        url: string;
    }[];
    externalLinks: {
        text: string;
        url: string;
    }[];
    columns: {
        label: string;
        text: string;
    }[];
    get brandFull(): boolean;
    set brandFull(value: boolean | string);
    private _brandFull;
    private _unsubscribeAll;
    isNotScreenSmall: boolean;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DscFooterComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DscFooterComponent, "dsc-footer", never, { "theme": { "alias": "theme"; "required": false; }; "model": { "alias": "model"; "required": false; }; "showLogo": { "alias": "showLogo"; "required": false; }; "showCGC": { "alias": "showCGC"; "required": false; }; "showSigla": { "alias": "showSigla"; "required": false; }; "showAdditionalText": { "alias": "showAdditionalText"; "required": false; }; "showVersion": { "alias": "showVersion"; "required": false; }; "version": { "alias": "version"; "required": false; }; "cgc": { "alias": "cgc"; "required": false; }; "sigla": { "alias": "sigla"; "required": false; }; "additionalText": { "alias": "additionalText"; "required": false; }; "sectionTitleText": { "alias": "sectionTitleText"; "required": false; }; "sectionText": { "alias": "sectionText"; "required": false; }; "internalLinkTitle": { "alias": "internalLinkTitle"; "required": false; }; "externalLinkTitle": { "alias": "externalLinkTitle"; "required": false; }; "internalLinks": { "alias": "internalLinks"; "required": false; }; "externalLinks": { "alias": "externalLinks"; "required": false; }; "columns": { "alias": "columns"; "required": false; }; "brandFull": { "alias": "brandFull"; "required": false; }; }, {}, never, ["*"], true, never>;
}
