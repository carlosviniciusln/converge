import { BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare class BreakpointMatcherService {
    private _breakpointObserver;
    constructor(_breakpointObserver: BreakpointObserver);
    private _breakpoints;
    getSize$(): Observable<string>;
    static ɵfac: i0.ɵɵFactoryDeclaration<BreakpointMatcherService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<BreakpointMatcherService>;
}
