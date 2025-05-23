import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiResponse } from 'src/app/models/api-response';
import { ContratoVigencia } from 'src/app/models/contratoVigencia';
import { Dashboard, NumerosRapidosExecContratual } from 'src/app/models/dashboard';
import { ApiService } from 'src/app/services/api.service';
import {
  ActionPolicies,
  ModuleEnum,
  TokenStorageService,
} from 'src/app/services/token-storage.service';
import { ContratoItem, ResumoPlanejamentoModel } from 'src/app/models/Gcptb001ContratoResponse';
import { ModalPlanejamentoComponent } from './modal-planejamento/modal-planejamento.component';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-planejamento-orcamentario-lista',
  templateUrl: './planejamento-orcamentario.component.html',
  styleUrls: ['./planejamento-orcamentario.component.scss'],
})
export class PlanejamentoOrcamentarioComponent implements OnInit {
  permissions: ActionPolicies;
  tabs: string[] = ['Planejamento']
  tabsCapexOpex: string[] = ['Investimento (CAPEX)', 'Custeio (OPEX)']
  tabsPlanejamento: string[] = ['Planejamento Orçamentário']
  dashboard: Dashboard;
  orcamentos: any = [];
  execucao: any = [];
  anos: number[] = [];
  anoSelected: number = new Date().getFullYear();
  loading: boolean = true;
  modalRef: any
  listaContratosVigencia: ContratoVigencia[];
  titleContratosVigencia: string;
  filial1885Data: any = null;
  ultimaAtualizacao: string = '';
  numerosRapidosExecContratual: NumerosRapidosExecContratual;
  contratosOrigem: ContratoItem[];
  contratos: ContratoItem[];
  anoAtual: number = 0;
  filtroRegistros: any = {
    pageNumber: 1,
    pageSize: 4,
    Contrato: null,
    Fornecedor: null,
    Tipo: null,
    Gestor: null,
    Status: null,
    NoTipoArp: null
  };

  planejamentos: ResumoPlanejamentoModel[] = [];

  quantidadeTotal: number = 0;

  closeResult: string = '';
  exibeResultado = false;
  perfil: string = '';
  constructor(
    private apiService: ApiService,
    private modalService: NgbModal,
    public token: TokenStorageService,
    private toastr: ToastrService
  ) {
    this.obterPermissoes();
  }

  obterPermissoes() {
    this.permissions = this.token.getActionPolicies(ModuleEnum.Dashboard);
    this.perfil = this.token.getUserPerfil();
  }

  ngOnInit() {
    this.obterPlanejamentos();
  }

  obterPlanejamentos() {
    const result = this.apiService.get<ApiResponse<ResumoPlanejamentoModel[]>>('v1/Exercicio/resumo-planejamento')
    result.then(response => {
      this.planejamentos = response.data;
      console.log(this.planejamentos)
    });
  }

  async novoExercicio(){
const ultimoItem: ResumoPlanejamentoModel = this.planejamentos[this.planejamentos.length - 1];
this.anoAtual = ultimoItem.cO_EXERCICIO;

    const alert = await Swal.fire({
      title: '',
      text: 'Tem Certeza de que deseja gerar o Planejamento Orçamentário do exercício ' + (this.anoAtual + 1) + '?',
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

    if(!alert){
      return;
    }
    this.toastr.warning('Aguarde, gerando o exercício ' + (this.anoAtual + 1) + ', isso pode levar alguns minutos...');
    const result = this.apiService.post<ApiResponse<ResumoPlanejamentoModel[]>>('v1/Exercicio/novo-exercicio','')
    result.then(response => {
      this.planejamentos = response.data;
      this.toastr.clear();
      this.toastr.success('Exercício ' + this.planejamentos[this.planejamentos. length - 1].cO_EXERCICIO + ' gerado com sucesso.')
    });
  }

  openModalPlanejamento(anoSelecionado: string) {
    const modalRef = this.modalService.open(ModalPlanejamentoComponent, {
      ariaLabelledBy: 'modal-basic-title',
     windowClass: 'modal-80',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.anoSelecionado = anoSelecionado;
  }
}
