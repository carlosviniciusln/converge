import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse } from 'src/app/models/generics/api-response';
import { Filial } from 'src/app/models/generics/filial';
import { LimitesRubricaResponse, LimitesRubricasUpdate } from 'src/app/models/generics/limites-rubrica-response';
import { Orcamento } from 'src/app/models/generics/orcamento';
import { PlanejamentoTipoResponse } from 'src/app/models/generics/planejamento-response';
import {
  Gcptb028GrupoRemanejamento,
  RubricaGrupo,
} from 'src/app/models/generics/rubrica';
import { ApiService } from 'src/app/shared/services/api.service';
import { PageAction } from 'src/app/shared/services/token-storage.service';
import { Endpoints } from 'src/app/models/enums/endpoints';

@Component({
  selector: 'app-limites-rubricas-cadastro',
  templateUrl: './limites-rubricas-cadastro.component.html',
  styleUrls: ['./limites-rubricas-cadastro.component.scss'],
})
export class LimitesRubricasCadastroComponent implements OnInit {
  @Input() public limiteRubrica: LimitesRubricaResponse;
  @Input() public isEditable: boolean;
  @Output() atualizarPagina: EventEmitter<boolean> = new EventEmitter();

  public form: FormGroup;
  public listaOrcamentos: Orcamento[] = [];
  public listaRubricas: RubricaGrupo[] = [];
  public listaGruposRemanejamento: Gcptb028GrupoRemanejamento[] = [];
  public listaFiliais: Filial[] = [];
  public listaTiposPlanejamento: PlanejamentoTipoResponse[] = [];

  public titulo: string;
  public subTitulo: string;
  public actionButtonLabel: string;
  public currentPageAction: PageAction;

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

  submitted = false;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.definirPageAction();

    this.formulario();

    this.obterOrcamentos();
    this.obterRubricas();
    this.obterFiliais();
    this.obterTiposPlanejamento();
    this.obterGruposRemanejamento();

    if (this.limiteRubrica) {
      this.obterLimiteRubrica();
    } else {
      this.editarTextos();
    }
  }

  definirPageAction() {
    if (!this.isEditable) {
      this.currentPageAction = PageAction.Consultar;
    } else {
      if (this.limiteRubrica) {
        this.currentPageAction = PageAction.Alterar;
      } else {
        this.currentPageAction = PageAction.Cadastrar;
      }
    }
  }

  editarTextos() {
    var element = this.actionList.find((x) => x.type == this.currentPageAction);
    this.titulo = element.title;
    this.subTitulo = element.subTitle;
    this.actionButtonLabel = element.actionButtonLabel;
  }

  formulario() {
    this.form = this.formBuilder.group({
      nuAnoOrcamentario: new FormControl({ value: null, disabled: this.currentPageAction != PageAction.Cadastrar }, [
        Validators.required,
      ]),
      nuRubrica: new FormControl({ value: null, disabled:  this.currentPageAction != PageAction.Cadastrar }, [
        Validators.required,
      ]),
      nuGrupoRemanejamento: new FormControl({ value: null, disabled: true }, [
        Validators.required,
      ]),
      nuFilial: new FormControl({ value: null, disabled:  this.currentPageAction != PageAction.Cadastrar }, [
        Validators.required,
      ]),
      nuPlanejamentoTipo: new FormControl({ value: null, disabled:  this.currentPageAction != PageAction.Cadastrar }, [
        Validators.required,
      ]),
      vrLimiteRubrica: new FormControl(
        { value: 0, disabled: !this.isEditable },
        [Validators.required]
      ),
      dhCadastro: [''],
      dhAlteracao: [''],
    });
  }

  get f() {
    return this.form.controls;
  }

  onRubricaChange() {
    const currentNuRubrica = this.form.controls['nuRubrica'].value;
    if (currentNuRubrica != null)
      this.form.controls['nuGrupoRemanejamento'].setValue(
        this.listaRubricas.find((x) => x.nuRubrica == currentNuRubrica)
          ?.nuGrupoRemanejamento
      );
  }

  public async obterLimiteRubrica(): Promise<void> {
    const getRequest: any = {
      NuAnoOrcamentario: this.limiteRubrica.nuAnoOrcamentario,
      NuRubrica: this.limiteRubrica.nuRubrica,
      NuFilial: this.limiteRubrica.nuFilial,
      NuPlanejamentoTipo: this.limiteRubrica.nuPlanejamentoTipo,
    };

    try {
      const response = await this.apiService.get<
        ApiResponse<LimitesRubricaResponse>
      >(`${Endpoints.URL_ORCAMENTO}/limite-orcamentario`, getRequest);

      this.limiteRubrica = response.data;

      this.form.controls['nuAnoOrcamentario'].setValue(
        response.data.nuAnoOrcamentario
      );
      this.form.controls['nuRubrica'].setValue(response.data.nuRubrica);
      this.form.controls['nuGrupoRemanejamento'].setValue(
        response.data.gcptb003Rubrica.nuGrupoRemanejamento
      );
      this.form.controls['nuFilial'].setValue(response.data.nuFilial);
      this.form.controls['nuPlanejamentoTipo'].setValue(response.data.nuPlanejamentoTipo);
      this.form.controls['vrLimiteRubrica'].setValue(
        response.data.vrLimiteRubrica
      );
      this.form.controls['dhCadastro'].setValue(
        response.data.dhCadastro.toString().substring(8, 10) +
          '/' +
          response.data.dhCadastro.toString().substring(5, 7) +
          '/' +
          response.data.dhCadastro.toString().substring(0, 4)
      );
      if (response.data.dhAlteracao != null) {
        this.form.controls['dhAlteracao'].setValue(
          response.data.dhAlteracao.toString().substring(8, 10) +
            '/' +
            response.data.dhAlteracao.toString().substring(5, 7) +
            '/' +
            response.data.dhAlteracao.toString().substring(0, 4)
        );
      }
    } catch (error) {}

    this.editarTextos();
  }

  public async obterOrcamentos(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<Orcamento[]>>(
        `${Endpoints.URL_PAGAMENTO}/listar-orcamentos`
      );

      this.listaOrcamentos = response.data;
    } catch (error) {}
  }

  public async obterRubricas(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<RubricaGrupo[]>>(
        `${Endpoints.URL_RUBRICA}/grupo-ativas`
      );

      this.listaRubricas = response.data;
    } catch (error) {}
  }

  public async obterFiliais(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<Filial[]>>(
        `${Endpoints.URL_FILIAL}/ativos`
      );

      this.listaFiliais = response.data;
    } catch (error) {}
  }

  public async obterTiposPlanejamento(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<PlanejamentoTipoResponse[]>>(
        `${Endpoints.URL_ORCAMENTO}/tipos-planejamento`
      );

      this.listaTiposPlanejamento = response.data;
    } catch (error) {}
  }

  public async obterGruposRemanejamento(): Promise<void> {
    try {
      const response = await this.apiService.get<
        ApiResponse<Gcptb028GrupoRemanejamento[]>
      >(`${Endpoints.URL_ORCAMENTO}/limite-orcamentario/grupos`);

      this.listaGruposRemanejamento = response.data;
    } catch (error) {}
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

      if (this.form.invalid) {
        const invalids = [];
        const controls = this.form.controls;
        for (const name in controls) {
          if (controls[name].invalid) invalids.push(name);
        }
        console.log(invalids);
        return;
      }

      await this.apiService.post<any>(
        `${Endpoints.URL_ORCAMENTO}/limite-orcamentario`,
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

      const updateRequest : LimitesRubricasUpdate = {
        nuAnoOrcamentario: this.limiteRubrica.nuAnoOrcamentario,
        nuRubrica: this.limiteRubrica.nuRubrica,
        nuFilial: this.limiteRubrica.nuFilial,
        nuPlanejamentoTipo: this.limiteRubrica.nuPlanejamentoTipo,
        vrLimiteRubrica: this.form.controls['vrLimiteRubrica'].value,
      }

      await this.apiService.put<LimitesRubricasUpdate>(
        `${Endpoints.URL_ORCAMENTO}/limite-orcamentario`,
        updateRequest
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
}
