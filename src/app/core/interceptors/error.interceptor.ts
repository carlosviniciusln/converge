import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export const InterceptorSkipErrorHeader = 'X-Skip-Error-Interceptor';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private toastr: ToastrService, private router: Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (!request.headers.has(InterceptorSkipErrorHeader)) {
          const status: number = err.status;
          const toastrOptions = {
            timeOut: 5500,
            extendedTimeOut: 2000,
            closeButton: false,
          };

          switch (status) {
            case 401:
              this.toastr.error('Login requerido!', 'Error', toastrOptions);
              this.router.navigate(['/']);
              break;
            case 403:
              this.toastr.error(
                'Acesso não autorizado!',
                'Error',
                toastrOptions
              );
              break;
            case 404:
              this.toastr.error(
                'Página não encontrada!',
                'Error',
                toastrOptions
              );
              break;
            case 500:
            case 400:
              const errors: string[] = err.error.errors;
              errors.forEach((x) => {
                this.toastr.error(x, 'Error', toastrOptions);
              });
              break;
            default:
              this.toastr.error(
                'Ocorreu um erro inesperado',
                'Error',
                toastrOptions
              );
              break;
          }
        }
        const error = (err && err.error && err.error.message) || err.statusText;
        console.error(err);
        return throwError(error);
      })
    );
  }
}
