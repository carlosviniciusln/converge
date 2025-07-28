import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Select2Data } from 'ng-select2-component';
import { ApiService } from 'src/app/services/api.service';
import { ApiResponse } from 'src/app/models/api-response';
import { Endpoints } from 'src/app/shared/enums/endpoints';

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

  constructor(
       public activeModal: NgbActiveModal,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
         private apiService: ApiService,
  ) { }

  public form: FormGroup;
  public loading = false;
  public listaGcptb018TipoServico : any[]; // criar interface
  public contrato: any; // CRIAR INTERFACE OU CLASSE PARA DEFINIR ATRIBUTOS QUE SERÃO PRENCHIDOS DIRETO NO FORM..


  ngOnInit(): void {
    this.formulario();
    this.obterTipoServicos();
  }

  async updateRelatorio(e): Promise<void> {
    console.log(e, "TESTE")
  }

    formulario() {
      this.form = this.formBuilder.group({
          
          noContrato: ['', [Validators.required]],
          noFornecedor: ['', [Validators.required]],
          noObjeto: ['', [Validators.required]],
          dtInicioVigencia: new FormControl('', [Validators.required]),
          dtFimVigencia: new FormControl('', [Validators.required]),
          noCompetencia: new FormControl(''),
          dtInicioCompetencia: new FormControl('', [Validators.required]),
          dtFimCompetencia: new FormControl(''),
          noRetencao: new FormControl('', [Validators.required]),
          vrRetencao: new FormControl(''),
          noPenalidades: new FormControl('', [Validators.required]),
          vrPenalidades: new FormControl(''),
          faturamentos: new FormArray([]),
      });
    }

    get faturamentos(): FormArray {
      return this.form.get('faturamentos') as FormArray;
    }


    
    criarFaturamento(faturamento: number): FormGroup{
      return this.formBuilder.group({
       nuItens:[0],
       itens: ['', [Validators.required, Validators.maxLength(30), Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/)]],
       valor: ['', [Validators.maxLength(30), Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/)]],
      })
     }
  

    
adicionarFaturamento() {
  this.faturamentos.push(this.criarFaturamento(this.faturamentos.length + 1));
}

onUpload(event: UploadEvent) {
  console.log("TESTE", event)
  this.toastr.success('Upload efetuado com sucesso!', 'Sucesso');
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

    
}
