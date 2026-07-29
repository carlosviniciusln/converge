import { TemplateRef } from '@angular/core';
export interface DscAccordionItem {
    title: string;
    icon?: string;
    iconColor?: string;
    expanded?: boolean;
    hideIconDescription?: boolean;
    text?: string;
    template?: TemplateRef<any> | null;
    context?: any;
    visible?: boolean;
    headingLevel?: string;
}
