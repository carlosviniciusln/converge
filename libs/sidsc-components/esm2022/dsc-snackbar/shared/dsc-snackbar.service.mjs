import { Injectable } from '@angular/core';
import { DscSnackbarComponent } from '../dsc-snackbar.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/material/snack-bar";
export class DscSnackbarService {
    constructor(snackBar) {
        this.snackBar = snackBar;
    }
    add(snackbarConfig) {
        this.snackBar.openFromComponent(DscSnackbarComponent, {
            verticalPosition: snackbarConfig.verticalPosition ?? 'bottom',
            horizontalPosition: snackbarConfig.horizontalPosition ?? 'center',
            duration: snackbarConfig.duration ?? 5000,
            data: snackbarConfig
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscSnackbarService, deps: [{ token: i1.MatSnackBar }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscSnackbarService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscSnackbarService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.MatSnackBar }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHNjLXNuYWNrYmFyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9zaWRzYy1jb21wb25lbnRzL2RzYy1zbmFja2Jhci9zaGFyZWQvZHNjLXNuYWNrYmFyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUkzQyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQzs7O0FBR2pFLE1BQU0sT0FBTyxrQkFBa0I7SUFFN0IsWUFBbUIsUUFBcUI7UUFBckIsYUFBUSxHQUFSLFFBQVEsQ0FBYTtJQUFHLENBQUM7SUFFNUMsR0FBRyxDQUFDLGNBQWlDO1FBQ25DLElBQUksQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsb0JBQW9CLEVBQUU7WUFDcEQsZ0JBQWdCLEVBQUUsY0FBYyxDQUFDLGdCQUFnQixJQUFJLFFBQVE7WUFDN0Qsa0JBQWtCLEVBQUUsY0FBYyxDQUFDLGtCQUFrQixJQUFJLFFBQVE7WUFDakUsUUFBUSxFQUFFLGNBQWMsQ0FBQyxRQUFRLElBQUksSUFBSTtZQUN6QyxJQUFJLEVBQUUsY0FBYztTQUNyQixDQUFDLENBQUM7SUFDTCxDQUFDOytHQVhVLGtCQUFrQjttSEFBbEIsa0JBQWtCOzs0RkFBbEIsa0JBQWtCO2tCQUQ5QixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTWF0U25hY2tCYXIgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9zbmFjay1iYXInO1xuXG5pbXBvcnQgeyBEc2NTbmFja2JhckNvbmZpZyB9IGZyb20gJy4vZHNjLXNuYWNrYmFyLWNvbmZpZyc7XG5pbXBvcnQgeyBEc2NTbmFja2JhckNvbXBvbmVudCB9IGZyb20gJy4uL2RzYy1zbmFja2Jhci5jb21wb25lbnQnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRHNjU25hY2tiYXJTZXJ2aWNlIHtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgc25hY2tCYXI6IE1hdFNuYWNrQmFyKSB7fVxuXG4gIGFkZChzbmFja2JhckNvbmZpZzogRHNjU25hY2tiYXJDb25maWcpOiB2b2lkIHtcbiAgICB0aGlzLnNuYWNrQmFyLm9wZW5Gcm9tQ29tcG9uZW50KERzY1NuYWNrYmFyQ29tcG9uZW50LCB7XG4gICAgICB2ZXJ0aWNhbFBvc2l0aW9uOiBzbmFja2JhckNvbmZpZy52ZXJ0aWNhbFBvc2l0aW9uID8/ICdib3R0b20nLFxuICAgICAgaG9yaXpvbnRhbFBvc2l0aW9uOiBzbmFja2JhckNvbmZpZy5ob3Jpem9udGFsUG9zaXRpb24gPz8gJ2NlbnRlcicsXG4gICAgICBkdXJhdGlvbjogc25hY2tiYXJDb25maWcuZHVyYXRpb24gPz8gNTAwMCxcbiAgICAgIGRhdGE6IHNuYWNrYmFyQ29uZmlnXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==