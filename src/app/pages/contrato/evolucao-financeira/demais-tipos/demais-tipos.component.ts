import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ApiResponse } from 'src/app/models/api-response';
import { EvolucaoFinanceira } from 'src/app/models/evolucao-financeira';
import { ApiService } from 'src/app/services/api.service';
import { Endpoints } from 'src/app/shared/enums/endpoints';
import * as html2pdf from 'html2pdf.js';
import { Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActionPolicies, ModuleEnum, TokenStorageService } from 'src/app/services/token-storage.service';
import * as Highcharts from 'highcharts';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DetalheEvolucaoComponent } from './detalhe-evolucao/detalhe-evolucao.component';
import { ContratoResponse, ContratoResponseV2 } from 'src/app/models/contrato-response';
import { MatTabChangeEvent } from '@angular/material/tabs';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { DetalheFinanceiroComponent } from '../detalhe-financeiro/detalhe-financeiro.component';


@Component({
  selector: 'app-demais-tipos',
  templateUrl: './demais-tipos.component.html',
  styleUrls: ['./demais-tipos.component.scss'],

})
export class DemaisTiposComponent implements OnInit, OnChanges {
  @ViewChild('chart', { static: true }) chartElement: ElementRef;
  @ViewChild(DetalheFinanceiroComponent) relatorioCompletoPdf!: DetalheFinanceiroComponent;
  chart: Highcharts.Chart;
  @Input() permissions: ActionPolicies;
  @Input() vigenciaAnterior: any;
  @Input() vigenciaAtual: any;
  @Input() vigenciaAnteriorSelect: any
  @Input() contrato : ContratoResponse;
  @Output() abaSelecionada = new EventEmitter<string>();

  nuContrato!: string;
  series: any[] = []
  periodos: any;
  loading: boolean = true;
  loadingPDF: boolean = false;
  rubricas = [];
  listaEvolucaoFinanceira: EvolucaoFinanceira[];
  listaResumoPagamentos: any[] = [];
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    chart: {
      type: 'column',
      events: {
        click: (event) => {

        }
      }
    },
    title: {
      text: 'Comparação Mensal X Executado'
    },
    credits: {
      enabled: false
    },
    xAxis: {
      categories: ['Categoria 1', 'Categoria 2', 'Categoria 3'],
      title: {
        text: 'Período'
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Valor'
      },
      stackLabels: {
        enabled: true,
        style: {
          fontWeight: 'bold'
        }
      }
    },
    plotOptions: {
      column: {

        grouping: true
      },
      series: {
        point: {
          events: {
            click: (event) => {
            }
          }
        }
      }
    },
    series: [
      {
        type: 'line', // Alterar para 'line' para a série Valor Planejado
        name: 'Estimativa Mensal',
        data: [] as number[], // Certifique-se de que é um array de números
        color: '#ff5733'  // Cor da linha para Valor Planejado
      },
      {
        type: 'column', // Manter como 'column' para a série Valor Executado
        name: 'Valor Executado',
        data: [] as number[], // Certifique-se de que é um array de números
        color: '#2dce89' // Cor das barras para Valor Executado
      }
    ]
  };
  coRubricaSelecionada: string = '';
  vigenciaUsuarioSelecionada: any;
  constructor(
    private apiService: ApiService,
    private location: Location,
    public spinner: NgxSpinnerService,
    public token: TokenStorageService,
    private modalService: NgbModal,
  ) {
    this.obterPermissoes();
  }

  obterPermissoes() {
    this.permissions = this.token.getActionPolicies(ModuleEnum.Contratos);
  }

  ngOnInit(): void {
    this.populaVariaveis()
    this.obterDadosGraficosVigencias(this.vigenciaUsuarioSelecionada);
    this.obterResumoPagamentos(this.nuContrato, this.vigenciaUsuarioSelecionada, this.coRubricaSelecionada);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.populaVariaveis()

    if (changes.vigenciaAnteriorSelect?.currentValue != undefined) {
      this.vigenciaAnterior = changes.vigenciaAnteriorSelect.currentValue;
      this.obterDadosGraficosVigencias(this.vigenciaAnterior);
      this.obterResumoPagamentos(this.nuContrato, this.vigenciaAnterior, this.coRubricaSelecionada);
    }
  }

  populaVariaveis() {
    if (this.coRubricaSelecionada == null || this.coRubricaSelecionada == '') {
      this.coRubricaSelecionada = 'TOTAL';
    }
    if (this.vigenciaAtual) {
      this.nuContrato = this.vigenciaAtual.nU_CONTRATO;
      this.vigenciaUsuarioSelecionada = this.vigenciaAtual;
    } else {
      this.nuContrato = this.vigenciaAnterior.nU_CONTRATO;
      this.vigenciaUsuarioSelecionada = this.vigenciaAnterior;
    }
  }

  openModalDetalhe(dE_PERIODO: string, nU_CONTRATO: number, tipo: string) {
    const modalRef = this.modalService.open(DetalheEvolucaoComponent, {
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'custom-class',
    });

    modalRef.componentInstance.dE_PERIODO = dE_PERIODO;
    modalRef.componentInstance.nU_CONTRATO = nU_CONTRATO;
    modalRef.componentInstance.tipo = tipo;
  }

  public async obterResumoPagamentos(nuContrato: string, nuVigencia: any, coRubricaSelecionada: string): Promise<void> {
    // this.nuContrato = nuContrato;
    // this.vigenciaUsuarioSelecionada = nuVigencia;
    try {
      const response = await this.apiService.get<ApiResponse<EvolucaoFinanceira[]>>(
        `${Endpoints.URL_CONTRATOS}/detalhe-resumo-pagamento-evolucao-financeira?nuContrato=${nuContrato}&nuVigencia=${nuVigencia?.nU_VIGENCIA}&coRubrica=${coRubricaSelecionada}`
      );
      this.listaResumoPagamentos = response.data;
      this.loading = false;
    } catch (error) {
      console.error('Error fetching data', error);
      this.loading = false;
    }
  }

  async detalharPagamento(evolucao: any) {
    try {
      this.loading = true;
      evolucao.expanded = !evolucao.expanded;
      if (evolucao.expanded && !evolucao.detalhes) {
        const response = await this.apiService.get<
          ApiResponse<EvolucaoFinanceira[]>
        >(`${Endpoints.URL_CONTRATOS}/detalhe-pagamento-evolucao-financeira?dePeriodo=${evolucao.dE_PERIODO}&nuVigencia=${evolucao.nU_VIGENCIA}&coRubrica=${this.coRubricaSelecionada}`)
        evolucao.detalhes = response.data || [];
        this.loading = false;
      }
    } catch (error) {
      this.loading = false;
      console.error(error, 'detalharPagamento');
    }
  }

  public async obterDadosGraficosVigencias(params): Promise<void> {
    try {
      const response = await this.apiService.get<
        ApiResponse<EvolucaoFinanceira[]>
      >(`${Endpoints.URL_CONTRATOS}/grafico-vigencias-contrato?nuContrato=${params.nU_CONTRATO}&nuVigencia=${params.nU_VIGENCIA}`);
      const resp: any = response.data

      this.listaEvolucaoFinanceira = [this.vigenciaAtual];
      if (this.vigenciaAnterior) {
        this.listaEvolucaoFinanceira = [this.vigenciaAnterior]
      }
      this.rubricas = this.agruparDadosPorRubrica(resp);

      this.rubricas = this.rubricas.map(item => {
        return item = {
          ...item,
          series: [
            {
              color: '#ffffff',
              data: item.valoresMensais,
              name: 'Vigência Mensal'
            },
            {
              color: '#000000',
              data: item.valoresExecutados,
              name: 'Valores Executados'
            }
          ]
        }
      })

      this.loading = false;
    } catch (error) {
      console.error(error, 'error');

    }
  }

  createChart() {
    const info: any = this.listaEvolucaoFinanceira;
    this.chartOptions.xAxis = {
      categories: info[0].grafico.categorias
    };
    this.chartOptions.series = [
      {
        type: 'line',
        name: 'Estimativa Mensal',
        data: info[0].grafico.series.find(item => item.name == "Estimativa Mensal").data,
        color: '#F9B200'
      },
      {
        type: 'column',
        name: 'Valor Executado',
        data: info[0].grafico.series.find(item => item.name == "Valor Executado").data,
        color: '#005CA9'
      },
    ];

    this.updateChart();
  }

  agruparDadosPorRubrica(array) {

    const agrupados = {};

    array.forEach(item => {
      const { cO_RUBRICA, vR_EXECUTADO_MENSAL, vR_VIGENCIA_MENSAL, dE_PERIODO } = item;

      if (!agrupados[cO_RUBRICA]) {
        agrupados[cO_RUBRICA] = { cO_RUBRICA: cO_RUBRICA, valoresExecutados: [], valoresMensais: [], periodos: [] }
      }

      agrupados[cO_RUBRICA].valoresExecutados.push(vR_EXECUTADO_MENSAL);
      agrupados[cO_RUBRICA].valoresMensais.push(vR_VIGENCIA_MENSAL);
      agrupados[cO_RUBRICA].periodos.push(dE_PERIODO);
    }

    )
    return Object.values(agrupados)

  }

  getLatestDate(lista) {
    if (lista.length) {
      return lista.reduce((m, v, i) =>
        v.dtPagamentoEfetivo > m.dtPagamentoEfetivo && i ? v : m
      ).dtPagamentoEfetivo;
    }
  }

  downloadPDF() {
    this.spinner.show();

    for (var i = 0; i < this.listaEvolucaoFinanceira.length; i++) {
      document.getElementById('divGrafico_' + i).style.width = '1050px';
    }

    setTimeout(() => {
      var element = document.getElementById('divPDF');

      const elementCopy = element.cloneNode(true) as HTMLElement; // copy of the element to be printed
      const tableBodies = elementCopy.querySelectorAll('.cl-body'); // store div of table body
      const maxRowsPerPage = 13;

      // For each table
      for (let k = 0; k < tableBodies?.length; k++) {
        // Check table size
        const tableRows = tableBodies[k].getElementsByTagName('tr');

        // Ignore table if it is less or equal than maximum
        if (tableRows?.length <= maxRowsPerPage) continue;

        // Get number of new tables
        const newTableCount = Math.ceil(
          (tableRows?.length - 1) / maxRowsPerPage
        );

        // Create array of resulting tables
        const newTableBodies: HTMLElement[] = [];

        // Copy table body and clean content
        const tableBodyClean = tableBodies[k].cloneNode(true) as HTMLElement;
        const toDeleteRows = tableBodyClean.getElementsByTagName('tr');
        while (toDeleteRows.length > 1) {
          const toDeleteRow = toDeleteRows[1];
          toDeleteRow.parentNode?.removeChild(toDeleteRow);
        }

        // Break the table in smaller ones
        for (let i = 0; i < newTableCount; i++) {
          // Creating new table
          const newTable = tableBodyClean.cloneNode(true) as HTMLElement;
          const dataTables =
            newTable.getElementsByClassName('p-datatable-tbody');
          const dataTable = dataTables?.length > 0 ? dataTables[0] : null;
          if (dataTable == null) break;

          // Adding rows to new table
          const startIndex = i * maxRowsPerPage + 1;
          const endIndex = Math.min(
            (i + 1) * maxRowsPerPage + 1,
            tableRows.length
          );
          for (let j = startIndex; j < endIndex; j++) {
            const row = tableRows[j].cloneNode(true) as HTMLTableRowElement;
            dataTable.appendChild(row);
          }

          // Adding new table to array
          newTableBodies.push(newTable);
        }

        tableBodies[k].parentNode?.replaceChild(
          newTableBodies[0],
          tableBodies[k]
        );
        for (let i = 1; i < newTableBodies.length; i++) {
          elementCopy
            .querySelectorAll('.cl-table-component')
          [k].insertAdjacentElement('beforeend', newTableBodies[i]);
        }
      }

      var opt = {
        margin: [5, 5, 5, 5],
        filename: 'SobDemanda.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, dpi: 192, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
        pagebreak: { before: ['.cl-body', '.cl-consumo'], mode: 'avoid-all' },
      };

      html2pdf()
        .from(elementCopy)
        .set(opt)
        .toPdf()
        .get('pdf')
        .then((pdf) => {
          pdf.deletePage(1);
        })
        .save();

      for (var i = 0; i < this.listaEvolucaoFinanceira.length; i++) {
        document.getElementById('divGrafico_' + i).style.width = 'auto';
      }

      this.spinner.hide();
      elementCopy.remove();
    }, 1000);
  }

  public downloadExcel() {
    return this.apiService.downloadfile(
      `${Endpoints.URL_CONTRATOS_EVOLUCAO_FINANCEIRA}/excel/` + this.nuContrato
    );
  }

  goBackToPrevPage(): void {
    this.location.back();
  }

  initChart(): void {
    this.chart = Highcharts.chart(this.chartElement.nativeElement, this.chartOptions);
  }

  updateChart(): void {
    if (this.chart) {
      this.chart.update(this.chartOptions);
    }
  }

  destroyChart() {
    if (this.chart) {

      this.chart.destroy();
      this.chart = null;
    }
  }

  titulo(): string {
    if (this.vigenciaAnterior) {
      return 'CONTRATO ' + this.vigenciaAnterior.cO_CONTRATO + ' - RUBRICA: ' + this.coRubricaSelecionada
    } else {
      return 'CONTRATO ' + this.vigenciaAtual.cO_CONTRATO + ' - RUBRICA: ' + this.coRubricaSelecionada
    }
  }

  onTabChange(event: MatTabChangeEvent) {
    const tabLabel = event.tab.textLabel;
    this.coRubricaSelecionada = tabLabel;
    if (this.vigenciaAtual != undefined) {
      this.vigenciaUsuarioSelecionada = this.vigenciaAtual;
    } else {
      this.vigenciaUsuarioSelecionada = this.vigenciaAnterior;
    }
    this.obterResumoPagamentos(this.nuContrato, this.vigenciaUsuarioSelecionada, this.coRubricaSelecionada);
    //this.obterDadosGraficosVigencias(this.vigenciaUsuarioSelecionada);
    this.abaSelecionada.emit(this.coRubricaSelecionada + ',' + this.vigenciaUsuarioSelecionada.nU_VIGENCIA + ',' + this.vigenciaUsuarioSelecionada.iC_VIGENCIA_ATUAL);
    //this.obterDadosGraficosVigencias(this.vigenciaUsuarioSelecionada);
  }

  gerarPDF() {
    this.loadingPDF = true;

    setTimeout(() => {
    if(this.coRubricaSelecionada !== 'TOTAL'){
    const element = document.getElementById('area-pdf');
    if (!element) {
      return;
    }

    html2canvas(element).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeigth = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.setFontSize(18);
      pdf.text('Evolução Financeira', pdfWidth / 2, 12, {
        align: 'center'
      });

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeigth);
      pdf.save('Evolução Financeira.pdf');

    }).finally(()=>{
      this.loadingPDF = false;
  });


  }
  else{
   this.relatorioCompletoPdf.gerarRelatorioCompleto().then(resposta => {
    this.loadingPDF = false;
      if (resposta) {
        console.log('PDF gerado com sucesso!');
        } 
      else {
         console.warn('Falha ao gerar o PDF.');
        
         }
    });
  }

  },100);
  
}

}
