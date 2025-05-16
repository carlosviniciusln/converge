import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse } from 'src/app/models/api-response';
import {
  Gcptb021CartaQuitacao,
  Gcptb021CartaQuitacaoResponse,
} from 'src/app/models/Gcptb021CartaQuitacaoResponse';
import { ApiService } from 'src/app/services/api.service';
import {
  ActionPolicies,
  ModuleEnum,
  TokenStorageService,
} from 'src/app/services/token-storage.service';
import { Endpoints } from 'src/app/shared/enums/endpoints';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-carta-quitacao-cadastro',
  templateUrl: './carta-quitacao-cadastro.component.html',
  styleUrls: ['./carta-quitacao-cadastro.component.scss'],
})
export class CartaQuitacaoCadastroComponent implements OnInit {
  @Input() public nuContrato;
  @Input() public nuCartaQuitacao;
  @Output() atualizarPagina: EventEmitter<boolean> = new EventEmitter();

  permissions: ActionPolicies;

  public form: FormGroup;
  public listaAnos: number[] = [];
  public listaStatus: any[] = [];

  public carta: Gcptb021CartaQuitacaoResponse;

  public titulo: string = 'Cadastro';
  public subTitulo: string = 'Cadastro de carta de quitação';

  submitted = false;

  checked1: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    public token: TokenStorageService
  ) {
    this.obterPermissoes();
  }

  obterPermissoes() {
    this.permissions = this.token.getActionPolicies(ModuleEnum.Contratos);
  }

  ngOnInit(): void {
    for (let i = new Date().getFullYear(); i >= 2016; i--) {
      this.listaAnos.push(i);
    }

    this.listaStatus.push({ nuStatus: 1, noStatus: 'Pendente' });
    this.listaStatus.push({ nuStatus: 2, noStatus: 'Recebido' });

    this.form = this.formBuilder.group({
      nuCartaQuitacao: [0],
      nuContrato: [this.nuContrato, [Validators.required]],
      nuAno: new FormControl('', [Validators.required]),
      dtRecebimento: new FormControl(null, [Validators.required]),
      nuCartaQuitacaoStatus: new FormControl('', [Validators.required]),
    });

    if (this.nuCartaQuitacao) {
      this.obterCartaQuitacao();
    }
  }

  get f() {
    return this.form.controls;
  }

  public async obterCartaQuitacao(): Promise<void> {
    try {
      const response = await this.apiService.get<
        ApiResponse<Gcptb021CartaQuitacaoResponse>
      >(`${Endpoints.URL_CARTA}/` + this.nuCartaQuitacao);

      this.carta = response.data;
      this.titulo = 'Edição';
      this.subTitulo = 'Edição da carta de quitação' + this.carta.nuAno;

      this.form.get('nuAno').disable();

      this.form.controls['nuCartaQuitacao'].setValue(
        response.data.nuCartaQuitacao
      );
      this.form.controls['nuContrato'].setValue(response.data.nuContrato);
      this.form.controls['nuAno'].setValue(response.data.nuAno);
      this.form.controls['dtRecebimento'].setValue(
        response.data.dtRecebimento.toString().substring(0, 10)
      );
      this.form.controls['nuCartaQuitacaoStatus'].setValue(
        response.data.nuCartaQuitacaoStatus
      );
    } catch (error) {
      console.error(error, 'erro na busca do empenho');
    }
  }

  public async onSubmit(): Promise<void> {
    if (this.nuCartaQuitacao) {
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
        `${Endpoints.URL_CARTA}`,
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
        `${Endpoints.URL_CARTA}/${this.nuCartaQuitacao}`,
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

  async Excluir(nuCartaQuitacao: number) {
    const alert = await Swal.fire({
      title: '',
      text: 'Deseja realmente excluir esta carta de quitação?',
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
          `${Endpoints.URL_CARTA}/` + nuCartaQuitacao
        );

        this.toastr.success(
          'Carta de quitação excluída com sucesso.',
          'Sucesso'
        );
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
