import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
// import theme from 'highcharts/themes/dark-unica';
// theme(Highcharts);

@Component({
  selector: 'app-grafico-aquisicao-old',
  templateUrl: './grafico-aquisicao.component.html',
  styleUrls: ['./grafico-aquisicao.component.scss']
})
export class GraficoAquisicaoComponent implements OnInit {

  @Input()
  titulo: string = "";
  
  @Input()
  categorias: string[] = [];

  @Input()
  series: any[] = [];

  highcharts = Highcharts;

  updateFlag : boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.updateData();
  }

  updateData() {
    this.updateFlag = true;
    this.chartOptions.xAxis["categories"] = this.categorias;
    this.chartOptions.series = this.series.map((m) => ({type: undefined, name: m.name, data: m.data, color: m.color }))
    }

  chartOptions: Highcharts.Options = {
    chart: {
      type: 'column'
    },
    title: {
      text: ""
    },
    xAxis: {
      title: {
        text: 'Período'
      },
      categories: []
    },
    yAxis: {
      title: {
        text: "Valor"
      }
    },
    series: []
  }
}
