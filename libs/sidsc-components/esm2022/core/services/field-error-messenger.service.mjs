import { Injectable } from '@angular/core';
import { formatCurrency } from '@angular/common';
import * as i0 from "@angular/core";
export class FieldErrorMessengerService {
    getErrorMessage(formField, customErrorMessage) {
        if (!formField)
            return customErrorMessage || '';
        const errorMessages = {
            required: 'Campo obrigatório.',
            email: 'Email inválido.',
            pattern: 'Formato inválido.',
            minlength: (error) => `O tamanho mínimo é ${error.requiredLength}.`,
            maxlength: (error) => `O tamanho máximo é ${error.requiredLength}.`,
            min: (error) => `O valor mínimo é ${formatCurrency(error.min, 'pt-br', 'R$')}.`,
            max: (error) => `O valor máximo é ${formatCurrency(error.max, 'pt-br', 'R$')}.`,
            matDatepickerFilter: 'Data não permitida.',
            matDatepickerMin: 'Data inferior ao mínimo.',
            matDatepickerMax: 'Data superior ao máximo.',
            notAllowedFile: 'Formato de arquivo inválido.',
            fileSizeOverLimit: (error) => `O tamanho máximo é ${error.maxSizeFriendly}.`,
        };
        for (const error in formField.errors) {
            const message = errorMessages[error];
            if (message) {
                return typeof message === 'function' ? message(formField.errors[error]) : message;
            }
        }
        return customErrorMessage || '';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: FieldErrorMessengerService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: FieldErrorMessengerService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: FieldErrorMessengerService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGQtZXJyb3ItbWVzc2VuZ2VyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9zaWRzYy1jb21wb25lbnRzL2NvcmUvc2VydmljZXMvZmllbGQtZXJyb3ItbWVzc2VuZ2VyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUzQyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0saUJBQWlCLENBQUM7O0FBR2pELE1BQU0sT0FBTywwQkFBMEI7SUFDckMsZUFBZSxDQUFDLFNBQW9CLEVBQUUsa0JBQTJCO1FBQy9ELElBQUksQ0FBQyxTQUFTO1lBQUUsT0FBTyxrQkFBa0IsSUFBSSxFQUFFLENBQUM7UUFFaEQsTUFBTSxhQUFhLEdBRWY7WUFDRixRQUFRLEVBQUUsb0JBQW9CO1lBQzlCLEtBQUssRUFBRSxpQkFBaUI7WUFDeEIsT0FBTyxFQUFFLG1CQUFtQjtZQUM1QixTQUFTLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLHNCQUFzQixLQUFLLENBQUMsY0FBYyxHQUFHO1lBQ25FLFNBQVMsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsc0JBQXNCLEtBQUssQ0FBQyxjQUFjLEdBQUc7WUFDbkUsR0FBRyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxvQkFBb0IsY0FBYyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxHQUFHO1lBQy9FLEdBQUcsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsb0JBQW9CLGNBQWMsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsR0FBRztZQUMvRSxtQkFBbUIsRUFBRSxxQkFBcUI7WUFDMUMsZ0JBQWdCLEVBQUUsMEJBQTBCO1lBQzVDLGdCQUFnQixFQUFFLDBCQUEwQjtZQUM1QyxjQUFjLEVBQUUsOEJBQThCO1lBQzlDLGlCQUFpQixFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxzQkFBc0IsS0FBSyxDQUFDLGVBQWUsR0FBRztTQUM3RSxDQUFDO1FBRUYsS0FBSyxNQUFNLEtBQUssSUFBSSxTQUFTLENBQUMsTUFBTSxFQUFFO1lBQ3BDLE1BQU0sT0FBTyxHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNyQyxJQUFJLE9BQU8sRUFBRTtnQkFDWCxPQUFPLE9BQU8sT0FBTyxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO2FBQ25GO1NBQ0Y7UUFDRCxPQUFPLGtCQUFrQixJQUFJLEVBQUUsQ0FBQztJQUNsQyxDQUFDOytHQTVCVSwwQkFBMEI7bUhBQTFCLDBCQUEwQixjQURkLE1BQU07OzRGQUNsQiwwQkFBMEI7a0JBRHRDLFVBQVU7bUJBQUMsRUFBRSxVQUFVLEVBQUMsTUFBTSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTmdDb250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgZm9ybWF0Q3VycmVuY3kgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46J3Jvb3QnIH0pXG5leHBvcnQgY2xhc3MgRmllbGRFcnJvck1lc3NlbmdlclNlcnZpY2Uge1xuICBnZXRFcnJvck1lc3NhZ2UoZm9ybUZpZWxkOiBOZ0NvbnRyb2wsIGN1c3RvbUVycm9yTWVzc2FnZT86IHN0cmluZyk6IHN0cmluZyB7XG4gICAgaWYgKCFmb3JtRmllbGQpIHJldHVybiBjdXN0b21FcnJvck1lc3NhZ2UgfHwgJyc7XG5cbiAgICBjb25zdCBlcnJvck1lc3NhZ2VzOiB7XG4gICAgICBba2V5OiBzdHJpbmddOiBzdHJpbmcgfCAoKGVycm9yOiBhbnkpID0+IHN0cmluZylcbiAgICB9ID0ge1xuICAgICAgcmVxdWlyZWQ6ICdDYW1wbyBvYnJpZ2F0w7NyaW8uJyxcbiAgICAgIGVtYWlsOiAnRW1haWwgaW52w6FsaWRvLicsXG4gICAgICBwYXR0ZXJuOiAnRm9ybWF0byBpbnbDoWxpZG8uJyxcbiAgICAgIG1pbmxlbmd0aDogKGVycm9yKSA9PiBgTyB0YW1hbmhvIG3DrW5pbW8gw6kgJHtlcnJvci5yZXF1aXJlZExlbmd0aH0uYCxcbiAgICAgIG1heGxlbmd0aDogKGVycm9yKSA9PiBgTyB0YW1hbmhvIG3DoXhpbW8gw6kgJHtlcnJvci5yZXF1aXJlZExlbmd0aH0uYCxcbiAgICAgIG1pbjogKGVycm9yKSA9PiBgTyB2YWxvciBtw61uaW1vIMOpICR7Zm9ybWF0Q3VycmVuY3koZXJyb3IubWluLCAncHQtYnInLCAnUiQnKX0uYCxcbiAgICAgIG1heDogKGVycm9yKSA9PiBgTyB2YWxvciBtw6F4aW1vIMOpICR7Zm9ybWF0Q3VycmVuY3koZXJyb3IubWF4LCAncHQtYnInLCAnUiQnKX0uYCxcbiAgICAgIG1hdERhdGVwaWNrZXJGaWx0ZXI6ICdEYXRhIG7Do28gcGVybWl0aWRhLicsXG4gICAgICBtYXREYXRlcGlja2VyTWluOiAnRGF0YSBpbmZlcmlvciBhbyBtw61uaW1vLicsXG4gICAgICBtYXREYXRlcGlja2VyTWF4OiAnRGF0YSBzdXBlcmlvciBhbyBtw6F4aW1vLicsXG4gICAgICBub3RBbGxvd2VkRmlsZTogJ0Zvcm1hdG8gZGUgYXJxdWl2byBpbnbDoWxpZG8uJyxcbiAgICAgIGZpbGVTaXplT3ZlckxpbWl0OiAoZXJyb3IpID0+IGBPIHRhbWFuaG8gbcOheGltbyDDqSAke2Vycm9yLm1heFNpemVGcmllbmRseX0uYCxcbiAgICB9O1xuXG4gICAgZm9yIChjb25zdCBlcnJvciBpbiBmb3JtRmllbGQuZXJyb3JzKSB7XG4gICAgICBjb25zdCBtZXNzYWdlID0gZXJyb3JNZXNzYWdlc1tlcnJvcl07XG4gICAgICBpZiAobWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gdHlwZW9mIG1lc3NhZ2UgPT09ICdmdW5jdGlvbicgPyBtZXNzYWdlKGZvcm1GaWVsZC5lcnJvcnNbZXJyb3JdKSA6IG1lc3NhZ2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjdXN0b21FcnJvck1lc3NhZ2UgfHwgJyc7XG4gIH1cbn1cbiJdfQ==