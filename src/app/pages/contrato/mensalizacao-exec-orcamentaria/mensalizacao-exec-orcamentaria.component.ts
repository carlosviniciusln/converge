import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Gcptb002ContratoTipo, Gcpvw008Mensalizacao, Gcpvw018EexcucaoOrcamentaria, TotalPorRubrica } from 'src/app/models/generics/Gcptb001ContratoResponse';
import { ApiResponse } from 'src/app/models/generics/api-response';
import { ContratoResponse, Gcptb006Vigencia } from 'src/app/models/generics/contrato-response';
import { ApiService } from 'src/app/shared/services/api.service';
import { ActionPolicies, ModuleEnum, TokenStorageService } from 'src/app/shared/services/token-storage.service';
import { Endpoints } from 'src/app/models/enums/endpoints';
import { DatePipe, Location } from '@angular/common';
import { ModalSimulacaoComponent } from '../modal-simulacao/modal-simulacao.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mensalizacao-exec-orcamentaria',
  templateUrl: './mensalizacao-exec-orcamentaria.component.html',
  styleUrls: ['./mensalizacao-exec-orcamentaria.component.scss']
})
export class MensalizacaoComponent implements OnInit {
  permissions: ActionPolicies;
  showSelect = false;
  nuContrato: string;
  contrato: ContratoResponse;
  gcpvw008Mensalizacao: Gcpvw008Mensalizacao[] = [];
  gcpvw018EexcucaoOrcamentariaList: Gcpvw018EexcucaoOrcamentaria[] = [];
  gcpvw018EexcucaoOrcamentariaListAnoVigente: Gcpvw018EexcucaoOrcamentaria[] = [];
  totalExecucao: number;
  rubricas: Gcpvw008Mensalizacao[] = [];
  loading: boolean = true;
  totalRubrica: number;
  currentUser: any;
  vigencias: Gcptb006Vigencia[];
  semMensalizacao = true;
  hoje = new Date();
  dT_INI_VIGENCIA: Date;
  dT_TERMINO_VIGENCIA: Date;
  tblTotalRubrica: TotalPorRubrica[] = [];
  listaFiltrada:any;
  rubricaAtiva:any = 'TOTAL';
  competencias = [];
  valoresPlanejados = [];
  valoresExecutados = [];
  vigenciasAnteriores: any[];
  contratoVigencia: any;
  vigenciaAtual: any;
  vigenciaSelecionada:any;
  listaEvolucaoFinanceira: any[];
  rubricasVigencia = [];
  tituloVigenciaAtual: string;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    public token: TokenStorageService,
    private location: Location,
    private datePipe: DatePipe,
    private modalService: NgbModal
  ) {
    this.obterPermissoes();
    this.currentUser = this.token.getUser();
    this.nuContrato = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.nuContrato = this.route.snapshot.paramMap.get('id');
    this.obterContrato(this.nuContrato);
    this.obterVigenciasContrato(this.nuContrato)
  }

  obterPermissoes() {
    this.permissions = this.token.getActionPolicies(ModuleEnum.Contratos);
  }

  async obterVigenciasContrato(nuContrato: string): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<Gcptb002ContratoTipo>>(`${Endpoints.URL_CONTRATOS}/vigencias-contrato?nuContrato=${nuContrato}`);
      this.contratoVigencia = response;
      const resp: any = response.data;
      this.vigenciaAtual = resp.find(item => item.iC_VIGENCIA_ATUAL == true);
      this.vigenciasAnteriores = resp.filter(item => item.iC_VIGENCIA_ATUAL != true && item.cO_RUBRICA == 'TOTAL');
      this.vigenciaSelecionada = this.vigenciasAnteriores[0];
      this.montaVigenciaAtual();
      this.loading = false;
    } catch (error) {
      console.error(error);
      this.loading = false;
    }
  }

  public apresentaDia(nuDia: number, flag: boolean) {
    if (nuDia != null && nuDia > 0) {
      return nuDia.toString() + '°' + (flag ? ' dia útil' : '');
    }
    return '--';
  }

  public async obterContrato(nuContrato: string): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<ContratoResponse>>(`${Endpoints.URL_CONTRATOS}/` + nuContrato);
      this.contrato = response.data;
      await this.obterMensalizacaoContrato(this.contrato);
    } catch (error) {
    }
  }

  public async obterMensalizacaoContrato(contrato: ContratoResponse): Promise<void> {

    try {
      const response = await this.apiService.get<
        ApiResponse<Gcpvw008Mensalizacao[]>
      >(`${Endpoints.URL_MENSALIZACAO}/contrato?coContrato=${contrato.nuContrato}`);
      this.gcpvw008Mensalizacao = response.data;
      this.gcpvw008Mensalizacao.sort((a, b) => (a.dE_PERIODO < b.dE_PERIODO ? -1 : 1));
      this.rubricas = this.gcpvw008Mensalizacao.filter((item, i, arr) => arr.findIndex((t) => t.dE_RUBRICA === item.dE_RUBRICA) === i);
      const totalTab:any = {
        nU_MENSALIZACAO:0,
        dE_CONTRATO: "",
        dE_PERIODO : "",
        dE_RUBRICA : "TOTAL",
        dT_FIM_VIGENCIA: "",
        dT_INI_VIGENCIA: "",
        obS_PARCELA:null,
        vR_PLANEJADO:0,
        vR_EXECUTADO:0
      }
      this.rubricas.unshift(totalTab);
      this.gcpvw008Mensalizacao.unshift(totalTab);

      if(this.gcpvw008Mensalizacao.length > 0){
        this.semMensalizacao = false;
      }

      contrato.gcptb006Vigencias.forEach(contr => {
        const dataInicioVigenciaContrato = new Date (contr.dtInicio)
        const dataTerminoVigenciaContrato = new Date (contr.dtTermino)
        if(this.hoje >= dataInicioVigenciaContrato && this.hoje <= dataTerminoVigenciaContrato){
          this.dT_INI_VIGENCIA = contr.dtInicio;
          this.dT_TERMINO_VIGENCIA = contr.dtTermino;
          const qtdMeses = (dataTerminoVigenciaContrato.getFullYear() - dataInicioVigenciaContrato.getFullYear())*12 + (dataTerminoVigenciaContrato.getMonth() - dataInicioVigenciaContrato.getMonth());
        }
      });
      this.loading = false;
    } catch (error) {
    }
  }

  public async obterExecucaoOrcamentariaContrato(nuContrato: string): Promise<void> {
    try {
      const response = await this.apiService.get<ApiResponse<Gcpvw018EexcucaoOrcamentaria[]>>(`${Endpoints.URL_EXECUCAO_ORCAMENTARIA}/contrato?nuContrato=${nuContrato}`);
      this.gcpvw018EexcucaoOrcamentariaList = response.data;
      this.gcpvw018EexcucaoOrcamentariaList.forEach(element => {
        if (element.periodo.includes('2024')) {
          this.gcpvw018EexcucaoOrcamentariaListAnoVigente.push(element)
          this.totalExecucao += element.execucao
        }
      });
      this.loading = false;
    } catch (error) {

    }
  }

  public filtroRegistros: any = {
    pageNumber: 1,
    pageSize: 11,
    nuPerfil: null,
    filtro: '',
  };

  goBackToPrevPage(): void {
    this.location.back();
  }

  formatarNumeroParaReal(numero: number): string {
    return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
  formatarDatas(){
    this.competencias = this.competencias.map(data => {
      const dateObj = new Date(data);
      const mes = dateObj.getMonth() + 1; // Mês (0-11), adiciona +1 para ficar (1-12)
      const ano = dateObj.getFullYear();
      return `${mes.toString().padStart(2, '0')}/${ano}`;
    });

  }

  getCompetencias(startDate: any, endDate: any): number {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const yearsDifference = end.getFullYear() - start.getFullYear();
    const monthsDifference = end.getMonth() - start.getMonth();

    return yearsDifference * 12 + monthsDifference;
  }

  linkContrato(){
    const partesContrato = this.contrato.coContrato.split('/');
    const contratoFormatado = this.contrato.coContrato.replace('/','_');

    window.open('https://caixa.sharepoint.com/:f:/r/sites/Arquivos7550/Documentos%20Compartilhados/TIPO_2_DIGITAL/' + partesContrato[1] + '/' + contratoFormatado ,'_blank');
  }

  montaVigenciaAtual(){
    if(this.vigenciaAtual == null){
      this.tituloVigenciaAtual = "Encerrada"
    }else{
      this.tituloVigenciaAtual = 'VIGÊNCIA ATUAL (' + this.datePipe.transform(this.vigenciaAtual.iniciO_VIGENCIA,'dd/MM/yyyy') + ' a ' + this.datePipe.transform(this.vigenciaAtual.fiM_VIGENCIA,'dd/MM/yyyy') + ')'
    }
  }

  onTabChange(event){
    event.tab.textLabel == 'OUTRAS VIGÊNCIAS' ? this.showSelect = true : this.showSelect = false;
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
    modalRef.componentInstance.coContrato = this.contrato.coContrato;
  }
}
