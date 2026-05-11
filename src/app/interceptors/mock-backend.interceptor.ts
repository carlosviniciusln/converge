import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

interface MockEndpoints {
  [path: string]: { status?: number; body: any };
}

@Injectable()
export class MockBackendInterceptor implements HttpInterceptor {
  private static cache: { endpoints?: MockEndpoints } | null = null;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const tryHandle = (endpoints: MockEndpoints | undefined) => {
      try {
        // remove scheme+host, then normalize by removing a leading /api if present
        const rawUrl = req.url.replace(/https?:\/\/[^/]+/, '');
        const normalize = (s: string) => s.replace(/^\/api/, '').replace(/\/+/g, '/');
        const normUrl = normalize(rawUrl);
        const keys = endpoints ? Object.keys(endpoints) : [];
        // debug: log normalization and available keys (only in dev)
        try { console.debug('MockBackendInterceptor: normUrl=', normUrl, 'keys=', keys); } catch(e){}
        // prefer the longest matching key (most specific) to avoid generic keys shadowing specific endpoints
        const possibleMatches = keys.filter(k => {
          const nk = normalize(k);
          return normUrl.startsWith(nk);
        });
        let match: string | undefined = undefined;
        if (possibleMatches.length === 1) {
          match = possibleMatches[0];
        } else if (possibleMatches.length > 1) {
          // choose the most specific (longest normalized key)
          match = possibleMatches.reduce((best, cur) => {
            const bestLen = normalize(best).length;
            const curLen = normalize(cur).length;
            return curLen > bestLen ? cur : best;
          });
        }
        // fallback: if request is /v1/contrato/<digits> but no exact key found,
        // map it to the generic '/v1/contrato/' or '/api/v1/contrato/' mock entry
        if (!match) {
          if (/^\/v1\/contrato\/\d+/.test(normUrl)) {
            match = keys.find(k => normalize(k) === '/v1/contrato/');
          } else if (/^\/api\/v1\/contrato\/\d+/.test(normUrl)) {
            match = keys.find(k => normalize(k) === '/api/v1/contrato/');
          }
        }
        if (match) { try { console.debug('MockBackendInterceptor matched key=', match); } catch(e){} }
        if (match && endpoints) {
          const entry = endpoints[match];
          const body = JSON.parse(JSON.stringify(entry.body));
          const status = entry.status || 200;
          const res = new HttpResponse({ status, body });
          return of(res);
        }
      } catch (e) {
        console.error('MockBackendInterceptor error', e);
      }
      return next.handle(req);
    };

    if (MockBackendInterceptor.cache && MockBackendInterceptor.cache.endpoints) {
      return tryHandle(MockBackendInterceptor.cache.endpoints) as Observable<HttpEvent<any>>;
    }

    // load JSON once from assets (uses fetch to avoid HttpClient recursion)
    return from(fetch('assets/mock/mock-backend.json').then(r => r.json())).pipe(
      mergeMap((json: any) => {
        MockBackendInterceptor.cache = { endpoints: json && json.endpoints ? json.endpoints : {} };
        return tryHandle(MockBackendInterceptor.cache.endpoints) as Observable<HttpEvent<any>>;
      })
    );
  }
}
