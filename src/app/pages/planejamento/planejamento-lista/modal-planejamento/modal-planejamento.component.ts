import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { ActionPolicies, ModuleEnum, TokenStorageService } from 'src/app/services/token-storage.service';
import { ResumoPlanejamentoModel } from 'src/app/models/Gcptb001ContratoResponse';
import { ApiResponse } from 'src/app/models/api-response';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-planejamento',
  templateUrl: './modal-planejamento.component.html',
  styleUrls: ['./modal-planejamento.component.scss']
})
export class ModalPlanejamentoComponent implements OnInit {
  public titulo: string = 'Simulação';
  public subTitulo: string = 'Simulação de Revisão de Preços';

  @Input() public anoSelecionado;
  @Output() atualizarPagina: EventEmitter<boolean> = new EventEmitter();

  permissions: ActionPolicies;
  loading: boolean = true;
  submitted = false;
  showData = false;
  listaSimulacao: any[] = [];
  selectedContratos: any[];
  public form: FormGroup;
  public dtIni;
  public dtFim;
  public percentSimulacao;
  planejamentos: ResumoPlanejamentoModel[] = [];
  planejamentosModal: ResumoPlanejamentoModel[] = [];
  tipoProgramacaoSelecionada = '';
  planejamentoAberto: boolean = false;
  planejamentoCancelado: boolean = false;
  planejamentoEncerrado: boolean = false;
  planejamentoAjuste: boolean = false;
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
    private toastr: ToastrService
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
      this.planejamentos = response.data;
      this.montarPlanejamentosModal(this.planejamentos);
    });
  }

  montarPlanejamentosModal(any) {
    this.planejamentosModal = any;
    if (this.planejamentosModal && this.planejamentosModal.length > 0) {
      let ultimoValor = this.planejamentosModal[this.planejamentosModal.length - 1].statuS_PLANEJAMENTO;
      let tipoProgramacao = this.planejamentosModal[this.planejamentosModal.length - 1].tipo;

      this.validarBotoes(ultimoValor, tipoProgramacao);
    }
  }

  limparPlanejamento() {
    this.planejamentoAberto = false;
    this.planejamentoEncerrado = false;
    this.planejamentoCancelado = false;
    this.planejamentoAjuste = false;
  }

  validarBotoes(ultimoValor: string, tipoProgramacao: string): void {
    this.limparPlanejamento();

    console.log('tipoProgramacao: ' + tipoProgramacao, 'ultimoValor: ' + ultimoValor)

    if (ultimoValor == "Encerrado") {
      this.ajustarValoresBotoes(null, null, false, null);
      return;
    }else{
      this.ajustarValoresBotoes(true, true, true, false);
      return;
    }
///////////////////////////////////////////////////
    // if (tipoProgramacao.includes("Ajuste") && ultimoValor == "Aberta") {
    //   this.ajustarValoresBotoes(false, false, true, true);
    //   return;
    // }

    // if (tipoProgramacao.includes("Ajuste") && ultimoValor == "Encerrado") {
    //   this.ajustarValoresBotoes(true, true, false, false);
    //   return;
    // }
    // if (tipoProgramacao.includes("reprog") && ultimoValor == "Aberto") {
    //   this.ajustarValoresBotoes(false, false, true, true);
    //   return;
    // }
    // if (tipoProgramacao.includes("reprog") && ultimoValor == "Encerrado") {
    //   this.ajustarValoresBotoes(true, false, false, false);
    //   return;
    // }
    // if (tipoProgramacao.includes("Prog") && ultimoValor == "Aberta") {
    //   this.ajustarValoresBotoes(false, false, true, true);
    //   return;
    // }

    // if (tipoProgramacao.includes("Prog") && ultimoValor == "Encerrado") {
    //   this.ajustarValoresBotoes(true, true, false, false);
    //   return;
    // }
  }

  ajustarValoresBotoes(aberto?, ajuste?, encerrado?, cancelado?) {
    this.planejamentoAberto = aberto;
    this.planejamentoAjuste = ajuste;
    this.planejamentoEncerrado = encerrado;
    this.planejamentoCancelado = cancelado;
  }


  fechar() {
    this.activeModal.dismiss();
  }

  atualizarPlanejamento(botaoClicado) {
    this.form = this.formBuilder.group({
      ano: [this.anoSelecionado],
      acao: [botaoClicado]
    });

    const result = this.apiService.post<ApiResponse<ResumoPlanejamentoModel[]>>('v1/Exercicio/planejamento', this.form.value)

    result.then(response => {
      if (response && response.data) {
        this.planejamentos = response.data;
        this.obterPlanejamentos();
        this.atualizarRetorno(response.data, botaoClicado);
      }
    });
  }
  atualizarRetorno(retorno, botaoClicado){
    console.log(retorno)
    //if(retor)

  }

  onRowClick(rowId: number) {
    console.log('---')
    // if (this.selectedRowId === rowId) {
    //   this.selectedRowId = null;
    // } else {
    //   this.selectedRowId = rowId;
    // }
    this.activeModal.close();
    window.location.href = '/#/planejamento-orcamentario-detalhe'
  }

  async mensagemBotaoClick(botaoClicado) {

    this.validarAno();
    if(this.retornoAno){
      return;
    }

    let mensagem = '';
    let retorno = '';
    let tipoProgramacao = this.planejamentosModal[this.planejamentosModal.length - 1].tipo;

    if (botaoClicado == "ajuste") {
      mensagem = `Tem certeza de que deseja gerar a Programação do Planejamento do ${this.anoSelecionado} - ${tipoProgramacao}?`
    }

    /*if(botaoClicado == "ajuste"){
       `Tem certeza de que deseja gerar a Programação do Planejamento do ${this.anoSelecionado} - ${tipoProgramacao}?`
    }*/

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
    this.atualizarPlanejamento(botaoClicado);
  }

  async validarAno() {

    this.retornoAno = false;
    let anoAtual = new Date().getFullYear().toString();

    if (anoAtual > this.anoSelecionado) {
      let tipoProgramacao = this.planejamentosModal[this.planejamentosModal.length - 1].tipo;

      const alert = await Swal.fire({
        title: '',
        text:  `Exercício ${this.anoSelecionado} - ${tipoProgramacao}, não pode ser gerado, exercício está Encerrado`,
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok!',
      }).then((result) => {
        this.retornoAno = true;
      });
    }
  }
}
