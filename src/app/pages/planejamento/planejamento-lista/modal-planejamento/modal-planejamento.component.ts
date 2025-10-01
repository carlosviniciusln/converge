import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { ActionPolicies, ModuleEnum, PerfisEnum, TokenStorageService } from 'src/app/services/token-storage.service';
import { ResumoPlanejamentoModel } from 'src/app/models/Gcptb001ContratoResponse';
import { ApiResponse } from 'src/app/models/api-response';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

 interface DomainDTO {
  value: string,
  label: string,
  message: string
}
@Component({
  selector: 'app-modal-planejamento',
  templateUrl: './modal-planejamento.component.html',
  styleUrls: ['./modal-planejamento.component.scss']
})
export class ModalPlanejamentoComponent implements OnInit {

  @Input() public anoSelecionado;
  @Output() atualizarPagina: EventEmitter<boolean> = new EventEmitter();

  public form: FormGroup;

  permissions: ActionPolicies;
  labelButtonsLeft : DomainDTO = {label: null, value: null, message: null};
  labelButtonsRight : DomainDTO = {label: null, value: null, message: null};
  labelButtons : DomainDTO = {label: null, value: null, message: null};
  listaPlanejamentos: ResumoPlanejamentoModel[] = [];
  ultimoPlanejamento: ResumoPlanejamentoModel;
  retornoAno: boolean = false;
  anoAtual: number;
  currentProfile: PerfisEnum;
  isPerfilPrivilegiado = false
  selectedRowId: number | null = null;

  filtroRegistros: any = {
    pageNumber: 1,
    pageSize: 1,
    Contrato: null,
    Fornecedor: null,
    Tipo: null,
    Gestor: null,
    Status: null,
  };



  constructor(
    public activeModal: NgbActiveModal,
    private apiService: ApiService,
    public token: TokenStorageService,
    private formBuilder: FormBuilder,
    private router : Router,
    private toastr: ToastrService,
  ) {
    this.obterPermissoes();
  }

  ngOnInit(): void {
    this.obterPlanejamentos();
      this.currentProfile = this.token.getUserPerfil();
        this.permissions = this.token.getActionPolicies(ModuleEnum.Contratos);

        if(this.currentProfile === 'Administrador' || this.currentProfile === 'Torres GEGAT'){
          this.isPerfilPrivilegiado = true;
        }
        this.anoAtual = new Date().getFullYear();
  }

  obterPermissoes() {
    this.permissions = this.token.getActionPolicies(ModuleEnum.Contratos);
  }

  obterPlanejamentos() {
    const result = this.apiService.get<ApiResponse<ResumoPlanejamentoModel[]>>('v1/Exercicio/resumo-planejamento?coExercicio='+this.anoSelecionado)
    result.then(response => {
      this.listaPlanejamentos = response.data;
      this.montarPlanejamentosModal(this.listaPlanejamentos);
    });
  }

  montarPlanejamentosModal(lista: ResumoPlanejamentoModel[]) {
    this.validarAno()
    if (lista.length > 0) {
      this.ultimoPlanejamento = lista[this.listaPlanejamentos.length - 1];
      this.validarBotoes(this.ultimoPlanejamento);
    }
    else{
      this.validarBotoes(lista[0]);
    }
  }

  //TODO: MELHORIA: REFATOR EM JSON OU CRIAR METODOS PARA CADA CENARIO

  validarBotoes(ultimoPlanejamento : ResumoPlanejamentoModel): void {
    const tipo = ultimoPlanejamento?.tipo.replace(/^\d+\s*-\s*/, "");
    switch(tipo){
      case "Programação" :
        switch(ultimoPlanejamento.statuS_PLANEJAMENTO){
          case "Aberta":
            this.labelButtonsLeft.label = 'Encerrar Programação';
            this.labelButtonsLeft.value = 'encerrar';
            this.labelButtonsLeft.message = 'Tem certeza que deseja encerrar o planejamento';
            this.labelButtonsRight.label = 'Cancelar Programação';
            this.labelButtonsRight.value = 'cancelar';
            this.labelButtonsRight.message = 'Tem certeza que deseja cancelar o planejamento';
            break;
          case "Em Avaliação":
            this.labelButtonsLeft.label = 'Encerrar Programação';
            this.labelButtonsLeft.value = 'encerrar';
            this.labelButtonsLeft.message = 'Tem certeza que deseja encerrar o planejamento';
            this.labelButtonsRight.label = 'Cancelar Programação';
            this.labelButtonsRight.value = 'cancelar';
            this.labelButtonsRight.message = 'Tem certeza que deseja cancelar o planejamento';
            break;
          case "Encerrado":
            this.labelButtonsLeft.label = 'Nova Reprogramação';
            this.labelButtonsLeft.value = 'nova';
            this.labelButtonsLeft.message = 'Tem certeza que deseja gerar uma nova reprogramação do planejamento';
            this.labelButtonsRight.label = 'Reabrir Programação';
            this.labelButtonsRight.value = 'reabrir';
            this.labelButtonsRight.message = 'Tem certeza que deseja reabrir o planejamento';
            break;
          default:
            this.labelButtonsLeft = null;
            this.labelButtonsRight = null;
            break;
        }
      break;
      case "Reprogramação":
        switch(ultimoPlanejamento.statuS_PLANEJAMENTO){
          case "Aberta":
            this.labelButtonsLeft.label = 'Encerrar Programação';
            this.labelButtonsLeft.value = 'encerrar';
            this.labelButtonsLeft.message = 'Tem certeza que deseja encerrar o planejamento';
            this.labelButtonsRight.label = 'Cancelar Programação';
            this.labelButtonsRight.value = 'cancelar';
            this.labelButtonsRight.message = 'Tem certeza que deseja cancelar o planejamento';
            break;
          case "Em Avaliação":
            this.labelButtonsLeft.label = 'Encerrar Programação';
            this.labelButtonsLeft.value = 'encerrar';
            this.labelButtonsLeft.message = 'Tem certeza que deseja encerrar o planejamento';
            this.labelButtonsRight.label = 'Cancelar Programação';
            this.labelButtonsRight.value = 'cancelar';
            this.labelButtonsRight.message = 'Tem certeza que deseja cancelar o planejamento';
            break
          case "Encerrado":
            this.labelButtonsLeft.label = 'Nova Reprogramação';
            this.labelButtonsLeft.value = 'nova';
            this.labelButtonsLeft.message = 'Tem certeza que deseja gerar uma nova reprogramação do planejamento';
            this.labelButtonsRight.label = 'Reabrir Reprogramação';
            this.labelButtonsRight.message = 'Tem certeza que deseja reabrir o planejamento';
            this.labelButtonsRight.value = 'reabrir';
            break
          case "Cancelado":
            this.labelButtonsLeft.label = 'Nova Reprogramação';
            this.labelButtonsLeft.value = 'nova';
            this.labelButtonsLeft.message = 'Tem certeza que deseja gerar uma nova reprogramação do planejamento'
            this.labelButtonsRight = null;
            break
          default:
            this.labelButtonsLeft.label = 'Nova Reprogramação';
            this.labelButtonsLeft.value = 'nova';
            this.labelButtonsLeft.message = 'Tem certeza que deseja gerar uma nova reprogramação do planejamento'
            this.labelButtonsRight = null;
            break;
        }
      break;
      default:
        break;
    }

  }

  atualizarPlanejamento(botaoClicado) {
    this.form = this.formBuilder.group({
      ano: [this.anoSelecionado],
      acao: [botaoClicado],
      NuPlanejamento: [this.ultimoPlanejamento.nU_PLANEJAMENTO]
    });
    const result = this.apiService.post<ApiResponse<ResumoPlanejamentoModel[]>>('v1/Exercicio/planejamento', this.form.value)

    result.then(response => {
      if (response && response.data) {
        this.listaPlanejamentos = response.data;
        this.obterPlanejamentos();
        this.toastr.success('Alteração efetuada com sucesso.', 'Sucesso');
      }
    });
  }

  onRowClick(item: any) {
    this.activeModal.close();
    this.router.navigate(['/planejamento-orcamentario-detalhe'], {
      queryParams: { cO_EXERCICIO: item.cO_EXERCICIO, tipo: item.tipo, statusPlanejamento: item.statuS_PLANEJAMENTO, nuPlanejamento: item.nU_PLANEJAMENTO}
    });

  }

  async mensagemBotaoClick(cenario: any) {

    const alert = await Swal.fire({
      title: `Exercício ${this.anoSelecionado}`,
      text: cenario.message + ` ${this.ultimoPlanejamento.tipo}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim!',
      cancelButtonText: 'Não!',
    }).then((result) => {
      if (result.value) {
        return true;
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        return false;
      }
    });

    if (!alert) {
      return;
    }
    this.atualizarPlanejamento(cenario.value);
  }

  async validarAno() {
    this.retornoAno = false;
    if (this.anoAtual > this.anoSelecionado) {
      const alert = await Swal.fire({
        title: '',
        text:  `Exercício ${this.anoSelecionado} está Encerrado`,
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok!',
      }).then((result) => {
        this.retornoAno = true;
      });
    }
  }
}
