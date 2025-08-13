import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { ActionPolicies, ModuleEnum, TokenStorageService } from 'src/app/services/token-storage.service';
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
    private router : Router
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

  //TODO: MELHORIA: REFATOR EM JSON OU CRIAR METODOS PARA CADA CENARIO 

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
            this.labelButtonsLeft.label = 'Nova Programação';
            this.labelButtonsLeft.value = 'nova';
            this.labelButtonsRight.label = 'Reabrir Programação';
            this.labelButtonsRight.value = 'reabrir';
            break;
          default:
            break;
        }
      break;
      // case "Ajuste Programação":
      //   switch(ultimoPlanejamento.statuS_PLANEJAMENTO){
      //     case "Aberta":
      //       this.labelButtonsLeft.label = 'Encerrar Programação';
      //       this.labelButtonsLeft.value = 'encerrar';
      //       this.labelButtonsRight.label = 'Cancelar Programação';
      //       this.labelButtonsRight.value = 'cancelar';
      //       break;
      //     case "Encerrado":
      //         this.labelButtonsLeft.label = 'Ajuste de Programação';
      //         this.labelButtonsLeft.value = 'ajuste';
      //         this.labelButtonsRight.label = 'Nova Programação';
      //         this.labelButtonsRight.value = 'nova';
      //       break 
      //     default:
      //       break;
      //   }
      // break;
      case "Reprogramação":
        switch(ultimoPlanejamento.statuS_PLANEJAMENTO){
          case "Aberta":
            this.labelButtonsLeft.label = 'Encerrar Programação';
            this.labelButtonsLeft.value = 'encerrar';
            this.labelButtonsRight.label = 'Cancelar Programação';
            this.labelButtonsRight.value = 'cancelar';
            break
          case "Encerrado":
            this.labelButtonsLeft.label = 'Nova Reprogramação';
            this.labelButtonsLeft.value = 'Reabrir Reprogramação';
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

  onRowClick(item: any) {
    console.log(item, "identificador do planejamento")
    this.activeModal.close();
    this.router.navigate(['/planejamento-orcamentario-detalhe'], {
      queryParams: { cO_EXERCICIO: item.cO_EXERCICIO, tipo: item.tipo, statusPlanejamento: item.statuS_PLANEJAMENTO}
    });

   
  
  
    // window.location.href = '/#/planejamento-orcamentario-detalhe'
  }

  async mensagemBotaoClick(cenario: any) {


    /*
     Regra de negócio: Botão Ajuste Programação ao ser acionado deverá gerar o próximo Tipo para o respectivo ano/exercício.

     RN 40:Ao clicar no botão Ajuste Programação, a partir do último Tipo/Status que deverá ser igual a Programação ou igual a Ajuste Programação e 
     deverá gerar a próxima programação de Ajuste Programação do planejamento do respectivo ano/exercício.
     RN41: Emitir mensagem através de pop-up para confirmação da execução “Tem certeza de que deseja gerar a Programação do Planejamento do Exercício 9999 – 99 – XXXXXXXXXXXX?” Sim ou Não.
           Onde: 9999 é o ano do exercício. 99 – é o número do Tipo sequencial.XXXXXXXXXXXX – é o nome/descrição do Tipo que neste caso será sempre Ajuste Programação.
           Exemplo: “Tem certeza de que deseja gerar a Programação do Planejamento do Exercício 2026 – 01 – Ajuste Programação?” Sim/Não
           Quando = Não, apenas apagar o pop-up.
           Quando = Sim, seguir o processo.


    
    */


    // this.validarAno();
    // if(this.retornoAno){
    //   return;
    // }



    const alert = await Swal.fire({
      title: `Exercício ${this.anoSelecionado}`,
      text: `Tem certeza de que deseja cancelar o Planejamento ${this.ultimoPlanejamento.tipo}?`,
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
