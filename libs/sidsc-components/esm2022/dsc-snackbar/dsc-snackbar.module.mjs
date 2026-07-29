import { NgModule } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { NgClass, NgIf } from '@angular/common';
import { DscButtonComponent } from 'sidsc-components/dsc-button';
import { DscSnackbarComponent } from './dsc-snackbar.component';
import { DscSnackbarService } from './shared/dsc-snackbar.service';
import * as i0 from "@angular/core";
export class DscSnackbarModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscSnackbarModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.2.12", ngImport: i0, type: DscSnackbarModule, declarations: [DscSnackbarComponent], imports: [MatSnackBarModule, MatIconModule, NgClass, NgIf, DscButtonComponent], exports: [DscSnackbarComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscSnackbarModule, providers: [DscSnackbarService], imports: [MatSnackBarModule, MatIconModule, DscButtonComponent] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscSnackbarModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [DscSnackbarComponent],
                    imports: [MatSnackBarModule, MatIconModule, NgClass, NgIf, DscButtonComponent],
                    exports: [DscSnackbarComponent],
                    providers: [DscSnackbarService]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHNjLXNuYWNrYmFyLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL3NpZHNjLWNvbXBvbmVudHMvZHNjLXNuYWNrYmFyL2RzYy1zbmFja2Jhci5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUNoRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUVoRCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUVqRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUNoRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQzs7QUFRbkUsTUFBTSxPQUFPLGlCQUFpQjsrR0FBakIsaUJBQWlCO2dIQUFqQixpQkFBaUIsaUJBTGIsb0JBQW9CLGFBQ3pCLGlCQUFpQixFQUFFLGFBQWEsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLGtCQUFrQixhQUNuRSxvQkFBb0I7Z0hBR25CLGlCQUFpQixhQUZqQixDQUFDLGtCQUFrQixDQUFDLFlBRnJCLGlCQUFpQixFQUFFLGFBQWEsRUFBaUIsa0JBQWtCOzs0RkFJbEUsaUJBQWlCO2tCQU43QixRQUFRO21CQUFDO29CQUNSLFlBQVksRUFBRSxDQUFDLG9CQUFvQixDQUFDO29CQUNwQyxPQUFPLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxhQUFhLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxrQkFBa0IsQ0FBQztvQkFDOUUsT0FBTyxFQUFFLENBQUMsb0JBQW9CLENBQUM7b0JBQy9CLFNBQVMsRUFBRSxDQUFDLGtCQUFrQixDQUFDO2lCQUNoQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNYXRTbmFja0Jhck1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3NuYWNrLWJhcic7XG5pbXBvcnQgeyBNYXRJY29uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvaWNvbic7XG5pbXBvcnQgeyBOZ0NsYXNzLCBOZ0lmIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuaW1wb3J0IHsgRHNjQnV0dG9uQ29tcG9uZW50IH0gZnJvbSAnc2lkc2MtY29tcG9uZW50cy9kc2MtYnV0dG9uJztcblxuaW1wb3J0IHsgRHNjU25hY2tiYXJDb21wb25lbnQgfSBmcm9tICcuL2RzYy1zbmFja2Jhci5jb21wb25lbnQnO1xuaW1wb3J0IHsgRHNjU25hY2tiYXJTZXJ2aWNlIH0gZnJvbSAnLi9zaGFyZWQvZHNjLXNuYWNrYmFyLnNlcnZpY2UnO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtEc2NTbmFja2JhckNvbXBvbmVudF0sXG4gIGltcG9ydHM6IFtNYXRTbmFja0Jhck1vZHVsZSwgTWF0SWNvbk1vZHVsZSwgTmdDbGFzcywgTmdJZiwgRHNjQnV0dG9uQ29tcG9uZW50XSxcbiAgZXhwb3J0czogW0RzY1NuYWNrYmFyQ29tcG9uZW50XSxcbiAgcHJvdmlkZXJzOiBbRHNjU25hY2tiYXJTZXJ2aWNlXVxufSlcbmV4cG9ydCBjbGFzcyBEc2NTbmFja2Jhck1vZHVsZSB7IH1cbiJdfQ==