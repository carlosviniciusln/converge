import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { Retencao } from 'src/app/models/contrato-response';
import { Endpoints } from 'src/app/shared/enums/endpoints';
import { ActionPolicies, ModuleEnum, TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-retencao-cadastro',
  templateUrl: './retencao-cadastro.component.html',
  styleUrls: ['./retencao-cadastro.component.scss'],
})
export class RetencaoCadastroComponent implements OnInit {
  @Input() public retencao: Retencao;
  @Output() atualizarPagina: EventEmitter<boolean> = new EventEmitter();

  permissions: ActionPolicies;
  currentUser: any;

  public form: UntypedFormGroup;
  public titulo: string = 'Cadastro';
  public subTitulo: string = 'Cadastro de Retenção';

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: UntypedFormBuilder,
    private apiService: ApiService,
    private toastr: ToastrService,
    private token: TokenStorageService
  ) {
    this.obterPermissoes();
    this.currentUser = this.token.getUser();
  }

  obterPermissoes() {
    this.permissions = this.token.getActionPolicies(ModuleEnum.Contratos);
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      dE_PERIODO: new UntypedFormControl({ value: this.retencao?.dE_PERIODO, disabled: true }),
      nU_RETENCAO: new UntypedFormControl({ value: this.retencao?.nU_RETENCAO, disabled: true }),
      nU_LIBERACAO: new UntypedFormControl({ value: this.retencao?.nU_LIBERACAO, disabled: true }),
      nU_CONTRATO: new UntypedFormControl({ value: this.retencao?.nU_CONTRATO, disabled: true }),
      cO_CONTRATO: new UntypedFormControl({ value: this.retencao?.cO_CONTRATO, disabled: true }),
      nU_PEDIDO: new UntypedFormControl({ value: this.retencao?.nU_PEDIDO, disabled: true }),
      nU_ATESTE: new UntypedFormControl({ value: this.retencao?.nU_ATESTE, disabled: true }),
      vR_PENALIDADE: new UntypedFormControl({ value: this.retencao?.vR_PENALIDADE, disabled: true }),
      observacao: [this.retencao?.observacao, [Validators.required]],
      nU_TIPO_PENALIDADE: new UntypedFormControl({ value: this.retencao?.nU_TIPO_PENALIDADE, disabled: true }),
      dE_TIPO_PENALIDADE: new UntypedFormControl({ value: this.retencao?.dE_TIPO_PENALIDADE, disabled: true }),
    });

    if (this.retencao) {
      this.titulo = 'Edição';
      this.subTitulo = `Edição da Retenção - Período: ${this.retencao.dE_PERIODO}`;
    }
  }

  public async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      return;
    }

    try {
      if (this.retencao) {
        await this.apiService.put<any>(
          `${Endpoints.URL_RETENCAO}/atualizar`,
          {
            nU_LIBERACAO: this.form.get('nU_LIBERACAO').value,
            nU_RETENCAO: this.form.get('nU_RETENCAO').value,
            nU_TIPO_PENALIDADE: this.form.get('nU_TIPO_PENALIDADE').value,
            observacao: this.form.get('observacao').value
          }
        );
        this.toastr.success('Alteração efetuada com sucesso.', 'Sucesso');
      }

      this.atualizarPagina.emit(true);
      this.activeModal.dismiss();
    } catch (error) {
      this.toastr.error('Ocorreu um erro ao salvar a retenção.', 'Erro');
      this.atualizarPagina.emit(false);
      this.activeModal.dismiss();
    }
  }
}