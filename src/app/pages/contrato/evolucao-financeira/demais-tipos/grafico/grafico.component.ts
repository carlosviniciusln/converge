import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Series } from 'src/app/models/evolucao-financeira';

@Component({
  selector: 'app-grafico',
  templateUrl: './grafico.component.html',
  styleUrls: ['./grafico.component.scss']
})
export class GraficoComponent implements OnInit {
  
  @Input()
  titulo: string = "";
  
  @Input()
  categorias: string[] = [];

  @Input()
  series: any[] = [];

  highcharts = Highcharts;
  chart: Highcharts.Chart | null;

  updateFlag : boolean = false;

  chartOptions: Highcharts.Options = {
    chart:{
      type: 'column',
      height: "300vh",
      zoomType: 'xy',
      reflow: true,      
    },
    title: {
      text: ""
    },
    credits:{
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
  }

  constructor() { }

  ngOnInit(): void {
    this.updateData();
  }

  updateData() {
    this.updateFlag = true;
    this.chartOptions.xAxis["categories"] = this.categorias;
    const estimativaMensal = this.series[0];
    const valoresExecutados = this.series[1];
    
    // this.chartOptions.series = this.series.map((m) => ({type: undefined, name: m.name, data: m.data }))
    this.chartOptions.series = [
      {
      type: 'line',
      name: 'Estimativa Mensal',
      data: estimativaMensal.data,
      color: '#F9B200'  
      },
      {
        type: 'column',
        name: 'Valor Executado',
        data: valoresExecutados.data,
        color: '#005CA9'
        },
  ];
  }

  chartCallback: Highcharts.ChartCallbackFunction = function (chart): void {
      setInterval(() => {
          chart.reflow();
      },500);
  }
}
