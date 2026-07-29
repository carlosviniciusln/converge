import { MatTab } from '@angular/material/tabs';
import { BooleanInput } from '@angular/cdk/coercion';
import * as i0 from "@angular/core";
export declare class DscTabComponent {
    matTab: MatTab;
    label: string;
    icon?: string;
    iconStyle?: 'outlined' | 'filled' | 'rounded' | 'sharp' | 'two-tone';
    dscBadge?: string;
    dscBadgeSize: 'small' | 'standard' | 'large';
    get disabled(): boolean;
    set disabled(value: BooleanInput);
    private _disabled;
    getIconClass(): string;
    isImage(icon: any): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<DscTabComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DscTabComponent, "dsc-tab", never, { "label": { "alias": "label"; "required": false; }; "icon": { "alias": "icon"; "required": false; }; "iconStyle": { "alias": "iconStyle"; "required": false; }; "dscBadge": { "alias": "dscBadge"; "required": false; }; "dscBadgeSize": { "alias": "dscBadgeSize"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; }, {}, never, ["*"], true, never>;
}
