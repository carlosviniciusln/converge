import { Component, Input, OnInit} from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActionPolicies, ModuleEnum, TokenStorageService } from 'src/app/shared/services/token-storage.service';

@Component({
  selector: 'artigo-pagamento-tipos',
  templateUrl: './artigo-pagamento.component.html',
  styleUrls: ['./artigo-pagamento.component.scss'],
})
export class ArtigoPagamentoComponent implements OnInit {
  @Input() permissions: ActionPolicies;

  nuContrato!: string;
  loading: boolean = true;

  constructor(
    public spinner: NgxSpinnerService,
    public token: TokenStorageService,
  ) {
    this.obterPermissoes();
  }

  obterPermissoes() {
    this.permissions = this.token.getActionPolicies(ModuleEnum.Contratos);
  }

  ngOnInit(): void {
  }
}
