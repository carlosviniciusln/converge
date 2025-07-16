import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { ActionPolicies, ModuleEnum, TokenStorageService } from 'src/app/services/token-storage.service';
import { ResumoPlanejamentoModel } from 'src/app/models/Gcptb001ContratoResponse';
import { ApiResponse } from 'src/app/models/api-response';
import Swal from 'sweetalert2';

 interface DomainDTO {
  value: string,
  label: string
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
  labelButtonsLeft : DomainDTO = {label: null, value: null};
  labelButtonsRight : DomainDTO = {label: null, value: null};
  listaPlanejamentos: ResumoPlanejamentoModel[] = [];
  ultimoPlanejamento: ResumoPlanejamentoModel;
  retornoAno: boolean = false;
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
  ) {
    this.obterPermissoes();
  }

  ngOnInit(): void {
    this.obterPlanejamentos();
  }

  obterPermissoes() {
    this.permissions = this.token.getActionPolicies(ModuleEnum.Contratos);
  }

  obterPlanejamentos() {
    const result = this.apiService.get<ApiResponse<ResumoPlanejamentoModel[]>>('v1/Exercicio/resumo-planejamento?coExercicio='+this.anoSelecionado)
    result.then(response => {
      this.listaPlanejamentos = response.data;
      this.montarPlanejamentosModal();
    });
  }

  montarPlanejamentosModal() {
   
    if (this.listaPlanejamentos.length > 0) {
      this.ultimoPlanejamento = this.listaPlanejamentos[this.listaPlanejamentos.length - 1];
      this.validarBotoes(this.ultimoPlanejamento);
    }
    else{
      this.validarBotoes(this.listaPlanejamentos[0]);
    }
  }

  validarBotoes(ultimoPlanejamento : ResumoPlanejamentoModel): void {
    const tipo = ultimoPlanejamento?.tipo.replace(/^\d+\s*-\s*/, "");
    switch(tipo){
      case "Programação" :
        switch(ultimoPlanejamento.statuS_PLANEJAMENTO){
          case "Aberta":
            this.labelButtonsLeft.label = 'Encerrar Programação';
            this.labelButtonsLeft.value = 'encerrar';
            this.labelButtonsRight.label = 'Cancelar Programação';
            this.labelButtonsRight.value = 'cancelar';
            break;
          case "Encerrado":
            this.labelButtonsLeft.label = 'Ajuste de Programação';
            this.labelButtonsLeft.value = 'ajuste';
            this.labelButtonsRight.label = 'Nova Programação';
            this.labelButtonsRight.value = 'nova';
            break;
          default:
            break;
        }
      break;
      case "Ajuste Programação":
        switch(ultimoPlanejamento.statuS_PLANEJAMENTO){
          case "Aberta":
            this.labelButtonsLeft.label = 'Encerrar Programação';
            this.labelButtonsLeft.value = 'encerrar';
            this.labelButtonsRight.label = 'Cancelar Programação';
            this.labelButtonsRight.value = 'cancelar';
            break;
          case "Encerrado":
              this.labelButtonsLeft.label = 'Ajuste de Programação';
              this.labelButtonsLeft.value = 'ajuste';
              this.labelButtonsRight.label = 'Nova Programação';
              this.labelButtonsRight.value = 'nova';
            break 
          default:
            break;
        }
      break;
      case "Reprogramação":
        switch(ultimoPlanejamento.statuS_PLANEJAMENTO){
          case "Aberta":
            this.labelButtonsLeft.label = 'Encerrar Programação';
            this.labelButtonsLeft.value = 'encerrar';
            this.labelButtonsRight.label = 'Cancelar Programação';
            this.labelButtonsRight.value = 'cancelar';
            break
          case "Encerrado":
            this.labelButtonsLeft.label = 'Nova Programação';
            this.labelButtonsLeft.value = 'nova';
            this.labelButtonsRight = null;
            break 
          default:
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
      acao: [botaoClicado]
    });

    const result = this.apiService.post<ApiResponse<ResumoPlanejamentoModel[]>>('v1/Exercicio/planejamento', this.form.value)

    result.then(response => {
      if (response && response.data) {
        this.listaPlanejamentos = response.data;
        this.obterPlanejamentos();
      }
    });
  }

  onRowClick(rowId: number) {
    console.log(rowId, "identificador do planejamento")
    this.activeModal.close();
    window.location.href = '/#/planejamento-orcamentario-detalhe'
  }

  async mensagemBotaoClick(acao) {

    this.validarAno();
    if(this.retornoAno){
      return;
    }

    let mensagem = '';
    let retorno = '';
    

    if (acao == "ajuste") {
      mensagem = `Tem certeza de que deseja gerar a Programação do Planejamento do ${this.anoSelecionado} - ${this.ultimoPlanejamento.tipo}?`
    }

    const alert = await Swal.fire({
      title: '',
      text: mensagem,
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
    this.atualizarPlanejamento(acao);
  }

  async validarAno() {

    this.retornoAno = false;
    let anoAtual = new Date().getFullYear().toString();

    if (anoAtual > this.anoSelecionado) {
     
      const alert = await Swal.fire({
        title: '',
        text:  `Exercício ${this.anoSelecionado} - ${this.ultimoPlanejamento.tipo}, não pode ser gerado, exercício está Encerrado`,
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok!',
      }).then((result) => {
        this.retornoAno = true;
      });
    }
  }
}
