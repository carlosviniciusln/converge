import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/services/api.service';
import { ApiResponse } from 'src/app/models/api-response';
import { Endpoints } from 'src/app/shared/enums/endpoints';
import { Gcpvw030DetalhamentoDeContratosResponse } from 'src/app/models/Gcpvw030AtesteResponse';

@Component({
  selector: 'app-registrar-ateste',
  templateUrl: './registrar-ateste.component.html',
  styleUrls: ['./registrar-ateste.component.scss'],
})
export class RegistrarAtesteComponent implements OnInit {
  @Input() public contrato: Gcpvw030DetalhamentoDeContratosResponse;


  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private apiService: ApiService
  ) {}

  public form: FormGroup;
  public loading = false;
  public total: number;
  public selectFile: File | null = null;
  public submitted = false;
  public listaGcptb018TipoServico: any[]; // criar interface

  ngOnInit(): void {
    this.formulario();
    this.obterTipoServicos();
    this.ngOnChanges();
  }

  ngOnChanges() {
    this.faturamentos.valueChanges.subscribe((values) => {
      this.calcularTotal(values);
    });
  }


  public totalFormatado: string = '';

  calcularTotal(values: any[]): void {
    let soma = values.reduce((acc, curr) => {
      let valorStr = (curr.vrApurado ?? '').toString().trim();
      valorStr = valorStr.replace(/R\$\s?/g, '').trim();
      valorStr = valorStr.replace(/\./g, '').replace(',', '.');
      const vrApurado = parseFloat(valorStr);
      return acc + (isNaN(vrApurado) ? 0 : vrApurado);
    }, 0);

    // Garante que soma é número e formata como string
    this.totalFormatado = `R$ ${soma.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }


  formulario() {
    this.form = this.formBuilder.group({
      nuContrato: [this.contrato[0]?.nuContrato, [Validators.required]],
      coContrato: [this.contrato[0]?.coContrato, [Validators.required]],
      noEmpresa: [this.contrato[0]?.noEmpresa, [Validators.required]],
      noObjeto: [this.contrato[0]?.noObjeto, [Validators.required]],
      nuVigencia: [this.contrato[0]?.nuVigencia, [Validators.required]],
      inicioVigencia: new FormControl(
        this.contrato[0].inicioVigencia?.substring(0, 10),
        [Validators.required]
      ),
      fimVigencia: new FormControl(
        this.contrato[0].fimVigencia?.substring(0, 10),
        [Validators.required]
      ),
      deCompetencia: new FormControl(
        this.onDtInicioChange(this.contrato[0].deCompetencia)
      ),
      dtInicioPeriodoCompetencia: new FormControl(
        this.contrato[0].dtInicioPeriodoCompetencia?.substring(0, 10),
        [Validators.required]
      ),
      dtFimPeriodoCompetencia: new FormControl(
        this.contrato[0].dtFimPeriodoCompetencia?.substring(0, 10)
      ),
      deRetencao: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/),
      ]),
      deObservacao: new FormControl('', [Validators.required]),
  
      // Aqui você adiciona os valores iniciais:
      vrPagamento: new FormControl(''),
      vrRetencao: new FormControl(''),
      vrMulta: new FormControl(''),
  
      dePenalidade: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/),
      ]),
      arquivoAnexado: new FormControl(null),
      faturamentos: new FormArray([]),
    });
  }

  get faturamentos(): FormArray {
    return this.form.get('faturamentos') as FormArray;
  }

  onDtInicioChange(value: any): string {
    const date = new Date(value);
    let month = date.getMonth();
    let year = date.getFullYear();
    const formattedMonth = month < 10 ? `0${month}` : month.toString();

    return `${formattedMonth}/${year}`;
  }

  criarFaturamento(faturamento: number): FormGroup {
    return this.formBuilder.group({
      nuServicoTipo: ['', Validators.required],
      vrApurado: ['', Validators.required],
    });
  }

  adicionarFaturamento() {
    this.faturamentos.push(this.criarFaturamento(this.faturamentos.length + 1));
  }

  onUpload(event: any): void {
    const file = event.files?.[0];
    if (file) {
      this.selectFile = file;
      this.form.get('arquivoAnexado')?.setValue(file);
      this.toastr.success('Anexo salvo com sucesso.', 'Sucesso');
    }
  }

  removerFaturamento(index: number) {
    this.faturamentos.removeAt(index);
  }

  public async obterTipoServicos(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<any[]>>(
        `${Endpoints.URL_RUBRICA}/servicos`
      );

      console.log('lista backend', response);

      this.listaGcptb018TipoServico =
        response.data.map((c) => ({
          label: c.noServicoTipo,
          value: c.nuServicoTipo,
        })) || [];
      this.loading = false;
    } catch (error) {
      console.error(error, 'obter GCPTB18');
    }
  }

  public onSubmit() {
    this.submitted = true;
    this.form.markAllAsTouched();
    if (this.form.invalid) {

      this.faturamentos.controls.forEach((grupo: AbstractControl) => {
        const contatoGroup = grupo as FormGroup;
        Object.keys(contatoGroup.controls).forEach((campo) => {
          const control = contatoGroup.get(campo);

          if (control?.invalid) {
            if (control.errors?.required) {
              this.toastr.error(`O campo item(s) de faturamento é obrigatório`, 'Error');
            }
          }
        });
      });

      Object.keys(this.form.controls).forEach((campo) => {
        const control = this.form.get(campo);
        if (control?.invalid) {
          if (control.errors?.required) {
            this.toastr.error(`O campo ${campo} é obrigatório`, 'Error');
          }

          if (control.errors?.pattern) {
            this.toastr.error(`O campo ${campo} está fora do padrão`, 'Error');
          }

          // if (control.errors?.email) {
          //   this.toastr.error(`E-mail inválido`, 'Error');
          // }
          // if (control.errors?.mask) {
          //   this.toastr.error(`Telefone inválido`, 'Error');
          // }
        }
      });
      return;
    }

    this.form.get('vrPagamento')?.setValue(this.total);
    const vrApurado = this.form.get('vrApurado')?.value.replace('R$', '').trim();
    const vrMulta = this.form.get('vrMulta')?.value.replace('R$', '').trim();
    const vrRetencao = this.form.get('vrRetencao')?.value.replace('R$', '').trim();
    this.form.get('vrApurado')?.setValue(vrApurado);
    this.form.get('vrMulta')?.setValue(vrMulta);
    this.form.get('vrRetencao')?.setValue(vrRetencao);
    const formData = this.toFormData(this.form);

    // formData.forEach((value, key) => {
    //   console.log(key, value);
    // });

    this.Cadastrar(formData);
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

  public async Cadastrar(formValue: FormData): Promise<void> {
    try {
      await this.apiService.postFormData<any>(Endpoints.URL_ATESTE, formValue);
      this.toastr.success('Ateste salvo com sucesso', 'Sucesso');
      this.activeModal.dismiss();
    } catch (error) {
      console.error('Erro ao salvar ateste:', error);
      this.toastr.error('Erro ao salvar ateste', 'Erro');
    }
  }

}
