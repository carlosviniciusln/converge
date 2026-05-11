import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
  } from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import { Observable } from 'rxjs';
  import { finalize } from 'rxjs/operators';
  import { LoaderService } from '../services/loader.service';
  
  export const InterceptorSkipLoaderHeader = 'X-Skip-Loader-Interceptor';
  
  @Injectable()
  export class LoaderInterceptor implements HttpInterceptor {
    constructor(public loader: LoaderService) {}
  
    intercept(
      request: HttpRequest<any>,
      next: HttpHandler
    ): Observable<HttpEvent<any>> {
      if (!request.headers.has(InterceptorSkipLoaderHeader)) {
        this.loader.show();
        return next.handle(request).pipe(finalize(() => this.loader.hide()));
      } else {
        return next.handle(request);
      }
    }
  }
  