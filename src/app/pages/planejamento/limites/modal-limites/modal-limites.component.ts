import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { PageAction, PerfisEnum, TokenStorageService } from 'src/app/services/token-storage.service';
import { ApiResponse, ApiResponsePaginado } from 'src/app/models/api-response';
import { Filial } from 'src/app/models/filial';
import {
  LimitesRubricaResponse,
  LimitesRubricasUpdate,
  LimitesRubricasUpdateV2,
} from 'src/app/models/limites-rubrica-response';
import { PlanejamentoTipoResponse } from 'src/app/models/planejamento-response';
import {
  RubricaGrupo,
  Gcptb028GrupoRemanejamento,
  Rubrica,
} from 'src/app/models/rubrica';
import { Endpoints } from 'src/app/shared/enums/endpoints';
import {
  ExercicioModel,
  LimitesModel,
  listaErroUploadModel,
  StatusPlanejamentoModel,
} from 'src/app/models/limites-model';
import { Select2Data } from 'ng-select2-component';

@Component({
  selector: 'app-modal-limites',
  templateUrl: './modal-limites.component.html',
  styleUrls: ['./modal-limites.component.scss'],
})
export class ModalLimitesComponent implements OnInit {
  @Input() public isEditable: boolean;
  @Input() public registro: LimitesModel;
  @Input() public planejamentoEdit: number;
  @Input() public nuFilialEdit: number;




  @Output() atualizarPagina: EventEmitter<boolean> = new EventEmitter();
  @Input() public nuPlanejamento: number;
  @Input() public tipoModal: string;

  public formCadastro: FormGroup;
  public listaExercicios: ExercicioModel[] = [];
  public listaRubricas: RubricaGrupo[] = [];
  public listaGruposRemanejamento: Gcptb028GrupoRemanejamento[] = [];
  public listaFiliais: Filial[] = [];
  public listaTiposPlanejamento: PlanejamentoTipoResponse[] = [];
  public isDisabled: boolean = true;
  public titulo: string;
  public subTitulo: string;
  public actionButtonLabel: string;
  public currentPageAction: PageAction;
  submitted = false;
  public listaRubrica: Rubrica[] = [];
  public selectedRubrica: string = null;
  public selectRubrica: Select2Data;
  public selectFilial: Select2Data;
  public descricaoRubrica: string = '';
  public nuRubrica: number = 0;
  public exercicio: number;
  public rubrica: string;
  public unidadeDemandante: string;
  private readonly actionList: {
    type: PageAction;
    title: string;
    subTitle: string;
    actionButtonLabel: string;
  }[] = [
      {
        type: PageAction.Consultar,
        title: 'Consulta',
        subTitle: 'Consulta limites rubrica',
        actionButtonLabel: 'Fechar',
      },
      {
        type: PageAction.Alterar,
        title: 'Edição',
        subTitle: 'Edição de limites rubrica',
        actionButtonLabel: 'Alterar',
      },
      {
        type: PageAction.Cadastrar,
        title: 'Cadastro',
        subTitle: 'Cadastro de limites rubrica',
        actionButtonLabel: 'Cadastrar',
      },
    ];

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.definirPageAction();
    this.formulario();
    this.editarTextos();
  }

  definirPageAction() {
    if (this.isEditable)
      this.currentPageAction = PageAction.Alterar;
    else {
      this.currentPageAction = PageAction.Cadastrar;
      this.obterOrcamentos();
      this.obterRubricas();
      this.obterFiliais();
    }
  }

  editarTextos() {
    var element = this.actionList.find((x) => x.type == this.currentPageAction);
    this.titulo = element.title;
    this.subTitulo = element.subTitle;
    this.actionButtonLabel = element.actionButtonLabel;
  }

  formulario() {
    if (!this.registro) {
      this.formCadastro = this.formBuilder.group({
        nuPlanejamento: ['', Validators.required],
        nuRubrica: ['', Validators.required],
        nuUnidadeDemandante: ['', Validators.required],
        vrLimite: [0, Validators.required],
        nuLimitePlanejamento: [0, Validators.required]
      });
      this.isDisabled = false;
    } else {
      this.descricaoRubrica = this.registro?.dE_RUBRICA;
      this.exercicio = this.registro?.cO_EXERCICIO;
      this.rubrica = this.registro?.cO_RUBRICA;
      this.unidadeDemandante = this.registro?.sG_FILIAL;
      this.formCadastro = this.formBuilder.group({
        nuPlanejamento: [this.planejamentoEdit, Validators.required],
        nuRubrica: [this.registro.nU_RUBRICA, Validators.required],
        nuUnidadeDemandante: [this.nuFilialEdit, Validators.required],
        vrLimite: [this.registro.vR_LIMITE, Validators.required],
        nuLimitePlanejamento: [this.registro.nU_LIMITE_PLANEJAMENTO, Validators.required]
      });
    }
  }

  public async obterRubricas(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<Rubrica[]>>(
        `${Endpoints.URL_RUBRICA}/ativas`
      );

      this.selectRubrica = response?.data?.map(c => ({ label: c.coRubrica, value: c.nuRubrica + '-' + c.deRubrica }));
    } catch (error) {
    }
  }

  public async obterFiliais(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<Filial[]>>(
        `${Endpoints.URL_FILIAL}/ativos`
      );

      this.selectFilial = response?.data?.filter((x) => x.nuFilialPai != null).map(c => ({ label: c.sgFilial, value: c.nuFilial }));
    } catch (error) {
    }
  }

  public async obterOrcamentos(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<ExercicioModel[]>>(
        `${Endpoints.URL_CONTRATOS}/exercicios-ativos`
      );
      this.listaExercicios = response.data;
    } catch (error) { }
  }

  public fillRubrica(e: any) {
    this.descricaoRubrica = e.value.split('-')[1]
    this.nuRubrica = e.value.split('-')[0]
  }

  public async onSubmit(): Promise<void> {
    switch (this.currentPageAction) {
      case PageAction.Cadastrar:
        this.Cadastrar();
        break;
      case PageAction.Alterar:
        this.Alterar();
        break;
      case PageAction.Consultar:
      default:
        this.activeModal.dismiss('Cross click');
        break;
    }
  }

  get f() {
    return this.formCadastro.controls;
  }

  public async Cadastrar(): Promise<void> {
    try {
      this.submitted = true;
      this.formCadastro.markAllAsTouched();
      const nuRubricaNum = Number(this.nuRubrica);
      this.formCadastro.controls['nuRubrica'].setValue(nuRubricaNum);
      //remover o R$
      const valorAtual = this.formCadastro.controls['vrLimite'].value;
      const valorSemPrefixo = valorAtual.replace('R$ ', '');
      this.formCadastro.controls['vrLimite'].setValue(valorSemPrefixo);
      const formData = this.toFormData(this.formCadastro);

      if (this.formCadastro.invalid) {
        const invalids = [];
        const controls = this.formCadastro.controls;
        for (const name in controls) {
          if (controls[name].invalid) invalids.push(name);
        }
        this.toastr.error('Todos os campos são obrigatórios.', 'Campo Obrigatório');
        console.log(invalids);
        return;
      }

      let validaJaCadastrado = false;

      if (validaJaCadastrado) {
        this.toastr.error('Por favor, nesse caso o valor deverá ser alterado.', 'Registro já Cadastro');
      }
      else {
        if (nuRubricaNum > 0) {
          let response = await this.apiService.postFormData<any>(
            `${Endpoints.URL_PLANEJAMENTO_ORCAMENTO}/cadastrar-limite`,
            formData
          );
          if (response.data.succeeded) {
            this.toastr.success(response.data.data, 'Sucesso');
            this.atualizarPagina.emit(true);
            this.activeModal.dismiss();
            setTimeout(() => {
              window.location.reload()
            }, 3000);
          } else {
            this.toastr.error(response.data, 'Registro já Cadastro');
            this.atualizarPagina.emit(false);
          }
        }
      }
    } catch (error) {
      console.log(error)
      this.atualizarPagina.emit(false);
    }
  }

  toFormData(formGroup: FormGroup): FormData {
    const formData = new FormData();
    const values = formGroup.getRawValue();

    for (const key in values) {
      if (values.hasOwnProperty(key)) {
        const value = values[key];

        if (value instanceof File) {
          formData.append(key, value, value.name);
        } else if (Array.isArray(value) || typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      }
    }

    return formData;
  }

  public async Alterar(): Promise<void> {
    try {
      this.submitted = true;

      if (this.formCadastro.invalid) {
        const invalids = [];
        const controls = this.formCadastro.controls;
        for (const name in controls) {
          if (controls[name].invalid) invalids.push(name);
        }
        console.log(invalids);
        return;
      }

      //remover o R$
      const valorAtual = this.formCadastro.controls['vrLimite'].value;
      const valorSemPrefixo = valorAtual.replace('R$ ', '');
      this.formCadastro.controls['vrLimite'].setValue(valorSemPrefixo);

      if (Number.isNaN(valorSemPrefixo)) {
          this.toastr.error('valor informado em formato inválido. Informe novamente o novo limite', 'Erro');
          this.formCadastro.controls['vrLimite'].setValue('');
          return;
      }

      const updateRequest: LimitesRubricasUpdateV2 = {
        nuPlanejamento: this.formCadastro.controls['nuPlanejamento'].value,
        nuFilial: this.formCadastro.controls['nuUnidadeDemandante'].value,
        nuRubrica: this.formCadastro.controls['nuRubrica'].value,
        novoLimite: Number(this.formCadastro.controls['vrLimite'].value?.replace(',', '.')),
        nuLimitePlanejamento: this.formCadastro.controls['nuLimitePlanejamento'].value        
      };

      await this.apiService.put<LimitesRubricasUpdate>(
        `${Endpoints.URL_PLANEJAMENTO_ORCAMENTO}/Atualizar-limite`,
        updateRequest
      );

      this.toastr.success('Alteração efetuada com sucesso.', 'Sucesso');
      this.atualizarPagina.emit(true);
      this.activeModal.dismiss();
      setTimeout(() => {
        window.location.reload()
      }, 3000);
    } catch (error) {
      this.atualizarPagina.emit(false);
    }
  }

  ajustarCentavos(): void {
    const valor = this.formCadastro.get('vrLimite')?.value;

    if (!valor || typeof valor !== 'string') return;

    // Remove prefixo e separadores para verificar se é inteiro
    const valorLimpo = valor.replace('R$ ', '').replace(/\./g, '').replace(',', '.');
    const numero = parseFloat(valorLimpo);

    if (!isNaN(numero)) {
      const partes = valorLimpo.split('.');
      const temCentavos = partes.length > 1 && partes[1].length > 0;

      if (!temCentavos) {
        // Apenas atualiza o valor do FormControl com número formatado
        // sem interferir na máscara
        this.formCadastro.get('vrLimite')?.setValue(numero.toFixed(2).replace('.', ','), { emitEvent: true });
      }
    }
  }
}
