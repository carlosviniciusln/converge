import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse } from 'src/app/models/api-response';
import { Gcptb016Empenho } from 'src/app/models/contrato-response';
import { ApiService } from 'src/app/services/api.service';
import {
  ActionPolicies,
  ModuleEnum,
  TokenStorageService,
} from 'src/app/services/token-storage.service';
import { Endpoints } from 'src/app/shared/enums/endpoints';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-empenho-cadastro',
  templateUrl: './empenho-cadastro.component.html',
  styleUrls: ['./empenho-cadastro.component.scss'],
})
export class EmpenhoCadastroComponent implements OnInit {
  @Input() public nuContrato;
  @Input() public nuEmpenho;
  @Output() atualizarPagina: EventEmitter<boolean> = new EventEmitter();

  permissions: ActionPolicies;

  public form: UntypedFormGroup;

  public empenho: Gcptb016Empenho;

  public titulo: string = 'Cadastro';
  public subTitulo: string = 'Cadastro de empenho';

  submitted = false;

  checked1: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private formBuilder: UntypedFormBuilder,
    private apiService: ApiService,
    public token: TokenStorageService
  ) {
    this.obterPermissoes();
  }

  obterPermissoes() {
    this.permissions = this.token.getActionPolicies(ModuleEnum.Contratos);
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nuEmpenho: [0],
      nuContrato: [this.nuContrato, [Validators.required]],
      dePeriodo: new UntypedFormControl('', [Validators.required]),
      vrTotal: new UntypedFormControl(null, [Validators.required]),
    });

    if (this.nuEmpenho) {
      this.obterEmpenho();
    }
  }

  get f() {
    return this.form.controls;
  }

  public async obterEmpenho(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<Gcptb016Empenho>>(
        `${Endpoints.URL_EMPENHO}/` + this.nuEmpenho
      );

      this.empenho = response.data;
      this.titulo = 'Edição';
      this.subTitulo = 'Edição do empenho ' + this.empenho.dePeriodo;

      this.form.controls['nuEmpenho'].setValue(response.data.nuEmpenho);
      this.form.controls['nuContrato'].setValue(response.data.nuContrato);
      this.form.controls['dePeriodo'].setValue(response.data.dePeriodo);
      this.form.controls['vrTotal'].setValue(response.data.vrTotal);
    } catch (error) {
      console.error(error, 'erro na busca do empenho');
    }
  }

  public async onSubmit(): Promise<void> {
    if (this.nuEmpenho) {
      this.Alterar();
    } else {
      this.Cadastrar();
    }
  }

  public async Cadastrar(): Promise<void> {
    try {
      this.submitted = true;
      if (this.form.invalid) {
        return;
      }
     
      await this.apiService.post<any>(
        `${Endpoints.URL_EMPENHO}`,
        this.form.value
      );

      this.toastr.success('Cadastro efetuado com sucesso.', 'Sucesso');
      this.atualizarPagina.emit(true);
      this.activeModal.dismiss();
    } catch (error) {
      this.atualizarPagina.emit(false);
      this.activeModal.dismiss();
    }
  }

  public async Alterar(): Promise<void> {
    try {
      this.submitted = true;

      if (this.form.invalid) {
        return;
      }

      await this.apiService.put<any>(
        `${Endpoints.URL_EMPENHO}/${this.nuEmpenho}`,
        this.form.value
      );

      this.toastr.success('Alteração efetuada com sucesso.', 'Sucesso');
      this.atualizarPagina.emit(true);
      this.activeModal.dismiss();
    } catch (error) {
      this.atualizarPagina.emit(false);
      //this.activeModal.dismiss();
    }
  }

  async excluirEmpenho(nuEmpenho: number) {
    const alert = await Swal.fire({
      title: '',
      text: 'Deseja realmente excluir este empenho?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Não, cancelar!',
    }).then((result) => {
      if (result.value) {
        return true;
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        return false;
      }
    });

    if (alert) {
      try {
        const response = await this.apiService.delete<ApiResponse<boolean>>(
          `${Endpoints.URL_EMPENHO}/` + nuEmpenho
        );

        this.toastr.success('Empenho excluído com sucesso.', 'Sucesso');
        this.atualizarPagina.emit(true);
        this.activeModal.dismiss();
      } catch (error) {
        console.error(error, 'aquirsd');
      }
    }
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }
}
