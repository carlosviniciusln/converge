import { StatusPlanejamentoModel, ExercicioModel } from '../../../../models/generics/limites-model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse } from 'src/app/models/generics/api-response';
import { listaErroUploadModel } from 'src/app/models/generics/limites-model';
import { LimitesRubricaResponse, LimitesRubricasUpdate } from 'src/app/models/generics/limites-rubrica-response';
import { ApiService } from 'src/app/shared/services/api.service';
import { PageAction } from 'src/app/shared/services/token-storage.service';
import { Endpoints } from 'src/app/models/enums/endpoints';
import Swal from 'sweetalert2';

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

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
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

  get f() {
    return this.form.controls;
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }


  public async onSubmit(): Promise<void> {

        try {


      const alert = await Swal.fire({
            title: '',
            text: 'Tem certeza que deseja realizar o upload? As informações anteriores serão apagadas.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não',
          }).then((result) => {
            if (result.value) {
              return true;
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              return false;
            }
          });

          if(!alert){
            return;
          }


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
          `v1/Limites/cadastrar-limite-planilha`,
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

  // public async Alterar(): Promise<void> {
  //   try {


  //     console.log('Alterar limite rubrica:', this.form.value);
  //     this.submitted = true;

  //     if (this.form.invalid) {
  //       const invalids = [];
  //       const controls = this.form.controls;
  //       for (const name in controls) {
  //         if (controls[name].invalid) invalids.push(name);
  //       }
  //       console.log(invalids);
  //       return;
  //     }

  //     const updateRequest: LimitesRubricasUpdate = {
  //       nuAnoOrcamentario: this.limiteRubrica.nuAnoOrcamentario,
  //       nuRubrica: this.limiteRubrica.nuRubrica,
  //       nuFilial: this.limiteRubrica.nuFilial,
  //       nuPlanejamentoTipo: this.limiteRubrica.nuPlanejamentoTipo,
  //       vrLimiteRubrica: this.form.controls['vrLimiteRubrica'].value,
  //     };

  //     await this.apiService.put<LimitesRubricasUpdate>(
  //       `${Endpoints.URL_ORCAMENTO}/limite-orcamentario`,
  //       updateRequest
  //     );

  //     this.toastr.success('Alteração efetuada com sucesso.', 'Sucesso');
  //     this.atualizarPagina.emit(true);
  //     this.activeModal.dismiss();
  //     setTimeout(() => {
  //       window.location.reload()
  //     }, 3000);
  //   } catch (error) {
  //     this.atualizarPagina.emit(false);
  //   }
  // }

  formulario() {
    this.form = this.formBuilder.group({
      nuPlanejamento: [this.nuPlanejamento, Validators.required],
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
