import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Select2Data } from 'ng-select2-component';
import { ApiService } from 'src/app/services/api.service';
import { ApiResponse } from 'src/app/models/api-response';
import { Endpoints } from 'src/app/shared/enums/endpoints';
import { Gcpvw030DetalhamentoDeContratosResponse } from 'src/app/models/Gcpvw030AtesteResponse';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-registrar-ateste',
  templateUrl: './registrar-ateste.component.html',
  styleUrls: ['./registrar-ateste.component.scss']
})
export class RegistrarAtesteComponent implements OnInit {


   @Input() public contrato: Gcpvw030DetalhamentoDeContratosResponse;

   
  constructor(
       public activeModal: NgbActiveModal,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
         private apiService: ApiService,
         private http: HttpClient
  ) { }

  public form: FormGroup;
  public loading = false;
  public total : number;
  selectFile : File | null = null;
  public listaGcptb018TipoServico : any[]; // criar interface


  ngOnInit(): void {
    this.formulario();
    this.obterTipoServicos();
    this.faturamentos.valueChanges.subscribe(values => {
      this.calcularTotal(values);
    });
  }

  async updateRelatorio(e): Promise<void> {
    console.log(e, "TESTE")
  }
  
calcularTotal(values: any[]) {
  this.total = values.reduce((acc, curr) => {
    const valor = parseFloat(curr.valor?.toString().replace('.', '').replace(',', '.')) || 0;
    return acc + valor;
  }, 0);
}


    formulario() {
      this.form = this.formBuilder.group({
          nuContrato: [this.contrato[0].nuContrato, [Validators.required]],
          coContrato: [this.contrato[0].coContrato, [Validators.required]],
          noEmpresa: [this.contrato[0].noEmpresa, [Validators.required]],
          noObjeto: [this.contrato[0].noObjeto, [Validators.required]],
          inicioVigencia: new FormControl(this.contrato[0].inicioVigencia?.substring(0, 10), [Validators.required]),
          fimVigencia: new FormControl(this.contrato[0].fimVigencia?.substring(0, 10), [Validators.required]),
          deCompetencia: new FormControl(this.contrato[0].dtProximaCompetencia),
          dtInicioPeriodoCompetencia: new FormControl(this.contrato[0].dtInicioPeriodoCompetencia?.substring(0, 10), [Validators.required]),
          dtFimPeriodoCompetencia: new FormControl(this.contrato[0].dtFimPeriodoCompetencia?.substring(0, 10)),
          deRetencao: new FormControl('', [Validators.required]),
          deObservacao: new FormControl(''),
          vrRetencao: new FormControl(''),
          dePenalidade: new FormControl('', [Validators.required]),
          vrMulta: new FormControl(''),
          arquivoAnexado: new FormControl(null),
          faturamentos: new FormArray([]),
      });
    }

    get faturamentos(): FormArray {
      return this.form.get('faturamentos') as FormArray;
    }


    
    criarFaturamento(faturamento: number): FormGroup{
      return this.formBuilder.group({
       nuServicoTipo: [''],
       valor: [''],
      })
     }
  

    
adicionarFaturamento() {
  this.faturamentos.push(this.criarFaturamento(this.faturamentos.length + 1));
}


onUpload(event: any): void {
  console.log(event)
  const file = event.files?.[0];
  if (file) {
    this.selectFile = file;
    this.form.get('arquivoAnexado')?.setValue(file);
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

        console.log("lista backend", response)

        this.listaGcptb018TipoServico = response.data.map(c => ({label: c.noServicoTipo, value: c.nuServicoTipo})) || [];
        this.loading = false;
      } catch (error) {
        console.error(error, 'obter GCPTB18');

      }
    }

    public onSubmit() {
      console.log("DADOS", this.form);
    
      const formData = this.toFormData(this.form);

      formData.forEach((value, key) => {
        console.log(key, value);
      });
      
 
        // formData.append('noEmpresa', this.form.get('noEmpresa')?.value)
      // Adiciona todos os campos do formulário ao FormData

      // Adiciona o arquivo, se houver
      // if (this.selectFile) {
      //   formData.append('arquivoAnexado', this.selectFile);
      // }
    
      // Debug: mostrar conteúdo do FormData
      // for (let pair of formData.entries()) {
      //   console.log(`${pair[0]}:`, pair[1]);
      // }
    
      console.log(formData)
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
    
    
    

  public async Cadastrar(formValue: any): Promise<void> {
    try {
      await this.http.post(`${environment.end_point}/${Endpoints.URL_ATESTE}`, formValue).subscribe({
        next: res => console.log('Sucesso', res),
        error: err => console.error('Erro', err)
      });
      

      // this.toastr.success('Cadastro efetuado com sucesso.', 'Sucesso');
      // this.activeModal.dismiss();
    } catch (error) {
    }
  }

}
