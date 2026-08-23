import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiResponse } from 'src/app/models/generics/api-response';
import { ApiService } from 'src/app/shared/services/api.service';
import { Endpoints } from 'src/app/models/enums/endpoints';

@Injectable({ providedIn: 'root' })
export class AppInfoService {

  private _ultimaAtualizacao$ = new BehaviorSubject<string>('');
  readonly ultimaAtualizacao$ = this._ultimaAtualizacao$.asObservable();

  private _loaded = false;

  constructor(private apiService: ApiService) {}

  /** Chama a API apenas uma vez; chamadas subsequentes reutilizam o valor em cache. */
  async carregar(): Promise<void> {
    if (this._loaded) return;
    try {
      const response = await this.apiService.get<ApiResponse<string>>(
        `${Endpoints.URL_DASHBOARD}/dt-ultima-atualizacao`
      );
      this._ultimaAtualizacao$.next(response.data ?? '');
      this._loaded = true;
    } catch {
      // silencia erro — o header fica sem a data se a API falhar
    }
  }

  get ultimaAtualizacao(): string {
    return this._ultimaAtualizacao$.getValue();
  }
}
