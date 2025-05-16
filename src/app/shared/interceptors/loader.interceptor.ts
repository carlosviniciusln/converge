import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
  } from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import { NgxSpinnerService } from 'ngx-spinner';
  import { Observable } from 'rxjs';
  import { finalize } from 'rxjs/operators';
  
  export const InterceptorSkipLoaderHeader = 'X-Skip-Loader-Interceptor';
  
  @Injectable()
  export class LoaderInterceptor implements HttpInterceptor {
    constructor(public spinner: NgxSpinnerService) {}
  
    intercept(
      request: HttpRequest<any>,
      next: HttpHandler
    ): Observable<HttpEvent<any>> {
      if (!request.headers.has(InterceptorSkipLoaderHeader)) {
        this.spinner.show();
        return next.handle(request).pipe(finalize(() => this.spinner.hide()));
      } else {
        return next.handle(request);
      }
    }
  }
  