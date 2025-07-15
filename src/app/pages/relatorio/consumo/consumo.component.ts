import { Component, OnInit } from '@angular/core';
import { ApiResponse } from 'src/app/models/api-response';
import { Gcptb001ContratoResponse, ContratoApiResponse, ContratoItem } from 'src/app/models/Gcptb001ContratoResponse';
import { ApiService } from 'src/app/services/api.service';
import { Endpoints } from 'src/app/shared/enums/endpoints';
import { Select2Data } from 'ng-select2-component';
import {
  ActionPolicies,
  ModuleEnum,
  TokenStorageService,
} from 'src/app/services/token-storage.service';
import * as fileSaver from 'file-saver';
import { ActivatedRoute, Router } from '@angular/router';
import { SortEvent } from 'primeng/api';

@Component({
  selector: 'app-consumo',
  templateUrl: './consumo.component.html',
  styleUrls: ['./consumo.component.scss'],
})
export class ConsumoComponent implements OnInit {
  permissions: ActionPolicies;

  contratosOrigem: ContratoItem[];
  contratos: ContratoItem[];

  selectedContratos: Gcptb001ContratoResponse[];

  statuses: any[];
  
  loading: boolean = true;

  activityValues: number[] = [0, 100];

  currentUser: any;

  selectTiposContrato: Select2Data;
  selectTiposFornecedor: Select2Data;
  selectTiposTpContrato: Select2Data;
  selectTiposGestor: Select2Data;
  selectTiposStatus: Select2Data;
  selectTiposAcuracia: Select2Data;

  selectedTipoContrato: string = null;
  selectedTipoFornecedor: string = null;
  selectedTipoTpContrato: string = null;
  selectedTipoGestor: string = null;
  selectedTipoStatus: string = null;
  selectedTipoAcuracia: string = null;

  isRotaAtas: boolean = false;
  tituloPage: string = 'Lista de Contratos';
  rota: string = '';
  filtroRegistros: any = {
    pageNumber: 1,
    pageSize: 10,
    Contrato: null,
    Fornecedor: null,
    Tipo: null,
    Gestor: null,
    Status: null,
    TipoAcuracia: null,
    NoTipoArp: null,
    Field: null,
    Order: null
  };

  
rowsOptions = [
    10,
    20, 
    50,
    { label: 'Todos', value: 0 }
  ];
  


  quantidadeTotal: number = 0;

  constructor(
    private apiService: ApiService,
    private token: TokenStorageService,
    private route: ActivatedRoute
  ) {
    this.obterPermissoes();
    this.currentUser = this.token.getUser();
  }

  ngOnInit() {
    this.validarRotaAtas();
    this.obterContratos();
    this.selectTiposAcuracia = [{value: '1', label: 'Menor 98%'}, {value: '2', label: 'Entre 98% e 101%'}, {value: '3', label: 'Entre 102% e 104%'},{value: '4', label: 'Acima 105%'}]
  }

  obterPermissoes() {
    this.permissions = this.token.getActionPolicies(ModuleEnum.Contratos);
  }

  aoOrdenar(event : SortEvent){

    const field = event.field; 
    const order = event.order; 
  
    console.log(this.contratos)
    this.contratos.sort((a, b) => {
      let valorA = a[field];
      let valorB = b[field];
 
      if (valorA instanceof Date === false && field.includes('Data')) {
        valorA = new Date(valorA);
        valorB = new Date(valorB);
      }
   
      if (typeof valorA === 'string') {
        return valorA.localeCompare(valorB) * order;
      }
  
      return (valorA < valorB ? -1 : valorA > valorB ? 1 : 0) * order;
    });
  }
  assignCopy() {
    this.contratos = Object.assign([], this.contratosOrigem);
  }

  navegarInfoContrato(coContrato: string, nuContrato: number) {
    if (coContrato.startsWith('81000') || this.isRotaAtas) {
      this.navegarParaDetalhes(nuContrato)
    } else {
      this.navegarParaEvolucao(nuContrato)
    }
  }
  navegarParaEvolucao(nuContrato: number) {
    const url = `/#/contrato/evolucao-financeira/${nuContrato}`
    window.open(url, '_blank');
  }

  navegarParaDetalhes(nuContrato: number) {
    const url = `/#/contrato/detalhe/v/${nuContrato}`
    window.open(url, '_blank');
  }


  public async obterContratos(): Promise<void> {

    this.loading = true;
    try {

      const filtrosLimpos = this.limparFiltrosNulos(this.filtroRegistros);
      const response = await this.apiService.get<ApiResponse<ContratoApiResponse>>
        (`${Endpoints.URL_CONTRATOS}/relatorio-consumo`, filtrosLimpos);
      this.contratosOrigem = this.mapObject(response?.data?.contratos);
      this.selectTiposContrato = response?.data?.listaContrato.map(c => ({ label: c, value: c }));
      this.selectTiposFornecedor = response?.data?.listaFornecedor.map(f => ({ label: f, value: f }));
      this.selectTiposTpContrato = response?.data?.listaTipo.map(t => ({ label: t, value: t }));
      this.selectTiposGestor = response?.data?.listaGestor.map(g => ({ label: g, value: g }));
      this.selectTiposStatus = response?.data?.listaStatus.map(s => ({ label: s, value: s }));
      this.quantidadeTotal = response.data.totalRecords;
      this.assignCopy();
      this.loading = false;
    } catch (error) {
      this.loading = false;
      console.error('Erro ao obter contratos', error);
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


  mapObject(contrato : ContratoItem[]){
    return contrato.map(c => ({
      ...c,
      percConsumo: typeof c.percConsumo === 'string' ? parseFloat(
        c.percConsumo
          .replace(/\./g, '')
          .replace(',', '.')

      ) : c.percConsumo,
      saldoDisponivel: typeof c.saldoDisponivel === 'string' ? parseFloat(
      c.saldoDisponivel
       .replace(/\./g, '')
       .replace(',', '.')
       )
       : c.saldoDisponivel,
       pC_ACURACIA: typeof c.pC_ACURACIA === 'string' 
       ? parseFloat(c.pC_ACURACIA) 
        : c.pC_ACURACIA,
        percVrExecutado: typeof c.percVrExecutado === 'string' ? 
         parseFloat(
          c.percVrExecutado
            .replace(/\./g, '')
            .replace(',', '.')
        ):
        c.percVrExecutado,
        percDiasCorridos : typeof c.percDiasCorridos === 'string' ? 
        parseFloat(
         c.percDiasCorridos
           .replace(/\./g, '')
           .replace(',', '.')
       ):
       c.percDiasCorridos,
       vrExecutadoFormatado: typeof c.vrExecutadoFormatado === 'string' ? 
       parseFloat(
        c.vrExecutadoFormatado
          .replace(/\./g, '')
          .replace(',', '.')
      ):
      c.vrExecutadoFormatado,
      vrGlobalFormatado: typeof c.vrGlobalFormatado === 'string' ? 
      parseFloat(
       c.vrGlobalFormatado
         .replace(/\./g, '')
         .replace(',', '.')
     ):
     c.vrGlobalFormatado,
    }))
  }

  async updateRelatorio(e, op: number): Promise<void> {
    this.loading = true;
    this.filtroRegistros.pageNumber = 1;
    switch (op) {
      case 1:
        this.filtroRegistros.Contrato = e.value;
        break;
      case 2:
        this.filtroRegistros.Fornecedor = e.value;
        break;
      case 3:
        this.filtroRegistros.Tipo = e.value;
        break;
      case 4:
        this.filtroRegistros.Gestor = e.value;
        break;
      case 5:
        this.filtroRegistros.Status = e.value;
        break;
      case 6:
        this.filtroRegistros.TipoAcuracia = e.value;
        break;
    }
    await this.obterContratos();
    this.loading = false;
  }

  loadPage(event: any) {
    const page = (event.first || 0) / (event.rows || this.filtroRegistros.pageSize) + 1;
    const pageSize = event.rows || this.filtroRegistros.pageSize;

    if (page !== this.filtroRegistros.pageNumber || pageSize !== this.filtroRegistros.pageSize) {
      this.filtroRegistros.pageNumber = page;
      this.filtroRegistros.pageSize = pageSize;
      this.obterContratos();
    }
  }

  async exportExcel() {

    if (this.contratos.length > 0) {
      const dadosFiltrados = this.contratos.map(item => ({
        "Nr. Contrato": item.coContrato,
        "Fornecedor": item.noEmpresa,
        "CNPJ": item.coCnpj,
        "Tipo": item.no_Tipo_Arp,
        "Objeto": item.noObjeto,
        "Unidade Demandante": item.sgFilial,
        "Status": item.icAtivo ? 'Ativo' : 'Encerrado',
        "Data de Início": new Date(item.dtInicioContrato).toLocaleDateString('pt-BR'),
        "Data de Término": new Date(item.dtTerminoContrato).toLocaleDateString('pt-BR'),
        "Valor Global": item.vrGlobal,
        "Valor Executado": item.vrExecutado,
        "% Dias Corridos": item.percDiasCorridos,
        "% Executado Vigência": item.percVrExecutado,
        "% Consumo": item.percConsumo,
        "Saldo Disponível": item.saldoDisponivel,
        "Acurácia": item.pC_ACURACIA ? item.pC_ACURACIA : 0 
      }));

      import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(dadosFiltrados);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, "Consumo_");
      });
    } else {
      console.error('Erro ao exportar dados, tente novamente mais tarde ');
    }
  }

  gerarNomeArquivo(): string {
    const agora = new Date();
    const ano = agora.getFullYear();
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const dia = String(agora.getDate()).padStart(2, '0');
    const horas = String(agora.getHours()).padStart(2, '0');
    const minutos = String(agora.getMinutes()).padStart(2, '0');
    const segundos = String(agora.getSeconds()).padStart(2, '0');

    const nomeArquivo = `Consumo_${ano}${mes}${dia}${horas}${minutos}${segundos}.xls`;
    return nomeArquivo;
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    fileSaver.saveAs(data, this.gerarNomeArquivo() + EXCEL_EXTENSION);
  }

  validarRotaAtas() {
    let rota = this.route.snapshot.url[1]?.path;
    this.rota = rota;
    this.isRotaAtas = (rota && rota == 'atas') ? true : false;
    if (this.isRotaAtas) {
      this.tituloPage = 'Lista de Atas'
    }
  }


  formataCasaDecimal(valorPercent: number): string{
    if(valorPercent == 100)
      return valorPercent.toString();
    else
      return valorPercent.toFixed(2);
  }

  getColor(value: string){
    switch(value){
      case '1':
        break;
      case '2':
        return '	#DCFFD5';
      case '3':
        return ' #FFFBBB';
      case '4':
        return ' #FFA6A3';
    }
  }
}
