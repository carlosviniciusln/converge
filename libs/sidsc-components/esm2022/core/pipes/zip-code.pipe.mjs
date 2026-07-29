import { Pipe } from '@angular/core';
import { formatZipCode } from '../formatters/format-zip-code';
import * as i0 from "@angular/core";
export class ZipCodePipe {
    transform(value, ...args) {
        return formatZipCode(value);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: ZipCodePipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "16.2.12", ngImport: i0, type: ZipCodePipe, isStandalone: true, name: "zipCode" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: ZipCodePipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'zipCode',
                    standalone: true
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiemlwLWNvZGUucGlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3NpZHNjLWNvbXBvbmVudHMvY29yZS9waXBlcy96aXAtY29kZS5waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxJQUFJLEVBQWlCLE1BQU0sZUFBZSxDQUFDO0FBRXBELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQzs7QUFNOUQsTUFBTSxPQUFPLFdBQVc7SUFDdEIsU0FBUyxDQUFDLEtBQWEsRUFBRSxHQUFHLElBQWU7UUFDekMsT0FBTyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDOUIsQ0FBQzsrR0FIVSxXQUFXOzZHQUFYLFdBQVc7OzRGQUFYLFdBQVc7a0JBSnZCLElBQUk7bUJBQUM7b0JBQ0osSUFBSSxFQUFFLFNBQVM7b0JBQ2YsVUFBVSxFQUFFLElBQUk7aUJBQ2pCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBmb3JtYXRaaXBDb2RlIH0gZnJvbSAnLi4vZm9ybWF0dGVycy9mb3JtYXQtemlwLWNvZGUnO1xuXG5AUGlwZSh7XG4gIG5hbWU6ICd6aXBDb2RlJyxcbiAgc3RhbmRhbG9uZTogdHJ1ZVxufSlcbmV4cG9ydCBjbGFzcyBaaXBDb2RlUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuICB0cmFuc2Zvcm0odmFsdWU6IHN0cmluZywgLi4uYXJnczogdW5rbm93bltdKTogc3RyaW5nIHtcbiAgICByZXR1cm4gZm9ybWF0WmlwQ29kZSh2YWx1ZSk7XG4gIH1cbn1cbiJdfQ==