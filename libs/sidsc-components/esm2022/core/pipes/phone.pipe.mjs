import { Pipe } from '@angular/core';
import { formatPhone } from '../formatters/format-phone';
import * as i0 from "@angular/core";
export class PhonePipe {
    transform(value, ...args) {
        return formatPhone(value);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: PhonePipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "16.2.12", ngImport: i0, type: PhonePipe, isStandalone: true, name: "phone" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: PhonePipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'phone',
                    standalone: true
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGhvbmUucGlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3NpZHNjLWNvbXBvbmVudHMvY29yZS9waXBlcy9waG9uZS5waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxJQUFJLEVBQWlCLE1BQU0sZUFBZSxDQUFDO0FBRXBELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQzs7QUFNekQsTUFBTSxPQUFPLFNBQVM7SUFDcEIsU0FBUyxDQUFDLEtBQWEsRUFBRSxHQUFHLElBQWU7UUFDekMsT0FBTyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDNUIsQ0FBQzsrR0FIVSxTQUFTOzZHQUFULFNBQVM7OzRGQUFULFNBQVM7a0JBSnJCLElBQUk7bUJBQUM7b0JBQ0osSUFBSSxFQUFFLE9BQU87b0JBQ2IsVUFBVSxFQUFFLElBQUk7aUJBQ2pCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBmb3JtYXRQaG9uZSB9IGZyb20gJy4uL2Zvcm1hdHRlcnMvZm9ybWF0LXBob25lJztcblxuQFBpcGUoe1xuICBuYW1lOiAncGhvbmUnLFxuICBzdGFuZGFsb25lOiB0cnVlXG59KVxuZXhwb3J0IGNsYXNzIFBob25lUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuICB0cmFuc2Zvcm0odmFsdWU6IHN0cmluZywgLi4uYXJnczogdW5rbm93bltdKTogc3RyaW5nIHtcbiAgICByZXR1cm4gZm9ybWF0UGhvbmUodmFsdWUpO1xuICB9XG59XG4iXX0=