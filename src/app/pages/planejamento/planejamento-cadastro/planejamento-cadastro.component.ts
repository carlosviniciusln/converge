import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
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
} from 'src/app/models/planejamento-response';
import { Endpoints } from 'src/app/shared/enums/endpoints';
import { ApiResponse } from 'src/app/models/api-response';
import { Filial } from 'src/app/models/filial';
import { Rubrica } from 'src/app/models/rubrica';
import { ContratoResponse } from 'src/app/models/contrato-response';
import { Orcamento } from 'src/app/models/orcamento';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Select2Data, Select2Option } from 'ng-select2-component';
import { ActionPolicies, ModuleEnum, PageAction, TokenStorageService } from 'src/app/services/token-storage.service';
import { Gcpvw008Mensalizacao } from 'src/app/models/Gcptb001ContratoResponse';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-planejamento-cadastro',
  templateUrl: './planejamento-cadastro.component.html',
  styleUrls: ['./planejamento-cadastro.component.scss'],
})
export class PlanejamentoCadastroComponent implements OnInit {
  @Input() public nuPlanejamento: number;
  @Input() public tipoModal: string;
  @Input() public isEditable: boolean;
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
  public listaClassificacoesPlanejamentoDigital: ClassificacaoPlanejamentoResponse[] = [];
  public listaClassificacoesPlanejamentoDigitalFiltrada: ClassificacaoPlanejamentoResponse[] = [];
  classificacaoPlanejamentoManutencao: ClassificacaoPlanejamentoResponse;
  public listaStatusPlanejamento: PlanejamentoStatusResponse[] = [];
  public listaObjetivosEstrategicosPdti: ObjetivoEstrategicoResponse[] = [];
  public listaObjetivosEstrategicosPei: ObjetivoEstrategicoResponse[] = [];
  public planejamento: PlanejamentoOrcamentarioResponse;
  public listaDigital: any[] = [{ id: 1, tipo: 'Digital' }, { id: 2, tipo: 'Digital - TD' }, { id: 3, tipo: 'Não Digital' }]
  public digitalOpSelec: string;
  totalRubrica: number;
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

  selectContratos: Select2Data;
  selectedContrato: string = null;

  submitted = false;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private toastr: ToastrService,
    public token: TokenStorageService,
    private modalService: NgbModal
  ) {
    this.obterPermissoes();
  }

  ngOnInit(): void {
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

    if (this.nuPlanejamento) {
      this.obterPlanejamento();
    } else {
      this.nuPlanejamento = 0;
      this.editarTextos();
    }
  }

  obterPermissoes() {
    this.permissions = this.token.getActionPolicies(ModuleEnum.Planejamento);
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
        : `${element.subTitle} ${this.planejamento?.coPlanejamentoOrcamentario}`;
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
      deObservacao: new FormControl(
        { value: '', disabled: !this.isEditable },
        [Validators.required]
      ),
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
      nuClassificacaoPlanejamento: new FormControl(
        { value: 1, disabled: !this.isEditable },
        [Validators.required]
      ),
      nuPlanejamentoTipo: new FormControl(
        { value: '', disabled: !this.isEditable },
        [Validators.required]
      ),
      noCriador: [''],
      dhCadastro: [''],
      icServicoContinuo: new FormControl({ value: 0, disabled: true }, [
        Validators.required,
      ]),
      icDigital: new FormControl(
        { value: '', disabled: !this.isEditable },
        [Validators.required]
      ),
      previsoesDesembolso: new FormArray([]),
      vrTotalOrcamentoPlanejamento: new FormControl(
        { value: 0, disabled: true },
        [Validators.required]
      ),
    });
  }

  get f() {
    return this.form.controls;
  }

  get previsoesDesembolso(): FormArray {
    return this.form.get('previsoesDesembolso') as FormArray;
  }

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
      nuRubrica: new FormControl(0, [Validators.required]),
      nuPreComprometimento: new FormControl(0, [Validators.required]),
      vrPreComprometimento: new FormControl(0, [Validators.required]),
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
    var prevDes = <FormArray>this.previsoesDesembolso.at(i);
    prevDes.controls['vrTotalRubrica'].setValue(
      prevDes.controls['vrJaneiro'].value +
      prevDes.controls['vrFevereiro'].value +
      prevDes.controls['vrMarco'].value +
      prevDes.controls['vrAbril'].value +
      prevDes.controls['vrMaio'].value +
      prevDes.controls['vrJunho'].value +
      prevDes.controls['vrJulho'].value +
      prevDes.controls['vrAgosto'].value +
      prevDes.controls['vrSetembro'].value +
      prevDes.controls['vrOutubro'].value +
      prevDes.controls['vrNovembro'].value +
      prevDes.controls['vrDezembro'].value
    );
    this.somaValorTotalPlanejamentoOrcamentario();
  }

  somaValorTotalPlanejamentoOrcamentario() {
    var vrTotalOrcamentoPlanejamentoTemp = 0;

    const previsoesDesembolso = this.form.get(
      'previsoesDesembolso'
    ) as FormArray;
    previsoesDesembolso.controls.forEach((element) => {
      vrTotalOrcamentoPlanejamentoTemp += element.get('vrTotalRubrica').value;
    });

    this.form.controls['vrTotalOrcamentoPlanejamento'].setValue(
      vrTotalOrcamentoPlanejamentoTemp
    );
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
      >(`${Endpoints.URL_PLANEJAMENTO_ORCAMENTO}/contrato?nuContrato=${nuContrato}`);

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
          deJustificativa: response.data.objeto
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
      >(`${Endpoints.URL_ORCAMENTO}/` + this.nuPlanejamento);

      this.planejamento = response.data;
      this.form.controls['nuPlanejamentoOrcamentario'].setValue(
        response.data.nuPlanejamentoOrcamentario
      );
      this.form.controls['coPlanejamentoOrcamentario'].setValue(
        response.data.coPlanejamentoOrcamentario
      );
      this.form.controls['nuAno'].setValue(response.data.nuAno);
      this.form.controls['nuFilial'].setValue(response.data.nuFilial);
      this.form.controls['deObjeto'].setValue(response.data.deObjeto);
      this.form.controls['deJustificativa'].setValue(
        response.data.deJustificativa
      );
      this.form.controls['deObservacao'].setValue(
        response.data.deObservacao
      );
      this.form.controls['nuPlanejamentoStatus'].setValue(
        response.data.nuPlanejamentoStatus
      );
      this.form.controls['nuDemandaTipo'].setValue(response.data.nuDemandaTipo);
      this.onPlanejadoParaChange();
      this.form.controls['nuContrato'].setValue(response.data.nuContrato);
      if (response.data.gcptb001Contrato?.coContrato)
        this.form.controls['coContrato'].setValue(
          response.data.gcptb001Contrato.coContrato
        );
      this.form.controls['nuObjetivoEstrategicoPdti'].setValue(
        response.data.nuObjetivoEstrategicoPdti
      );
      this.form.controls['nuObjetivoEstrategicoPei'].setValue(
        response.data.nuObjetivoEstrategicoPei
      );
      if (response.data.gcptb024ClassificacaoPlanejamento.noEnquadramento == 'Digital') {
        this.form.controls['icDigital'].setValue(1);
      } else if (response.data.gcptb024ClassificacaoPlanejamento.noEnquadramento == 'Digital - TD') {
        this.form.controls['icDigital'].setValue(2);
      } else {
        this.form.controls['icDigital'].setValue(3);
      }
      this.form.controls['nuClassificacaoPlanejamento'].setValue(
        response.data.nuClassificacaoPlanejamento
      );
      this.form.controls['nuPlanejamentoTipo'].setValue(
        response.data.nuPlanejamentoTipo
      );
      this.form.controls['noCriador'].setValue('NULL');
      this.form.controls['dhCadastro'].setValue(
        response.data.dhCadastro.toString().substring(8, 10) +
        '/' +
        response.data.dhCadastro.toString().substring(5, 7) +
        '/' +
        response.data.dhCadastro.toString().substring(0, 4)
      );

      this.previsoesDesembolso.clear();
      response.data.gcptb027PrevisoesDesembolso.map((x) => {
        const previsaoDesembolso = new FormGroup({
          nuPrevisaoDesembolso: new FormControl(x.nuPrevisaoDesembolso),
          nuPlanejamentoOrcamentario: new FormControl(
            x.nuPlanejamentoOrcamentario,
            [Validators.required]
          ),
          nuRubrica: new FormControl(
            { value: x.nuRubrica, disabled: !this.isEditable },
            [Validators.required]
          ),
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
          vrPreComprometimento: new FormControl(
            { value: x.vrPreComprometimento, disabled: !this.isEditable },
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
      });

      this.buildClassificacaoPlanejamento(response.data.gcptb024ClassificacaoPlanejamento)
      this.somaValorTotalPlanejamentoOrcamentario();
      this.obterMensalizacaoContrato(response.data.gcptb001Contrato.nuContrato)
    } catch (error) {
      console.error(error);
    }

    this.editarTextos();
  }

  public async obterContratos(): Promise<void> {
    try {
      if (this.tipoModal !== 'adicionar') {
        const response = await this.apiService.get<
          ApiResponse<ContratoResponse[]>
        >(`${Endpoints.URL_CONTRATOS}`);
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
      this.listaClassificacoesPlanejamentoDigital = response.data
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

  public async obterObjetivosEstrategicosPdti(): Promise<void> {
    try {
      const response = await this.apiService.get<
        ApiResponse<ObjetivoEstrategicoResponse[]>
      >(`${Endpoints.URL_ORCAMENTO}/objetivos-estrategicos-pdti`);

      this.listaObjetivosEstrategicosPdti = response.data;
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

  public async Cadastrar(): Promise<void> {
    try {
      this.submitted = true;
      var codigoContrato = this.form.controls['coContrato'].value
      this.form.controls['nuContrato'].setValue(codigoContrato);
      if (this.form.invalid) {
        const invalids = [];
        const controls = this.form.controls;
        for (const name in controls) {
          if (controls[name].invalid) invalids.push(name);
        }
        if(this.form.controls['deObjeto'].value == ''){
          console.log('erro objeto')
          this.toastr.error('Informe o objeto.', 'Erro');
        }
        if(this.form.controls['deJustificativa'].value == ''){
          this.toastr.error('Informe a justificativa.', 'Erro');
        }
        console.log(invalids);
        return;
      } else if (this.form.controls['nuClassificacaoPlanejamento'].value == 1 && (this.form.controls['icDigital'].value == 1 || this.form.controls['icDigital'].value == 2)) {
        this.toastr.error('Informe a categoria da classificação digital.', 'Erro');
        return;
      } else if(this.form.controls['deObjeto'].value == null){
        this.toastr.error('Informe o objeto.', 'Erro');
      }

      await this.apiService.post<any>(
        `${Endpoints.URL_ORCAMENTO}`,
        this.form.value
      );

      this.toastr.success('Cadastro efetuado com sucesso.', 'Sucesso');
      this.atualizarPagina.emit(true);
      this.activeModal.dismiss();
    } catch (error) {
      this.atualizarPagina.emit(false);
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
  
      if (
        this.form.value.nuClassificacaoPlanejamento === 1 &&
        (this.form.value.icDigital === 1 || this.form.value.icDigital === 2)
      ) {
        this.toastr.error('Informe a categoria da classificação digital.', 'Erro');
        return;
      }
  
      const planejamentoItem = {
        nuPlanejamentoItem: this.form.value.nuPlanejamentoOrcamentario,
        nuPlanejamento: this.form.value.nuAno,
        nuContrato: this.form.value.nuContrato,
        nuFilial: this.form.value.nuFilial,
        nuRubrica: this.form.value.nuRubrica,
        nuStatusPlanejamentoItem: this.form.value.nuPlanejamentoStatus,
        nuTipoDemanda: this.form.value.nuDemandaTipo,
        nuVigencia: this.form.value.nuVigencia,
  
        deObjeto: this.form.value.deObjeto,
        deObjetivoPDTIC: this.form.value.nuObjetivoEstrategicoPdti,
        deObjetivoPEI: this.form.value.nuObjetivoEstrategicoPei,
        deJustificativa: this.form.value.deJustificativa,
  
        nuPreComprometimento: this.form.value.nuPreComprometimento,
        nuReserva: this.form.value.nuReserva,
  
        vrPlanejamentoItem: this.form.value.vrTotalOrcamentoPlanejamento,
        vrJaneiro: this.form.value.vrJaneiro,
        vrFevereiro: this.form.value.vrFevereiro,
        vrMarco: this.form.value.vrMarco,
        vrAbril: this.form.value.vrAbril,
        vrMaio: this.form.value.vrMaio,
        vrJunho: this.form.value.vrJunho,
        vrJulho: this.form.value.vrJulho,
        vrAgosto: this.form.value.vrAgosto,
        vrSetembro: this.form.value.vrSetembro,
        vrOutubro: this.form.value.vrOutubro,
        vrNovembro: this.form.value.vrNovembro,
        vrDezembro: this.form.value.vrDezembro,
  
        nuUsuario: this.token.getUser()?.nuUsuario ?? 0,
        dhAlteracao: new Date(),
        nuUsuarioAlteracao: this.token.getUser()?.nuUsuario ?? 0,
  
        previsoesDesembolso: this.form.value.previsoesDesembolso
      };
  
      console.log('Dados enviados:', planejamentoItem);
  
      await this.apiService.post<any>(
        `${Endpoints.URL_ORCAMENTO}/cadastrar-planejamento-item`,
        planejamentoItem
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

  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }

  async buildClassificacaoPlanejamento(classificacao: ClassificacaoPlanejamentoResponse) {
    if (classificacao.noEnquadramento == 'Digital') {
      this.listaClassificacoesPlanejamentoDigitalFiltrada = this.listaClassificacoesPlanejamentoDigital.filter(x => x.noEnquadramento == 'Digital');
    }
    else if (classificacao.noEnquadramento == 'Digital - TD') {
      this.listaClassificacoesPlanejamentoDigitalFiltrada = this.listaClassificacoesPlanejamentoDigital.filter(x => x.noEnquadramento == 'Digital - TD');
    }
  }

  async onIsDigitalChange(e: any): Promise<void> {
    const valorSelecionado = e.target.value.split(':')[0];

    if (valorSelecionado == 1) {
      this.listaClassificacoesPlanejamentoDigitalFiltrada = this.listaClassificacoesPlanejamentoDigital.filter(x => x.noEnquadramento == 'Digital');
      this.form.controls['nuClassificacaoPlanejamento'].setValue('');
      this.form.controls['nuClassificacaoPlanejamento'].updateValueAndValidity();
    }
    else if (valorSelecionado == 2) {
      this.listaClassificacoesPlanejamentoDigitalFiltrada = this.listaClassificacoesPlanejamentoDigital.filter(x => x.noEnquadramento == 'Digital - TD');
      this.form.controls['nuClassificacaoPlanejamento'].setValue('');
      this.form.controls['nuClassificacaoPlanejamento'].updateValueAndValidity();
    }
    else {
      this.form.controls['nuClassificacaoPlanejamento'].setValue(1);
      this.form.controls['nuClassificacaoPlanejamento'].updateValueAndValidity();
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
      this.gcpvw008Mensalizacao.forEach(element => {
        if (element.dE_PERIODO.includes(this.planejamento.gcptb010Orcamento.nuAnoOrcamento.toString())) {
          this.gcpvw008MensalizacaoAnoExercicio.push(element)
        }
      });

      this.gcpvw008MensalizacaoAnoExercicio.sort((a, b) => (a.dE_PERIODO < b.dE_PERIODO ? -1 : 1));
      this.rubricas = this.gcpvw008MensalizacaoAnoExercicio.filter((item, i, arr) => arr.findIndex((t) => t.dE_RUBRICA === item.dE_RUBRICA) === i);

    } catch (error) {
      console.error(error)
    }
  }

  public filtraRubrica(rubrica: string): Gcpvw008Mensalizacao[] {

    const anoPlanejamento = this.listaExercicios.filter(x => x.nuOrcamento == this.planejamento.nuAno)[0].nuAnoOrcamento;
    const listaFiltrada = this.gcpvw008MensalizacaoAnoExercicio.filter(x => x.dE_RUBRICA == rubrica && x.dE_PERIODO.includes(anoPlanejamento.toString()));

    this.totalRubrica = 0;

    listaFiltrada.forEach(rubricaFiltrada => {
      this.totalRubrica += rubricaFiltrada.vR_PLANEJADO;
    });

    return listaFiltrada;
  }

  async Excluir(planejamentoOrcamentario: PlanejamentoOrcamentarioResponse) {
    const alert = await Swal.fire({
      title: '',
      text: `Deseja realmente excluir Planejamento Orçamentário cód: ${planejamentoOrcamentario.coPlanejamentoOrcamentario}?`,
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
        const response = await this.apiService.delete<ApiResponse<boolean>>(
          `${Endpoints.URL_ORCAMENTO}/` +
          planejamentoOrcamentario.nuPlanejamentoOrcamentario
        );

        this.toastr.success(
          `Planejamento Orçamentário cód: ${planejamentoOrcamentario.coPlanejamentoOrcamentario} excluído com sucesso.`,
          'Sucesso'
        );
        setTimeout(() => {
          location.reload();
       }, 2000);
      } catch (error) {
        console.error(error, 'aquirsd');
      }
      this.loading = false;
    }
  }

  openModalPlanejamento(tipoModal: string, isEditable: boolean, nuPlanejamento?: number) {
    this.activeModal.dismiss('Cross click');
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
    });
  }
}
