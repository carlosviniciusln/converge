import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ApiService } from 'src/app/shared/services/api.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import {
  PlanejamentoOrcamentarioConsultaResponse,
  PlanejamentoStatusResponse
} from 'src/app/models/generics/planejamento-response';
import { ApiResponse } from 'src/app/models/generics/api-response';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Select2Data } from 'ng-select2-component';
import {
  ActionPolicies,
  ModuleEnum,
  PageAction,
  PerfisEnum,
  TokenStorageService,
} from 'src/app/shared/services/token-storage.service';
import Swal from 'sweetalert2';
import { IUser } from 'src/app/models/DTOs/IUser';
import { Gcptb063PrevisaoDesembolsoDTO } from 'src/app/models/DTOs/Gcptb063PrevisaoDesembolsoDTO';
import { Gcpvw055DetalheTelaConsultaV2DTO } from 'src/app/models/DTOs/Gcpvw055DetalheTelaConsultaV2DTO';
import { Gcptb051CriarPlanejamentoItemRequest } from 'src/app/models/request/Gcptb051CriarPlanejamentoItemRequest';
import { Gcptb051AtualizarPlanejamentoItemRequest } from 'src/app/models/request/Gcptb051AtualizarPlanejamentoItemRequest';
import { Gcptb060PlanejamentoItemHistoricoV2Response } from 'src/app/models/response/Gcptb060PlanejamentoItemHistoricoV2Response';
import { Gcptb060DiffRegistros } from 'src/app/models/DTOs/Gcptb060DiffRegistros';
import { Gcpvw055DetalharPlanejamentoItensResponse } from 'src/app/models/response/Gcpvw055DetalharPlanejamentoItensResponse';

@Component({
  selector: 'app-planejamento-cadastro-v2',
  templateUrl: './planejamento-cadastro-v2.component.html',
  styleUrls: ['./planejamento-cadastro-v2.component.scss']
})
export class PlanejamentoCadastroV2Component implements OnInit {
  @Input() public planejamento: any; //PLANEJAMENTO ENVIADO PELO MODAL GERAL VW051
  @Input() public tipo: any;
  @Input() public nuAno: number;
  @Input() public tipoModal: string;
  @Input() public isEditable: boolean;
  @Input() public statusExercicio: string;
  @Input() public isCadastro: boolean;
  @Output() atualizarPagina: EventEmitter<boolean> = new EventEmitter();

  public previsoesExcluidas: {
  nuPlanejamentoItem: number;
  nuPrevisaoDesembolso: number; } [] = [];

  public dadosDeDominio: Gcpvw055DetalharPlanejamentoItensResponse = new Gcpvw055DetalharPlanejamentoItensResponse();

  public form: FormGroup;


  public isFlagContrato : boolean = false;
  public isFlagObjeto : boolean = false;
  public isFlagPlanoDeAquisicao : boolean = false;
  public isFlagTipoModalidade : boolean = false;
  public isFlagVrGlobal : boolean = false;
  public isFlagPrazoVigencia : boolean = false;
  public isFlagDtPrevisaoSiclg : boolean = false;

  public totalRubrica: number;
  public selectTab: number = 0;
  public loading: boolean = true;
  public gestorETorresGEGAT: boolean = false;
  public isReadonly = true;
  public permissions: ActionPolicies;

  private readonly STATUS_ORDER = [
    'Criado',
    'Revisado',
    'Avaliado',
    'Ajustado',
    'Validado',
  ];

  private readonly actionList: {
    type: PageAction;
    title: string;
    subTitle: string;
    actionButtonLabel: string;
  }[] = [
    {
      type: PageAction.Consultar,
      title: 'Consulta',
      subTitle: 'Consulta Planejamento Orçamentário',
      actionButtonLabel: 'Fechar',
    },
    {
      type: PageAction.Alterar,
      title: 'Edição',
      subTitle: 'Edição do Planejamento Orçamentário',
      actionButtonLabel: 'Salvar',
    },
    {
      type: PageAction.Cadastrar,
      title: 'Cadastro',
      subTitle: 'Cadastro de Planejamento Orçamentário',
      actionButtonLabel: 'Cadastrar',
    },
  ];

  public titulo: string;
  public subTitulo: string;
  public actionButtonLabel: string;
  public currentPageAction: PageAction;

  public currentProfile: IUser;
  public perfilAtual: string = '';
  public isPerfilPrivilegiado = false;
  rubricasSelecionadas: string[] = [];
  submitted = false;

  /**
   * INICIO ATRIBUTOS HISTORICO
   */

  public filtroRegistros: any = {
    paginaAtual: 1,
    tamanhoPagina: 5,
    coRubrica: null,
    NuContrato: null,
    NuTipoDemanda: null,
    NuPlanejamento: null,
    TpOperacao: null,
    NuOrc: null
  };

  // PASSAR PARA ENUM

  public filtros: any = [
    {
      label: 'Todos',
      value: null,
    },
    {
      label: 'Inclusão',
      value: 'INCLUSAO',
    },
    {
      label: 'Alteração',
      value: 'ALTERACAO',
    },
    {
      label: 'Exclusão',
      value: 'EXCLUSAO',
    },
  ];

  listaPlanejamentoItemHistorico: Gcptb060PlanejamentoItemHistoricoV2Response = new Gcptb060PlanejamentoItemHistoricoV2Response();
  dialogVisible = false;
  selectedDiff: Gcptb060DiffRegistros[] | null = null;
  filtrosSelecionado: string | null = null;

  /**
   * FIM HISTORICO
   */

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private toastr: ToastrService,
    public token: TokenStorageService
  ) {}

  async ngOnInit(): Promise<void> {
    this.loading = true;
    await this.definirPageAction();
    await this.formulario();



    if (this.planejamento?.nuOrc) {
     await this.obterPlanejamento();
    } else {

      this.editarTextos();
    }
    this.loading = false;


    if(this.tipoModal != 'adicionar'){
     await this.obterPlanejamentoItemHistorico();
    }

     this.obterPermissoes();
     await this.obterDadosDominio();

  }

  verDetalhes(event: any) {
    this.selectedDiff = event;
    this.dialogVisible = true;
  }

  getMarkerColor(event: any): string {
    if (event.tpOperacao === 'INCLUSAO') return '#4CAF50';
    if (event.tpOperacao === 'ALTERACAO' && event.listaDiffs?.some((d: any) => d.depois === 'Validado')) return '#4CAF50';
    if (event.tpOperacao === 'ALTERACAO') return '#2196F3';
    return '#F44336';
  }

  getMarkerIcon(event: any): string {
    if (event.tpOperacao === 'INCLUSAO') return 'pi pi-plus';
    if (event.tpOperacao === 'ALTERACAO' && event.listaDiffs?.some((d: any) => d.depois === 'Validado')) return 'pi pi-check';
    if (event.tpOperacao === 'ALTERACAO') return 'pi pi-pencil';
    return 'pi pi-trash';
  }

  getCardHeader(event: any): string {
    if (event.tpOperacao === 'INCLUSAO') return 'INCLUSÃO';
    if (event.tpOperacao === 'ALTERACAO' && event.listaDiffs?.some((d: any) => d.depois === 'Validado')) return 'VALIDADO';
    if (event.tpOperacao === 'ALTERACAO') return 'ALTERAÇÃO';
    return 'EXCLUSÃO';
  }

  onTabChange(event) {
    this.selectTab = event.index;
  }

  async filtrarEventos(e, op: number): Promise<void> {
    this.loading = true;
    switch (op) {
      case 1: {
        this.filtroRegistros.TpOperacao = e.value;
        if (e.value == null || this.filtros.length > 1) {
          await this.obterPlanejamentoItemHistorico();
        }
        break;
      }

      case 1: {
        this.filtroRegistros.coRubrica = e.value;
        if (e.value == null || this.filtros.length > 1) {
          await this.obterPlanejamentoItemHistorico();
        }
        break;
      }
      default: {
        this.obterPlanejamentoItemHistorico();
        break;
      }
    }
    this.loading = false;
  }



  /**
   *
   * FIM HISTORICO METODOS
   */

  obterPermissoes() {

    this.permissions = this.token.getActionPolicies(ModuleEnum.Planejamento);
    this.currentProfile = this.token.obterUsuarioEstruturado() as IUser;

    const perfil = this.currentProfile.noPerfil;
    this.perfilAtual = perfil;
    const mesmaUnidade = this.planejamento?.coFilial === this.currentProfile.coUnidade;


    const isAdministrador = perfil === PerfisEnum.Administrador;
    const isOrcamento = perfil === PerfisEnum.Orcamento;
    const isTorresGEGAT = perfil === PerfisEnum.TorresGEGAT;
    const isGestorOperacional = perfil === PerfisEnum.GestorOperacional;

    const perfisAceitos = isOrcamento || isAdministrador || isTorresGEGAT || (isGestorOperacional && mesmaUnidade);

    this.gestorETorresGEGAT =  isTorresGEGAT || isGestorOperacional;

    if (!perfisAceitos) {
      this.isPerfilPrivilegiado = false;
      return;
    }

    if (this.statusExercicio === "Cancelado") {
      this.isPerfilPrivilegiado = false;
      return;
    }

    if (this.statusExercicio === "Validado"  && !isAdministrador) {
      this.isPerfilPrivilegiado = false;
      return;
    }

    if(this.planejamento.nuStatusPlanejamentoItem == 3 && !isAdministrador && !isOrcamento){
      this.isPerfilPrivilegiado = false;
      return;
    }

    this.isPerfilPrivilegiado = true;
  }

  definirPageAction() {
    if (!this.isEditable) {
      this.currentPageAction = PageAction.Consultar;
    } else {
      if (this.planejamento && this.tipoModal != 'adicionar') {
        this.currentPageAction = PageAction.Alterar;
      } else {
        this.currentPageAction = PageAction.Cadastrar;
      }
    }
  }

  editarTextos() {
    var element = this.actionList.find((x) => x.type == this.currentPageAction);
    this.titulo = element.title;
    this.subTitulo =
      this.currentPageAction == PageAction.Cadastrar
        ? element.subTitle
        : `${element.subTitle} ${this.planejamento?.nuOrc}`;
    this.actionButtonLabel = element.actionButtonLabel;
  }


  /* REFATORAÇÃO HISTORICO */

  formulario() {
    this.form = this.formBuilder.group({
      nuPlanejamentoItem: new FormControl(0),
      nuAno: new FormControl({ value: this.nuAno, disabled: !this.isEditable }, [
        Validators.required,
      ]),
      nuFilial: new FormControl({ value: '', disabled: !this.isEditable }, [
        Validators.required,
      ]),
      deObjeto: new FormControl({ value: '', disabled: !this.isEditable }, [
      Validators.required
      ]),
      deJustificativa: new FormControl(
        { value: '', disabled: !this.isEditable },
        [Validators.required, Validators.maxLength(255)]
      ),
      deObservacao: new FormControl({ value: '', disabled: !this.isEditable }, [
        Validators.maxLength(255)
      ]),
      nuPlanejamentoStatus: new FormControl(
        { value: '', disabled: !this.isEditable },
        [Validators.required]
      ),
      nuDemandaTipo: new FormControl(
        { value: '', disabled: !this.isEditable },
        [Validators.required]
      ),
      nuContrato: new FormControl({ value: '', disabled: !this.isEditable }),
      coContrato: [''],
      nuObjetivoEstrategicoPdti: new FormControl(
        { value: '', disabled: !this.isEditable },
        [Validators.required]
      ),
      nuObjetivoEstrategicoPei: new FormControl(
        { value: '', disabled: !this.isEditable },
        [Validators.required]
      ),
      nuClassificacaoPlanejamento: new FormControl({
        value: 1,
        disabled: !this.isEditable,
      }),
      nuPlanejamentoTipo: new FormControl(
        { value: '', disabled: !this.isEditable },

      ),
      noCriador: [''],
      dhCadastro: [''],
      icServicoContinuo: new FormControl({ value: 0, disabled: true }, [
        Validators.required,
      ]),

      // icDigital: new FormControl({ value: '', disabled: !this.isEditable }, [
      //   Validators.required,
      // ]),
      nuSap: [''],
      deSap: [''],
      nuModalidade: new FormControl(
        { value: '', disabled: !this.isEditable },
        // [Validators.required]
      ),
      dePrazoVigencia: new FormControl(
        { value: '', disabled: !this.isEditable } ,
        // [Validators.required]

      ),
      dtPrevisaoSiclg: new FormControl(
        { value: '', disabled: !this.isEditable },
        // [Validators.required]

      ),
      vrGlobal: new FormControl(
        { value: '', disabled: !this.isEditable },
        // [Validators.required]
      ),
      previsoesDesembolso: new FormArray([]),
      vrTotalOrcamentoPlanejamento: new FormControl(
        { value: 0, disabled: true },
        [Validators.required]
      ),
    });
  }



  formularioLivre() {
    if (!this.form) return;

    // Habilita todos os controles do nível principal
    Object.keys(this.form.controls).forEach((key) => {
      const control = this.form.get(key);
      if (control?.disabled && key != 'vrTotalOrcamentoPlanejamento') {
        control.enable();
      }
    });

    this.onPlanejadoParaChange();
  }

  get f() {
    return this.form.controls;
  }

  get previsoesDesembolso(): FormArray {
    return this.form.get('previsoesDesembolso') as FormArray;
  }


  adicionarPrevisaoDesembolso() {
    this.previsoesDesembolso.push(this.novaPrevisaoDesembolso());
  }


  novaPrevisaoDesembolso(): FormGroup {
    return new FormGroup({
      nuPlanejamentoItem: new FormControl(0, [Validators.required]),
      nuPrevisaoDesembolso: new FormControl(0, [Validators.required]),
      nuRubrica: new FormControl({ value: '', disabled: !this.isEditable }, [
        Validators.required,
      ]),
      // nuSap: new FormControl({value: "", disabled: true}),
      // deSap: new FormControl({value: "", disabled: true}),
      vrJaneiro: new FormControl(0, [Validators.required]),
      vrFevereiro: new FormControl(0, [Validators.required]),
      vrMarco: new FormControl(0, [Validators.required]),
      vrAbril: new FormControl(0, [Validators.required]),
      vrMaio: new FormControl(0, [Validators.required]),
      vrJunho: new FormControl(0, [Validators.required]),
      vrJulho: new FormControl(0, [Validators.required]),
      vrAgosto: new FormControl(0, [Validators.required]),
      vrSetembro: new FormControl(0, [Validators.required]),
      vrOutubro: new FormControl(0, [Validators.required]),
      vrNovembro: new FormControl(0, [Validators.required]),
      vrDezembro: new FormControl(0, [Validators.required]),
      vrTotalRubrica: new FormControl(0, [Validators.required]),
    });
  }

  onPlanejadoParaChange() {
    if (this.form.controls['nuDemandaTipo'].value == 4) {
      this.form.controls['icServicoContinuo'].setValue(1);
      return;
    }
    else if(this.form.controls['nuDemandaTipo'].value == 1){
      this.isFlagPlanoDeAquisicao = true;
      this.planoAquisicaoObrigatorio();
      return
    }

     this.form.controls['icServicoContinuo'].setValue(0);
     this.isFlagPlanoDeAquisicao = false;
     this.limparValidatorsTipoPlano();

  }

  private tornarObrigatorio(controlName: string) {
      const control = this.form.get(controlName);
      control?.setValidators([Validators.required]);
      control?.updateValueAndValidity();
  }

  private removerObrigatorio(controlName: string) {
    const control = this.form.get(controlName);
    control?.clearValidators();
    control?.reset();
    control?.updateValueAndValidity();
  }

    private limparValidatorsTipoPlano(): void {
    this.removerObrigatorio('vrGlobal');
    this.removerObrigatorio('dtPrevisaoSiclg');
    this.removerObrigatorio('dePrazoVigencia');
    this.removerObrigatorio('nuModalidade');
  }

private normalizarDataParaInput(data?: string): string | null {
  if (!data) return null;
  return data.split('T')[0];
}






  onIsServicoContinuoChange($event: MatSlideToggleChange) {
    if ($event.checked) {
      this.form.controls['icServicoContinuo'].setValue(1);
      this.form.controls['nuDemandaTipo'].setValue(4)

    } else {
      this.form.controls['icServicoContinuo'].setValue(0);
      this.form.controls['nuDemandaTipo'].setValue(6);

    }
  }

  onValorRubricaChange(i: number) {
    const prevDes = this.previsoesDesembolso.at(i) as FormGroup;

    Object.keys(prevDes.controls).forEach((campo) => {
      if (campo.startsWith('vr') && campo !== 'vrTotalRubrica') {
        const ctrl = prevDes.get(campo);
        const v = ctrl?.value;
        if (v === '' || v === null || v === undefined) {
          ctrl?.setValue(0, { emitEvent: false });
        }
      }
    });


    const total =
      this.limparValor(prevDes.get('vrJaneiro')?.value) +
      this.limparValor(prevDes.get('vrFevereiro')?.value) +
      this.limparValor(prevDes.get('vrMarco')?.value) +
      this.limparValor(prevDes.get('vrAbril')?.value) +
      this.limparValor(prevDes.get('vrMaio')?.value) +
      this.limparValor(prevDes.get('vrJunho')?.value) +
      this.limparValor(prevDes.get('vrJulho')?.value) +
      this.limparValor(prevDes.get('vrAgosto')?.value) +
      this.limparValor(prevDes.get('vrSetembro')?.value) +
      this.limparValor(prevDes.get('vrOutubro')?.value) +
      this.limparValor(prevDes.get('vrNovembro')?.value) +
      this.limparValor(prevDes.get('vrDezembro')?.value);

    prevDes.get('vrTotalRubrica')?.setValue(total);

    this.somaValorTotalPlanejamentoOrcamentario();
  }

  limparValor = (valor: string): number => {
    if (!valor) return 0;
    return (
      parseFloat(
        (valor + '').replace('R$ ', '').replace(',', '.')
      ) || 0
    );
  };

  somaValorTotalPlanejamentoOrcamentario() {
    let vrTotalOrcamentoPlanejamentoTemp = 0;
    const previsoesDesembolso = this.form.get(
      'previsoesDesembolso'
    ) as FormArray;

    previsoesDesembolso.controls.forEach((element) => {
      vrTotalOrcamentoPlanejamentoTemp += Number(
        element.get('vrTotalRubrica')?.value
      );
    });
    const totalFormatado = vrTotalOrcamentoPlanejamentoTemp;

    this.form.controls['vrTotalOrcamentoPlanejamento'].setValue(totalFormatado);
  }


  onContratoChange(event: any) {
    const nuContrato = event?.value;

    if (nuContrato) {
      this.obterDadosContrato(nuContrato);
    }
  }

  onRubricaChange(event: any) {
    var nuRubrica = event.target.value != null ? event.target.value.split(': ')[1] : event.target.value;

    if (nuRubrica) {
      const controls = this.form.controls.previsoesDesembolso?.value;
      for (const i in controls) {
        const controlValue = controls[i].nuRubrica;
        if (controlValue) {
          this.rubricasSelecionadas.push(controlValue+"");
        }
      }

      this.removerRubrica(nuRubrica);
      const jaExiste2 = this.rubricasSelecionadas.includes(nuRubrica);
      if (jaExiste2) {
        event.target.value = '';
        this.toastr.warning('Este Rubrica já foi selecionado. Escolha outra e tente novamente.', 'Aviso');
        return;
      }
    }

  }

async removerRubrica(nuRubrica: string) {
  const index = this.rubricasSelecionadas.indexOf(nuRubrica);
  if (index !== -1) {
    this.rubricasSelecionadas.splice(index, 1);
  }
}


  async obterDadosContrato(nuContrato: string) {
    try {

      //VERIFICAR ESSE TIPO
      const response = await this.apiService.get<
        ApiResponse<PlanejamentoOrcamentarioConsultaResponse>
      >(
        `v1/Contrato/lista-contrato-planejamento?nuContrato=${nuContrato}`
      );


      if (response.succeeded && response.data) {

        const contrato = response.data[0];
        this.form.patchValue({
          nuContrato: contrato?.nuContrato,
          coContrato: contrato?.coContrato,
          nuFilial: contrato?.nuFilial,
          coFilial: contrato?.coFilial,
          deObjeto: contrato?.noObjeto,
          //nuPlanejamentoStatus: response.data.status,
          nuObjetivoEstrategicoPdti: contrato?.nuObjetivoPdtic,
          nuObjetivoEstrategicoPei: contrato?.nuObjetivoPei,
          nuPlanejamentoTipo: this.tipo
        });
      }
    } catch (error) {
      console.error('Erro ao obter dados do contrato', error);
    }
  }



 public async obterPlanejamento(): Promise<void> {
  try {

    const response = await this.apiService.get<
      ApiResponse<Gcpvw055DetalheTelaConsultaV2DTO>
    >(
      `v1/PlanejamentoOrcamentarioV/detalhar-itens-planejados-novo`, {
        nuOrc: this.planejamento?.nuOrc,
        nuPlanejamento  : this.planejamento?.nuPlanejamento
      }
    );

    if(!response.succeeded) {
      this.toastr.error(
        'Não foi possível obter os dados para este detalhamento.',
        'Erro'
      );
      return;
    }


    const planejamento = response.data;

    this.planejamento = planejamento as any; // mantém compatibilidade interna

    // ===== Dados principais =====
    this.form.patchValue({
      nuPlanejamentoItem: planejamento.nuPlanejamentoItem,
      planejamento: planejamento.nuPlanejamento,
      nuFilial: planejamento.nuFilial,
      deObjeto: planejamento.deObjeto,
      deJustificativa: planejamento.deJustificativa,
      deObservacao: planejamento.deObservacao,
      nuPlanejamentoStatus: planejamento.nuStatusPlanejamentoItem,
      nuDemandaTipo: planejamento.nuTipoDemanda,
      nuObjetivoEstrategicoPdti: planejamento.nuObjetivoPdtic,
      nuObjetivoEstrategicoPei: planejamento.nuObjetivoPei,
      // icDigital: planejamento.nuDigital,
      noCriador: planejamento.coMatricula,
      deSap: planejamento.deSap,
      nuSap: planejamento.nuSap,
      vrGlobal: planejamento.vrGlobal,
      dePrazoVigencia: planejamento.dePrazoVigencia,
      nuModalidade: planejamento.nuModalidade,
      dtPrevisaoSiclg: this.normalizarDataParaInput(planejamento.dtPrevisaoSiclg),
      dhCadastro: this.formatarData(planejamento.dhCadastro),
    });


    //regra de bloqueio
    if (planejamento.nuSap || planejamento.deSap) {
      this.form.get('nuSap')?.disable({ emitEvent: false });
      this.form.get('deSap')?.disable({ emitEvent: false });
    }


    this.form.controls['nuContrato'].setValue(planejamento.nuContrato);
    this.form.controls['coContrato'].setValue(planejamento.coContrato);

    if(planejamento.nuTipoDemanda == 1){
      this.isFlagPlanoDeAquisicao = true;
      this.planoAquisicaoObrigatorio()
    }

    if(planejamento.nuContrato != null && planejamento.nuContrato != 0){
      this.isFlagContrato = true;
    }

    if(this.planejamento?.noModalidade != null){
      this.form.get('nuModalidade')?.setValue(this.dadosDeDominio.listaTiposModalidade.find(x => x.descricao == this.planejamento?.noModalidade).id);
    }

    // ===== Previsões =====
    this.previsoesDesembolso.clear();

    let total = 0;
    planejamento.previsoesDesembolso.forEach(p => {
      total += p.vrPlanejado;
      this.previsoesDesembolso.push(this.criarFormGroupPrevisao(p));
    });

    this.form.controls['vrTotalOrcamentoPlanejamento']
      .setValue(total);

  } catch (error) {
    console.error(error);
    this.toastr.error('Erro ao carregar planejamento.');
  }

  this.editarTextos();
}

private planoAquisicaoObrigatorio(): void {
  this.limparValidatorsTipoPlanoSemReset();
  this.tornarObrigatorio('vrGlobal');
  this.tornarObrigatorio('dtPrevisaoSiclg');
  this.tornarObrigatorio('dePrazoVigencia');
  // this.tornarObrigatorio('nuModalidade');
}


  private limparValidatorsTipoPlanoSemReset(): void {
  this.form.get('vrGlobal')?.clearValidators();
  this.form.get('dePrazoVigencia')?.clearValidators();
  // this.form.get('nuModalidade')?.clearValidators();
  this.form.get('dtPrevisaoSiclg')?.clearValidators();

  this.form.get('vrGlobal')?.updateValueAndValidity();
  this.form.get('dePrazoVigencia')?.updateValueAndValidity();
  // this.form.get('nuModalidade')?.updateValueAndValidity();
  this.form.get('dtPrevisaoSiclg')?.updateValueAndValidity();
}




private formatarData(data: string | Date | null | undefined): string {
  if (!data) return '';

  const d = typeof data === 'string' ? new Date(data) : data;
  if (isNaN(d.getTime())) return '';

  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const ano = d.getFullYear();

  return `${dia}/${mes}/${ano}`;
}

bloquearCaracteresInvalidos(event: KeyboardEvent): void {
  const teclasBloqueadas = ['e', 'E', '+', '-', '.', ','];

  if (teclasBloqueadas.includes(event.key)) {
    event.preventDefault();
  }
}


private criarFormGroupPrevisao(
  x: Gcptb063PrevisaoDesembolsoDTO
): FormGroup {
  return new FormGroup({
    nuPrevisaoDesembolso: new FormControl(x.nuPrevisaoDesembolso),
    nuPlanejamentoItem: new FormControl({ value: x.nuPlanejamentoItem, disabled: true }),
    nuRubrica: new FormControl(
      { value: x.nuRubrica, disabled: !this.isEditable },
      Validators.required
    ),

    vrJaneiro: new FormControl({ value: x.vrJaneiro, disabled: !this.isEditable }),
    vrFevereiro: new FormControl({ value: x.vrFevereiro, disabled: !this.isEditable }),
    vrMarco: new FormControl({ value: x.vrMarco, disabled: !this.isEditable }),
    vrAbril: new FormControl({ value: x.vrAbril, disabled: !this.isEditable }),
    vrMaio: new FormControl({ value: x.vrMaio, disabled: !this.isEditable }),
    vrJunho: new FormControl({ value: x.vrJunho, disabled: !this.isEditable }),
    vrJulho: new FormControl({ value: x.vrJulho, disabled: !this.isEditable }),
    vrAgosto: new FormControl({ value: x.vrAgosto, disabled: !this.isEditable }),
    vrSetembro: new FormControl({ value: x.vrSetembro, disabled: !this.isEditable }),
    vrOutubro: new FormControl({ value: x.vrOutubro, disabled: !this.isEditable }),
    vrNovembro: new FormControl({ value: x.vrNovembro, disabled: !this.isEditable }),
    vrDezembro: new FormControl({ value: x.vrDezembro, disabled: !this.isEditable }),

    // nuSap: new FormControl({ value: x.nuSap ?? null, disabled: true }),
    // deSap: new FormControl({ value: x.deSap ?? null, disabled: true }),

    vrTotalRubrica: new FormControl(
      { value: x.vrPlanejado, disabled: true }
    ),
  });
}


async excluirPrevisaoDesembolso(i: number) {

  const grupo = this.previsoesDesembolso.at(i) as FormGroup;

  const nuPlanejamentoItem = grupo.get('nuPlanejamentoItem')?.value;
  const nuPrevisaoDesembolso = grupo.get('nuPrevisaoDesembolso')?.value;

  const confirm = await Swal.fire({
    text: `Deseja realmente excluir a rubrica ${i + 1}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sim',
    cancelButtonText: 'Não',
  });

  if (!confirm.isConfirmed) return;

  if (nuPlanejamentoItem && (nuPrevisaoDesembolso != 0 && nuPrevisaoDesembolso != null)) {
    this.previsoesExcluidas.push({
      nuPlanejamentoItem,
      nuPrevisaoDesembolso
    });
  }

  this.previsoesDesembolso.removeAt(i);
  this.somaValorTotalPlanejamentoOrcamentario();
}

   public async obterDadosDominio(): Promise<Gcpvw055DetalharPlanejamentoItensResponse> {
    try {
      const response = await this.apiService.get<ApiResponse<Gcpvw055DetalharPlanejamentoItensResponse>>(
        `v1/PlanejamentoOrcamentarioV/planejamento-item-dados-de-dominio`
      );

      if(!response.succeeded) {
        this.toastr.error(
          'Não foi possível obter os dados de domínio para este detalhamento.',
          'Erro'
        );
        return;
      }

      const dadosDeDominio = response.data as Gcpvw055DetalharPlanejamentoItensResponse;

      this.dadosDeDominio =  {
        ...dadosDeDominio,
        listaStatusPlanejamento: this.planejamento?.nuStatusPlanejamentoItem === 3 || this.planejamento?.nuStatusPlanejamento === 3
          ? dadosDeDominio.listaStatusPlanejamento
          : this.gestorETorresGEGAT ? dadosDeDominio.listaStatusPlanejamento.filter(
              s => s.noPlanejamentoStatus !== 'Validado'
            ) : dadosDeDominio.listaStatusPlanejamento

            }
      this.tratarStatusPlanejamento()

    } catch (error) {
      console.error(error);
    }
  }


  public tratarStatusPlanejamento() {

      this.buildStatusRank_();
            //Define o campo como criado ao criar um novo contrato e desabilita o campo
            if (this.isCadastro) {
              const criadoId = this.dadosDeDominio.listaStatusPlanejamento.find(
                s => s.noPlanejamentoStatus === 'Criado'
              )?.nuPlanejamentoStatus;

              if (criadoId) {
                this.form.controls['nuPlanejamentoStatus'].setValue(criadoId);
                this.form.controls['nuPlanejamentoStatus'].disable();
              }
            }

      const c = this.form?.get('nuPlanejamentoStatus')?.value;

      if (c != null && c !== '') {
        this.originalStatusId = this.originalStatusId ?? c;
        this.setupNoRegressionGuard_();
      }

  }
  // TODO: Em outra oportunidade mover essa validacao para o Backend.
  private originalStatusId: number | null = null;
  private _noRegressionSub?: any;
  private statusRank = new Map<number, number>();

  public isAdmin_(): boolean {
    return this.currentProfile?.noPerfil === PerfisEnum.Administrador;
  }
  private isOrcamento_(): boolean {
    return this.currentProfile?.noPerfil === PerfisEnum.Orcamento;
  }

  private buildStatusRank_(): void {
    this.statusRank.clear();
    if (!this.dadosDeDominio.listaStatusPlanejamento?.length) return;
    const mapByName = new Map<string, number>();
    this.dadosDeDominio.listaStatusPlanejamento.forEach((s) =>
      mapByName.set(
        (s.noPlanejamentoStatus || '').trim(),
        s.nuPlanejamentoStatus
      )
    );
    this.STATUS_ORDER.forEach((name, idx) => {
      const id = mapByName.get(name);
      if (id != null) this.statusRank.set(id, idx);
    });
  }


  private rank_(id: number): number {
    const r = this.statusRank.get(id);
    return r == null ? Number.POSITIVE_INFINITY : r;
  }

  private setupNoRegressionGuard_(): void {
    const ctrl = this.form?.get('nuPlanejamentoStatus');
    if (!ctrl) return;
    if (this.isAdmin_() || this.isOrcamento_()) {
      this._noRegressionSub?.unsubscribe?.();
      return;
    }
    this._noRegressionSub?.unsubscribe?.();
    const current = ctrl.value;
    if (current == null || current === '') return;
    this.originalStatusId = this.originalStatusId ?? current;
    this._noRegressionSub = ctrl.valueChanges.subscribe((novoId: number) => {
      if (this.originalStatusId == null) {
        this.originalStatusId = novoId;
        return;
      }
      const rankNovo = this.rank_(novoId);
      const rankAtual = this.rank_(this.originalStatusId);
      if (rankNovo < rankAtual) {
        this.toastr.error(
          'Não é permitido regredir o status.',
          'Regra de negócio'
        );
        ctrl.setValue(this.originalStatusId, { emitEvent: false });
        return;
      }
      if (rankNovo > rankAtual) this.originalStatusId = novoId;
    });
  }


  public async obterPlanejamentoItemHistorico(): Promise<void> {
    try {

      this.filtroRegistros.NuContrato = this.planejamento?.nuContrato;
      this.filtroRegistros.NuPlanejamento =this.planejamento?.nuPlanejamento;
      this.filtroRegistros.NuTipoDemanda = this.planejamento?.nuTipoDemanda;
      this.filtroRegistros.NuOrc = this.planejamento.nuOrc;

      const response = await this.apiService.get<
        ApiResponse<Gcptb060PlanejamentoItemHistoricoV2Response>
      >(
        `v1/PlanejamentoOrcamentarioV/obter-historico-planejamento-item`,
        this.filtroRegistros
      );

      this.listaPlanejamentoItemHistorico.listaHistorico = response.data.listaHistorico;
      this.listaPlanejamentoItemHistorico.totalRegistros = response.data.totalRegistros;

    } catch (error) {
      console.error(error);
    }
  }

    loadPage(event: any) {
    const page = (event.first || 0) / (event.rows || this.filtroRegistros.tamanhoPagina) + 1;
    const pageSize = event.rows || this.filtroRegistros.tamanhoPagina;

    if (page !== this.filtroRegistros.paginaAtual || pageSize !== this.filtroRegistros.tamanhoPagina) {
      this.filtroRegistros.paginaAtual = page;
      this.filtroRegistros.tamanhoPagina = pageSize;
      this.obterPlanejamentoItemHistorico();
    }
  }


  public async onSubmit(): Promise<void> {
    this.submitted = true;
    const totalContratacao = this.form.get('vrTotalOrcamentoPlanejamento')?.value;

    switch (this.currentPageAction) {
      case PageAction.Cadastrar:

    if (totalContratacao === 0 || totalContratacao === null) {
      await Swal.fire({
        title: 'Atenção!',
        text: 'A previsão de desembolso não pode ser zero. Informe um valor válido',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }
        this.Cadastrar();
        break;
      case PageAction.Alterar:

    if (totalContratacao === 0 || totalContratacao === null) {
      await Swal.fire({
        title: 'Atenção!',
        text: 'A previsão de desembolso não pode ser zero. Informe um valor válido',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }
        this.Alterar();
        break;
      case PageAction.Consultar:
      default:
        this.activeModal.dismiss('Cross click');
        break;
    }
  }

  /* nova conversao  - inicio */
  public parseDecimal(value: any): number {
    if (!value) return undefined;
    if (typeof value === 'string') {
      const cleaned = value.replace(/[^\d,-]/g, '').replace(',', '.');
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? undefined : parsed;
    }
    return Number(value);
  }
  public async ValidarValores(obj: any): Promise<boolean> {
    /**** nova validação de valores *********/

       const totalContratacao = this.form.get('vrTotalOrcamentoPlanejamento')?.value;
          const previsoes = obj.previsoesDesembolso;


          for (var p in previsoes) {
            var item: Gcptb063PrevisaoDesembolsoDTO = {

              nuPlanejamentoItem: 0,
              vrPlanejado: this.parseDecimal(previsoes[p].vrTotalRubrica),
              vrJaneiro: this.parseDecimal(previsoes[p].vrJaneiro),
              vrFevereiro: this.parseDecimal(previsoes[p].vrFevereiro),
              vrMarco: this.parseDecimal(previsoes[p].vrMarco),
              vrAbril: this.parseDecimal(previsoes[p].vrAbril),
              vrMaio: this.parseDecimal(previsoes[p].vrMaio),
              vrJunho: this.parseDecimal(previsoes[p].vrJunho),
              vrJulho: this.parseDecimal(previsoes[p].vrJulho),
              vrAgosto: this.parseDecimal(previsoes[p].vrAgosto),
              vrSetembro: this.parseDecimal(previsoes[p].vrSetembro),
              vrOutubro: this.parseDecimal(previsoes[p].vrOutubro),
              vrNovembro: this.parseDecimal(previsoes[p].vrNovembro),
              vrDezembro: this.parseDecimal(previsoes[p].vrDezembro),
            };
            if (item.vrPlanejado == null || Number.isNaN(item.vrPlanejado)) {
              item.vrPlanejado = await this.calcularPlanejamento(item);
            }
            if(totalContratacao == 0) return true;
          }

          return false;
        /**** nova validação de valores *********/
  }

  public async Cadastrar(): Promise<void> {

    try {

      this.submitted = true;
      if (this.form.invalid) {
        const invalids = [];
        const controls = this.form.controls;
        for (const name in controls) {
          if (controls[name].invalid) invalids.push(name);
        }
        if (invalids.length > 0) {
             await Swal.fire({
              title: 'Atenção!',
              text: 'Preencha todos os campos obrigatórios.',
              icon: 'warning',
              confirmButtonText: 'OK'
              });
            return;
        }

        return;
      }


      var obj = this.form.getRawValue();
      var totalRubrica = await this.ValidarValores(obj);
      if(totalRubrica){
        await Swal.fire({
          title: 'Atenção!',
          text: 'A previsão de desembolso não pode ser zero. Informe um valor válido.',
          icon: 'warning',
          confirmButtonText: 'OK'
        });
        return;
      }

      const previsoes = obj.previsoesDesembolso;

      if (previsoes.length > 0) {

          var request : Gcptb051CriarPlanejamentoItemRequest = {

            NuPlanejamento: this.tipoModal == 'adicionar' ? this.planejamento : this.planejamento?.nuPlanejamento ?? 0,
            NuContrato: obj.nuContrato,
            NuFilial: obj.nuFilial,

            NuStatusPlanejamentoItem: obj.nuPlanejamentoStatus == null ? 5 : obj.nuPlanejamentoStatus,
            // NuVigencia: obj.nuAno,
            // DeDigital: digital?.code,
            DeObjeto: obj.deObjeto,
            DeObservacao: obj.deObservacao,
            NuDemandaTipo: obj.nuDemandaTipo,
            NuObjetivoPDTIC: obj.nuObjetivoEstrategicoPdti?.toString(),
            NuObjetivoPEI: obj.nuObjetivoEstrategicoPei?.toString(),
            DeJustificativa: obj.deJustificativa,
            NuModalidade: obj.nuModalidade,
            VrGlobal: this.parseDecimal(obj.vrGlobal),
            DePrazoVigencia: obj.dePrazoVigencia,
            DtPrevisaoSiclg: obj.dtPrevisaoSiclg,
            IcPlanoAquisicao: this.isFlagPlanoDeAquisicao ? true : null,


            // NuOrc: this.planejamento?.nuOrc,
            // NuSap: Number(previsoes[p].nuSap),
            // DeSap: String(previsoes[p].deSap),

            previsaoDesembolso: obj.previsoesDesembolso.map(p => ({
            NuPlanejamentoItem: p.nuPlanejamentoItem ?? 0,
            NuRubrica: p.nuRubrica,
            VrPlanejado: this.parseDecimal(p.vrTotalRubrica),
            VrJaneiro: this.parseDecimal(p.vrJaneiro),
            VrFevereiro: this.parseDecimal(p.vrFevereiro),
            VrMarco: this.parseDecimal(p.vrMarco),
            VrAbril: this.parseDecimal(p.vrAbril),
            VrMaio: this.parseDecimal(p.vrMaio),
            VrJunho: this.parseDecimal(p.vrJunho),
            VrJulho: this.parseDecimal(p.vrJulho),
            VrAgosto: this.parseDecimal(p.vrAgosto),
            VrSetembro: this.parseDecimal(p.vrSetembro),
            VrOutubro: this.parseDecimal(p.vrOutubro),
            VrNovembro: this.parseDecimal(p.vrNovembro),
            VrDezembro: this.parseDecimal(p.vrDezembro),
            }))

          };

        this.cadastrarItem(request);

      } else {
        this.toastr.warning('Previsão de desembolso obrigatório', 'Aviso');
      }
    } catch (error) {
      this.atualizarPagina.emit(false);
    }
  }

  public async Alterar(): Promise<void> {
    try {
      this.submitted = true;
      this.isReadonly = false;
      await this.habilitarCampoRubrica(true);
      var obj = this.form.getRawValue();

      console.log(obj, "TESTE")


      var totalRubrica = await this.ValidarValores(obj);

      if(totalRubrica){
        await Swal.fire({
          title: 'Atenção!',
          text: 'A previsão de desembolso não pode ser zero. Informe um valor válido.',
          icon: 'warning',
          confirmButtonText: 'OK'
        });
        this.habilitarCampoRubrica(false);
        return;
      }

      if (this.form.invalid) {
        const itemErro = [];
        const controls = this.form.controls;

        for (const name in controls) {
          if (controls[name].invalid) itemErro.push(name);
        }
        if (itemErro.length > 0) {
            await Swal.fire({
            title: 'Atenção!',
            text: 'Preencha todos os campos obrigatórios.',
            icon: 'warning',
            confirmButtonText: 'OK'
            });
            return;
        }
        this.isReadonly = true;
        if (itemErro.find((item) => item === 'previsoesDesembolso')) {
              await Swal.fire({
              title: 'Atenção!',
              text: 'Preencha todos os campos obrigatórios.',
              icon: 'warning',
              confirmButtonText: 'OK'
              });

            return;

        }

        this.habilitarCampoRubrica(false);
        return;
      }


      //regra: maquina de status
      //  5	Criado - 7	Revisado - 9	Ajustado
      if (
        this.currentProfile.noPerfil == PerfisEnum.TorresGEGAT ||
        this.currentProfile.noPerfil ==
          PerfisEnum.GestorOperacional /* || this.currentProfile.noPerfil == PerfisEnum.UnidadeDemandante*/
      ) {
        if (
          this.planejamento.nuStatusPlanejamento == 5 &&
          this.form.value.nuPlanejamentoStatus != 7 && this.form.value.nuPlanejamentoStatus != 5
        ) {
          //Criado para Revisado

          await Swal.fire({
          title: 'Atenção!',
          text: 'Status só poderá ser atualizado de Criado para Revisado e de Avaliado para Ajustado. Favor ajustar e tentar novamente.',
          icon: 'warning',
          confirmButtonText: 'OK'
          });
          this.habilitarCampoRubrica(false);
          return;
        }

        //MENSAGEM IGUAL PARA CONDIÇÕES DIFERENTES, REGRA APLICADA NÃO ENTENDIDA
        if (
          this.planejamento.nuStatusPlanejamento == 7 &&
          this.form.value.nuPlanejamentoStatus != 9 && this.form.value.nuPlanejamentoStatus != 7
        ) {
          //Revisado e de Avaliado
           await Swal.fire({
          title: 'Atenção!',
          text: 'Status só poderá ser atualizado de Criado para Revisado e de Avaliado para Ajustado. Favor ajustar e tentar novamente.',
          icon: 'warning',
          confirmButtonText: 'OK'
          });

          // this.toastr.error(
          //   'Status só poderá ser atualizado de Criado para Revisado e de Avaliado para Ajustado. Favor ajustar e tentar novamente.',
          //   'Erro'
          // );
          this.habilitarCampoRubrica(false);
          return;
        }
        if (
          this.planejamento.nuStatusPlanejamento == 9 &&
          this.form.value.nuPlanejamentoStatus != 9
        ) {
          //Revisado e de Avaliado

           await Swal.fire({
          title: 'Atenção!',
          text: 'Status só poderá ser atualizado de Criado para Revisado e de Avaliado para Ajustado. Favor ajustar e tentar novamente.',
          icon: 'warning',
          confirmButtonText: 'OK'
          });
          this.toastr.error(
            'Status só poderá ser atualizado de Criado para Revisado e de Avaliado para Ajustado. Favor ajustar e tentar novamente.',
            'Erro'
          );
          this.habilitarCampoRubrica(false);
          return;
        }
      }

      if (
        this.planejamento.nuStatusPlanejamento == 4 && //cancelado
        this.form.value.nuPlanejamentoStatus != 4
      ) {
        //Revisado e de Avaliado
         await Swal.fire({
          title: 'Atenção!',
          text: 'O status "Cancelado" não pode sofre alteração de status.',
          icon: 'warning',
          confirmButtonText: 'OK'
          });
        // this.toastr.error(
        //   'O status "Cancelado" não pode sofre alteração de status.',
        //   'Erro'
        // );
        this.habilitarCampoRubrica(false);
        return;
      }

        var request: Gcptb051AtualizarPlanejamentoItemRequest = {

            NuPlanejamentoItem: obj.nuPlanejamentoItem,
            NuPlanejamento: this.tipoModal == 'adicionar' ? this.planejamento : this.planejamento?.nuPlanejamento ?? 0,
            NuContrato: obj.nuContrato,
            NuFilial: obj.nuFilial,
            NuStatusPlanejamentoItem: obj.nuPlanejamentoStatus,
            NuDemandaTipo: obj.nuDemandaTipo,
            DeObjeto: obj.deObjeto,
            DeObservacao: obj.deObservacao,
            NuObjetivoPDTIC: obj.nuObjetivoEstrategicoPdti?.toString(),
            NuObjetivoPEI: obj.nuObjetivoEstrategicoPei?.toString(),
            DeJustificativa: obj.deJustificativa,
            NuModalidade: obj.nuModalidade,
            VrGlobal: this.parseDecimal(obj.vrGlobal),
            DePrazoVigencia: obj.dePrazoVigencia,
            DtPrevisaoSiclg: obj.dtPrevisaoSiclg,
            IcPlanoAquisicao: this.isFlagPlanoDeAquisicao ? true : null,

          previsaoDesembolso: obj.previsoesDesembolso.map(p => ({
            NuPrevisaoDesembolso: p.nuPrevisaoDesembolso ?? 0,
            NuPlanejamentoItem: obj.nuPlanejamentoItem,
            NuRubrica: p.nuRubrica,
            VrPlanejado: this.parseDecimal(p.vrTotalRubrica),
            VrJaneiro: this.parseDecimal(p.vrJaneiro),
            VrFevereiro: this.parseDecimal(p.vrFevereiro),
            VrMarco: this.parseDecimal(p.vrMarco),
            VrAbril: this.parseDecimal(p.vrAbril),
            VrMaio: this.parseDecimal(p.vrMaio),
            VrJunho: this.parseDecimal(p.vrJunho),
            VrJulho: this.parseDecimal(p.vrJulho),
            VrAgosto: this.parseDecimal(p.vrAgosto),
            VrSetembro: this.parseDecimal(p.vrSetembro),
            VrOutubro: this.parseDecimal(p.vrOutubro),
            VrNovembro: this.parseDecimal(p.vrNovembro),
            VrDezembro: this.parseDecimal(p.vrDezembro),
          })),


          previsaoDesembolsoExclusao: this.previsoesExcluidas.map(x => ({
            NuPlanejamentoItem: x.nuPlanejamentoItem,
            NuPrevisaoDesembolso: x.nuPrevisaoDesembolso
          }))
        };

      await this.habilitarCampoRubrica(false);
      const response = await this.apiService.put<ApiResponse<any>>(
        `v1/PlanejamentoOrcamentarioV/atualizar-planejamento-item`,
        request
      );

      if (!response?.succeeded) {

          await Swal.fire({
            title: 'Erro!',
            text: 'Falha ao alterar item. Não foi possível concluir a operação. Verifique sua conexão ou tente novamente.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }

      await Swal.fire({
        title: 'Sucesso!',
        text: `Item do Planejamento Orçamentário alterado com sucesso.`,
        icon: 'success',
        confirmButtonText: 'OK',
      });

      this.atualizarPagina.emit(true);
      this.activeModal.dismiss();
    } catch (error) {
      console.error('Erro ao alterar planejamento:', error);
      this.toastr.error('Erro ao salvar alterações.', 'Erro');
      this.atualizarPagina.emit(false);
    }
  }



  public async habilitarCamposMesId(): Promise<void> {
    const meses = [
      'vrJaneiro','vrFevereiro','vrMarco','vrAbril','vrMaio','vrJunho',
      'vrJulho','vrAgosto','vrSetembro','vrOutubro','vrNovembro','vrDezembro','nuPlanejamentoItem'
    ];
    const arr = this.form.get('previsoesDesembolso') as FormArray | null;
    if (!arr) {
      console.warn('FormArray "previsoesDesembolso" não encontrado');
      return;
    }
    arr.controls.forEach((itemCtrl, idx) => {
      const grupo = itemCtrl as FormGroup;
      meses.forEach((nome) => {
        const ctrl = grupo.get(nome);
        if (ctrl) {
          ctrl.enable({ emitEvent: true });
        } else {
          console.warn(`Item ${idx}: campo "${nome}" não encontrado`);
        }
      });
    });
  }

  public async habilitarCampoRubrica(rubrica:boolean): Promise<void> {
      const arr = this.form.get('previsoesDesembolso') as FormArray | null;
      if (!arr) {
        console.warn('FormArray "previsoesDesembolso" não encontrado');
        return;
      }
      arr.controls.forEach((itemCtrl, idx) => {
        const grupo = itemCtrl as FormGroup;
          const ctrl = grupo.get("nuRubrica");
          if (ctrl) {
            if(rubrica){
              ctrl.enable({ emitEvent: true });
            } else {
              ctrl.disable({ emitEvent: true });
            }
          } else {
            console.warn(`Item ${idx}: campo "${"nuRubrica"}" não encontrado`);
          }
      });
  }

  public async calcularPlanejamento(item: any): Promise<number> {
    const meses = [
      item.VrJaneiro, item.VrFevereiro, item.VrMarco, item.VrAbril,
      item.VrMaio, item.VrJunho, item.VrJulho, item.VrAgosto,
      item.VrSetembro, item.VrOutubro, item.VrNovembro, item.VrDezembro
    ];
    return meses.reduce((total, valor) => total + (valor ?? 0), 0);
  }


  async Excluir(planejamento: any) {
    const alert = await Swal.fire({
      title: '',
      text: `Deseja realmente excluir Planejamento Orçamentário Cód: ${planejamento?.nuPlanejamentoItem}?`,
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
      this.loading = true;

      try {

      this.submitted = true;

      const response = await this.apiService.put<any>(
        `v1/PlanejamentoOrcamentarioV/inativar-planejamento-item`,
        planejamento.nuPlanejamentoItem
      );

      if(!response?.succeeded){
          await Swal.fire({
          title: 'Erro!',
          text: 'Erro ao Excluir planejamento item.',
          icon: 'error',
          confirmButtonText: 'OK'
          });
      }

       await Swal.fire({
          title: 'Sucesso!',
          text: 'Exclusão efetuada com sucesso.',
          icon: 'success',
          confirmButtonText: 'OK'
          });

        this.atualizarPagina.emit(true);
        this.activeModal.dismiss();

      } catch (error) {
        console.error(error, 'aquirsd');
      }

      this.loading = false;
    }
  }

  habilitarCamposParaEdicao(tipoModal: string, isEditable: boolean)
  {

    if (tipoModal == 'editar') {
      this.isEditable = isEditable;
      this.formularioLivre();
      // this.form.controls['nuAno'].disable();
      this.habilitarCamposMesId();
      this.habilitarCampoRubrica(false);
    }
  }

  async cadastrarItem(lista: any): Promise<void> {
    try {

      const response = await this.apiService.post<ApiResponse<any>>(
        `v1/PlanejamentoOrcamentarioV/novo-planejamento-item`,
        lista
      );

      if (!response?.succeeded) {

         await Swal.fire({
            title: 'Erro!',
            text: 'Falha ao cadastrar item. Não foi possível concluir a operação. Verifique sua conexão ou tente novamente.',
            icon: 'error',
            confirmButtonText: 'OK',
          });


        }

         await Swal.fire({
          title: 'Sucesso!',
          text: `Item do Planejamento Orçamentário cadastrado com sucesso.`,
          icon: 'success',
          confirmButtonText: 'OK',
        });

      this.atualizarPagina.emit(true);
      this.activeModal.dismiss();
    } catch (error) {
      console.error('Erro na requisição:', error);

    }
  }
}
