import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiResponse } from 'src/app/models/generics/api-response';
import { ContratoResponse, RetencaoResponse, Retencao, Gcptb002ContratoTipo, ContratoResponseV2 } from 'src/app/models/generics/contrato-response';
import { ApiService } from 'src/app/shared/services/api.service';
import { EvolucaoFinanceira } from 'src/app/models/generics/evolucao-financeira';
import {
  ActionPolicies,
  ModuleEnum,
  PerfisEnum,
  TokenStorageService,
} from 'src/app/shared/services/token-storage.service';
import { Endpoints } from 'src/app/models/enums/endpoints';
import { ContratoCadastroComponent } from '../contrato-cadastro/contrato-cadastro.component';
import { RetencaoCadastroComponent } from '../retencao/retencao-cadastro.component'
import { PagamentoCadastroComponent } from '../pagamento-cadastro/pagamento-cadastro.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { Gcptb016EmpenhoResponse } from 'src/app/models/generics/Gcptb016EmpenhoResponse';
import { NavigationService } from 'src/app/shared/services/navigation-service';
import { Gcptb021CartaQuitacaoResponse } from 'src/app/models/generics/Gcptb021CartaQuitacaoResponse';
import { ModalSimulacaoComponent } from '../modal-simulacao/modal-simulacao.component';
import { ContratoApiResponse, ContratoItem } from 'src/app/models/generics/Gcptb001ContratoResponse';

@Component({
  selector: 'app-contrato-detalhe',
  templateUrl: './contrato-detalhe.component.html',
  styleUrls: ['./contrato-detalhe.component.scss'],
})
export class ContratoDetalheComponent implements OnInit {
  permissions: ActionPolicies;

  loading: boolean = true;
  nuContrato: string;
  Contrato: ContratoResponse;
  ContratoAtaPai: ContratoResponse;
  ContratoV2: ContratoResponseV2;
  retencoes: RetencaoResponse;
  listaEmpenho: Gcptb016EmpenhoResponse[];
  listaEmpenhoAnos: number[] = [];

  vigenciaAtual: any[];
  dadosVigenciaAtual: any;
  totalCurrentVigencia: number = 0;
  currentVigenciaRubricas: any[] = [];
  inicioVigencia: string;
  fimVigencia: string;
  currentVigenciaSum = {};

  rubricaDescriptions: { [key: string]: string } = {};

  listaQuitacao: Gcptb021CartaQuitacaoResponse[];

  currentUser: any;
  public btnVoltar: Boolean;

  totalPayment: number = 0;
  totalRetencao: number = 0;

  isRotaAtas: boolean = false;

  isDerivadoAta: boolean = false;

  listaValoresExecutadosAtas: ContratoItem[] = [];
  expandedRowKeys: { [key: string]: boolean } = {};

  tituloPagamentos: string = '';

  currentProfile: PerfisEnum;
	permissaoEditar: boolean = false;

  filtroRegistros: any = {
    pageNumber: 1,
    pageSize: 10,
    Contrato: null,
    Fornecedor: null,
    Tipo: null,
    Gestor: null,
    Status: null,
    NoTipoArp: null,
    Processo: null,
    NuAta: null
  };

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private modalService: NgbModal,
    private location: Location,
    private navigation: NavigationService,
    private token: TokenStorageService,
    private toastr: ToastrService
  ) {
    this.obterPermissoes();
    this.currentUser = this.token.getUser();
    this.currentProfile = this.token.getUserPerfil();
    this.nuContrato = this.route.snapshot.paramMap.get('id');
    this.btnVoltar = this.route.snapshot.paramMap.get('voltar') == 'v';
  }

  obterPermissoes() {
    this.permissions = this.token.getActionPolicies(ModuleEnum.Contratos);
  }

  ngOnInit(): void {
    this.obterContrato().then(() => {
      this.calculateSumByRubrica();
      this.calculateTotalPayment();
    });
    this.obterRetencao().then(() => {
      this.calculateSumByTipoRetencao();
      this.calculateTotalRetencao();
    });

    this.obterRubricaDescriptions();
    this.setTipoUsuario();
  }

  public sumByRubrica: { [rubricaCode: string]: number } = {};
  public sumByTipoRetencao: { [retencaoCode: string]: number } = {};

  convertDateToString(date: string): number {
    const parts = date.split('/');
    return parseInt(parts[1] + parts[0]);
  }

  compareDates(date1: string, date2: string): number {
    return this.convertDateToString(date1) - this.convertDateToString(date2);
  }

  calculateSumByRubrica(): void {
    this.sumByRubrica = this.Contrato.gcptb011Pagamentos.reduce<{ [key: string]: number }>((acc, pagamento) => {
      const rubricaCode = pagamento.gcptb017VigenciaRubrica.gcptb003Rubrica.coRubrica;
      if (acc[rubricaCode]) {
        acc[rubricaCode] += pagamento.vrExecutado;
      } else {
        acc[rubricaCode] = pagamento.vrExecutado;
      }
      return acc;
    }, {});
  }

  calculateSumByTipoRetencao(): void {
    this.sumByTipoRetencao = this.retencoes.reduce<{ [key: string]: number }>((acc, retencao) => {
      const retencaoCode = retencao.dE_TIPO_PENALIDADE;
      if (acc[retencaoCode]) {
        acc[retencaoCode] += retencao.vR_PENALIDADE;
      } else {
        acc[retencaoCode] = retencao.vR_PENALIDADE;
      }
      return acc;
    }, {});
  }

  calculateTotalPayment(): void {
    this.totalPayment = this.Contrato.gcptb011Pagamentos.reduce((acc, pagamento) => {
      return acc + pagamento.vrExecutado;
    }, 0);
  }

  calculateTotalRetencao(): void {
    this.totalRetencao = this.retencoes.reduce((acc, pagamento) => {
      return acc + pagamento.vR_PENALIDADE;
    }, 0);
  }

  public async obterContrato(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<ContratoResponse>>(
        `${Endpoints.URL_CONTRATOS}/` + this.nuContrato
      );

      const responseV2 = await this.apiService.get<ApiResponse<ContratoResponseV2>>(
        `${Endpoints.URL_CONTRATOS}/detalhe-contrato?nuContrato=` + this.nuContrato
      );

      this.Contrato = response.data;
      this.ContratoV2 = responseV2.data;
      this.obterValorVigencias();
      this.validarRotaAtas();
      this.setTituloPagamentos();
      this.loading = false;
    } catch (error) {
      console.error(error, 'obterContrato');
      //this.loading = true;
    }
  }

  public async obterRetencao(): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<RetencaoResponse>>(
        `${Endpoints.URL_RETENCAO}/obter-retencoes-contrato` + `?nuContrato=${this.nuContrato}`
      );
      this.retencoes = response.data || [];
      this.loading = false;
    } catch (error) {
      console.error(error, 'obterRetencao');
      this.retencoes = [];
      this.loading = false;
    }
  }

  openModalRetencao(retencao: Retencao) {
    const modalRef = this.modalService.open(RetencaoCadastroComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });

    modalRef.componentInstance.retencao = retencao;

    modalRef.componentInstance.atualizarPagina.subscribe((data: boolean) => {
      if (data) {
        this.obterRetencao();
      }
    });
  }

  hasEntries(obj: any): boolean {
    return obj && Object.keys(obj).length > 0;
  }

  public async obterRubricaDescriptions(): Promise<void> {
    try {
      const response = await this.apiService.get<any>(
        `${Endpoints.URL_CONTRATOS}/resumo-vigencia-aditivo-contrato?nuContrato=${this.nuContrato}`
      );

      const data: any = response.data;

      data.forEach(item => {
        if (item.nO_RUBRICA !== 'TOTAL') {
          this.rubricaDescriptions[item.nO_RUBRICA] = item.dE_RUBRICA;
        }
      });
    } catch (error) {
      console.error(error, 'obterRubricaDescriptions');
    }
  }

  public async obterDadosVigenciaAtual(): Promise<void> {
    try {
      const response = await this.apiService.get<
        ApiResponse<EvolucaoFinanceira[]>
      >(
        `${Endpoints.URL_CONTRATOS}/valores-vigencia-atual?nuContrato=${this.nuContrato}`
      );
      const resp: any[] = response.data;

      this.dadosVigenciaAtual = resp;

      const totalItem = resp.find(item => item.nO_RUBRICA === 'TOTAL');

      this.totalCurrentVigencia = totalItem?.vR_GLOBAL || 0;
      this.inicioVigencia = totalItem?.dT_INICIO;
      this.fimVigencia = totalItem?.dT_TERMINO;

      this.currentVigenciaRubricas = resp.filter(item => item.nO_RUBRICA !== 'TOTAL');

      this.loading = false;
    } catch (error) {
      console.error(error, 'aquirsd');

    }
  }

  public async obterValorVigencias(): Promise<void> {
    try {
      const response = await this.apiService.get<
        ApiResponse<Gcptb002ContratoTipo>
      >(`${Endpoints.URL_CONTRATOS}/vigencias-contrato?nuContrato=${this.nuContrato}`);
      const arrayVigencias: any = response.data;

      this.obterDadosVigenciaAtual();

      this.loading = false;
    } catch (error) {
      console.error(error, 'aquirsd');
      //this.loading = true;
    }
  }
  openModalContrato(nuContrato: number) {
    const modalRef = this.modalService.open(ContratoCadastroComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      windowClass: 'custom-class',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.nuContrato = nuContrato;
    modalRef.componentInstance.atualizarPagina.subscribe((data: boolean) => {
      if (data) {
        this.obterContrato();
      }
    });
  }

  openModalPreposto(nuContrato: number){
    const modalRef = this.modalService.open(ContratoCadastroComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      windowClass: 'custom-class',
      backdrop: 'static',
      keyboard: false,
    });

    modalRef.componentInstance.ativaPreposto = true;
    modalRef.componentInstance.nuContrato = nuContrato;
  }

  openModalSimulacao(nuContrato: number) {
    const modalRef = this.modalService.open(ModalSimulacaoComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      windowClass: 'custom-class',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.nuContrato = nuContrato;
    modalRef.componentInstance.coContrato = this.Contrato.coContrato;
  }

  openModalPagamento(nuContrato: number, nuPagamento?: number, icConciliacao?: boolean) {
    const modalRef = this.modalService.open(PagamentoCadastroComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      windowClass: 'custom-class',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.nuContrato = nuContrato;
    modalRef.componentInstance.nuPagamento = nuPagamento;
    modalRef.componentInstance.isConciliacao = icConciliacao;


    modalRef.componentInstance.atualizarPagina.subscribe((data: boolean) => {
      if (data) {
        this.obterContrato();
      }
    });
  }

  async excluirPagamento(nuPagamento: number) {
    const alert = await Swal.fire({
      title: '',
      text: 'Deseja realmente excluir este pagamento?',
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
      try {
        const response = await this.apiService.delete<ApiResponse<boolean>>(
          `${Endpoints.URL_PAGAMENTO}/` + nuPagamento
        );

        this.toastr.success('Pagamento excluído com sucesso.', 'Sucesso');
        this.loading = false;
        this.obterContrato();
      } catch (error) {
        console.error(error, 'excluirPagamento');
        //this.loading = true;
      }
    }
  }

  public apresentaDia(nuDia: number, flag: boolean) {
    if (nuDia != null && nuDia > 0) {
      return nuDia.toString() + '°' + (flag ? ' dia útil' : '');
    }
    return '--';
  }

  goBackToPrevPage(): void {
    if (this.btnVoltar) this.location.back();
    else window.top.close();
  }

  calculatePagamentosTotal(name) {
    let total = 0;

    if (this.Contrato.gcptb011Pagamentos) {
      for (let pagamento of this.Contrato.gcptb011Pagamentos) {
        if (
          pagamento.gcptb017VigenciaRubrica?.gcptb003Rubrica?.coRubrica === name
        ) {
          total++;
        }
      }
    }

    return total;
  }


  ordenarContratos() {
    const contratos: any = this.Contrato.gcptb006Vigencias;
    contratos.sort((a: any, b: any) => {
      const dateA = new Date(a.dtInicio);
      const dateB = new Date(b.dtInicio);

      if (dateA > dateB) {
        return -1
      } else if (dateA < dateB) {
        return 1
      } else {
        return b.nuContrato - a.nuContrato
      }

    })
  }

  linkContrato(){
    const partesContrato = this.Contrato.coContrato.split('/');
    const contratoFormatado = this.Contrato.coContrato.replace('/','_');

    window.open('https://caixa.sharepoint.com/:f:/r/sites/Arquivos7550/Documentos%20Compartilhados/TIPO_2_DIGITAL/' + partesContrato[1] + '/' + contratoFormatado ,'_blank');
  }

  somaVigencias(vigencias: any[]): number{
    let vrGlobalTotal = 0;

    vigencias.forEach(element => {
      vrGlobalTotal += element.vrGlobal
    });
    return vrGlobalTotal
  }

  ordenaVigenciaRubricas(lista: any[]): any[]{
    lista.sort((a,b) => {
      const [numA, subA] = a.gcptb003Rubrica.coRubrica.split('-').map(Number);
      const [numB, subB] = b.gcptb003Rubrica.coRubrica.split('-').map(Number);
      return numA - numB || subA - subB;
    });
    return lista;
  }

  ordenaVigenciaAtualRubricas(lista: any[]): any[]{
    lista.sort((a,b) => {
      const [numA, subA] = a.nO_RUBRICA.split('-').map(Number);
      const [numB, subB] = b.nO_RUBRICA.split('-').map(Number);
      return numA - numB || subA - subB;
    });
    return lista;
  }

  async validarRotaAtas() {

    this.isRotaAtas = (this.Contrato && this.Contrato.no_Tipo_Arp == 'ATA_DE_REGISTRO_DE_PRECOS' && this.Contrato.ic_Arp) ? true : false;
    this.isDerivadoAta = (this.Contrato && this.Contrato.no_Tipo_Arp == 'CONTRATO_DERIVADO_ATA_REGISTRO_PRECOS' && this.Contrato.ic_Arp) ? true : false;

    if (this.isRotaAtas) {

      this.obterContratosAtas().then(() => {
        this.listaValoresExecutadosAtas.forEach(element => {
          this.obterContratoAtasVinculadas(element);
        });

      });
    } else if (this.isDerivadoAta) {
      const response = await this.apiService.get<ApiResponse<ContratoResponse>>(
        `${Endpoints.URL_CONTRATOS}/` + this.Contrato.nu_Ata
      );
      this.ContratoAtaPai = response.data;
    }
  }

  public async obterContratosAtas(): Promise<void> {

    this.loading = true;
    try {
      const filtrosLimpos = this.limparFiltrosNulos(this.filtroRegistros);

      filtrosLimpos.NoTipoArp = 'CONTRATO_DERIVADO_ATA_REGISTRO_PRECOS';
      filtrosLimpos.NuAta = this.Contrato.nuContrato;

      const response = await this.apiService.get<ApiResponse<ContratoApiResponse>>
        (`${Endpoints.URL_CONTRATOS}/filter-paginado`, filtrosLimpos);

      this.listaValoresExecutadosAtas = response?.data?.contratos;
      this.loading = false;
    } catch (error) {
      this.loading = false;
      console.error('Erro ao obter contratos derivados', error);
    }
  }

  public async obterContratoAtasVinculadas(element: ContratoItem): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<ContratoResponse>>(
        `${Endpoints.URL_CONTRATOS}/` + element.nuContrato
      );

      element.pagamentosAta = response.data;

      /*let Contrato: ContratoResponse;

      this.Contrato = response.data;
      this.obterValorVigencias();
      this.validarRotaAtas();
      this.loading = false;*/
    } catch (error) {
      console.error(error, 'obterContrato');
      //this.loading = true;
    }
  }

  private limparFiltrosNulos(filtros: any): any {
    const filtrosLimpos: any = {};
    Object.keys(filtros).forEach((key) => {
      if (filtros[key] !== null && filtros[key] !== undefined && filtros[key] !== '') {
        filtrosLimpos[key] = filtros[key];
      }
    });
    return filtrosLimpos;
  }

  async toggleRow(registro: any) {
    let id = registro.coContrato;
    this.expandedRowKeys[id] = !this.expandedRowKeys[id];
  }

  setTipoUsuario() {
    if (this.currentProfile === 'Pagadoria' || this.currentProfile === 'Administrador' || this.currentProfile === PerfisEnum.TorresGEGAT) {
      this.permissaoEditar = true;
    }
  }

  validaContratoArtigo81(codContrato: string): boolean{
    if(codContrato.startsWith('81000')){
      return true
    }
    return false
  }

  setTituloPagamentos(){
    this.tituloPagamentos =  this.validaContratoArtigo81(this.ContratoV2.cO_CONTRATO) ?
    `Pagamentos Art. 81 - ${this.ContratoV2.cO_CONTRATO.replace('81000/', '')} - PAGAMENTOS POR RUBRICA` :
    `CONTRATO ${this.ContratoV2.cO_CONTRATO}  - RESUMO DOS PAGAMENTOS
                    POR RUBRICA`
  }
}
