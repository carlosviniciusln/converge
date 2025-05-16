import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { InterceptorSkipLoaderHeader } from 'src/app/shared/interceptors/loader.interceptor';
import { InterceptorSkipErrorHeader } from 'src/app/shared/interceptors/error.interceptor';

interface QueryParams {
  [key: string]: string | number;
}

interface ShowEvents {
  loader: boolean;
  error: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly END_POINT: string;

  constructor(private http: HttpClient) {
    this.END_POINT = `${environment.end_point}`;
  }

  public downloadfile(
    route: string,
    qp: QueryParams = {},
    showEvents: ShowEvents = { loader: true, error: true }
  ): string {
    const cfqu = this.correctFormatForQueryUrl(qp);
    const headers = this.obterHeaders(showEvents);

    return (window.location.href = `${this.END_POINT}/${route}${cfqu}`);
  }

  public async get<T>(
    route: string,
    qp: QueryParams = {},
    showEvents: ShowEvents = { loader: true, error: true }
  ): Promise<T> {
    const cfqu = this.correctFormatForQueryUrl(qp);
    const headers = this.obterHeaders(showEvents);

    return this.http
      .get<T>(`${this.END_POINT}/${route}${cfqu}`, {
        headers: headers,
      })
      .toPromise();
  }

  public async delete<T>(
    route: string,
    qp: QueryParams = {},
    showEvents: ShowEvents = { loader: true, error: true }
  ): Promise<T> {
    const cfqu = this.correctFormatForQueryUrl(qp);
    const headers = this.obterHeaders(showEvents);
    return this.http
      .delete<T>(`${this.END_POINT}/${route}${cfqu}`, {
        headers: headers,
      })
      .toPromise();
  }

  public async post<T>(
    route: string,
    data: any,
    qp: QueryParams = {},
    showEvents: ShowEvents = { loader: true, error: true }
  ): Promise<T> {
    const cfqu = this.correctFormatForQueryUrl(qp);
    const headers = this.obterHeaders(showEvents);

    return this.http
      .post<T>(`${this.END_POINT}/${route}${cfqu}`, data, {
        headers: headers,
      })
      .toPromise();
  }

  public async put<T>(
    route: string,
    data: any,
    qp: QueryParams = {},
    showEvents: ShowEvents = { loader: true, error: true }
  ): Promise<T> {
    const cfqu = this.correctFormatForQueryUrl(qp);
    const headers = this.obterHeaders(showEvents);

    return this.http
      .put<T>(`${this.END_POINT}/${route}${cfqu}`, data, {
        headers: headers,
      })
      .toPromise();
  }

  private obterHeaders(showEvent: ShowEvents): HttpHeaders {
    let headers = this.obterHeadersBase();
    if (!showEvent.loader) {
      headers = headers.append(InterceptorSkipLoaderHeader, '');
    }
    if (!showEvent.error) {
      headers = headers.append(InterceptorSkipErrorHeader, '');
    }
    return headers;
  }

  private obterHeadersBase(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      'Access-Control-Allow-Origin': '*',
    });
  }

  private correctFormatForQueryUrl(qp: QueryParams): string {
    if (qp === null || qp === undefined) {
      return '';
    }
    const qpAsStr = this.mapQueryParamsToUrl(qp);
    return qpAsStr.length === 0 ? '' : `?${qpAsStr.join('&')}`;
  }

  private mapQueryParamsToUrl(qp: QueryParams): Array<string> {
    return Object.keys(qp).map((key: string) => {
      return `${key}=${qp[key]}`;
    });
  }
}
