import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { PageAction, PerfisEnum, TokenStorageService } from 'src/app/services/token-storage.service';
import { ApiResponse } from 'src/app/models/api-response';
import { Filial } from 'src/app/models/filial';
import {
  LimitesRubricasUpdateV2,
} from 'src/app/models/limites-rubrica-response';
import { PlanejamentoTipoResponse } from 'src/app/models/planejamento-response';
import {
  RubricaGrupo,
  Gcptb028GrupoRemanejamento,
  Rubrica,
} from 'src/app/models/rubrica';
import { Endpoints } from 'src/app/shared/enums/endpoints';
import {
  ExercicioModel,
  LimitesModel,
  listaErroUploadModel,
  StatusPlanejamentoModel,
} from 'src/app/models/limites-model';
import { Select2Data } from 'ng-select2-component';
import Swal from 'sweetalert2';
import { ModalHistoricoComponent } from '../modal-historico/modal-historico.component';

@Component({
  selector: 'app-modal-limites',
  templateUrl: './modal-limites.component.html',
  styleUrls: ['./modal-limites.component.scss'],
})
export class ModalLimitesComponent implements OnInit {
  public PageAction = PageAction;

  @Input() public isEditable: boolean;
  @Input() public registro: LimitesModel;
  @Input() public planejamentoEdit: number;
  @Input() public nuFilialEdit: number;
  @Input() public nuPlanejamento: number;
  @Input() public tipoModal: string;
  @Output() atualizarPagina: EventEmitter<boolean> = new EventEmitter();

  public formCadastro: FormGroup;
  public listaExercicios: ExercicioModel[] = [];
  public listaRubricas: RubricaGrupo[] = [];
  public listaGruposRemanejamento: Gcptb028GrupoRemanejamento[] = [];
  public listaFiliais: Filial[] = [];
  public listaTiposPlanejamento: PlanejamentoTipoResponse[] = [];
  public isDisabled: boolean = true;
  public titulo: string;
  public subTitulo: string;
  public actionButtonLabel: string;
  public currentPageAction: PageAction;
  public submitted = false;
  public listaRubrica: Rubrica[] = [];
  public selectedRubrica: string = null;
  public selectRubrica: Select2Data;
  public selectFilial: Select2Data;
  public descricaoRubrica: string = '';
  public nuRubrica: number = 0;
  public exercicio: number;
  public rubrica: string;
  public unidadeDemandante: string;
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
        actionButtonLabel: 'Salvar',
      },
      {
        type: PageAction.Cadastrar,
        title: 'Cadastro',
        subTitle: 'Cadastro de limites rubrica',
        actionButtonLabel: 'Salvar',
      },
    ];

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.definirPageAction();
    this.formulario();
    this.editarTextos();
  }

  definirPageAction(): void {
    if (this.isEditable) {
      this.currentPageAction = PageAction.Alterar;
    } else {
      this.currentPageAction = PageAction.Cadastrar;
      this.obterOrcamentos();
      this.obterRubricas();
      this.obterFiliais();
    }
  }

  editarTextos(): void {
    const element = this.actionList.find((x) => x.type === this.currentPageAction);
    if (!element) return;
    this.titulo = element.title;
    this.subTitulo = element.subTitle;
    this.actionButtonLabel = element.actionButtonLabel;
  }

  formulario(): void {
    if (!this.registro) {
      this.formCadastro = this.formBuilder.group({
        nuPlanejamento: ['', Validators.required],
        nuRubrica: ['', Validators.required],
        nuUnidadeDemandante: ['', Validators.required],
        vrLimite: [this.formatarValorMonetario(0), Validators.required],
        nuLimitePlanejamento: [0, Validators.required],
      });
      this.isDisabled = false;
    } else {
      this.descricaoRubrica = this.registro?.deRubrica;
      this.exercicio = this.registro?.coExercicio;
      this.rubrica = this.registro?.coRubrica;
      this.unidadeDemandante = this.registro?.sgFilial;
      this.formCadastro = this.formBuilder.group({
        nuPlanejamento: [this.planejamentoEdit, Validators.required],
        nuRubrica: [this.registro.nuRubrica, Validators.required],
        nuUnidadeDemandante: [this.registro.nuFilial, Validators.required],
        vrLimite: [this.formatarValorMonetario(this.registro.vrLimite), Validators.required],
        nuLimitePlanejamento: [this.registro.nuLimitePlanejamento, Validators.required],
      });
    }
  }

  public async obterRubricas(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<Rubrica[]>>(
        `${Endpoints.URL_RUBRICA}/ativas`
      );

      this.selectRubrica = response?.data?.map(c => ({ label: c.coRubrica, value: c.nuRubrica + '-' + c.deRubrica }));
    } catch (error) {
      console.error(error);
    }
  }

  public async obterFiliais(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<Filial[]>>(
        `${Endpoints.URL_FILIAL}/ativos`
      );

      this.selectFilial = response?.data?.filter((x) => x.nuFilialPai != null).map(c => ({ label: c.sgFilial, value: c.nuFilial }));
    } catch (error) {
      console.error(error);
    }
  }

  public async obterOrcamentos(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<ExercicioModel[]>>(
        `${Endpoints.URL_CONTRATOS}/exercicios-ativos`
      );
      this.listaExercicios = response.data;
    } catch (error) {
      console.error(error);
    }
  }

  public fillRubrica(e: any): void {
    this.descricaoRubrica = e.value.split('-')[1];
    this.nuRubrica = Number(e.value.split('-')[0]);
  }

  public async onSubmit(): Promise<void> {
    switch (this.currentPageAction) {
      case PageAction.Cadastrar:

        await this.Cadastrar();
        break;
      case PageAction.Alterar:
        await this.Alterar();
        break;
      case PageAction.Consultar:
      default:
        this.activeModal.dismiss('Cross click');
        break;
    }
  }


  public visualizaHistorico(noRubrica: string, noUnidadeDemandante: string){
    console.log("TESTE 1", this.formCadastro.get('nuLimitePlanejamento').value)
      const modalRef = this.modalService.open(ModalHistoricoComponent, {

        ariaLabelledBy: 'modal-basic-title',
        size: 'lg',
        fullscreen: 'xl',        // isso só afeta largura em breakpoints
        windowClass: 'modal-h-90',
        backdrop: 'static',
        keyboard: false,
        scrollable: true,        // permite scroll no body

        });


        modalRef.componentInstance.nuLimitePlanejamento = this.formCadastro.get('nuLimitePlanejamento').value;
        modalRef.componentInstance.noRubrica = noRubrica;
        modalRef.componentInstance.noUnidadeDemandante = noUnidadeDemandante;
        // modalRef.componentInstance.nuPlanejamentoOrcamento = nuPlanejamentoOrcamento;
        // modalRef.componentInstance.isEditable = isEditable;
        // modalRef.componentInstance.statusExercicio = this.statusExercio;
        // modalRef.componentInstance.isCadastro = isCadastro;
        // modalRef.componentInstance.tipoModal = tipoModal;
        // modalRef.componentInstance.nuAno = (planejamento?.nU_EXERCICIO_ORCAMENTO != null? planejamento?.nU_EXERCICIO_ORCAMENTO : nuAno);
        // modalRef.componentInstance.atualizarPagina.subscribe((data: boolean) => {
        //   if (data) {
        //     this.obterPlanejamentosOrc();
        //   }
        // });

        // modalRef.componentInstance.ano = this.anoExercicio;
        // modalRef.componentInstance.tipo = this.ordemTipoExercicio;
  }

  get f() {
    return this.formCadastro.controls;
  }

  public async Cadastrar(): Promise<void> {
    try {
      this.submitted = true;
      this.formCadastro.markAllAsTouched();
      const nuRubricaNum = Number(this.nuRubrica);
      this.formCadastro.controls['nuRubrica'].setValue(nuRubricaNum);
      const valorAtual = this.formCadastro.controls['vrLimite'].value;
      const valorSemPrefixo = valorAtual.replace('R$ ', '');
      this.formCadastro.controls['vrLimite'].setValue(valorSemPrefixo);
      const formData = this.toFormData(this.formCadastro);

      if (this.formCadastro.invalid) {
        const invalids = [];
        const controls = this.formCadastro.controls;
        for (const name in controls) {
          if (controls[name].invalid) invalids.push(name);
        }
        this.toastr.error('Todos os campos são obrigatórios.', 'Campo Obrigatório');
        console.error(invalids);
        return;

      }


      const validaJaCadastrado = false;

      if (validaJaCadastrado) {
        this.toastr.error('Por favor, nesse caso o valor deverá ser alterado.', 'Registro já Cadastro');
        return;
      }
      if (nuRubricaNum > 0) {
        const response = await this.apiService.postFormData<any>(
          `v1/Limites`,
          formData
        );
        if (response.data.succeeded) {
          this.toastr.success(response.data.data, 'Sucesso');
          this.atualizarPagina.emit(true);
          this.activeModal.dismiss();
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        } else {
          this.toastr.error(response.data, 'Registro já Cadastro');
          this.atualizarPagina.emit(false);
        }
      }
    } catch (error) {
      console.error(error);
      this.atualizarPagina.emit(false);
    }
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

public async Alterar(): Promise<void> {
  try {
    this.submitted = true;
    console.log('Valores do formulário:', this.formCadastro.value);

    if (this.formCadastro.invalid) {
      const invalids = [];
      const controls = this.formCadastro.controls;
      for (const name in controls) {
        if (controls[name].invalid) invalids.push(name);
      }
      console.error(invalids);
      return;
    }

    let valorAtual = this.formCadastro.controls['vrLimite'].value;
    let valorSemPrefixo = valorAtual.replace('R$ ', '').trim();
    valorSemPrefixo = valorSemPrefixo.replace(/\./g, '');
    valorSemPrefixo = valorSemPrefixo.replace(',', '.');
    const valorNumerico = parseFloat(valorSemPrefixo);
    if (isNaN(valorNumerico)) {
      this.toastr.error('Valor informado em formato inválido. Informe novamente o novo limite', 'Erro');
      this.formCadastro.controls['vrLimite'].setValue('');
      return;
    }

    const updateRequest: LimitesRubricasUpdateV2 = {
      nuPlanejamento: this.formCadastro.controls['nuPlanejamento'].value,
      nuFilial: this.formCadastro.controls['nuUnidadeDemandante'].value,
      nuRubrica: this.formCadastro.controls['nuRubrica'].value,
      vrLimite: valorNumerico,
      nuLimitePlanejamento: this.formCadastro.controls['nuLimitePlanejamento'].value
    };

    await this.apiService.put<LimitesRubricasUpdateV2>(
      `v1/Limites`,
      updateRequest
    );

    const valorFormatado = `R$ ${valorNumerico.toLocaleString('pt-BR', {
      minimumFractionDigits: 2
    })}`;
    this.formCadastro.controls['vrLimite'].setValue(valorFormatado);

    this.toastr.success('Alteração efetuada com sucesso.', 'Sucesso');
    this.atualizarPagina.emit(true);
    this.activeModal.dismiss();
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  } catch (error) {
    console.error(error);
    this.atualizarPagina.emit(false);
  }
}

public async onDelete(): Promise<void> {
  const result = await Swal.fire({
    title: 'Confirmação',
    text: 'Tem certeza que deseja excluir este registro?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sim, excluir',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6'
  });

  if (!result.isConfirmed) {
    return;
  }

  const id = this.formCadastro?.controls?.['nuLimitePlanejamento']?.value
    ?? this.registro?.nuLimitePlanejamento;

  if (!id) {
    this.toastr.error('ID do limite não encontrado.', 'Erro');
    return;
  }

  try {
    let urlDelete = `v1/Limites/inativar`;

    const result = await this.apiService.put<LimitesRubricasUpdateV2>(
      `${urlDelete}`, id
    );

    await Swal.fire({
      title: 'Sucesso!',
      text: 'Registro excluído com sucesso.',
      icon: 'success',
      confirmButtonText: 'OK'
    });

    this.atualizarPagina.emit(true);
    this.activeModal.dismiss();
    setTimeout(() => window.location.reload(), 2000);
  } catch (error) {
    console.error(error);
    await Swal.fire({
      title: 'Erro!',
      text: 'Não foi possível excluir o registro.',
      icon: 'error',
      confirmButtonText: 'OK'
    });
    this.atualizarPagina.emit(false);
  }
}


formatarValor(): void {
  let valor = this.formCadastro.get('vrLimite')?.value;

  if (!valor) {
    this.formCadastro.get('vrLimite')?.setValue('R$ ', { emitEvent: false });
    return;
  }

  valor = valor.replace(/\D/g, '');

  if (!valor) {
    this.formCadastro.get('vrLimite')?.setValue('R$ ', { emitEvent: false });
    return;
  }

  while (valor.length < 3) {
    valor = '0' + valor;
  }

  const reais = valor.slice(0, -2);
  const centavos = valor.slice(-2);
  const reaisFormatados = parseInt(reais, 10).toLocaleString('pt-BR');

  const formatado = `R$ ${reaisFormatados},${centavos}`;
  this.formCadastro.get('vrLimite')?.setValue(formatado, { emitEvent: false });
}

private formatarValorMonetario(valor: any): string {
  if (!valor || valor === '0') return 'R$ 0,00';

  const numero = parseFloat(valor.toString().replace(',', '.'));
  if (isNaN(numero)) return 'R$ 0,00';

  return `R$ ${numero.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
}
}
