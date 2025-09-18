import { StatusPlanejamentoModel, ExercicioModel } from './../../../../models/limites-model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse } from 'src/app/models/api-response';
import { listaErroUploadModel } from 'src/app/models/limites-model';
import { LimitesRubricaResponse, LimitesRubricasUpdate } from 'src/app/models/limites-rubrica-response';
import { ApiService } from 'src/app/services/api.service';
import { PageAction } from 'src/app/services/token-storage.service';
import { Endpoints } from 'src/app/shared/enums/endpoints';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styleUrls: ['./modal-upload.component.scss']
})
export class ModalUploadComponent implements OnInit {
  @Input() public limiteRubrica: LimitesRubricaResponse;
  @Input() public isEditable: boolean;
  @Output() atualizarPagina: EventEmitter<boolean> = new EventEmitter();
  @Input() public nuPlanejamento: number;
  @Input() public tipoModal: string;

  public listaExercicios: ExercicioModel[] = [];
  public isDisabled: boolean = true;
  public isUploaded: boolean = false;
  public currentPageAction: PageAction;
  public listaErros: listaErroUploadModel[] = [];
  public form: FormGroup;
  submitted = false;
  public selectFile: File | null = null;
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
    this.obterOrcamentos();
  }

  public async obterOrcamentos(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<ExercicioModel[]>>(
        `${Endpoints.URL_CONTRATOS}/exercicios-ativos`
      );
      this.listaExercicios = response.data;
    } catch (error) {}
  }

  definirPageAction() {
    if (this.nuPlanejamento) {
      this.currentPageAction = PageAction.Alterar;
    } else {
      this.currentPageAction = PageAction.Cadastrar;
    }
  }

  get f() {
    return this.form.controls;
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }

  public async Cadastrar(): Promise<void> {
    try {
      this.submitted = true;
      this.form.markAllAsTouched();
      const formData = this.toFormData(this.form);
      if (this.form.invalid) {
        const invalids = [];
        const controls = this.form.controls;
        for (const name in controls) {
          if (controls[name].invalid) invalids.push(name);
        }
        this.toastr.error('Todos os campos são obrigatórios.', 'Campo Obrigatório');
        console.log(invalids);
        return;
      }

        let response = await this.apiService.postFormData<any>(
          `${Endpoints.URL_PLANEJAMENTO_ORCAMENTO}/cadastrar-limite-planilha`,
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
        this.listaErros = response.data.errors;
        console.log('listaErros:', this.listaErros)
        this.atualizarPagina.emit(false);
      }

    } catch (error) {
      this.listaErros = error;
        console.log(this.listaErros)
      this.atualizarPagina.emit(false);
    }
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
      setTimeout(() => {
        window.location.reload()
      }, 3000);
    } catch (error) {
      this.atualizarPagina.emit(false);
    }
  }

  formulario() {
    this.form = this.formBuilder.group({
      nuPlanejamento: [null, Validators.required],
      arquivoAnexado: new FormControl(null),
    });
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
    this.listaErros = [];
    this.toastr.warning('Anexo removido com sucesso.', 'Anexo')
  }

  baixarModelo() {
    const link = document.createElement('a');
    link.href = 'assets/upload/Arquivo_ Carga_Limites.xlsx';
    link.download = 'Arquivo_ Carga_Limites.xlsx';
    link.click();
  }
}
