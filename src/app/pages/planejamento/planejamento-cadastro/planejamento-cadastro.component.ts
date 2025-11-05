import { Gcptb060PlanejamentoItemHistoricoDTO } from './../../../models/DTOs/Gcptb060PlanejamentoItemHistoricoDTO';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  RequiredValidator,
  Validators,
} from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import {
  ClassificacaoPlanejamentoResponse,
  DemandaTipoResponse,
  ObjetivoEstrategicoResponse,
  PlanejamentoOrcamentarioResponse,
  PlanejamentoOrcamentarioConsultaResponse,
  PlanejamentoStatusResponse,
  PlanejamentoTipoResponse,
  //PlanejamentoItemResponse,
  PrevisaoDesembolsoResponse,
} from 'src/app/models/planejamento-response';
import { Endpoints } from 'src/app/shared/enums/endpoints';
import { ApiResponse } from 'src/app/models/api-response';
import { Filial } from 'src/app/models/filial';
import { Rubrica } from 'src/app/models/rubrica';
import { ContratoResponse } from 'src/app/models/contrato-response';
import { PlanejamentoOrcamentarioItemRequest } from 'src/app/models/planejamento-request';
import { Orcamento } from 'src/app/models/orcamento';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Select2Data, Select2Option } from 'ng-select2-component';
import {
  ActionPolicies,
  ModuleEnum,
  PageAction,
  PerfisEnum,
  TokenStorageService,
} from 'src/app/services/token-storage.service';
import { Gcpvw008Mensalizacao } from 'src/app/models/Gcptb001ContratoResponse';
import Swal from 'sweetalert2';
import { IUser } from 'src/app/models/DTOs/IUser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Gcptb060PlanejamentoItemHistoricoResponse } from 'src/app/models/response/Gcptb060PlanejamentoItemHistoricoResponse';

@Component({
  selector: 'app-planejamento-cadastro',
  templateUrl: './planejamento-cadastro.component.html',
  styleUrls: ['./planejamento-cadastro.component.scss'],
})
export class PlanejamentoCadastroComponent implements OnInit {
  @Input() public nuPlanejamento: any;
  @Input() public nuPlanejamentoOrcamento: any;
  @Input() public tipoModal: string;
  @Input() public isEditable: boolean;
  @Input() public isCadastro: boolean;
  @Output() atualizarPagina: EventEmitter<boolean> = new EventEmitter();
  gcpvw008Mensalizacao: Gcpvw008Mensalizacao[] = [];
  gcpvw008MensalizacaoAnoExercicio: Gcpvw008Mensalizacao[] = [];
  rubricas: Gcpvw008Mensalizacao[] = [];

  public form: FormGroup;
  public listaContratos: ContratoResponse[] = [];
  public listaFiliais: Filial[] = [];
  public listaRubricas: Rubrica[] = [];
  public listaExercicios: Orcamento[] = [];
  public listaTiposPlanejamento: PlanejamentoTipoResponse[] = [];
  public listaTiposDemanda: DemandaTipoResponse[] = [];
  public listaClassificacoesPlanejamentoDigital: ClassificacaoPlanejamentoResponse[] =
    [];
  public listaClassificacoesPlanejamentoDigitalFiltrada: ClassificacaoPlanejamentoResponse[] =
    [];
  classificacaoPlanejamentoManutencao: ClassificacaoPlanejamentoResponse;
  public listaStatusPlanejamento: PlanejamentoStatusResponse[] = [];
  public listaObjetivosEstrategicosPdti: ObjetivoEstrategicoResponse[] = [];
  public listaObjetivosEstrategicosPei: ObjetivoEstrategicoResponse[] = [];
  public planejamento: PlanejamentoOrcamentarioResponse;
  public planejamentoEditar: PlanejamentoOrcamentarioResponse;
  public listaDigital: any[] = [{ id: 1, tipo: 'Digital' }, { id: 2, tipo: 'Digital - TD' }, { id: 3, tipo: 'Não Digital' }]
  public digitalOpSelec: string;
  totalRubrica: number;
  public selectTab: number = 0;
  loading: boolean = true;
  permissions: ActionPolicies;

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
  public isPerfilPrivilegiado = false;

  selectContratos: Select2Data;
  selectedContrato: string = null;

  submitted = false;

  /**
   * INICIO ATRIBUTOS HISTORICO
   */

  public filtroRegistros: any = {
    pageNumber: 1,
    pageSize: 10,
    NuContrato: null,
    NuTipoDemanda: null,
    NuPlanejamento: null,
    TpOperacao: null
  };


  ListaPlanejamentoItemHistorico: Gcptb060PlanejamentoItemHistoricoDTO[] = [];
  totalRegistros: number = 10;
  numeroContrato = 'SIGVC-2025';
  dialogVisible = false;
  selectedDiff: any = null;
  filtrosSelecionado: string | null = null;
  eventosFiltrados = [...this.ListaPlanejamentoItemHistorico];

  /**
   * FIM HISTORICO
   */

  constructor(
    private http: HttpClient,
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private toastr: ToastrService,
    public token: TokenStorageService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.obterPermissoes();
    this.definirPageAction();

    this.formulario();

    this.obterContratos();
    this.obterFiliais();
    this.obterRubricas();
    this.obterExercicios();
    this.obterTiposPlanejamento();
    this.obterTiposDemanda();
    this.obterClassificacoesPlanejamento();
    this.obterStatusPlanejamento();
    this.obterObjetivosEstrategicosPdti();
    this.obterObjetivosEstrategicosPei();

    if (this.nuPlanejamentoOrcamento == null) {
      this.nuPlanejamentoOrcamento = this.nuPlanejamento?.nU_PLANEJAMENTO;
    }

    const nU_ORC = this.nuPlanejamento?.nU_ORC;

    if (nU_ORC != null) {
      this.obterPlanejamento();
    } else {
      //this.nuPlanejamento.nU_ORC = 0;
      this.editarTextos();
    }
    this.loading = false;

    ///efetua as validações de perfil
    if (this.nuPlanejamento?.cO_FILIAL == this.currentProfile.coUnidade
      || this.currentProfile.noPerfil == PerfisEnum.Orcamento
      || this.currentProfile.noPerfil == PerfisEnum.Administrador)
      this.isPerfilPrivilegiado = true;

    this.obterPlanejamentoItemHistorico();
  }

  verDetalhes(event: any) {
    this.selectedDiff = event;
    this.dialogVisible = true;
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
          console.log(this.filtroRegistros.TpOperacao, "OPERACAO")
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


  // filtrarEventos() {
  //   this.eventosFiltrados = this.filtrosSelecionado
  //     ? this.ListaPlanejamentoItemHistorico.filter((e) => e.tpOperacao === this.filtrosSelecionado)
  //     : [...this.ListaPlanejamentoItemHistorico];
  // }

  filtros = [
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

  /**
 *
 * FIM HISTORICO METODOS
 */


  obterPermissoes() {
    this.permissions = this.token.getActionPolicies(ModuleEnum.Planejamento);
    this.currentProfile = this.token.obterUsuarioEstruturado() as IUser;
    if (this.nuPlanejamento?.cO_FILIAL == this.currentProfile.coUnidade
      || this.currentProfile.noPerfil == PerfisEnum.Orcamento
      || this.currentProfile.noPerfil == PerfisEnum.Administrador)
      this.isPerfilPrivilegiado = true;
  }

  definirPageAction() {
    if (!this.isEditable) {
      this.currentPageAction = PageAction.Consultar;
    } else {
      if (this.nuPlanejamento) {
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
        : `${element.subTitle} ${this.nuPlanejamento?.nU_ORC}`;
    this.actionButtonLabel = element.actionButtonLabel;

  }

  formulario() {
    this.form = this.formBuilder.group({
      nuPlanejamentoOrcamentario: [0],
      coPlanejamentoOrcamentario: [''],
      nuAno: new FormControl({ value: '', disabled: !this.isEditable }, [
        Validators.required,
      ]),
      nuFilial: new FormControl({ value: '', disabled: !this.isEditable }, [
        Validators.required,
      ]),
      deObjeto: new FormControl({ value: '', disabled: !this.isEditable }, [
        Validators.required,
      ]),
      deJustificativa: new FormControl(
        { value: '', disabled: !this.isEditable },
        [Validators.required]
      ),
      deObservacao: new FormControl({ value: '', disabled: !this.isEditable }, [
        Validators.required,
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
        [Validators.required]
      ),
      noCriador: [''],
      dhCadastro: [''],
      icServicoContinuo: new FormControl({ value: 0, disabled: true }, [
        Validators.required,
      ]),
      icDigital: new FormControl({ value: '', disabled: !this.isEditable }, [
        Validators.required,
      ]),
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

    // Habilita todos os controles dentro do FormArray previsoesDesembolso
     const previsoesArray = this.form.get('previsoesDesembolso') as FormArray;
    if (previsoesArray) {
      previsoesArray.controls.forEach((grupo) => {
        if (grupo instanceof FormGroup) {
          Object.keys(grupo.controls).forEach((childKey) => {
            const childControl = grupo.get(childKey);
            if (childControl?.disabled && childKey != 'vrTotalRubrica') {
              childControl.enable();
            }
          });
        }
      });
    }
    this.onPlanejadoParaChange();
  }

  get f() {
    return this.form.controls;
  }

  get previsoesDesembolso(): FormArray {
    return this.form.get('previsoesDesembolso') as FormArray;
  }

  currencyOptions = {
    prefix: 'R$ ',
    thousands: '.',
    decimal: ',',
    precision: 2,
    allowNegative: false,
    inputMode: 'numeric',
  };

  adicionarPrevisaoDesembolso(desabilitar: boolean) {
    this.previsoesDesembolso.push(this.novaPrevisaoDesembolso(desabilitar));
  }

  excluirPrevisaoDesembolso(i: number) {
    this.previsoesDesembolso.removeAt(i);
    this.somaValorTotalPlanejamentoOrcamentario();
  }

  novaPrevisaoDesembolso(desabilitar: boolean): FormGroup {
    return new FormGroup({
      nuPrevisaoDesembolso: new FormControl(0, [Validators.required]),
      nuPlanejamentoOrcamentario: new FormControl(
        this.planejamento?.nuPlanejamentoOrcamentario ?? 0,
        [Validators.required]
      ),
      nuRubrica: new FormControl([Validators.required]),
      nuPreComprometimento: new FormControl(),
      nuReserva: new FormControl(),
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

  // async onContratoChange(e: { value: any }): Promise<void> {
  //   this.form.controls['nuContrato'].setValue(e.value);
  // }

  onPlanejadoParaChange() {
    if (this.form.controls['nuDemandaTipo'].value == 4) {
      this.form.controls['icServicoContinuo'].setValue(1);
    } else {
      this.form.controls['icServicoContinuo'].setValue(0);
    }
  }

  onIsServicoContinuoChange($event: MatSlideToggleChange) {
    if ($event.checked) {
      this.form.controls['icServicoContinuo'].setValue(1);
    } else {
      this.form.controls['icServicoContinuo'].setValue(0);
    }
  }

  onValorRubricaChange(i: number) {
    const prevDes = this.previsoesDesembolso.at(i) as FormGroup;

    const limparValor = (valor: string): number => {
      if (!valor) return 0;
      return parseFloat(
        valor?.toString().replace('R$ ', '').replace(/\./g, '').replace(',', '.')
      ) || 0;
    };

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

    prevDes.get('vrTotalRubrica')?.setValue(total.toFixed(2));

    this.somaValorTotalPlanejamentoOrcamentario();
  }

  limparValor = (valor: string): number => {
    if (!valor) return 0;
    return (
      parseFloat(
        (valor+"").replace('R$ ', '').replace(/\./g, '').replace(',', '.')
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

  ajustarCentavos(index: number, campo: string): void {
    const grupo = this.previsoesDesembolso.at(index) as FormGroup;
    const valor = grupo.get(campo)?.value;

    if (!valor || typeof valor !== 'string') return;

    // Remove prefixo e separadores para verificar se é número
    const valorLimpo = valor.replace('R$ ', '').replace(/\./g, '').replace(',', '.');
    const numero = parseFloat(valorLimpo);

    if (!isNaN(numero)) {
      const partes = valorLimpo.split('.');
      const temCentavos = partes.length > 1;

      if (!temCentavos || partes[1].length < 2) {
        // Garante que o número tenha sempre duas casas decimais
        const valorFormatado = numero.toFixed(2).replace('.', ',');
        grupo.get(campo)?.setValue(valorFormatado, { emitEvent: true });
      }
    }
  }

  onContratoChange(event: any) {
    //Limpa formulário antes de preencher os campos.
    this.formulario();
    const nuContrato = event.target.value;
    if (nuContrato) {
      this.obterDadosContrato(nuContrato);
    }
  }

  async obterDadosContrato(nuContrato: string) {
    try {
      const response = await this.apiService.get<
        ApiResponse<PlanejamentoOrcamentarioConsultaResponse>
      >(
        `${Endpoints.URL_PLANEJAMENTO_ORCAMENTO}/contrato?nuContrato=${nuContrato}`
      );
      if (response.succeeded && response.data) {
        this.form.patchValue({
          nuContrato: response.data.contrato,
          coContrato: response.data.nU_CONTRATO,
          nuFilial: response.data.nU_FILIAL,
          coFilial: response.data.cO_FILIAL,
          deObjeto: response.data.objeto,
          nuPlanejamentoStatus: response.data.status,
          nuObjetivoEstrategicoPdti: response.data.objetivO_PDTIC,
          nuObjetivoEstrategicoPei: response.data.objetivO_PEI,
          nuPlanejamentoTipo: response.data.tipO_PLANEJAMENTO,
          deJustificativa: response.data.objeto,
        });
      }
    } catch (error) {
      console.error('Erro ao obter dados do contrato', error);
    }
  }

  public async obterPlanejamento(): Promise<void> {
    try {
      const response = await this.apiService.get<
        ApiResponse<PlanejamentoOrcamentarioResponse>
      >(`${Endpoints.URL_ORCAMENTO}/ObterConsultaGeral?nuContrato=` + this.nuPlanejamento.nU_CONTRATO + `&nuTipoDemanda=` + this.nuPlanejamento.nU_TIPO_DEMANDA + `&nuFilial=` + this.nuPlanejamento.nU_FILIAL + `&nuPlanejamento=` + this.nuPlanejamento.nU_PLANEJAMENTO);

      this.planejamento = response.data[0];
      if (this.planejamento) {
        this.form.controls['nuPlanejamentoOrcamentario'].setValue(
          this.nuPlanejamento.nU_PLANEJAMENTO
        );
        this.form.controls['coPlanejamentoOrcamentario'].setValue(
          this.nuPlanejamento.coPlanejamentoOrcamentario
        );
        //this.form.controls['nuAno'].setValue("10");//this.planejamento.coExercicio);

        const anoSelecionado = this.listaExercicios.find(
          (ano) =>
            ano.nuAnoOrcamento.toString() ===
            this.planejamento.coExercicio.toString()
        );
        if (anoSelecionado) {
          this.form.controls['nuAno'].setValue(anoSelecionado.nuOrcamento);
        }

        this.form.controls['nuFilial'].setValue(this.planejamento.nuFilial);
        this.form.controls['deObjeto'].setValue(this.planejamento.deObjeto);
        this.form.controls['deJustificativa'].setValue(
          this.planejamento.deJustificativa
        );
        this.form.controls['deObservacao'].setValue(this.planejamento.deObjeto);
        this.form.controls['nuPlanejamentoStatus'].setValue(
          this.planejamento.nuStatusPlanejamentoItem
        );


        this.form.controls['nuDemandaTipo'].setValue(
          this.planejamento.nuTipoDemanda
        );
        this.onPlanejadoParaChange();
        this.form.controls['nuContrato'].setValue(this.planejamento.nuContrato);
        if (this.planejamento.cO_CONTRATO)
          this.form.controls['coContrato'].setValue(
            this.nuPlanejamento.cO_CONTRATO
          );
        this.form.controls['nuObjetivoEstrategicoPdti'].setValue(
          this.planejamento.nuObjetivoPdtic
        );
        this.form.controls['nuObjetivoEstrategicoPei'].setValue(
          this.planejamento.nuObjetivoPei
        );
        if (this.nuPlanejamento.dE_DEMANDA == 'Digital') {
          this.form.controls['icDigital'].setValue(1);
        } else if (this.nuPlanejamento.dE_DEMANDA == 'Digital - TD') {
          this.form.controls['icDigital'].setValue(2);
        } else {
          this.form.controls['icDigital'].setValue(3);
        }
        this.form.controls['nuClassificacaoPlanejamento'].setValue(
          this.planejamento.nuClassificacaoPlanejamento
        );
        this.form.controls['nuPlanejamentoTipo'].setValue(
          this.planejamento.nuPlanejamentoTipo
        );

        this.form.controls['noCriador'].setValue(this.planejamento.coMatricula);
        this.form.controls['dhCadastro'].setValue(
          this.planejamento.dhCadastro.toString().substring(8, 10) +
          '/' +
          this.planejamento.dhCadastro.toString().substring(5, 7) +
          '/' +
          this.planejamento.dhCadastro.toString().substring(0, 4)
        );

        if (this.planejamento) {
          const responseVlr = await this.apiService.get<
            ApiResponse<PrevisaoDesembolsoResponse[]>
          >(
            `${Endpoints.URL_ORCAMENTO}/ObterConsultaPorRubrica?nuContrato=` +
            this.nuPlanejamento.nU_CONTRATO +
            `&nuTipoDemanda=` +
            this.nuPlanejamento.nU_TIPO_DEMANDA +
            `&nuFilial=` +
            this.nuPlanejamento.nU_FILIAL +
            `&nuPlanejamento=` +
            this.nuPlanejamento.nU_PLANEJAMENTO
          );
          if (responseVlr.data) {

            this.planejamento.gcptb027PrevisoesDesembolso = responseVlr.data;
          }



          if (this.planejamento.gcptb027PrevisoesDesembolso != undefined) {
            this.previsoesDesembolso.clear();
            this.planejamento.gcptb027PrevisoesDesembolso.map((x) => {
              const previsaoDesembolso = new FormGroup({
                nuPrevisaoDesembolso: new FormControl(x.nuPrevisaoDesembolso),
                nuPlanejamentoOrcamentario: new FormControl(
                  //x.nuPlanejamentoOrcamentario,
                  this.nuPlanejamento.nU_ORC,
                  [Validators.required]
                ),
                nuRubrica: new FormControl(
                  { value: x.nuRubrica, disabled: !this.isEditable },
                  [Validators.required]
                ),
                nuPlanejamentoItem: new FormControl({
                  value: x.nuPlanejamentoItem,
                  disabled: true,
                }),
                vrJaneiro: new FormControl(
                  { value: x.vrJaneiro, disabled: !this.isEditable },
                  [Validators.required]
                ),
                vrFevereiro: new FormControl(
                  { value: x.vrFevereiro, disabled: !this.isEditable },
                  [Validators.required]
                ),
                vrMarco: new FormControl(
                  { value: x.vrMarco, disabled: !this.isEditable },
                  [Validators.required]
                ),
                vrAbril: new FormControl(
                  { value: x.vrAbril, disabled: !this.isEditable },
                  [Validators.required]
                ),
                vrMaio: new FormControl(
                  { value: x.vrMaio, disabled: !this.isEditable },
                  [Validators.required]
                ),
                vrJunho: new FormControl(
                  { value: x.vrJunho, disabled: !this.isEditable },
                  [Validators.required]
                ),
                vrJulho: new FormControl(
                  { value: x.vrJulho, disabled: !this.isEditable },
                  [Validators.required]
                ),
                vrAgosto: new FormControl(
                  { value: x.vrAgosto, disabled: !this.isEditable },
                  [Validators.required]
                ),
                vrSetembro: new FormControl(
                  { value: x.vrSetembro, disabled: !this.isEditable },
                  [Validators.required]
                ),
                vrOutubro: new FormControl(
                  { value: x.vrOutubro, disabled: !this.isEditable },
                  [Validators.required]
                ),
                vrNovembro: new FormControl(
                  { value: x.vrNovembro, disabled: !this.isEditable },
                  [Validators.required]
                ),
                vrDezembro: new FormControl(
                  { value: x.vrDezembro, disabled: !this.isEditable },
                  [Validators.required]
                ),
                nuPreComprometimento: new FormControl(
                  { value: x.nuPreComprometimento, disabled: !this.isEditable },
                  [Validators.required]
                ),
                nuReserva: new FormControl(
                  { value: x.nuReserva, disabled: !this.isEditable },
                  [Validators.required]
                ),
                vrTotalRubrica: new FormControl(
                  {
                    value:
                      x.vrJaneiro +
                      x.vrFevereiro +
                      x.vrMarco +
                      x.vrAbril +
                      x.vrMaio +
                      x.vrJunho +
                      x.vrJulho +
                      x.vrAgosto +
                      x.vrSetembro +
                      x.vrOutubro +
                      x.vrNovembro +
                      x.vrDezembro,
                    disabled: true,
                  },
                  [Validators.required]
                ),
              });


              this.previsoesDesembolso.push(previsaoDesembolso);

              const totalDesembolso =
                this.planejamento.gcptb027PrevisoesDesembolso.reduce(
                  (soma, item) => soma + item['vrPlanejamentoTotal'],
                  0
                );

              this.form.controls['vrTotalOrcamentoPlanejamento'].setValue(totalDesembolso);
            });
          }
        }
      } else {
        this.toastr.error('Não retornou dados para este detalhamento. Tente novamente mais tarde.', 'Erro');
      }
    } catch (error) {
      console.error(error);
    }

    this.editarTextos();
  }

  //alterar para ativos - ### inviabiliza visualizar os não ativos #### pediu ta feito
  public async obterContratos(): Promise<void> {
    try {
      if (this.tipoModal !== 'adicionar') {
        const response = await this.apiService.get<
          ApiResponse<ContratoResponse[]>
        >(`${Endpoints.URL_CONTRATOS_ATIVOS}`); //somente ativos
        this.listaContratos = response.data;
        this.selectContratos = this.listaContratos
          .sort((a, b) => a.coContrato.localeCompare(b.coContrato))
          .map(
            (m) =>
            ({
              value: m.nuContrato,
              label: m.coContrato + ' - ' + m.noEmpresa,
            } as Select2Option)
          );
      } else {
        const response = await this.apiService.get<
          ApiResponse<ContratoResponse[]>
        >(`${Endpoints.URL_PLANEJAMENTO_ORCAMENTO}/obter-todos`);

        this.listaContratos = response.data;
      }
    } catch (error) { }
  }

  public async obterFiliais(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<Filial[]>>(
        `${Endpoints.URL_FILIAL}/ativos`
      );

      this.listaFiliais = response.data.filter((x) => x.nuFilialPai != null);
    } catch (error) {
      console.error(error);
    }
  }

  public async obterRubricas(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<Rubrica[]>>(
        `${Endpoints.URL_RUBRICA}/ativas`
      );

      this.listaRubricas = response.data;
    } catch (error) {
      console.error(error);
    }
  }

  public async obterExercicios(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<Orcamento[]>>(
        `${Endpoints.URL_PAGAMENTO}/orcamentos`
      );

      this.listaExercicios = response.data.filter(
        (f) => f.nuAnoOrcamento >= new Date().getFullYear()
      );
    } catch (error) {
      console.error(error);
    }
  }

  public async obterTiposPlanejamento(): Promise<void> {
    try {
      const response = await this.apiService.get<
        ApiResponse<PlanejamentoTipoResponse[]>
      >(`${Endpoints.URL_ORCAMENTO}/tipos-planejamento`);

      this.listaTiposPlanejamento = response.data;
    } catch (error) {
      console.error(error);
    }
  }

  public async obterTiposDemanda(): Promise<void> {
    try {
      const response = await this.apiService.get<
        ApiResponse<DemandaTipoResponse[]>
      >(`${Endpoints.URL_ORCAMENTO}/tipos-demanda`);

      this.listaTiposDemanda = response.data;
    } catch (error) {
      console.error(error);
    }
  }

  public async obterClassificacoesPlanejamento(): Promise<void> {
    try {
      const response = await this.apiService.get<
        ApiResponse<ClassificacaoPlanejamentoResponse[]>
      >(`${Endpoints.URL_ORCAMENTO}/classificacao-planejamento`);
      this.listaClassificacoesPlanejamentoDigital = response.data;
    } catch (error) {
      console.error(error);
    }
  }

  public async obterStatusPlanejamento(): Promise<void> {
    try {
      const response = await this.apiService.get<
        ApiResponse<PlanejamentoStatusResponse[]>
      >(`${Endpoints.URL_ORCAMENTO}/status-planejamento`);

      this.listaStatusPlanejamento = response.data;
    } catch (error) {
      console.error(error);
    }
  }

  public async obterPlanejamentoItemHistorico(): Promise<void> {


    try {


      // const queryParams = new URLSearchParams({
      //   paginaAtual: this.filtroRegistros.paginaAtual,
      //   tamanhoPagina: this.filtroRegistros.tamanhoPagina,
      //   nuPlanejamento: this.filtroRegistros.nuPlanejamento,
      //   nuPlanejamentoItem: this.filtroRegistros.nuPlanejamentoItem || ''
      // });



      //   const response = await this.apiService.get<ApiResponse<Gcptb060PlanejamentoItemHistoricoResponse>>(
      //   `v1/PlanejamentoOrcamentario/obter-historico-planejamento-item?NuPlanejamento=${this.nuPlanejamento.nU_PLANEJAMENTO}&NuContrato=${this.nuPlanejamento.nU_CONTRATO}&NuTipoDemanda=${this.nuPlanejamento.nU_TIPO_DEMANDA}`
      // );

      this.filtroRegistros.NuContrato = this.nuPlanejamento?.nU_CONTRATO;
      this.filtroRegistros.NuPlanejamento = this.nuPlanejamento?.nU_PLANEJAMENTO;
      this.filtroRegistros.NuTipoDemanda = this.nuPlanejamento?.nU_TIPO_DEMANDA;
      const response = await this.apiService.get<ApiResponse<Gcptb060PlanejamentoItemHistoricoResponse>>(
        `v1/PlanejamentoOrcamentario/obter-historico-planejamento-item`, this.filtroRegistros)

      this.ListaPlanejamentoItemHistorico = response.data.listaHistorico;
    } catch (error) {
      console.error(error);
    }

  }

 public async obterObjetivosEstrategicosPdti(): Promise<void> {
  try {
    const response = await this.apiService.get<
      ApiResponse<ObjetivoEstrategicoResponse[]>
    >(`${Endpoints.URL_ORCAMENTO}/objetivos-estrategicos-pdti`);

    // Limita o texto de cada objetivo a 70 caracteres
    this.listaObjetivosEstrategicosPdti = response.data.map(obj => ({
      ...obj,
      deObjetivoEstrategico: obj.deObjetivoEstrategico?.slice(0, 70) +
        (obj.deObjetivoEstrategico?.length > 70 ? '...' : '')
    }));
  } catch (error) {
    console.error(error);
  }
}

  public async obterObjetivosEstrategicosPei(): Promise<void> {
    try {
      const response = await this.apiService.get<
        ApiResponse<ObjetivoEstrategicoResponse[]>
      >(`${Endpoints.URL_ORCAMENTO}/objetivos-estrategicos-pei`);

      this.listaObjetivosEstrategicosPei = response.data;
    } catch (error) {
      console.error(error);
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


  public async Cadastrar(): Promise<void> {
    try {

      this.submitted = true;
      if (this.form.invalid) {
        const invalids = [];
        const controls = this.form.controls;
        for (const name in controls) {
          if (controls[name].invalid) invalids.push(name);
        }
        if (this.form.controls['deObjeto'].value == '') {

          this.toastr.error('Informe o objeto.', 'Erro');
        }
        if (this.form.controls['deJustificativa'].value == '') {
          this.toastr.error('Informe a justificativa.', 'Erro');
        }

        return;
      } else if (
        this.form.controls['nuClassificacaoPlanejamento'].value == 1 &&
        (this.form.controls['icDigital'].value == 1 ||
          this.form.controls['icDigital'].value == 2)
      ) {
        this.toastr.error(
          'Informe a categoria da classificação digital.',
          'Erro'
        );
        return;
      } else if (this.form.controls['deObjeto'].value == null) {
        this.toastr.error('Informe o objeto.', 'Erro');
      }

      var codigoContrato = this.form.controls['coContrato'].value;
      this.form.controls['nuContrato'].setValue(codigoContrato);
      //console.log(codigoContrato, this.form.controls['nuContrato'], "valores");


      var obj = this.form.value;

      var lista: PlanejamentoOrcamentarioItemRequest[] = [];
      const previsoes = obj.previsoesDesembolso;

      if(previsoes.length > 0){

        for (var p in previsoes) {

        var item: PlanejamentoOrcamentarioItemRequest = {
          NuPlanejamentoItem: 0,
          NuPlanejamento: this.nuPlanejamentoOrcamento,
          NuContrato: obj.nuContrato,
          NuFilial: obj.nuFilial,
          NuRubrica: previsoes[p].nuRubrica,
          NuStatusPlanejamentoItem: obj.nuPlanejamentoStatus,
          NuTipoDemanda: obj.nuDemandaTipo,
          NuVigencia: obj.nuAno,

          DeObjeto: obj.deObjeto,
          DeObjetivoPDTIC: obj.nuObjetivoEstrategicoPdti?.toString(),
          DeObjetivoPEI: obj.nuObjetivoEstrategicoPei?.toString(),
          DeJustificativa: obj.deJustificativa,

          NuPreComprometimento: Number(previsoes[p].nuPreComprometimento),
          NuReserva: Number(previsoes[p].nuReserva),

          VrPlanejamentoItem: this.parseDecimal(previsoes[p].vrTotalRubrica),
          VrJaneiro: this.parseDecimal(previsoes[p].vrJaneiro),
          VrFevereiro: this.parseDecimal(previsoes[p].vrFevereiro),
          VrMarco: this.parseDecimal(previsoes[p].vrMarco),
          VrAbril: this.parseDecimal(previsoes[p].vrAbril),
          VrMaio: this.parseDecimal(previsoes[p].vrMaio),
          VrJunho: this.parseDecimal(previsoes[p].vrJunho),
          VrJulho: this.parseDecimal(previsoes[p].vrJulho),
          VrAgosto: this.parseDecimal(previsoes[p].vrAgosto),
          VrSetembro: this.parseDecimal(previsoes[p].vrSetembro),
          VrOutubro: this.parseDecimal(previsoes[p].vrOutubro),
          VrNovembro: this.parseDecimal(previsoes[p].vrNovembro),
          VrDezembro: this.parseDecimal(previsoes[p].vrDezembro),

          NuUsuario: this.token.getUser()?.nuUsuario ?? 0,
          DhCadastro: this.form.value.dhCadastro ?? new Date().toISOString(),
          DhExclusao: undefined,
          NuUsuarioExclusao: 0,
          NuUsuarioAlteracao: this.token.getUser()?.nuUsuario ?? 0,
          DhAlteracao: new Date(),
        };

        lista.push(item);
      }

        // const response = await this.apiService.post<any>(
        //   `${Endpoints.URL_ORCAMENTO_CADASTRO}`,
        //   lista
        // );

        this.cadastrarItem(lista)

        this.atualizarPagina.emit(true);
        this.activeModal.dismiss();
      }
      else
      {
          this.toastr.warning('Previsão de desembolso obrigatório', 'Aviso');
      }
    } catch (error) {
      this.atualizarPagina.emit(false);
    }
  }

  public async Alterar(): Promise<void> {
    try {
      this.submitted = true;


      var obj = this.form.value;
      var lista: PlanejamentoOrcamentarioItemRequest[] = [];

      if (this.form.invalid) {
        const itemErro = [];
        const controls = this.form.controls;

        for (const name in controls) {

          if (controls[name].invalid) itemErro.push(name);
        }
        if (itemErro.find((item) => item === 'previsoesDesembolso')) {
          this.toastr.error(
            'Informe a previsão de desembolso por completo.',
            'Erro'
          );
          return;
        }
        if (
          this.form.controls['deObjeto'].value == '' ||
          this.form.controls['deObjeto'].value == null
        ) {

          this.toastr.error('Informe o objeto.', 'Erro');
          return;
        }
        if (
          this.form.controls['deJustificativa'].value == '' ||
          this.form.controls['deJustificativa'].value == null
        ) {
          this.toastr.error('Informe a justificativa.', 'Erro');
          return;
        }

        return;
      } else if (
        this.form.controls['nuClassificacaoPlanejamento'].value == 1 &&
        (this.form.controls['icDigital'].value == 1 ||
          this.form.controls['icDigital'].value == 2)
      ) {
        this.toastr.error(
          'Informe a categoria da classificação digital.',
          'Erro'
        );
        return;
      } else if (this.form.controls['deObjeto'].value == null) {
        this.toastr.error('Informe o objeto.', 'Erro');
        return;
      } else if (
        this.form.controls['nuClassificacaoPlanejamento'].value == null
      ) {

      }

      if (
        this.form.value.nuClassificacaoPlanejamento === 1 &&
        (this.form.value.icDigital === 1 || this.form.value.icDigital === 2)
      ) {
        this.toastr.error(
          'Informe a categoria da classificação digital.',
          'Erro'
        );
        return;
      }
      //regra: maquina de status
      if (this.currentProfile.noPerfil == PerfisEnum.TorresGEGAT || this.currentProfile.noPerfil == PerfisEnum.GestorOperacional /* || this.currentProfile.noPerfil == PerfisEnum.UnidadeDemandante*/) {
        if (this.nuPlanejamento == 5 && this.form.value.nuPlanejamentoStatus != 7) {//Criado para Revisado
          this.toastr.error(
            'Status só poderá ser atualizado de Criado para Revisado e de Avaliado para Ajustado. Favor ajustar e tentar novamente.',
            'Erro'
          );
          return;
        }
        if (this.nuPlanejamento == 3 && this.form.value.nuPlanejamentoStatus != 9) { //Revisado e de Avaliado
          this.toastr.error(
            'Status só poderá ser atualizado de Criado para Revisado e de Avaliado para Ajustado. Favor ajustar e tentar novamente.',
            'Erro'
          );
          return;
        }
      }
      const previsoes = obj.previsoesDesembolso;


      for (var p in previsoes) {

        var item: PlanejamentoOrcamentarioItemRequest = {
          NuPlanejamentoItem: previsoes[p].nuPlanejamentoItem,
          NuPlanejamento: this.nuPlanejamentoOrcamento,
          NuContrato: obj.nuContrato,
          NuFilial: obj.nuFilial,
          NuRubrica: previsoes[p].nuRubrica,
          NuStatusPlanejamentoItem: obj.nuPlanejamentoStatus,
          NuTipoDemanda: obj.nuDemandaTipo,
          NuVigencia: obj.nuAno,

          DeObjeto: obj.deObjeto,
          DeObjetivoPDTIC: obj.nuObjetivoEstrategicoPdti?.toString(),
          DeObjetivoPEI: obj.nuObjetivoEstrategicoPei?.toString(),
          DeJustificativa: obj.deJustificativa,
          DeObservacao: obj.deObservacao,
          NuPreComprometimento: Number(previsoes[p].nuPreComprometimento),
          NuReserva: Number(previsoes[p].nuReserva),

          VrPlanejamentoItem: this.parseDecimal(previsoes[p].vrTotalRubrica),
          VrJaneiro: this.parseDecimal(previsoes[p].vrJaneiro),
          VrFevereiro: this.parseDecimal(previsoes[p].vrFevereiro),
          VrMarco: this.parseDecimal(previsoes[p].vrMarco),
          VrAbril: this.parseDecimal(previsoes[p].vrAbril),
          VrMaio: this.parseDecimal(previsoes[p].vrMaio),
          VrJunho: this.parseDecimal(previsoes[p].vrJunho),
          VrJulho: this.parseDecimal(previsoes[p].vrJulho),
          VrAgosto: this.parseDecimal(previsoes[p].vrAgosto),
          VrSetembro: this.parseDecimal(previsoes[p].vrSetembro),
          VrOutubro: this.parseDecimal(previsoes[p].vrOutubro),
          VrNovembro: this.parseDecimal(previsoes[p].vrNovembro),
          VrDezembro: this.parseDecimal(previsoes[p].vrDezembro),

          DhExclusao: undefined,
          NuUsuarioExclusao: null,
          NuUsuarioAlteracao: this.token.getUser()?.nuUsuario ?? 0,
          DhAlteracao: new Date(),
        };

        lista.push(item);
      }



      await this.apiService.post<any>(
        `${Endpoints.URL_ORCAMENTO_EDITA}`,
        lista
      );

      this.toastr.success('Alteração efetuada com sucesso.', 'Sucesso');
      this.atualizarPagina.emit(true);
      this.activeModal.dismiss();
    } catch (error) {
      console.error('Erro ao alterar planejamento:', error);
      this.toastr.error('Erro ao salvar alterações.', 'Erro');
      this.atualizarPagina.emit(false);
    }
  }

public async ExcluirItens(planejamento : PlanejamentoOrcamentarioResponse): Promise<void> {
    try {

      this.submitted = true;

      var lista: PlanejamentoOrcamentarioItemRequest[] = [];

      const previsoes = planejamento.gcptb027PrevisoesDesembolso;

      for (var p in previsoes) {
        var item: PlanejamentoOrcamentarioItemRequest = {
          NuPlanejamentoItem: previsoes[p].nuPlanejamentoItem,
          // NuPlanejamento: this.nuPlanejamentoOrcamento,
          // NuContrato: planejamento.nuContrato,
          // NuFilial: planejamento.nuFilial,
          // NuRubrica: previsoes[p].nuRubrica,
          NuStatusPlanejamentoItem: 10, //excluido
          // NuTipoDemanda: planejamento.nuDemandaTipo,
          // NuVigencia: planejamento.nuAno,

          // DeObjeto: planejamento.deObjeto,
          // DeObjetivoPDTIC: planejamento.nuObjetivoEstrategicoPdti?.toString(),
          // DeObjetivoPEI: planejamento.nuObjetivoEstrategicoPei?.toString(),
          // DeJustificativa: planejamento.deJustificativa,

          // NuPreComprometimento: Number(previsoes[p].nuPreComprometimento),
          // NuReserva: Number(previsoes[p].nuReserva),

          // VrPlanejamentoItem: this.parseDecimal(previsoes[p].vrTotalRubrica),
          // VrJaneiro: this.parseDecimal(previsoes[p].vrJaneiro),
          // VrFevereiro: this.parseDecimal(previsoes[p].vrFevereiro),
          // VrMarco: this.parseDecimal(previsoes[p].vrMarco),
          // VrAbril: this.parseDecimal(previsoes[p].vrAbril),
          // VrMaio: this.parseDecimal(previsoes[p].vrMaio),
          // VrJunho: this.parseDecimal(previsoes[p].vrJunho),
          // VrJulho: this.parseDecimal(previsoes[p].vrJulho),
          // VrAgosto: this.parseDecimal(previsoes[p].vrAgosto),
          // VrSetembro: this.parseDecimal(previsoes[p].vrSetembro),
          // VrOutubro: this.parseDecimal(previsoes[p].vrOutubro),
          // VrNovembro: this.parseDecimal(previsoes[p].vrNovembro),
          // VrDezembro: this.parseDecimal(previsoes[p].vrDezembro),

          DhExclusao: new Date(),
          NuUsuarioExclusao: this.token.getUser()?.nuUsuario ?? 0,
          NuUsuarioAlteracao: this.token.getUser()?.nuUsuario ?? 0,
          DhAlteracao: new Date(),
        };

        lista.push(item);
      }

      await this.apiService.post<any>(
        `${Endpoints.URL_ORCAMENTO_EDITA}`,
        lista
      );

      this.toastr.success('Exclusão efetuada com sucesso.', 'Sucesso');
      this.atualizarPagina.emit(true);
      this.activeModal.dismiss();
    } catch (error) {
      console.error('Erro ao excluir planejamento:', error);
      this.toastr.error('Erro ao salvar alterações.', 'Erro');
      this.atualizarPagina.emit(false);
    }
  }


  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }

  async buildClassificacaoPlanejamento(
    classificacao: ClassificacaoPlanejamentoResponse
  ) {
    if (classificacao.noEnquadramento == 'Digital') {
      this.listaClassificacoesPlanejamentoDigitalFiltrada =
        this.listaClassificacoesPlanejamentoDigital.filter(
          (x) => x.noEnquadramento == 'Digital'
        );
    } else if (classificacao.noEnquadramento == 'Digital - TD') {
      this.listaClassificacoesPlanejamentoDigitalFiltrada =
        this.listaClassificacoesPlanejamentoDigital.filter(
          (x) => x.noEnquadramento == 'Digital - TD'
        );
    }
  }

  async onIsDigitalChange(e: any): Promise<void> {
    const valorSelecionado = e.target.value.split(':')[0];

    if (valorSelecionado == 1) {
      this.listaClassificacoesPlanejamentoDigitalFiltrada =
        this.listaClassificacoesPlanejamentoDigital.filter(
          (x) => x.noEnquadramento == 'Digital'
        );
      this.form.controls['nuClassificacaoPlanejamento'].setValue('');
      this.form.controls[
        'nuClassificacaoPlanejamento'
      ].updateValueAndValidity();
    } else if (valorSelecionado == 2) {
      this.listaClassificacoesPlanejamentoDigitalFiltrada =
        this.listaClassificacoesPlanejamentoDigital.filter(
          (x) => x.noEnquadramento == 'Digital - TD'
        );
      this.form.controls['nuClassificacaoPlanejamento'].setValue('');
      this.form.controls[
        'nuClassificacaoPlanejamento'
      ].updateValueAndValidity();
    } else {
      this.form.controls['nuClassificacaoPlanejamento'].setValue(1);
      this.form.controls[
        'nuClassificacaoPlanejamento'
      ].updateValueAndValidity();
    }
  }

  // public async obterMensalizacaoContrato(coContrato: string): Promise<void> {
  //   try {
  //     const response = await this.apiService.get<
  //       ApiResponse<Gcpvw008Mensalizacao[]>
  //     >(`${Endpoints.URL_MENSALIZACAO}/contrato?coContrato=${coContrato}`);
  //     this.gcpvw008Mensalizacao = response.data;
  //     this.gcpvw008Mensalizacao.forEach(element => {
  //       if (element.dE_PERIODO.includes(this.planejamento.nuAno.toString())) {
  //         this.gcpvw008Mensalizacao2024.push(element)
  //       }
  //     });
  //     this.gcpvw008Mensalizacao2024.sort((a, b) => (a.dE_PERIODO < b.dE_PERIODO ? -1 : 1));
  //     this.rubricas = this.gcpvw008Mensalizacao2024.filter((item, i, arr) => arr.findIndex((t) => t.dE_RUBRICA === item.dE_RUBRICA) === i);
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }
  public async obterMensalizacaoContrato(coContrato: number): Promise<void> {
    try {
      const response = await this.apiService.get<
        ApiResponse<Gcpvw008Mensalizacao[]>
      >(`${Endpoints.URL_MENSALIZACAO}/contrato?coContrato=${coContrato}`);
      this.gcpvw008Mensalizacao = response.data;
      this.gcpvw008Mensalizacao.forEach((element) => {
        if (
          element.dE_PERIODO.includes(
            this.planejamento.gcptb010Orcamento.nuAnoOrcamento.toString()
          )
        ) {
          this.gcpvw008MensalizacaoAnoExercicio.push(element);
        }
      });

      this.gcpvw008MensalizacaoAnoExercicio.sort((a, b) =>
        a.dE_PERIODO < b.dE_PERIODO ? -1 : 1
      );
      this.rubricas = this.gcpvw008MensalizacaoAnoExercicio.filter(
        (item, i, arr) =>
          arr.findIndex((t) => t.dE_RUBRICA === item.dE_RUBRICA) === i
      );
    } catch (error) {
      console.error(error);
    }
  }

  public filtraRubrica(rubrica: string): Gcpvw008Mensalizacao[] {
    const anoPlanejamento = this.listaExercicios.filter(
      (x) => x.nuOrcamento == this.planejamento.nuAno
    )[0].nuAnoOrcamento;
    const listaFiltrada = this.gcpvw008MensalizacaoAnoExercicio.filter(
      (x) =>
        x.dE_RUBRICA == rubrica &&
        x.dE_PERIODO.includes(anoPlanejamento.toString())
    );

    this.totalRubrica = 0;

    listaFiltrada.forEach((rubricaFiltrada) => {
      this.totalRubrica += rubricaFiltrada.vR_PLANEJADO;
    });

    return listaFiltrada;
  }

  async Excluir(planejamentoOrcamentario: PlanejamentoOrcamentarioResponse) {

    const alert = await Swal.fire({
      title: '',
      text: `Deseja realmente excluir Planejamento Orçamentário Cód: ${this.nuPlanejamento?.nU_ORC}?`,
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
        // const response = await this.apiService.delete<ApiResponse<boolean>>(
        //   `${Endpoints.URL_ORCAMENTO}/` +
        //   planejamentoOrcamentario.nuPlanejamentoOrcamentario
        // );

        // this.toastr.success(
        //   `Planejamento Orçamentário cód: ${planejamentoOrcamentario.coPlanejamentoOrcamentario} excluído com sucesso.`,
        //   'Sucesso'
        // );
        this.ExcluirItens(planejamentoOrcamentario);
        setTimeout(() => {
          location.reload();
        }, 2000);
      } catch (error) {
        console.error(error, 'aquirsd');
      }
      this.loading = false;
    }
  }

  openModalPlanejamento(
    tipoModal: string,
    isEditable: boolean,
    nuPlanejamento?: number
  ) {
    /*this.activeModal.dismiss('Cross click');
    const modalRef = this.modalService.open(PlanejamentoCadastroComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      windowClass: 'custom-class',
      backdrop: 'static',
      keyboard: false,
    });

    modalRef.componentInstance.nuPlanejamento = nuPlanejamento;
    modalRef.componentInstance.isEditable = isEditable;
    modalRef.componentInstance.tipoModal = tipoModal;
    modalRef.componentInstance.atualizarPagina.subscribe((data: boolean) => {
      // if (data) {
      //   this.obterPlanejamentos();
      // }
    });*/
    if (tipoModal == 'editar') {
      this.isEditable = isEditable;
      this.formularioLivre();
    }
  }

onPreComprometimentoInput(event: Event): void {
  const value = (event.target as HTMLInputElement).value;
  const reservaInput = document.getElementById('nuReserva') as HTMLInputElement;

  if (value && value.trim() !== '') {
    reservaInput.readOnly = true; // ou reservaInput.disabled = true;
    this.form?.controls['nuReserva']?.removeValidators;
  } else {
    reservaInput.readOnly = false;
    this.form?.controls['nuReserva']?.addValidators(Validators.required);
  }
}

onReservaInput(event: Event): void {
  const value = (event.target as HTMLInputElement).value;
  const preComprometimentoInput = document.getElementById('nuPreComprometimento') as HTMLInputElement;

  if (value && value.trim() !== '') {
    preComprometimentoInput.readOnly = true; // ou reservaInput.disabled = true;
    this.form?.controls['nuPreComprometimento']?.removeValidators;
  } else {
    preComprometimentoInput.readOnly = false;
    this.form?.controls['nuPreComprometimento']?.addValidators(Validators.required);
  }


}


async cadastrarItem(lista: any): Promise<void> {
  try {
    const response = await this.apiService.post<any>(
      `${Endpoints.URL_ORCAMENTO_CADASTRO}`,
      lista
    );

    if (response?.succeeded && response.data?.succeeded) {
      const resultado = response.data.resultados?.[0];
      if (resultado?.succeeded) {
        console.log('Item cadastrado com sucesso:', resultado.nuPlanejamentoItem);
        // Aqui você pode exibir um toast, atualizar a UI, etc.
        await Swal.fire({
          title: 'Sucesso!',
          text: `Planejamento Orçamentário Cód: ${resultado.nuPlanejamentoItem} excluído com sucesso.`,
          icon: 'success',
          confirmButtonText: 'OK',
        });
      } else {
        console.warn('Falha ao cadastrar item:', resultado?.message);
        await Swal.fire({
          title: 'Erro!',
          text: 'Falha ao cadastrar item. Não foi possível concluir a operação. Verifique sua conexão ou tente novamente.',
          icon: 'error',
          confirmButtonText: 'OK',
        });

      }
    } else {
      console.error('Erro na resposta da API:', response.errors);
      await Swal.fire({
        title: 'Erro!',
        text: 'Erro na resposta da API. Não foi possível concluir a operação. Verifique sua conexão ou tente novamente.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }

  } catch (error) {
    console.error('Erro na requisição:', error);
    // Tratar erro de rede ou exceção
  }
}



}
