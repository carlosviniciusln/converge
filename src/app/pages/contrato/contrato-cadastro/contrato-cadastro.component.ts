import { AfterViewChecked, AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ApiResponse } from 'src/app/models/generics/api-response';
import { Filial } from 'src/app/models/generics/filial';
import { ApiService } from 'src/app/shared/services/api.service';
import { Endpoints } from 'src/app/models/enums/endpoints';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TipoVigencia } from 'src/app/models/generics/tipo-vigencia';
import { Sistema } from 'src/app/models/generics/sistemas';
import { TipoContrato } from 'src/app/models/generics/tipo-contrato';
import { Usuario } from 'src/app/models/generics/usuario';
import {
  ContratoResponse,
  ContratoResponseV2,
  Gcptb006Vigencia,
  Gcptb017VigenciaRubrica,
} from 'src/app/models/generics/contrato-response';
import { ToastrService } from 'ngx-toastr';
import { Rubrica } from 'src/app/models/generics/rubrica';
import { ServicoTipo } from 'src/app/models/generics/servico-tipo';
import { ActionPolicies, ModuleEnum, PerfisEnum, TokenStorageService } from 'src/app/shared/services/token-storage.service';
import { ContatoItem, ContratoApiResponse, ContratoItem } from 'src/app/models/generics/Gcptb001ContratoResponse';
import { TipoAta } from 'src/app/models/generics/tipo-ata';
import Swal from 'sweetalert2';
import { ProtocoloVigencia } from 'src/app/models/generics/protocolo-vigencia';

@Component({
  selector: 'app-contrato-cadastro',
  templateUrl: './contrato-cadastro.component.html',
  styleUrls: ['./contrato-cadastro.component.scss'],
})
export class ContratoCadastroComponent implements OnInit {
  @Input() public nuContrato;
  @Input() public ativaPreposto;
  @Output() atualizarPagina: EventEmitter<boolean> = new EventEmitter();

  permissions: ActionPolicies;

  currentProfile: PerfisEnum;

  public form: FormGroup;
  public contatoForm: FormGroup;
  public listaContatosOriginal: ContatoItem[] = [];
  public sequencial = 1
  public selectTab: number = 0;
  public isPerfilPrivilegiado = false;
  public listaProtocoloVigencia: ProtocoloVigencia[] = [];
  public listaFiliais: Filial[] = [];
  public listaTipoVigencia: TipoVigencia[] = [];
  public listaRubrica: Rubrica[] = [];
  public listaServicoTipo: ServicoTipo[] = [];
  public listaTipoContrato: TipoContrato[] = [];
  public listaSistemas: Sistema[] = [];
  public listaGestores: Usuario[] = [];
  public listaCaixasAdministrativo: Usuario[] = [];
  public contrato: ContratoResponse;
  public contratoV2: ContratoResponseV2;
  public listaTipoAtas: TipoAta[] = [];

  public titulo: string = 'Cadastro';
  public fiscalAdm: string;
  public fiscalTec: string;
  public subTitulo: string = 'Cadastro de contrato';
  public subTituloContatos: string = 'Prepostos e Contatos';

  public SUPRESSAO_VALUE = 40;

  public dtFimOptions: string[] = [];
  public useDtFimOptions: boolean[] = [];
  public useDtInicioPeriodo: boolean[] = [];

  submitted = false;

  checked1: boolean = false;
  currentUser: any;

  valoresRubricasSetados = false;

  isDerivadoAta: boolean = false;
  isRotaAtas: boolean = false;
  listaAtasResponse: ContratoItem[] = [];
  processoAta: string;
  ataVinculada: string;

  filtroRegistros: any = {
    pageNumber: 1,
    pageSize: 10,
    Contrato: null,
    Fornecedor: null,
    Tipo: null,
    Gestor: null,
    Status: null,
    NoTipoArp: null,
    NuAta: null,
    CoProcesso: null
  };

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private toastr: ToastrService,
    private token: TokenStorageService
  ) {
    this.obterPermissoes();
    this.currentUser = this.token.getUser();
  }

  /* MÉTODOS HERDADOS */

  ngOnInit(): void {
    this.obterFiliais();
    this.obterTiposContrato();
    this.obterTiposVigencia();
    this.obterRubricas();
    this.obterSistemas();
    this.obterServicos();

    this.formulario();
    this.contatosForm();
    this.adicionarVigencia(false);

    this.vigencias.at(0).get('nuVigenciaTipo').setValue(23);

    this.useDtFimOptions[0] = false;

    this.subscribeToNuVigenciaTipoChanges(0);
    this.subscribeToDtInicioChanges(0);

    if (this.nuContrato) {
      this.obterContatos();
      this.obterProtocoloVigencia();
      this.obterVigencias();
      this.obterContratoV2();
      this.obterDatasContrato();
      this.validarRotaAtas();
    }

  }

  obterPermissoes() {

    this.currentProfile = this.token.getUserPerfil();
    this.permissions = this.token.getActionPolicies(ModuleEnum.Contratos);

    if(this.currentProfile === 'Administrador' || this.currentProfile === 'Torres GEGAT' || this.currentProfile === PerfisEnum.Pagadoria){
      this.isPerfilPrivilegiado = true;
    }
  }
  criarContato(contador: number): FormGroup{
    return this.formBuilder.group({
     nuPreposto:[0],
     nuContrato:[0],
     sequencial: [contador],
     nome: ['', [Validators.required, Validators.maxLength(30), Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/)]],
     email: ['', [Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})*$/)]],
     telefone: [''],
     cargo: ['', [Validators.maxLength(30), Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/)]],
    }, {validators: [this.validador()]})
   }


  validador() : ValidatorFn {
    return (group: AbstractControl) : ValidationErrors | null => {

      const emailCtrl = group.get('email');
      const telefoneCtrl = group.get('telefone');

      const email = emailCtrl?.value?.trim();
      const telefone = telefoneCtrl?.value?.trim();

      const valido = telefone || email;


      if(!valido){
        emailCtrl?.setErrors({required : true});
        telefoneCtrl?.setErrors({required : true});
        return {validador : true};
      } else {
        if(telefoneCtrl?.hasError('required')){
              telefoneCtrl.setErrors(null);
        }
        if(emailCtrl?.hasError('required')){
          emailCtrl.setErrors(null);
         }
      return null;
    }
    };
  }


  get emailCtrl(){
    return this.contatoForm.get('email');
  }

  get telefoneCtrl(){
    return this.contatoForm.get('telefone');
  }

  inicializarRubricas() {
    this.vigencias.controls.forEach((vigencia, i) => {

      let tipoSelecionado = this.vigencias.controls[i].get('nuVigenciaTipo')?.value;

      if (tipoSelecionado == this.SUPRESSAO_VALUE) {
        const rub = vigencia.get('rubricas') as FormArray;
        rub.controls.forEach((rubItem, r) => {
          let valorAtual = rubItem.get('vrTotal')?.value;
          if (valorAtual)
            this.atualizarValor(valorAtual, i, r);
        })
      }
    })
  }

  atualizarValor(valor: any, i: number, r: number) {

    let tipoSelecionado = this.vigencias.controls[i].get('nuVigenciaTipo')?.value;
    let valorNumerico = parseFloat(valor) || 0;

    if (tipoSelecionado == this.SUPRESSAO_VALUE) {
      valorNumerico = -Math.abs(valorNumerico);
    } else {
      valorNumerico = Math.abs(valorNumerico);
    }

    let value = this.vigencias.controls[i].get('rubricas')
      ?.get(r.toString())
      ?.get('vrTotal').value;

    if (valorNumerico == value) {
      return;
    }

    this.vigencias.controls[i].get('rubricas')
      ?.get(r.toString())
      ?.get('vrTotal')
      ?.setValue(valorNumerico);
  }

  validarSupressaoOnChange(index: any) {

    const vigencia = this.vigencias.at(index) as FormGroup;
    const rub = vigencia.get('rubricas') as FormArray;
    rub.controls.forEach((rubItem, r) => {
      let valorAtual = rubItem.get('vrTotal')?.value;
      if (valorAtual)
        this.atualizarValor(valorAtual, index, r);
    })
  }

  public async obterDatasContrato(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<string[]>>(
        `${Endpoints.URL_CONTRATOS}/resumo-datas-contrato?nuContrato=${this.nuContrato}`
      );
      if (response.succeeded) {
        this.dtFimOptions = response.data;
      } else {
        this.dtFimOptions = [];
      }
    } catch (error) {
      console.error('Error fetching dates:', error);
      this.dtFimOptions = [];
    }
  }


  contatosForm(){
    this.contatoForm = this.formBuilder.group({
        contatos: this.formBuilder.array([])
    });
  }

  get contatos(): FormArray {
    return this.contatoForm.get('contatos') as FormArray;
  }

  async adicionarContato(){
    if(this.contatos.length < 5){
      this.contatos.push(this.criarContato(this.contatos.length + 1));
    }else{
            const alert = await Swal.fire({
              title: '',
              text:  `São permitidos no máximo 5 prepostos por contrato.`,
              icon: 'warning',
              showCancelButton: false,
              confirmButtonText: 'Ok!',
            }).then((result) => {
              console.log(result, "Result")
            });
          }
  }

   async removerContato(contato: any, index : number) {

    if(contato.value?.nuPreposto != 0){
      const alert = await Swal.fire({
        title: '',
        text: `Deseja excluir preposto ?`,
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
          this.removeContato(contato.value?.nuPreposto)
          this.contatos.removeAt(index);
          this.contatos.controls.forEach((group, index) => {
            group.get('sequencial')?.setValue(index + 1);
          });

      }

    }
    else{
        this.contatos.removeAt(index);
        this.contatos.controls.forEach((group, index) => {
          group.get('sequencial')?.setValue(index + 1);
        });
      }

  }

  formulario() {
    this.form = this.formBuilder.group({
      nuContrato: [0],
      coContrato: ['', [Validators.required]],
      noEmpresa: ['', [Validators.required]],
      noObjeto: ['', [Validators.required]],
      nuContratoTipo: new FormControl('', [Validators.required]),
      nuFilial: new FormControl('', [Validators.required]),
      nuDiaFechamentoFatura: new FormControl(''),
      icDiaUtilFechamentoFatura: new FormControl(0),
      nuDiaNotaFiscal: new FormControl(''),
      icDiaUtilNotaFiscal: new FormControl(0),
      nuDiaPagamentoFatura: new FormControl(''),
      icDiaUtilPagamentoFatura: new FormControl(0),
      nuAnalistaCaixa: new FormControl('', [Validators.required]),
      nuFiscalAdm: new FormControl('', [Validators.required]),
      icArtigo81: new FormControl(0),
      icAtivo: new FormControl(1),
      vigencias: new FormArray([]),
      nuAta: new FormControl(''),
    });
  }

  get f() {
    return this.form.controls;
  }

  get vigencias(): FormArray {
    return this.form.get('vigencias') as FormArray;
  }

  onNuVigenciaTipoChange(value: any, index: number) {
    const PRORROGACAO_VALUE = 26;
    const PRIMEIRA_VIGENCIA_VALUE = 23;

    if (value === PRORROGACAO_VALUE || value === PRIMEIRA_VIGENCIA_VALUE) {
      this.useDtFimOptions[index] = false;
    } else {
      if (this.dtFimOptions.length === 0) {
        this.obterDatasContrato();
      }
      this.useDtFimOptions[index] = true;
    }
    this.validarSupressaoOnChange(index);
  }

  subscribeToNuVigenciaTipoChanges(index: number) {
    const vigenciaGroup = this.vigencias.at(index) as FormGroup;
    vigenciaGroup.get('nuVigenciaTipo').valueChanges.subscribe((value) => {
      this.onNuVigenciaTipoChange(value, index);
    });
  }

  adicionarVigencia(desabilitar: boolean) {
    const index = this.vigencias.length;
    this.vigencias.push(this.novaVigencia(desabilitar, index));
    this.adicionarRubrica(index);

    this.useDtFimOptions[index] = false;

    this.subscribeToNuVigenciaTipoChanges(index);
    this.subscribeToDtInicioChanges(index);
  }

  subscribeToDtInicioChanges(index: number) {
    const vigenciaGroup = this.vigencias.at(index) as FormGroup;
    vigenciaGroup.get('dtInicio').valueChanges.subscribe((value) => {
      vigenciaGroup.get('dtInicioCompetencia').setValue(this.onDtInicioChange(value));
    });
  }

  onDtInicioChange(value: any): string {
    const date = new Date(value);
    const day = date.getDate();
    let month = date.getMonth() + 1; // Os meses em JavaScript são baseados em zero
    let year = date.getFullYear();

    if (day > 14) {
      month += 1;
      if (month > 12) {
        month = 1;
        year += 1;
      }
    }

    const formattedMonth = month < 10 ? `0${month}` : month.toString();

    return `${formattedMonth}/${year}`;
  }

  adicionarRubrica(i: number) {
    (this.vigencias.at(i).get('rubricas') as FormArray).push(
      this.novaRubrica(null)
    );
  }

  excluirVigencia(i: number) {
    this.vigencias.removeAt(i);
  }

  excluirRubrica(vigenciaIndex: number, i: number) {
    (this.vigencias.at(vigenciaIndex).get('rubricas') as FormArray).removeAt(i);
  }

  novaVigencia(desabilitar: boolean, index: number): FormGroup {
    return new FormGroup(
      {
        nuVigencia: new FormControl(0),
        nuVigenciaTipo: new FormControl({ value: '', disabled: desabilitar }, [
          Validators.required,
        ]),
        dtInicio: new FormControl('', [Validators.required]),
        dtTermino: new FormControl('', [Validators.required]),
        nuDiaInicio: new FormControl(null, [Validators.required]),
        nuDiaTermino: new FormControl(null, [Validators.required]),
        dtInicioCompetencia: new FormControl(null, [Validators.required]),
        coProtocoloVigencia: new FormControl(null),
        rubricas: new FormArray([]),
      },
      { validators: [this.validarDatas, this.validarVigencia(index)] }
    );
  }

  validarDatas(group: FormGroup): any | null {
    const dtInicio = group.get('dtInicio').value;
    const dtTermino = group.get('dtTermino').value;

    if (dtInicio && dtTermino) {
      const dtInicioDate = new Date(dtInicio);
      const dtTerminoDate = new Date(dtTermino);

      if (dtInicioDate > dtTerminoDate) {
        group.get('dtInicio').setErrors({ datasInvalidas: true });
        group.get('dtTermino').setErrors({ datasInvalidas: true });
        return { datasInvalidas: true };
      } else {
        group.get('dtInicio').setErrors(null);
        group.get('dtTermino').setErrors(null);
      }
    }
    return null;
  }

  validarVigencia(index: number): any {
    return (group: FormGroup): any | null => {
      const nuVigenciaTipo = group.get('nuVigenciaTipo').value;
      const dtInicio = group.get('dtInicio').value;

      const PRORROGACAO_VALUE = 26;
      const PRIMEIRA_VIGENCIA_VALUE = 23;

      if (nuVigenciaTipo === PRORROGACAO_VALUE || nuVigenciaTipo === PRIMEIRA_VIGENCIA_VALUE) {
        if (index > 0) {
          let previousIndex = index - 1;
          let previousVigencia = null;

          while (previousIndex >= 0) {
            const prevVigencia = this.vigencias.at(previousIndex);
            const prevNuVigenciaTipo = prevVigencia.get('nuVigenciaTipo').value;

            if (
              prevNuVigenciaTipo === PRORROGACAO_VALUE ||
              prevNuVigenciaTipo === PRIMEIRA_VIGENCIA_VALUE
            ) {
              previousVigencia = prevVigencia;
              break;
            }
            previousIndex--;
          }

          if (previousVigencia) {
            const previousDtTermino = previousVigencia.get('dtTermino').value;

            const dtInicioDate = new Date(dtInicio);
            const previousDtTerminoDate = new Date(previousDtTermino);

            if (dtInicioDate <= previousDtTerminoDate) {
              group.get('dtInicio').setErrors({ dataInvalidaProrrogacao: true });
              return { dataInvalidaProrrogacao: true };
            } else {
              group.get('dtInicio').setErrors(null);
            }
          } else {
            group.get('dtInicio').setErrors(null);
          }
        } else {
          group.get('dtInicio').setErrors(null);
        }
      } else {
        group.get('dtInicio').setErrors(null);
      }
      return null;
    };
  }

  novaRubrica(rubrica: Gcptb017VigenciaRubrica | null): FormGroup {
    return new FormGroup({
      nuVigenciaRubrica: new FormControl(
        rubrica ? rubrica.nuVigenciaRubrica : 0
      ),
      nuRubrica: new FormControl(rubrica ? rubrica.nuRubrica : '', [
        Validators.required,
      ]),
      nuServicoTipo: new FormControl(rubrica ? rubrica.nuServicoTipo : 1, [
        Validators.required,
      ]),
      vrTotal: new FormControl(rubrica?.vrTotal, [Validators.required]),
      vrMediaEstimada: new FormControl(rubrica?.vrMediaEstimada ?? 0),
    });
  }

  public async obterVigencias(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<ContratoResponse>>(
        `${Endpoints.URL_CONTRATOS}/` + this.nuContrato
      );
      this.contrato = response.data;
      this.vigencias.clear();

      response.data.gcptb006Vigencias.map((x, index) => {
        const vigencia = new FormGroup(
          {
            nuVigencia: new FormControl(x.nuVigencia),
            nuVigenciaTipo: new FormControl(x.nuVigenciaTipo, [
              Validators.required,
            ]),
            dtInicio: new FormControl(x.dtInicio.toString().substring(0, 10), [
              Validators.required,
            ]),
            dtTermino: new FormControl(x.dtTermino.toString().substring(0, 10), [
              Validators.required,
            ]),
            nuDiaInicio: new FormControl(x.nuDiaInicio, [Validators.required]),
            nuDiaTermino: new FormControl(x.nuDiaTermino, [Validators.required]),
            dtInicioCompetencia: new FormControl(x.dtInicioCompetencia, [Validators.required]),
            coProtocoloVigencia: new FormControl(x.coProtocoloVigencia),
            rubricas: new FormArray([]),
          },
          { validators: [this.validarDatas, this.validarVigencia(index)] }
        );

        if (x.nuVigenciaTipo === 23) {
          vigencia.get('nuVigenciaTipo').disable();
        }

        if(x.nuVigenciaTipo)

        x.gcptb017VigenciaRubricas.map((m) => {
          (vigencia.get('rubricas') as FormArray).push(this.novaRubrica(m));
        });

        if(index === 0){
          if(x.gcptb017VigenciaRubricas.length == 0){
            (vigencia.get('rubricas') as FormArray).push(this.novaRubrica(null));
          }
          vigencia.get('coProtocoloVigencia').disable();
          this.listaProtocoloVigencia = [...this.listaProtocoloVigencia.filter(p => p.cO_PROTOCOLO_VIGENCIA !=  vigencia.get('coProtocoloVigencia').value)]
        }

        this.vigencias.push(vigencia);

        vigencia.updateValueAndValidity({ onlySelf: false, emitEvent: true });
        vigencia.markAllAsTouched();

        this.useDtFimOptions[index] = false;
        this.subscribeToNuVigenciaTipoChanges(index);
      });

      this.inicializarRubricas();
      this.form.updateValueAndValidity({ onlySelf: false, emitEvent: true });
      this.form.markAllAsTouched();



    } catch (error) {
      console.error(error, 'erro ao obterVigencias');
    }
  }

  public async obterContatos(): Promise<void> {
      try{

        const response = await this.apiService.get<ApiResponse<ContatoItem[]>>(
          `${Endpoints.URL_PREPOSTO}/obter-todos/` + this.nuContrato
        );
        this.listaContatosOriginal = JSON.parse(JSON.stringify(response.data));
        this.contatos.clear();
        this.sequencial = 1;
        response.data.forEach(p => {
          this.contatos.push(this.formBuilder.group({
            sequencial: [this.sequencial],
            nuPreposto:[p.nU_PREPOSTO],
            nuContrato:[p.nU_CONTRATO],
            nome:  [p.nO_PREPOSTO || '', [Validators.required, Validators.maxLength(30), Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/)]],
            email:  [p.dE_EMAIL, [Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})*$/)]],
            telefone:  [p.nU_TELEFONE || ''],
            cargo:  [p.dE_CARGO || '', [Validators.maxLength(30), Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/)]]
          },{validators: [this.validador()]}))

          this.sequencial++;
      })
      }
      catch (error){

      }
  }

  public async obterContratoV2(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<ContratoResponseV2>>(
        `${Endpoints.URL_CONTRATOS}/detalhe-contrato?nuContrato=` + this.nuContrato
      );

      this.contratoV2 = response.data;
      this.titulo = 'Edição';
      this.subTitulo = 'Edição do contrato ' + this.contratoV2.cO_CONTRATO;
      this.form.controls['nuContrato'].setValue(response.data.nU_CONTRATO);
      this.form.controls['coContrato'].setValue(response.data.cO_CONTRATO);
      this.form.controls['noEmpresa'].setValue(response.data.nO_FORNECEDOR);
      this.form.controls['nuFilial'].setValue(response.data.nU_FILIAL);
      this.form.controls['nuContratoTipo'].setValue(response.data.nU_CONTRATO_TIPO);

      this.form.controls['nuAnalistaCaixa'].setValue(response.data.nU_FISCAL_ADM);

      this.form.controls['nuFiscalAdm'].setValue(response.data.nU_FISCAL_TEC);

      this.form.controls['noObjeto'].setValue(response.data.nO_OBJETO);
      this.form.controls['icArtigo81'].setValue(response.data.iC_ARTIGO_81);
      this.form.controls['icAtivo'].setValue(response.data.iC_ATIVO);

      if (response.data.diA_FECHAMENTO_FATURA) {
        this.form.controls['nuDiaFechamentoFatura'].setValue(
          response.data.diA_FECHAMENTO_FATURA
        );
        this.form.controls['icDiaUtilFechamentoFatura'].setValue(
          response.data.iC_DIA_PAGAMENTO_FATURA
        );
      }

      if (response.data.diA_PAGAMENTO_FATURA) {
        this.form.controls['icDiaUtilPagamentoFatura'].setValue(response.data.iC_DIA_UTIL_FATURA);
        this.form.controls['nuDiaPagamentoFatura'].setValue(
          response.data.diA_PAGAMENTO_FATURA
        );
      }

      this.obterCaixasV2();
      this.obterGestores();
    } catch (error) {
      console.error(error, 'aquirsd');
    }
  }

  public async obterFiliais(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<Filial[]>>(
        `${Endpoints.URL_FILIAL}/ativos`
      );

      this.listaFiliais = response.data.filter((x) => x.nuFilialPai != null);
    } catch (error) {
    }
  }

  public async obterTiposContrato(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<TipoContrato[]>>(
        `${Endpoints.URL_CONTRATOS}/tipos-contrato`
      );

      this.listaTipoContrato = response.data;
    } catch (error) {
      console.error('erro ao obterTiposContrato', error)
    }
  }

  public async obterTiposVigencia(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<TipoVigencia[]>>(
        `${Endpoints.URL_CONTRATOS}/tipos-vigencia`
      );

      this.listaTipoVigencia = response.data;
      //this.loading = false;
    } catch (error) {
      //this.loading = true;
    }
  }

  public async obterRubricas(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<Rubrica[]>>(
        `${Endpoints.URL_RUBRICA}/ativas`
      );

      this.listaRubrica = response.data;
      //this.loading = false;
    } catch (error) {
      //this.loading = true;
    }
  }

  public async obterProtocoloVigencia(): Promise<void> {
    try{

      const response = await this.apiService.get<ApiResponse<ProtocoloVigencia[]>>(
        `${Endpoints.URL_CONTRATOS}/protocolo-vigencia/` + this.nuContrato
      );

      this.listaProtocoloVigencia = response.data;
    }catch (erro) {
        console.error(erro, "Erro em obter protocolo SICLG");
    }
  }

  public async obterServicos(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<ServicoTipo[]>>(
        `${Endpoints.URL_RUBRICA}/servicos`
      );

      this.listaServicoTipo = response.data;
      //this.loading = false;
    } catch (error) {
      //this.loading = true;
    }
  }

  public async obterSistemas(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<Sistema[]>>(
        `${Endpoints.URL_CONTRATOS}/sistemas`
      );

      this.listaSistemas = response.data;
      //this.loading = false;
    } catch (error) {
      //this.loading = true;
    }
  }

  public async obterGestores(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<Usuario[]>>(
        `${Endpoints.URL_USUARIO}/caixas-gestor?cgcUnidade=` + this.contratoV2.filial
      );

      this.listaGestores = response.data;
      //this.loading = false;
    } catch (error) {
      //this.loading = true;
    }
  }

  onTabChange(event) {
    this.selectTab = event.index;
  }
  // public async obterCaixas(): Promise<void> {
  //   try {
  //     const response = await this.apiService.get<ApiResponse<Usuario[]>>(
  //       `${Endpoints.URL_USUARIO}/caixas`
  //     );

  //     this.listaCaixasAdministrativo = response.data;
  //     //this.loading = false;
  //   } catch (error) {
  //     //this.loading = true;
  //   }
  // }

  public async obterCaixasV2(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<Usuario[]>>(
        `${Endpoints.URL_USUARIO}/caixas-v2`
      );

      this.listaCaixasAdministrativo = response.data;
      //this.loading = false;
    } catch (error) {
      //this.loading = true;
    }
  }

  public async obterGestoresChange(event: any): Promise<void> {

    if (event.target.value) {
      let valorSelecionado;

      this.listaFiliais.forEach(item => {
        if(item.nuFilial.toString() == event.target.value.toString()){
          valorSelecionado = item.coFilial;
        }
      });

      if (!valorSelecionado) {
        return;
      }

      try {
        const response = await this.apiService.get<ApiResponse<Usuario[]>>(
          `${Endpoints.URL_USUARIO}/caixas-gestor?cgcUnidade=` + valorSelecionado
        );

        this.listaGestores = response.data;
        this.form.controls['nuFiscalAdm'].setValue('');
      } catch (error) {
      }
    }
  }

  private formatDate(dateString: string): string {
    if (dateString) {
      if (dateString.includes('T')) {
        return dateString.split('T')[0];
      }
      if (dateString.includes(' ')) {
        return dateString.split(' ')[0];
      }
      return dateString;
    }
    return dateString;
  }


  public async registrarContratos(): Promise<void> {
      this.contatoForm.markAllAsTouched();
      this.contatoForm.updateValueAndValidity();
      if(this.contatoForm.invalid){
          this.contatos.controls.forEach((grupo: AbstractControl) => {
            const contatoGroup = grupo as FormGroup;
            // if(contatoGroup.errors?.validador){
            //   this.toastr.error(`Preencha pelo menos o campo "E-mail" ou "Telefone"`, "Error");
            // }
            Object.keys(contatoGroup.controls).forEach(campo => {
              const control = contatoGroup.get(campo);

            if(control?.invalid){
              if(control.errors?.required){
                this.toastr.error(`O campo ${this.formatarNomes(campo)} é obrigatório`, "Error");
              }

              if(control.errors?.pattern){
                      this.toastr.error(`O campo ${this.formatarNomes(campo)} está fora do padrão`, "Error");
              }

              if(control.errors?.email){
                this.toastr.error(`E-mail inválido`, "Error");
              }
              if(control.errors?.mask){
                this.toastr.error(`Telefone inválido`, "Error");
              }
            }
          });
        });
        return
      }

      const contatosAtuais = this.contatoForm.get('contatos')?.value || [];

      const novos = contatosAtuais.filter(c => !c.nuPreposto);

      const alterados = contatosAtuais.filter(c => {
        if(!c.nuPreposto) return false;
        const original = this.listaContatosOriginal.find(o => o.nU_PREPOSTO === c.nuPreposto);
        if(!original) return false;
        return (
          original.nO_PREPOSTO !== c.nome || original.nU_TELEFONE !== c.telefone || original.dE_EMAIL !== c.email || original.dE_CARGO !== c.cargo
        )
      })


      if(novos.length){
        novos.forEach(cadastro => {
          cadastro.nuContrato = this.nuContrato;
          this.cadastrarContato(cadastro);
          this.atualizarPagina.emit(true);
        })

      }

      if(alterados.length){
          alterados.forEach(alterados => {
          this.alterarContato(alterados);
          this.atualizarPagina.emit(true);

        })
      }
      this.toastr.success('Prepostos e Contatos Salvos com Sucesso.', 'Sucesso');
      const alert = await Swal.fire({
        title: '',
        text:  `Prepostos e Contatos Salvos com Sucesso.`,
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok!',
      }).then((result) => {
        console.log(result, "Result")
      });
  }

  formatarNomes(campo : string) : string {
    const nomes: any = {
      email: 'E-mail',
      telefone: 'Telefone',
      nome: 'Nome'
    };

    return nomes[campo] || campo;
  }

  public async onSubmit(): Promise<void> {
    this.submitted = true;

    this.form.markAllAsTouched();

    this.vigencias.controls.forEach((vigenciaGroup: FormGroup) => {
      vigenciaGroup.markAllAsTouched();

      const rubricas = vigenciaGroup.get('rubricas') as FormArray;
      rubricas.controls.forEach((rubricaGroup: FormGroup) => {
        rubricaGroup.markAllAsTouched();
      });
    });

    this.form.updateValueAndValidity({ onlySelf: false, emitEvent: true });

    if (this.form.invalid) {
      console.log('Formulário inválido:', this.form.errors);
      return;
    }

    const formValue = this.form.getRawValue();

    formValue.vigencias.forEach((vigencia) => {
      if (vigencia.dtTermino) {
        vigencia.dtTermino = this.formatDate(vigencia.dtTermino);
      }
      if (vigencia.dtInicio) {
        vigencia.dtInicio = this.formatDate(vigencia.dtInicio);
      }
    });

    const PRORROGACAO_VALUE = 26;

    const prorrogacoes = formValue.vigencias.filter(
      (vigencia) => vigencia.nuVigenciaTipo === PRORROGACAO_VALUE
    );

    let targetVigencia;

    if (prorrogacoes.length > 0) {
      targetVigencia = prorrogacoes.reduce((latest, vigencia) => {
        return new Date(vigencia.dtInicio) > new Date(latest.dtInicio) ? vigencia : latest;
      });
    } else {
      targetVigencia = formValue.vigencias[0];
    }

    if (targetVigencia && targetVigencia.nuDiaTermino) {
      formValue.nuDiaFechamentoFatura = targetVigencia.nuDiaTermino;
    }

    for (let i = 0; i < formValue.vigencias.length; i++){
        for(let j = i + 1; j < formValue.vigencias.length; j++){
          if(formValue.vigencias[i].coProtocoloVigencia === formValue.vigencias[j].coProtocoloVigencia){
            if(formValue.vigencias[i].coProtocoloVigencia != 0 && formValue.vigencias[j].coProtocoloVigencia !=0 && formValue.vigencias[i].coProtocoloVigencia != null && formValue.vigencias[j].coProtocoloVigencia != null){
              this.toastr.warning(`Protocolo SICLG já foi utilizado, favor informar outro protocolo.`);
              return;
            }
        }
    }
  }

    if (this.nuContrato) {
      await this.Alterar(formValue);
    } else {
      await this.Cadastrar(formValue);
    }
  }



  public async Cadastrar(formValue: any): Promise<void> {
    try {
      await this.apiService.post<any>(
        `${Endpoints.URL_CONTRATOS}`,
        formValue
      );

      this.toastr.success('Cadastro efetuado com sucesso.', 'Sucesso');
      this.atualizarPagina.emit(true);
      this.activeModal.dismiss();
    } catch (error) {
    }
  }


  public async removeContato(contato: number){
    try{
      await this.apiService.delete<any>(`${Endpoints.URL_PREPOSTO}/`+ contato);

      this.toastr.success('Contato/Representante Removido com Sucesso.', 'Sucesso');
      this.atualizarPagina.emit(true);
      // this.activeModal.dismiss();

    }catch (error){

    }
  }

  public async cadastrarContato(contato: any){
    try{

      await this.apiService.post<any>(`${Endpoints.URL_PREPOSTO}/adicionar`, contato);
      this.obterContatos();

    }catch (error){

    }
  }

  public async alterarContato(contato: any){
    try{
      await this.apiService.put<any>(`${Endpoints.URL_PREPOSTO}/editar`, contato);
      this.obterContatos();
    }
    catch (error){

    }

  }

  public async Alterar(formValue: any): Promise<void> {
    try {
      await this.apiService.put<any>(
        `${Endpoints.URL_CONTRATOS}/${this.nuContrato}`,
        formValue
      );

      this.toastr.success('Alteração efetuada com sucesso.', 'Sucesso');
      this.atualizarPagina.emit(true);
      this.activeModal.dismiss();
    } catch (error) {
      this.atualizarPagina.emit(false);
    }
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }

  validarSupressao(vigencia) {
    // console.log("teste")
  }

  // passBack() {
  //   this.passEntry.emit(this.user);
  //   this.activeModal.close(this.user);
  // }

  async validarRotaAtas() {
    let contratoDerivadoAta: ContratoResponse;

    const response = await this.apiService.get<ApiResponse<ContratoResponse>>(
      `${Endpoints.URL_CONTRATOS}/` + this.nuContrato
    );

    contratoDerivadoAta = response.data;
    this.isRotaAtas = (contratoDerivadoAta && contratoDerivadoAta?.no_Tipo_Arp == 'ATA_DE_REGISTRO_DE_PRECOS' && contratoDerivadoAta?.ic_Arp) ? true : false;
    this.isDerivadoAta = (contratoDerivadoAta && contratoDerivadoAta?.no_Tipo_Arp == 'CONTRATO_DERIVADO_ATA_REGISTRO_PRECOS' && contratoDerivadoAta?.ic_Arp) ? true : false;

    if (this.isDerivadoAta && contratoDerivadoAta.qtAtasPai > 1) {
      this.carregarSelectAtas(contratoDerivadoAta.co_Processo, contratoDerivadoAta.nu_Ata);
    }
  }

  public async carregarSelectAtas(processo: string, nuAta: string): Promise<void> {

    try {
      this.listaTipoAtas = [];
      const filtrosLimpos = this.limparFiltrosNulos(this.filtroRegistros);

      filtrosLimpos.NoTipoArp = 'ATA_DE_REGISTRO_DE_PRECOS';
      filtrosLimpos.CoProcesso = processo;

      const response = await this.apiService.get<ApiResponse<ContratoApiResponse>>
        (`${Endpoints.URL_CONTRATOS}/filter-paginado`, filtrosLimpos);

      this.listaAtasResponse = response?.data?.contratos;

      if (this.listaAtasResponse && this.listaAtasResponse.length > 0) {
        this.listaAtasResponse.forEach(item => {

          let descAta = item.coContrato + " - " +
            (item.noEmpresa && item.noEmpresa.length < 16 ?
              item.noEmpresa : item.noEmpresa.substring(0, 15))

          let tipoAta: TipoAta = {
            nuContrato: item.nuContrato,
            noEmpresa: descAta
          }
          this.listaTipoAtas.push(tipoAta);
        });
      }

      let ataPai: ContratoResponse;

      const contratoAtaPai = await this.apiService.get<ApiResponse<ContratoResponse>>(
        `${Endpoints.URL_CONTRATOS}/` + nuAta
      );

      ataPai = contratoAtaPai.data;
      this.processoAta = ataPai.co_Processo;
      this.ataVinculada = ataPai.coContrato;
      this.form.controls['nuAta'].setValue(ataPai.nuContrato);

    } catch (error) {
      console.error('Erro ao obter contratos derivados', error);
    }
  }

  private limparFiltrosNulos(filtros: any): any {
    const filtrosLimpos: any = {};
    Object.keys(filtros).forEach((key) => {
      if (filtros[key] !== null && filtros[key] !== undefined && filtros[key] !== '') {
        filtrosLimpos[key] = filtros[key];
      }
    });
    return filtrosLimpos;
  }

  getListaProtocolos(index : number){
    const protocolo = this.contrato?.gcptb006Vigencias[0].coProtocoloVigencia;
    if(index === 0 && protocolo != undefined && protocolo != 0){
          const primeiroProtocolo = [{
            nU_PROTOCOLO_VIGENCIA: 0,
            nU_CONTRATO: 0,
            cO_PROTOCOLO_VIGENCIA: protocolo
          }];

        return primeiroProtocolo;
    }
    return this.listaProtocoloVigencia;
  }
}
