import { Injectable } from '@angular/core';
import { take } from 'rxjs';
import { DscDialogComponent } from '../dsc-dialog.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/material/dialog";
export class DscDialogService {
    constructor(dialog) {
        this.dialog = dialog;
    }
    confirm(dscDialogConfig) {
        const dialogRef = this.dialog.open(DscDialogComponent, {
            disableClose: dscDialogConfig.disableClose,
            autoFocus: dscDialogConfig.autoFocus,
            restoreFocus: dscDialogConfig.restoreFocus,
            hasBackdrop: true,
            ariaLabel: dscDialogConfig.ariaLabel,
            ariaLabelledBy: dscDialogConfig.ariaLabelledBy,
            ariaDescribedBy: dscDialogConfig.ariaDescribedBy,
            data: dscDialogConfig.data
        });
        dialogRef.afterClosed().pipe(take(1)).subscribe(value => {
            const actionButton = dscDialogConfig.data?.actionButton;
            if (value && actionButton?.confirmFunction) {
                actionButton.confirmFunction(value);
            }
            else if (!value && actionButton?.cancelFunction) {
                actionButton.cancelFunction();
            }
        });
        return dialogRef;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscDialogService, deps: [{ token: i1.MatDialog }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscDialogService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscDialogService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.MatDialog }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHNjLWRpYWxvZy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvc2lkc2MtY29tcG9uZW50cy9kc2MtZGlhbG9nL3NoYXJlZC9kc2MtZGlhbG9nLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBYSxNQUFNLGVBQWUsQ0FBQztBQUd0RCxPQUFPLEVBQWdCLElBQUksRUFBTyxNQUFNLE1BQU0sQ0FBQztBQUcvQyxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQzs7O0FBRzdELE1BQU0sT0FBTyxnQkFBZ0I7SUFFM0IsWUFBbUIsTUFBaUI7UUFBakIsV0FBTSxHQUFOLE1BQU0sQ0FBVztJQUFJLENBQUM7SUFFekMsT0FBTyxDQUFDLGVBQWdDO1FBQ3RDLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFO1lBQ3JELFlBQVksRUFBRSxlQUFlLENBQUMsWUFBWTtZQUMxQyxTQUFTLEVBQUUsZUFBZSxDQUFDLFNBQVM7WUFDcEMsWUFBWSxFQUFFLGVBQWUsQ0FBQyxZQUFZO1lBQzFDLFdBQVcsRUFBRSxJQUFJO1lBQ2pCLFNBQVMsRUFBRSxlQUFlLENBQUMsU0FBUztZQUNwQyxjQUFjLEVBQUUsZUFBZSxDQUFDLGNBQWM7WUFDOUMsZUFBZSxFQUFFLGVBQWUsQ0FBQyxlQUFlO1lBQ2hELElBQUksRUFBRSxlQUFlLENBQUMsSUFBSTtTQUMzQixDQUFDLENBQUM7UUFHSCxTQUFTLENBQUMsV0FBVyxFQUFFLENBQUMsSUFBSSxDQUMxQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDekIsTUFBTSxZQUFZLEdBQUcsZUFBZSxDQUFDLElBQUksRUFBRSxZQUFZLENBQUM7WUFDeEQsSUFBRyxLQUFLLElBQUksWUFBWSxFQUFFLGVBQWUsRUFBRTtnQkFDekMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUNyQztpQkFBTSxJQUFHLENBQUMsS0FBSyxJQUFJLFlBQVksRUFBRSxjQUFjLEVBQUU7Z0JBQ2hELFlBQVksQ0FBQyxjQUFjLEVBQUUsQ0FBQzthQUMvQjtRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUwsT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQzsrR0E1QlUsZ0JBQWdCO21IQUFoQixnQkFBZ0IsY0FESCxNQUFNOzs0RkFDbkIsZ0JBQWdCO2tCQUQ1QixVQUFVO21CQUFDLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIE9uRGVzdHJveSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTWF0RGlhbG9nLCBNYXREaWFsb2dSZWYgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9kaWFsb2cnO1xuXG5pbXBvcnQgeyBTdWJzY3JpcHRpb24sIHRha2UsIHRhcCB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBEc2NEaWFsb2dDb25maWcgfSBmcm9tICcuL2RzYy1kaWFsb2ctY29uZmlnJztcbmltcG9ydCB7IERzY0RpYWxvZ0NvbXBvbmVudCB9IGZyb20gJy4uL2RzYy1kaWFsb2cuY29tcG9uZW50JztcblxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcbmV4cG9ydCBjbGFzcyBEc2NEaWFsb2dTZXJ2aWNlIHtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgZGlhbG9nOiBNYXREaWFsb2cpIHsgfVxuXG4gIGNvbmZpcm0oZHNjRGlhbG9nQ29uZmlnOiBEc2NEaWFsb2dDb25maWcpOiBNYXREaWFsb2dSZWY8RHNjRGlhbG9nQ29tcG9uZW50PiB7XG4gICAgY29uc3QgZGlhbG9nUmVmID0gdGhpcy5kaWFsb2cub3BlbihEc2NEaWFsb2dDb21wb25lbnQsIHtcbiAgICAgIGRpc2FibGVDbG9zZTogZHNjRGlhbG9nQ29uZmlnLmRpc2FibGVDbG9zZSxcbiAgICAgIGF1dG9Gb2N1czogZHNjRGlhbG9nQ29uZmlnLmF1dG9Gb2N1cyxcbiAgICAgIHJlc3RvcmVGb2N1czogZHNjRGlhbG9nQ29uZmlnLnJlc3RvcmVGb2N1cyxcbiAgICAgIGhhc0JhY2tkcm9wOiB0cnVlLFxuICAgICAgYXJpYUxhYmVsOiBkc2NEaWFsb2dDb25maWcuYXJpYUxhYmVsLFxuICAgICAgYXJpYUxhYmVsbGVkQnk6IGRzY0RpYWxvZ0NvbmZpZy5hcmlhTGFiZWxsZWRCeSxcbiAgICAgIGFyaWFEZXNjcmliZWRCeTogZHNjRGlhbG9nQ29uZmlnLmFyaWFEZXNjcmliZWRCeSxcbiAgICAgIGRhdGE6IGRzY0RpYWxvZ0NvbmZpZy5kYXRhXG4gICAgfSk7XG5cblxuICAgIGRpYWxvZ1JlZi5hZnRlckNsb3NlZCgpLnBpcGUoXG4gICAgICB0YWtlKDEpKS5zdWJzY3JpYmUodmFsdWUgPT4ge1xuICAgICAgICBjb25zdCBhY3Rpb25CdXR0b24gPSBkc2NEaWFsb2dDb25maWcuZGF0YT8uYWN0aW9uQnV0dG9uO1xuICAgICAgICBpZih2YWx1ZSAmJiBhY3Rpb25CdXR0b24/LmNvbmZpcm1GdW5jdGlvbikge1xuICAgICAgICAgIGFjdGlvbkJ1dHRvbi5jb25maXJtRnVuY3Rpb24odmFsdWUpO1xuICAgICAgICB9IGVsc2UgaWYoIXZhbHVlICYmIGFjdGlvbkJ1dHRvbj8uY2FuY2VsRnVuY3Rpb24pIHtcbiAgICAgICAgICBhY3Rpb25CdXR0b24uY2FuY2VsRnVuY3Rpb24oKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICByZXR1cm4gZGlhbG9nUmVmO1xuICB9XG59XG4iXX0=