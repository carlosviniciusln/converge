import { Injectable, NgModule } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DscSnackbarService {
  add(_config: any): void {}
}

@NgModule({
  providers: [DscSnackbarService],
})
export class DscSnackbarModule {}
