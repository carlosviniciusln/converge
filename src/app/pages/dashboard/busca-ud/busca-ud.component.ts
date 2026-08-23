import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-busca-ud',
  templateUrl: './busca-ud.component.html',
  styleUrls: ['./busca-ud.component.scss'],
})
export class BuscaUdComponent implements OnInit {
  ud: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.ud = params['ud'] || '';
    });
  }

  voltar(): void {
    this.router.navigate(['/dashboard']);
  }
}
