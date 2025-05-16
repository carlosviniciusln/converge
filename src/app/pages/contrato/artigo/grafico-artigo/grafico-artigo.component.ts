import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { RetornoArtigo } from 'src/app/models/Gcptb001ContratoResponse';
import { ApiResponse } from 'src/app/models/api-response';
import { ApiService } from 'src/app/services/api.service';
import { Endpoints } from 'src/app/shared/enums/endpoints';

@Component({
  selector: 'app-grafico-artigo',
  templateUrl: './grafico-artigo.component.html',
  styleUrls: ['./grafico-artigo.component.scss']
})
export class GraficoArtigoComponent implements OnInit {

  highcharts = Highcharts;
  chart: Highcharts.Chart | null;
  updateFlag: boolean = false;
  loading: boolean = true;
  filtroRegistros: any = {};

  chartOptions: Highcharts.Options = {
    chart: {
      type: 'column',
      height: "300vh",
      zoomType: 'xy',
      reflow: true,
    },
    title: {
      text: ""
    },
    xAxis: {
      categories: [],
      labels: {
        useHTML: true,
        formatter: function () {
          const ano = this.value;
          return `<a class="nav-link" href="#/contrato/detalhe/v/${ano}" target="_blank" style="color: #000000; font-weight: bold; font-size: 20px;">${ano}</a>`;
        }
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
        dataLabels: {
          enabled: true,
          align: 'center',
          verticalAlign: 'top',
          y: -25,
          style: {
            fontWeight: 'bold'
          },
          formatter() {
            return new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              minimumFractionDigits: 2
            }).format(this.y as number);
          }
        }
      }
    },
    tooltip: {
      formatter: function () {
        return `<strong>${this.series.name}:</strong> ` +
          new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(this.y as number);
      }
    },
    series: [
      {
        type: 'column',
        name: 'Valor Executado',
        data: [],
        color: '#2dce89'
      }
    ],
    legend: {
      enabled: false
    },
    credits: {
      enabled: false
    },
    exporting: {
      enabled: true,
      chartOptions: {
        credits: {
          enabled: false,
        },
        legend: {
          enabled: false
        }
      }
    }
  };

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.obterArtigos();
  }

  chartCallback: Highcharts.ChartCallbackFunction = function (chart): void {
    setInterval(() => {
      chart.reflow();
    }, 500);
  }

  public async obterArtigos(): Promise<void> {
    this.loading = true;

    try {
      const response = await this.apiService.get<ApiResponse<any>>(
        `${Endpoints.URL_CONTRATOS}/grafico-artigos-81`,
        this.filtroRegistros
      );

      const artigos: RetornoArtigo[] = response?.data ?? [];
      const categorias = artigos.map(a => a.coContrato?.split('/')[1]);
      const valores = artigos.map(a => a.vrExecutado);

      this.chartOptions.xAxis = {
        ...this.chartOptions.xAxis,
        categories: categorias,
        labels: {
          useHTML: true,
          formatter: function () {
            const ano = this.value;
            return montalabel(artigos,ano)
          }
        }
      };

      this.chartOptions.series = [{
        type: 'column',
        name: 'Valor Executado',
        data: valores,
        color: '#2dce89'
      }];

      this.updateFlag = true;
      this.loading = false;

    } catch (error) {
      this.loading = false;
      console.error('Erro ao obter contratos', error);
    }
  }
}

function montalabel(artigos: RetornoArtigo[], ano: string | number) {
  const nuContrato = artigos.filter(x => x.coContrato?.split('/')[1] === ano)[0].nuContrato;
  return `<a class="nav-link" href="#/contrato/detalhe/v/${nuContrato}" target="_blank" style="color: #000000; font-weight: bold; font-size: 20px;">${ano}</a>`;
}
