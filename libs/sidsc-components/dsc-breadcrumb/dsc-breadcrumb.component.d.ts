import { DscBreadcrumbItem } from './shared/dsc-breadcrumb-item';
import * as i0 from "@angular/core";
export declare class DscBreadcrumbComponent {
    isScreenSmall: boolean;
    onResize(event: any): void;
    urls?: DscBreadcrumbItem[];
    homeUrl: string;
    truncatedUrls: DscBreadcrumbItem[];
    showFullBreadcrumb: boolean;
    breadcrumbAriaLabel: string;
    ngOnInit(): void;
    checkScreenSize(): void;
    updateTruncatedUrls(): void;
    handleKeydown(event: KeyboardEvent): void;
    toggleBreadcrumb(): void;
    get displayedUrls(): DscBreadcrumbItem[] | undefined;
    static ɵfac: i0.ɵɵFactoryDeclaration<DscBreadcrumbComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DscBreadcrumbComponent, "dsc-breadcrumb", never, { "urls": { "alias": "urls"; "required": false; }; "homeUrl": { "alias": "homeUrl"; "required": false; }; }, {}, never, never, true, never>;
}
