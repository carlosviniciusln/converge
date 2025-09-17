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
  @Input() public limiteRubrica: LimitesRubricaResponse;
  @Input() public isEditable: boolean;
  @Output() atualizarPagina: EventEmitter<boolean> = new EventEmitter();
  @Input() public nuPlanejamento: number;
  @Input() public tipoModal: string;

  public form: FormGroup;
  public formCadastro: FormGroup;
  public statusPlanejamentoSelecionado: StatusPlanejamentoModel | undefined;
  public statusPlanejamentoSelecionadoUpload: StatusPlanejamentoModel | undefined;
  public listaExercicios: ExercicioModel[] = [];
  public listaRubricas: RubricaGrupo[] = [];
  public listaGruposRemanejamento: Gcptb028GrupoRemanejamento[] = [];
  public listaFiliais: Filial[] = [];
  public listaTiposPlanejamento: PlanejamentoTipoResponse[] = [];
  public isDisabled: boolean = true;
  public isUploaded: boolean = false;
  public titulo: string;
  public subTitulo: string;
  public actionButtonLabel: string;
  public currentPageAction: PageAction;
  public selectFile: File | null = null;
  public listaErros: listaErroUploadModel[] = [];
  public listaRubrica: Rubrica[] = [];
  public selectedRubrica: string = null;
  public selectRubrica: Select2Data;
  public selectFilial: Select2Data;
  public descricaoRubrica: string = '';
  public nuRubrica: number = 0;
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

  submitted = false;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.definirPageAction();
    this.formulario();
    this.obterOrcamentos();
    this.obterRubricas();
    this.obterFiliais();
  }

  definirPageAction() {
    if (this.nuPlanejamento) {
      this.currentPageAction = PageAction.Alterar;
    } else {
      this.currentPageAction = PageAction.Cadastrar;
    }
  }

  editarTextos() {
    var element = this.actionList.find((x) => x.type == this.currentPageAction);
    this.titulo = element.title;
    this.subTitulo = element.subTitle;
    this.actionButtonLabel = element.actionButtonLabel;
  }

  formulario() {
    this.form = this.formBuilder.group({
      nuAnoOrcamentario: [null, Validators.required],
      nuPlanejamento: [null, Validators.required],
      arquivoAnexado: new FormControl(null),
    });

    this.formCadastro = this.formBuilder.group({
      nuAnoOrcamentario: ['', Validators.required],
      nuPlanejamento: ['', Validators.required],
      nuRubrica: ['', Validators.required],
      nuUnidadeDemandante: ['', Validators.required],
      vrLimite: ['', Validators.required]
    });
  }

  get f() {
    return this.form.controls;
  }

  public async obterRubricas(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<Rubrica[]>>(
        `${Endpoints.URL_RUBRICA}/ativas`
      );

      this.selectRubrica = response?.data?.map(c => ({ label: c.coRubrica, value: c.nuRubrica + '-' +c.deRubrica }));
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
    } catch (error) {}
  }

  public async onSubmit(): Promise<void> {
    switch (this.currentPageAction) {
      case PageAction.Cadastrar:
        this.CadastrarUpload();
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

  public fillRubrica(e: any){
    this.descricaoRubrica = e.value.split('-')[1]
    this.nuRubrica = e.value.split('-')[0]
  }

  public async onSubmitCadastro(): Promise<void> {
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

  public async CadastrarUpload(): Promise<void> {
    try {
      this.submitted = true;
      this.form.markAllAsTouched();
      const formData = this.toFormData(this.form);
      this.form
        .get('nuPlanejamento')
        ?.setValue(this.statusPlanejamentoSelecionadoUpload?.nU_PLANEJAMENTO);
      if (this.form.invalid) {
        const invalids = [];
        const controls = this.form.controls;
        for (const name in controls) {
          if (controls[name].invalid) invalids.push(name);
        }
        this.toastr.error('Informe o campo Exercício.', 'Campo Obrigatório');
        console.log(invalids);
        return;
      }

      console.log('planejamento selecionado: ', this.statusPlanejamentoSelecionadoUpload)
      if(this.statusPlanejamentoSelecionadoUpload?.nU_PLANEJAMENTO > 0){
        let response = await this.apiService.postFormData<any>(
          `${Endpoints.URL_PLANEJAMENTO_ORCAMENTO}/cadastrar-limite-planilha`,
          formData
        );
      if (response.data.succeeded) {
        this.toastr.success(response.data.data, 'Sucesso');
        this.atualizarPagina.emit(true);
        this.activeModal.dismiss();
      } else {
        this.listaErros = response.data.errors;
        console.log('listaErros:', this.listaErros)
        this.atualizarPagina.emit(false);
      }
    }
    } catch (error) {
      this.listaErros = error;
        console.log(this.listaErros)
      this.atualizarPagina.emit(false);
    }
  }

  public async Cadastrar(): Promise<void> {
    try {
      this.submitted = true;
      this.formCadastro.markAllAsTouched();
      const nuRubricaNum = Number(this.nuRubrica);
      const planejamentoNum = Number(this.statusPlanejamentoSelecionado?.nU_PLANEJAMENTO);
      this.formCadastro.patchValue({ nuPlanejamento: planejamentoNum });
      this.formCadastro.controls['nuRubrica'].setValue(nuRubricaNum);
      const formData = this.toFormData(this.formCadastro);



      if (this.formCadastro.invalid) {
        const invalids = [];
        const controls = this.formCadastro.controls;
        for (const name in controls) {
          if (controls[name].invalid) invalids.push(name);
        }
        this.toastr.error('Informe o campo Exercício.', 'Campo Obrigatório');
        console.log(invalids);
        return;
      }

      if(nuRubricaNum > 0 && planejamentoNum > 0){
        let response = await this.apiService.postFormData<any>(
          `${Endpoints.URL_PLANEJAMENTO_ORCAMENTO}/cadastrar-limite`,
          formData
        );
      if (response.data.succeeded) {
        this.toastr.success(response.data.data, 'Sucesso');
        this.atualizarPagina.emit(true);
        this.activeModal.dismiss();

      } else {
        this.toastr.error('Ocorreu um erro ao cadastrar novo limite', 'Tente novamente');
        this.atualizarPagina.emit(false);
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

  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }

  async obterExercicio() {
    const nuAno = this.formCadastro.controls['nuAnoOrcamentario'].value;

    try {
      const response = await this.apiService.get<
        ApiResponse<StatusPlanejamentoModel>
      >(
        `${Endpoints.URL_CONTRATOS}/status-planejamento?nuPlanejamento=` + nuAno
      );

      this.statusPlanejamentoSelecionado = response.data;
    } catch (error) {}
  }

  async obterExercicioUpload() {
    const nuAno = this.form.controls['nuAnoOrcamentario'].value;
    try {
      const response = await this.apiService.get<
        ApiResponse<StatusPlanejamentoModel>
      >(
        `${Endpoints.URL_CONTRATOS}/status-planejamento?nuPlanejamento=` + nuAno
      );

      this.statusPlanejamentoSelecionadoUpload = response.data;
    } catch (error) {}
  }

  onUpload(event: any): void {
    const file = event.files?.[0];
    if (file) {
      this.selectFile = file;
      this.form.get('arquivoAnexado')?.setValue(file);
      this.toastr.success('Anexo salvo com sucesso.', 'Sucesso');
      this.isDisabled = false;
      this.isUploaded = true;
    }
  }

  removerArquivo(fileUpload: any) {
    this.selectFile = null;
    fileUpload.clear();
    this.form.get('arquivoAnexado')?.setValue(null);
    this.isDisabled = true;
    this.isUploaded = false;
    this.toastr.warning('Anexo removido com sucesso.', 'Anexo')
  }

  baixarModelo() {
    const link = document.createElement('a');
    link.href = 'assets/upload/planilha_padrao.xlsx';
    link.download = 'planilha_padrao.xlsx';
    link.click();
  }

  public async Alterar(): Promise<void> {
    try {
      this.submitted = true;

      if (this.form.invalid) {
        const invalids = [];
        const controls = this.form.controls;
        for (const name in controls) {
          if (controls[name].invalid) invalids.push(name);
        }
        console.log(invalids);
        return;
      }

      const updateRequest: LimitesRubricasUpdate = {
        nuAnoOrcamentario: this.limiteRubrica.nuAnoOrcamentario,
        nuRubrica: this.limiteRubrica.nuRubrica,
        nuFilial: this.limiteRubrica.nuFilial,
        nuPlanejamentoTipo: this.limiteRubrica.nuPlanejamentoTipo,
        vrLimiteRubrica: this.form.controls['vrLimiteRubrica'].value,
      };

      await this.apiService.put<LimitesRubricasUpdate>(
        `${Endpoints.URL_ORCAMENTO}/limite-orcamentario`,
        updateRequest
      );

      this.toastr.success('Alteração efetuada com sucesso.', 'Sucesso');
      this.atualizarPagina.emit(true);
      this.activeModal.dismiss();
    } catch (error) {
      this.atualizarPagina.emit(false);
    }
  }
}
