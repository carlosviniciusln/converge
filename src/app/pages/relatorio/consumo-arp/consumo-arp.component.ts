import { Component, OnInit } from '@angular/core';
import { ApiResponse } from 'src/app/models/api-response';
import { Gcptb001ContratoResponse, ContratoApiResponse, ContratoItem } from 'src/app/models/Gcptb001ContratoResponse';
import { ApiService } from 'src/app/services/api.service';
import { Endpoints } from 'src/app/shared/enums/endpoints';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Select2Data } from 'ng-select2-component';
import {
  ActionPolicies,
  ModuleEnum,
  TokenStorageService,
} from 'src/app/services/token-storage.service';
import * as fileSaver from 'file-saver';
//import { LazyLoadEvent } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ContratoCadastroComponent } from '../../contrato/contrato-cadastro/contrato-cadastro.component'; 

@Component({
  selector: 'app-consumo',
  templateUrl: './consumo-arp.component.html',
  styleUrls: ['./consumo-arp.component.scss'],
})
export class ConsumoArpComponent implements OnInit {
  permissions: ActionPolicies;

  contratosOrigem: ContratoItem[];
  contratosOrigemExcel: ContratoItem[];
  contratos: ContratoItem[];

  selectedContratos: Gcptb001ContratoResponse[];

  statuses: any[];

  loading: boolean = true;

  activityValues: number[] = [0, 100];

  currentUser: any;

  selectTiposContrato: Select2Data;
  selectTiposInstrumentos: Select2Data;
  selectTiposFornecedor: Select2Data;
  selectTiposTpContrato: Select2Data;
  selectTiposGestor: Select2Data;
  selectTiposStatus: Select2Data;

  selectedTipoContrato: string = null;
  selectedTipoInstrumento: string = null;
  selectedTipoFornecedor: string = null;
  selectedTipoTpContrato: string = null;
  selectedTipoGestor: string = null;
  selectedTipoStatus: string = null;

  isRotaAtas: boolean = false;
  tituloPage: string = 'Lista de Contratos ARPs';
  rota: string = '';
  filtroRegistros: any = {
    pageNumber: 1,
    pageSize: 10,
    Contrato: null,
    Fornecedor: null,
    Tipo: null,
    Gestor: null,
    Status: null,
    TipoInstrumentos: null,
    NoTipoArp: null
  };

  quantidadeTotal: number = 0;

  constructor(
    private apiService: ApiService,
    private modalService: NgbModal,
    private token: TokenStorageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.obterPermissoes();
    this.currentUser = this.token.getUser();
  }

  obterPermissoes() {
    this.permissions = this.token.getActionPolicies(ModuleEnum.Contratos);
  }

  ngOnInit() {
    this.obterContratos();
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

  filterItem(value) {
    if (!value) {
      this.assignCopy();
    }

    if (value == 'ativo') {
      this.contratos = Object.assign([], this.contratosOrigem).filter(
        (item) => item.icAtivo == true)
    } else if (value == 'encerrado') {
      this.contratos = Object.assign([], this.contratosOrigem).filter(
        (item) => item.icAtivo == false)
    } else {

      this.contratos = Object.assign([], this.contratosOrigem).filter(
        (item) =>
          item.coContrato.toLowerCase().indexOf(value.toLowerCase()) > -1 ||
          item.noEmpresa.toLowerCase().includes(value) ||
          item.noContratoTipo.toLowerCase().includes(value) ||
          item.sgFilial.toLowerCase().includes(value)
      );
    }
  }

  public async obterContratos(): Promise<void> {

    this.loading = true;
    try {
      const filtrosLimpos = this.limparFiltrosNulos(this.filtroRegistros);
      filtrosLimpos.NoTipoArp = 'ATA_DE_REGISTRO_DE_PRECOS';

      const response = await this.apiService.get<ApiResponse<ContratoApiResponse>>
        (`${Endpoints.URL_CONTRATOS}/relatorio-consumo`, filtrosLimpos);
      this.contratosOrigem = response?.data?.contratos;
      this.selectTiposContrato = response?.data?.listaContrato.map(c => ({ label: c, value: c }));
      this.selectTiposInstrumentos = response?.data?.listaInstrumentos.map(c => ({ label: c, value: c }));
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
        this.filtroRegistros.TipoInstrumentos = e.value;
        break;
      case 4:
        this.filtroRegistros.Gestor = e.value;
        break;
      case 5:
        this.filtroRegistros.Status = e.value;
        break;
    }
    await this.obterContratos();
    this.loading = false;
  }

  loadPage(event: TableLazyLoadEvent) {
    const page = (event.first || 0) / (event.rows || this.filtroRegistros.pageSize) + 1;
    const pageSize = event.rows || this.filtroRegistros.pageSize;

    if (page !== this.filtroRegistros.pageNumber || pageSize !== this.filtroRegistros.pageSize) {
      this.filtroRegistros.pageNumber = page;
      this.filtroRegistros.pageSize = pageSize;
      this.obterContratos();
    }
  }

  async exportExcel() {

    await this.obterContratosExcel();

    if (this.contratosOrigemExcel.length > 0) {
      const dadosFiltrados = this.contratosOrigemExcel.map(item => ({
        "Nr. Instrumento": item.coContrato,
        "Nr. Processo": item.co_Processo,
        "Fornecedor": item.noEmpresa,
        "CNPJ": item.coCnpj,
        "Tipo de Instrumento" : item.noContratoTipo,
        "Objeto": item.noObjeto,
        "Unidade Demandante": item.sgFilial,
        "Status": item.icAtivo ? 'Ativo' : 'Encerrado',
        "Vigência Atual - Início": new Date(item.dtInicioContrato).toLocaleDateString('pt-BR'),
        "Vigência Atual - Fim": new Date(item.dtTerminoContrato).toLocaleDateString('pt-BR'),
        "% Dias Corridos": item.percDiasCorridos,
        "Valor Global Vigente": item.vrGlobal,
        "Pagamentos": item.vrExecutado,
        "% Executado Vigência": item.percVrExecutado,
        "% Consumo": item.percConsumo,
        "Saldo Disponível": item.saldoDisponivel
      }));

      import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(dadosFiltrados);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, "Consumo Arp_");
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

    const nomeArquivo = `Consumo Arp_${ano}${mes}${dia}${horas}${minutos}${segundos}`;
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

  public async obterContratosExcel(): Promise<void> {

    this.loading = true;
    try {
      const filtrosLimpos = this.limparFiltrosNulos(this.filtroRegistros);
      filtrosLimpos.NoTipoArp = 'ATA_DE_REGISTRO_DE_PRECOS';

      const response = await this.apiService.get<ApiResponse<ContratoApiResponse>>
        (`${Endpoints.URL_CONTRATOS}/relatorio-consumo-excel`, filtrosLimpos);

      this.contratosOrigemExcel = response?.data?.contratos;

      this.loading = false;

    } catch (error) {
      this.loading = false;
      console.error('Erro ao obter contratos', error);
    }
  }

  formataCasaDecimal(valorPercent: number): string{
    if(valorPercent == 100)
      return valorPercent.toString();
    else
      return valorPercent.toFixed(2);
  }
}
