import { Component } from '@angular/core';
import { LoaderService } from './core/services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'front-gc-painel-gerencial';
  loading$ = this.loader.loading$;

  constructor(public loader: LoaderService) {}
}
