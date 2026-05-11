import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PagamentoPendenteResponse } from 'src/app/models/generics/Gcptb001ContratoResponse';
import {
  Gcptb006Vigencia,
  Gcptb011Pagamento,
  Gcptb017VigenciaRubrica,
} from 'src/app/models/generics/contrato-response';
import { Orcamento } from 'src/app/models/generics/orcamento';
import { PagamentoTipo } from 'src/app/models/generics/pagamento-tipo';
import { ApiService } from 'src/app/shared/services/api.service';
import {
  ActionPolicies,
  ModuleEnum,
  TokenStorageService,
} from 'src/app/shared/services/token-storage.service';
import { Endpoints } from 'src/app/models/enums/endpoints';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editar-pagamento',
  templateUrl: './editar-pagamento.component.html',
  styleUrls: ['./editar-pagamento.component.scss'],
})
export class EditarPagamentoComponent implements OnInit {
  @Input() public contrato: PagamentoPendenteResponse;
  @Input() public isConciliacao: boolean;
  @Output() atualizarPagina: EventEmitter<boolean> = new EventEmitter();


  permissions: ActionPolicies;

  public form: FormGroup;
  public listaRubricas: Gcptb017VigenciaRubrica[] = [];
  public listaTipos: PagamentoTipo[] = [];
  public listaOrcamentos: Orcamento[] = [];
  public listaVigencias: Gcptb006Vigencia[] = [];

  public pagamento: Gcptb011Pagamento;

  public titulo: string = 'Edição';
  public subTitulo: string = 'Editar pagamento não identificado';

  submitted = false;

  checked1: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    public token: TokenStorageService,
    private router: Router
  ) {
    this.obterPermissoes();
  }

  obterPermissoes() {
    this.permissions = this.token.getActionPolicies(ModuleEnum.Contratos);
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nU_PAGAMENTO: [this.contrato.nU_PAGAMENTO, [Validators.required]],
      nU_ATESTE: ['', [Validators.required]],
      competencia: ['', [Validators.required]],
      dE_OBSERVACAO: ['', [Validators.required]],
    });

    this.titulo = 'Edição';
    this.subTitulo = 'Edição do pagamento - MIRO: ' + this.contrato.miro;
    this.validarConciliacao();
  }


  get f() {
    return this.form.controls;
  }


  public async onSubmit(): Promise<void> {
    if (this.contrato.nU_CONTRATO) {
      this.Alterar();
    }
  }

  public async Alterar(): Promise<void> {
    try {
      this.submitted = true;

      if (this.form.invalid) {
        return;
      }

      await this.apiService.put<any>(
        `${Endpoints.URL_ATUALIZA_CONTRATOS_PENDENTES}`,
        this.form.value
      );

      this.toastr.success('Alteração efetuada com sucesso.', 'Sucesso');
      this.atualizarPagina.emit(true);
      this.activeModal.dismiss();
    } catch (error) {
      this.atualizarPagina.emit(false);
      this.activeModal.dismiss();
    }
  }

  validarConciliacao() {
    if (!this.isConciliacao) {
      this.isConciliacao = false;
      this.form.controls['nU_PAGAMENTO'].disable();
      this.form.controls['nU_ATESTE'].disable();
    }else{
      this.isConciliacao = true;
      this.form.controls['nU_PAGAMENTO'].enable();
      this.form.controls['nU_ATESTE'].enable();
    }
  }

  irParaDetalhes() {
    // this.activeModal.dismiss();

    const url = `/#/contrato/detalhe/v/${this.contrato.nU_CONTRATO}`;

    window.open(url, '_blank');
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }
}
