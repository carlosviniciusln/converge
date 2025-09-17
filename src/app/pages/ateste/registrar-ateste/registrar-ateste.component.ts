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
  faturamentos: any;
  

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
  obterTipoServicos() {
    throw new Error('Method not implemented.');
  }

  ngOnChanges() {
    this.faturamentos.valueChanges.subscribe((values) => {
      this.calcularTotal(values);
    });
  }

  calcularTotal(values: any[]) {
    this.total = values.reduce((acc, curr, index) => {

      let valorStr = curr.vrApurado?.toString().trim() || '';

      valorStr = valorStr.replace('R$', '').trim();

      this.faturamentos
        .at(index)
        .get('vrApurado')
        ?.setValue(valorStr, { emitEvent: false });
      const valorNumerico = valorStr.replace(/\./g, '');
      const vrApurado = parseFloat(valorNumerico) || 0;

      return acc + vrApurado;
    }, 0);
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
      vrPagamento: new FormControl(''),
      vrRetencao: new FormControl('', [Validators.required]),
      dePenalidade: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/),
      ]),
      vrMulta: new FormControl('', [Validators.required]),
      arquivoAnexado: new FormControl(null),
      faturamentos: new FormArray([]),
    });
  }
  onDtInicioChange(deCompetencia: any): any {
    throw new Error('Method not implemented.');
  }
}
