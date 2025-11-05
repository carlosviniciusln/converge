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
  message: string,
  position: string
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
  labelButtonsLeft : DomainDTO = {label: null, value: null, message: null, position: null};
  labelButtonsRight : DomainDTO = {label: null, value: null, message: null,  position: null};
  labelButtons : DomainDTO = {label: null, value: null, message: null, position: null};
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

        if(this.currentProfile === 'Administrador' || this.currentProfile === 'Orçamento'){
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

  validarBotoes(ultimoPlanejamento: ResumoPlanejamentoModel): void {
    const tipo = ultimoPlanejamento?.tipo.replace(/^\d+\s*-\s*/, "").trim();

    switch (tipo) {
      case "Programação":
        switch (ultimoPlanejamento.statuS_PLANEJAMENTO) {
          case "Aberta":
            this.labelButtonsLeft = {
              label: 'Encerrar Programação',
              value: 'encerrar',
              message: 'Tem certeza que deseja encerrar o planejamento',
              position: 'left'
            };
            this.labelButtonsRight = {
              label: 'Cancelar Programação',
              value: 'cancelar',
              message: 'Tem certeza que deseja cancelar o planejamento',
              position: 'right'
            };
            break;

          case "Criado":
            this.labelButtonsLeft = {
              label: 'Encerrar Programação',
              value: 'encerrar',
              message: 'Tem certeza que deseja encerrar o planejamento',
              position: 'left'
            };
            this.labelButtonsRight = {
              label: 'Cancelar Programação',
              value: 'cancelar',
              message: 'Tem certeza que deseja cancelar o planejamento',
              position: 'right'
            };
            break;

          case "Em Avaliação":
            this.labelButtonsLeft = {
              label: 'Encerrar Programação',
              value: 'encerrar',
              message: 'Tem certeza que deseja encerrar o planejamento',
              position: 'left'
            };
            this.labelButtonsRight = {
              label: 'Cancelar Programação',
              value: 'cancelar',
              message: 'Tem certeza que deseja cancelar o planejamento',
              position: 'right'
            };
            break;

          case "Encerrado":
            this.labelButtonsLeft = {
              label: 'Nova Reprogramação',
              value: 'nova',
              message: 'Tem certeza que deseja gerar uma nova reprogramação do planejamento',
              position: 'left'
            };
            this.labelButtonsRight = {
              label: 'Reabrir Programação',
              value: 'reabrir',
              message: 'Tem certeza que deseja reabrir o planejamento',
              position: 'left'
            };
            break;

          default:
            this.labelButtonsLeft = null;
            this.labelButtonsRight = null;
            break;
        }
        break;

      case "Reprogramação":
        switch (ultimoPlanejamento.statuS_PLANEJAMENTO) {
          case "Aberta":
            this.labelButtonsLeft = {
              label: 'Encerrar Reprogramação',
              value: 'encerrar',
              message: 'Tem certeza que deseja encerrar o planejamento',
              position: 'left'
            };
            this.labelButtonsRight = {
              label: 'Cancelar Reprogramação',
              value: 'cancelar',
              message: 'Tem certeza que deseja cancelar o planejamento',
              position: 'right'
            };
            break;

          case "Criado":
            this.labelButtonsLeft = {
              label: 'Encerrar Reprogramação',
              value: 'encerrar',
              message: 'Tem certeza que deseja encerrar o planejamento',
              position: 'left'
            };
            this.labelButtonsRight = {
              label: 'Cancelar Reprogramação',
              value: 'cancelar',
              message: 'Tem certeza que deseja cancelar o planejamento',
              position: 'right'
            };
            break;

          case "Em Avaliação":
            this.labelButtonsLeft = {
              label: 'Encerrar Reprogramação',
              value: 'encerrar',
              message: 'Tem certeza que deseja encerrar o planejamento',
              position: 'left'
            };
            this.labelButtonsRight = {
              label: 'Cancelar Reprogramação',
              value: 'cancelar',
              message: 'Tem certeza que deseja cancelar o planejamento',
              position: 'right'
            };
            break;

          case "Encerrado":
            this.labelButtonsLeft = {
              label: 'Nova Reprogramação',
              value: 'nova',
              message: 'Tem certeza que deseja gerar uma nova reprogramação do planejamento',
              position: 'left'
            };
            this.labelButtonsRight = {
              label: 'Reabrir Reprogramação',
              value: 'reabrir',
              message: 'Tem certeza que deseja reabrir o planejamento',
              position: 'left'
            };
            break;

          case "Cancelado":
            this.labelButtonsLeft = {
              label: 'Nova Reprogramação',
              value: 'nova',
              message: 'Tem certeza que deseja gerar uma nova reprogramação do planejamento',
              position: 'left'
            };
            this.labelButtonsRight = null;
            break;
          default:
            this.labelButtonsLeft = {
              label: 'Nova Reprogramação',
              value: 'nova',
              message: 'Tem certeza que deseja gerar uma nova reprogramação do planejamento',
              position: 'left'
            };
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
