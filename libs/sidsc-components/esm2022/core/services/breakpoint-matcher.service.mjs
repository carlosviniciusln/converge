import { Injectable } from '@angular/core';
import { Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/layout";
export class BreakpointMatcherService {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: BreakpointMatcherService, deps: [{ token: i1.BreakpointObserver }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: BreakpointMatcherService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: BreakpointMatcherService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.BreakpointObserver }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJlYWtwb2ludC1tYXRjaGVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9zaWRzYy1jb21wb25lbnRzL2NvcmUvc2VydmljZXMvYnJlYWtwb2ludC1tYXRjaGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQXNCLFdBQVcsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBRXRFLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7O0FBSXJDLE1BQU0sT0FBTyx3QkFBd0I7SUFDbkMsWUFBb0IsbUJBQXVDO1FBQXZDLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBb0I7UUFFbkQsaUJBQVksR0FBRztZQUNyQixFQUFFLEVBQUUsV0FBVyxDQUFDLE1BQU07WUFDdEIsRUFBRSxFQUFFLFdBQVcsQ0FBQyxLQUFLO1lBQ3JCLEVBQUUsRUFBRSxXQUFXLENBQUMsTUFBTTtZQUN0QixFQUFFLEVBQUUsV0FBVyxDQUFDLEtBQUs7WUFDckIsRUFBRSxFQUFFLFdBQVcsQ0FBQyxNQUFNO1NBQ3ZCLENBQUM7SUFSNEQsQ0FBQztJQVUvRCxRQUFRO1FBQ04sT0FBTyxJQUFJLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUM1RSxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDWCxNQUFNLG1CQUFtQixHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLE1BQU07WUFDL0QsYUFBYTtZQUNiLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQzlDLENBQUM7WUFDRixPQUFPLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxJQUFJLFNBQVMsQ0FBQztRQUM3QyxDQUFDLENBQUMsQ0FDSCxDQUFDO0lBQ0osQ0FBQzsrR0FyQlUsd0JBQXdCO21IQUF4Qix3QkFBd0IsY0FEWixNQUFNOzs0RkFDbEIsd0JBQXdCO2tCQURwQyxVQUFVO21CQUFDLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJyZWFrcG9pbnRPYnNlcnZlciwgQnJlYWtwb2ludHMgfSBmcm9tICdAYW5ndWxhci9jZGsvbGF5b3V0JztcblxuaW1wb3J0IHsgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBCcmVha3BvaW50TWF0Y2hlclNlcnZpY2Uge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9icmVha3BvaW50T2JzZXJ2ZXI6IEJyZWFrcG9pbnRPYnNlcnZlcikge31cblxuICBwcml2YXRlIF9icmVha3BvaW50cyA9IHtcbiAgICB4czogQnJlYWtwb2ludHMuWFNtYWxsLFxuICAgIHNtOiBCcmVha3BvaW50cy5TbWFsbCxcbiAgICBtZDogQnJlYWtwb2ludHMuTWVkaXVtLFxuICAgIGxnOiBCcmVha3BvaW50cy5MYXJnZSxcbiAgICB4bDogQnJlYWtwb2ludHMuWExhcmdlXG4gIH07XG5cbiAgZ2V0U2l6ZSQoKTogT2JzZXJ2YWJsZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gdGhpcy5fYnJlYWtwb2ludE9ic2VydmVyLm9ic2VydmUoT2JqZWN0LnZhbHVlcyh0aGlzLl9icmVha3BvaW50cykpLnBpcGUoXG4gICAgICBtYXAocmVzdWx0ID0+IHtcbiAgICAgICAgY29uc3QgbWF0Y2hpbmdCcmVha3BvaW50cyA9IE9iamVjdC5rZXlzKHRoaXMuX2JyZWFrcG9pbnRzKS5maWx0ZXIoXG4gICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgIGkgPT4gcmVzdWx0LmJyZWFrcG9pbnRzW3RoaXMuX2JyZWFrcG9pbnRzW2ldXVxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gbWF0Y2hpbmdCcmVha3BvaW50c1swXSB8fCAndW5rbm93bic7XG4gICAgICB9KVxuICAgICk7XG4gIH1cbn1cbiJdfQ==