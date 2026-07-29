import { NgModule } from '@angular/core';
import { CommonModule, NgClass, NgIf, NgTemplateOutlet } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { DscButtonComponent } from 'sidsc-components/dsc-button';
import { DscDialogComponent } from './dsc-dialog.component';
import { DscDialogService } from './shared/dsc-dialog.service';
import { DscTooltipModule } from 'sidsc-components/dsc-tooltip';
import * as i0 from "@angular/core";
export class DscDialogModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscDialogModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.2.12", ngImport: i0, type: DscDialogModule, declarations: [DscDialogComponent], imports: [MatDialogModule,
            NgClass,
            NgIf,
            DscButtonComponent,
            DscTooltipModule,
            MatIconModule,
            NgTemplateOutlet,
            CommonModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscDialogModule, providers: [DscDialogService], imports: [MatDialogModule,
            DscButtonComponent,
            DscTooltipModule,
            MatIconModule,
            CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscDialogModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [DscDialogComponent],
                    imports: [
                        MatDialogModule,
                        NgClass,
                        NgIf,
                        DscButtonComponent,
                        DscTooltipModule,
                        MatIconModule,
                        NgTemplateOutlet,
                        CommonModule
                    ],
                    providers: [DscDialogService]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHNjLWRpYWxvZy5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9zaWRzYy1jb21wb25lbnRzL2RzYy1kaWFsb2cvZHNjLWRpYWxvZy5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNoRixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBRTNELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBRWpFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQzVELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQy9ELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDhCQUE4QixDQUFDOztBQWdCaEUsTUFBTSxPQUFPLGVBQWU7K0dBQWYsZUFBZTtnSEFBZixlQUFlLGlCQWJYLGtCQUFrQixhQUUvQixlQUFlO1lBQ2YsT0FBTztZQUNQLElBQUk7WUFDSixrQkFBa0I7WUFDbEIsZ0JBQWdCO1lBQ2hCLGFBQWE7WUFDYixnQkFBZ0I7WUFDaEIsWUFBWTtnSEFJSCxlQUFlLGFBRmYsQ0FBQyxnQkFBZ0IsQ0FBQyxZQVQzQixlQUFlO1lBR2Ysa0JBQWtCO1lBQ2xCLGdCQUFnQjtZQUNoQixhQUFhO1lBRWIsWUFBWTs7NEZBSUgsZUFBZTtrQkFkM0IsUUFBUTttQkFBQztvQkFDUixZQUFZLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQztvQkFDbEMsT0FBTyxFQUFFO3dCQUNQLGVBQWU7d0JBQ2YsT0FBTzt3QkFDUCxJQUFJO3dCQUNKLGtCQUFrQjt3QkFDbEIsZ0JBQWdCO3dCQUNoQixhQUFhO3dCQUNiLGdCQUFnQjt3QkFDaEIsWUFBWTtxQkFDYjtvQkFDRCxTQUFTLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQztpQkFDOUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlLCBOZ0NsYXNzLCBOZ0lmLCBOZ1RlbXBsYXRlT3V0bGV0IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE1hdEljb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9pY29uJztcbmltcG9ydCB7IE1hdERpYWxvZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2RpYWxvZyc7XG5cbmltcG9ydCB7IERzY0J1dHRvbkNvbXBvbmVudCB9IGZyb20gJ3NpZHNjLWNvbXBvbmVudHMvZHNjLWJ1dHRvbic7XG5cbmltcG9ydCB7IERzY0RpYWxvZ0NvbXBvbmVudCB9IGZyb20gJy4vZHNjLWRpYWxvZy5jb21wb25lbnQnO1xuaW1wb3J0IHsgRHNjRGlhbG9nU2VydmljZSB9IGZyb20gJy4vc2hhcmVkL2RzYy1kaWFsb2cuc2VydmljZSc7XG5pbXBvcnQgeyBEc2NUb29sdGlwTW9kdWxlIH0gZnJvbSAnc2lkc2MtY29tcG9uZW50cy9kc2MtdG9vbHRpcCc7XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW0RzY0RpYWxvZ0NvbXBvbmVudF0sXG4gIGltcG9ydHM6IFtcbiAgICBNYXREaWFsb2dNb2R1bGUsXG4gICAgTmdDbGFzcyxcbiAgICBOZ0lmLFxuICAgIERzY0J1dHRvbkNvbXBvbmVudCxcbiAgICBEc2NUb29sdGlwTW9kdWxlLFxuICAgIE1hdEljb25Nb2R1bGUsXG4gICAgTmdUZW1wbGF0ZU91dGxldCxcbiAgICBDb21tb25Nb2R1bGVcbiAgXSxcbiAgcHJvdmlkZXJzOiBbRHNjRGlhbG9nU2VydmljZV1cbn0pXG5leHBvcnQgY2xhc3MgRHNjRGlhbG9nTW9kdWxlIHt9XG4iXX0=