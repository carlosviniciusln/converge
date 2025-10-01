import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { ActionPolicies, TokenStorageService, ModuleEnum } from 'src/app/services/token-storage.service';
import { Endpoints } from 'src/app/shared/enums/endpoints';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mensalizacao-editar',
  templateUrl: './mensalizacao-editar.component.html',
  styleUrls: ['./mensalizacao-editar.component.scss']
})
export class MensalizacaoEditarComponent implements OnInit {
  @Input() public nuContrato;
  @Input() public nuCartaQuitacao;
  @Output() atualizarPagina: EventEmitter<boolean> = new EventEmitter();

  permissions: ActionPolicies;

  public form: UntypedFormGroup;

  public titulo: string = 'Editar';
  public subTitulo: string = 'Editar Valor Planejado';

  public dE_PERIODO;
  public valorExecutado;
  public valorPlanejado;
  public observacao;
  public rubricaAtiva;
  public nuVigenciaEditada;
  public nuVigenciaRubrica;
  public listaPagamentosMensalizadosRubrica;
  public totalPagamentosRubrica;
  public coRubricaSelecionada;
  public dadosCoRubrica;
  vrDisponivelRubrica: number = 0

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

  ngOnInit(): void {
    const vr1 = this.totalPagamentosRubrica.filter(x => x.rubrica == this.coRubricaSelecionada)[0]?.totalMensalizado;
    const vr2 = this.listaPagamentosMensalizadosRubrica.filter(x => x.rubrica == this.coRubricaSelecionada)[0]?.totalMensalizado;
    const mediaMensalizacao = this.dadosCoRubrica.valoresMensais.reduce((total, valor) => total + valor, 0) / this.dadosCoRubrica.valoresMensais.length;

    if (mediaMensalizacao.toFixed(2) == this.valorPlanejado) {
      this.vrDisponivelRubrica = (vr1 - vr2)
      if (vr2 === undefined) {
        this.vrDisponivelRubrica = vr1
      }
    }
    else {
      this.vrDisponivelRubrica = (vr1 - vr2) + this.valorPlanejado
      if (vr2 === undefined) {
        this.vrDisponivelRubrica = vr1 + this.valorPlanejado
      }
    }

    this.form = this.formBuilder.group({
      periodo: new UntypedFormControl(this.dE_PERIODO, [Validators.required]),
      vrExecutado: new UntypedFormControl(this.valorPlanejado, [Validators.required]),
      vr_PLANEJADO: new UntypedFormControl(null, [Validators.required]),
      observacao: new UntypedFormControl(this.observacao, [Validators.required]),
      nuContrato: new UntypedFormControl(this.nuContrato, [Validators.required]),
      nuVigenciaEditada: new UntypedFormControl(this.nuVigenciaEditada, [Validators.required]),
      nuVigenciaRubrica: new UntypedFormControl(this.nuVigenciaRubrica, [Validators.required]),
    });
  }

  get f() {
    return this.form.controls;
  }

  public async onSubmit(): Promise<void> {
    this.Alterar();
  }

  public async Alterar(): Promise<void> {
    try {
      this.submitted = true;

      if (this.form.invalid) {
        if (this.form.controls['vr_PLANEJADO'].value == null) {
          this.toastr.error('Informe o novo valor planejado', 'Erro');
        }
        return;
      }

      if (this.form.controls['vr_PLANEJADO'].value - 0.01 > this.vrDisponivelRubrica) {
        this.toastr.error('Valor excedido para ser mensalizado. Saldo disponível para essa rubrica: ' + this.vrDisponivelRubrica.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) + '. Por favor, informe outro valor.', 'Erro');
        return;
      }

      await this.apiService.put<any>(
        `${Endpoints.URL_MENSALIZACAO}/`,
        this.form.value
      );

      this.toastr.success('Alteração efetuada com sucesso.', 'Sucesso');
      this.atualizarPagina.emit(true);
      this.activeModal.dismiss();
      setTimeout(() => {
        location.reload();
      }, 2000);

    } catch (error) {
      this.atualizarPagina.emit(false);
      this.toastr.error('Erro ao efetuar alteração', 'error');
    }
  }

  obterPermissoes() {
    this.permissions = this.token.getActionPolicies(ModuleEnum.Contratos);
  }
}
