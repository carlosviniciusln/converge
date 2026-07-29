import { TemplateRef } from '@angular/core';
import * as i0 from "@angular/core";
export type DscCardTitleAvatarSize = 'large' | 'medium' | 'small';
export type DscCardVariant = 'neutral' | 'highlight';
export type DscCardAppearance = 'outlined' | 'raised';
export type DscCardTitleAvatar = {
    imgSrc?: string;
    icon?: string;
    size?: DscCardTitleAvatarSize;
    color?: string;
};
export type DscCardTitle = {
    variant?: DscCardVariant;
    text: string;
    subtext?: string;
    avatar?: DscCardTitleAvatar;
    headingLevelTitle?: string;
    headingLevelSubtitle?: string;
};
export type DscCardContent = {
    text?: string;
    template?: TemplateRef<any>;
};
export type DscCardImage = {
    src: string;
    alt: string;
    enableMargin?: boolean;
    topPosition?: boolean;
};
export type DscCardFooter = {
    showDivider?: boolean;
    template: TemplateRef<any>;
};
export type DscCardData = {
    appearance?: DscCardAppearance;
    interative?: boolean;
    focusable?: boolean;
    title?: DscCardTitle;
    image?: DscCardImage;
    content?: DscCardContent;
    footer?: DscCardFooter;
};
export declare class DscCardComponent {
    data: DscCardData;
    iconStyle: 'outlined' | 'filled' | 'rounded' | 'sharp' | 'two-tone';
    getIconClass(): string;
    getHeadingTagTitle(level?: string): string;
    getHeadingTagSubtitle(level?: string): string;
    getTitleHtml(): string;
    getSubtitleHtml(): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<DscCardComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DscCardComponent, "dsc-card", never, { "data": { "alias": "data"; "required": false; }; "iconStyle": { "alias": "iconStyle"; "required": false; }; }, {}, never, never, true, never>;
}
