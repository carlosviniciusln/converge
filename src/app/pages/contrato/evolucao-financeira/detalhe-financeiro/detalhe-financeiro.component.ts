import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ContratoResponse, ContratoResponseV2 } from 'src/app/models/contrato-response';
import { ApiService } from 'src/app/services/api.service';
import { Endpoints } from 'src/app/shared/enums/endpoints';
import { ApiResponse } from 'src/app/models/api-response';
import { EvolucaoFinanceira } from 'src/app/models/evolucao-financeira';
import { Gcptb002ContratoTipo } from 'src/app/models/Gcptb001ContratoResponse';


@Component({
  selector: 'app-detalhe-financeiro',
  templateUrl: './detalhe-financeiro.component.html',
  styleUrls: ['./detalhe-financeiro.component.scss']
})
export class DetalheFinanceiroComponent implements OnInit {

@ViewChild('conteudo',{static: false}) conteudo!: ElementRef;
@Input() nuContrato: string;

public Contrato : ContratoResponse;
public ContratoV2 : ContratoResponseV2;

visivel = true;
isRotaAtas: boolean = false;
dadosVigenciaAtual: any;
totalCurrentVigencia: number = 0;
currentVigenciaRubricas: any[] = [];
inicioVigencia: string;
todasVigencias: any[];
rubricas = [];
fimVigencia: string;
listaNova: any;
ListaVigenciasRubricas : any[] = [];
listaResumoPagamentos: any[] = [];


  constructor(
    private apiService: ApiService,

  ) {


  }
  
  ngOnInit(): void {

   if(this.nuContrato){
    this.obterContrato();
    this.obterDadosVigenciaAtual();
    this.obterVigenciasContrato(this.nuContrato);
   }


  }

    async obterVigenciasContrato(nuContrato: string): Promise<void> {
      try {
        const response = await this.apiService.get<
          ApiResponse<Gcptb002ContratoTipo>
        >(`${Endpoints.URL_CONTRATOS}/vigencias-contrato?nuContrato=${nuContrato}`);
        const resp: any = response.data;
        this.todasVigencias = resp;
        let vigenciaAtual = resp.find(item => item.iC_VIGENCIA_ATUAL == true && item.cO_RUBRICA == 'TOTAL');
        this.obterDadosGraficosVigencias(vigenciaAtual)
        this.obterDadosVigenciaAtual();
        this.listaNova = this.todasVigencias.filter( f => f.nU_VIGENCIA === vigenciaAtual.nU_VIGENCIA);
        
      // this.listaNova.forEach(element => {
      //   console.log(element, "valendo")
      //   this.obterResumoPagamentos(element?.nU_CONTRATO, element?.nU_VIGENCIA, element?.cO_RUBRICA);
      //   this.listaResumoPagamentos.push()
      // });

        this.listaNova.forEach(element => {
          this.obterDadosGraficosVigencias(element).then(valor => {
            const teste = {
              vigencia: element,
              rubrica: valor,
              lista: this.obterResumoPagamentos(element?.nU_CONTRATO, element?.nU_VIGENCIA, element?.cO_RUBRICA).then(d => teste.lista = d)
            }

            this.ListaVigenciasRubricas.push(teste)
        })
       
      });

      console.log(this.ListaVigenciasRubricas)
      } catch (error) {
        console.error(error);
      
      }
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

        this.isRotaAtas = (this.Contrato && this.Contrato.no_Tipo_Arp == 'ATA_DE_REGISTRO_DE_PRECOS' && this.Contrato.ic_Arp) ? true : false;
   
      } catch (error) {
        console.error(error, 'obterContrato');
      }
    }

  gerarRelatorioCompleto(){
    this.visivel = true;
    setTimeout(() => {
      const element = this.conteudo.nativeElement;

      if (!element) {
        return;
      }
      html2canvas(element, {scale: 2}).then(canvas => {
        
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfwidth = pdf.internal.pageSize.getWidth();
      const pdfHeigth = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const usableWidth = pdfwidth - margin * 2;
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pdfwidth;
      const imgHeigth = (imgProps.height * usableWidth) / imgProps.width;

      let alturaRestante = imgHeigth;
      let posicao = 0;


        pdf.addImage(imgData, 'PNG', 0, posicao, imgWidth, imgHeigth);
        alturaRestante -= pdfHeigth - margin * 2;

        while (alturaRestante > 0){
          posicao = alturaRestante - imgHeigth + margin;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', margin, posicao, usableWidth, imgHeigth);
          alturaRestante -= pdfHeigth - margin * 2;
        }
        
        pdf.save('teste.pdf');

  
      }).finally(() => {
        this.visivel = false;
      });

    });

   
    
  }

  somaVigencias(vigencias: any[]): number{
    let vrGlobalTotal = 0;

    vigencias?.forEach(element => {
      vrGlobalTotal += element.vrGlobal
    });
    return vrGlobalTotal
  }

  validaContratoArtigo81(codContrato: string): boolean{
    if(codContrato?.startsWith('81000')){
      return true
    }
    return false
  }

  ordenaVigenciaRubricas(lista: any[]): any[]{
    lista.sort((a,b) => {
      const [numA, subA] = a.gcptb003Rubrica.coRubrica.split('-').map(Number);
      const [numB, subB] = b.gcptb003Rubrica.coRubrica.split('-').map(Number);
      return numA - numB || subA - subB;
    });
    return lista;
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
  
      } catch (error) {
        console.error(error, 'error');
  
      }
    }

    ordenaVigenciaAtualRubricas(lista: any[]): any[]{
      lista.sort((a,b) => {
        const [numA, subA] = a.nO_RUBRICA.split('-').map(Number);
        const [numB, subB] = b.nO_RUBRICA.split('-').map(Number);
        return numA - numB || subA - subB;
      });
      return lista;
    }

  

  public async obterDadosGraficosVigencias(params): Promise<any> {
    try {
      const response = await this.apiService.get<
        ApiResponse<EvolucaoFinanceira[]>
      >(`${Endpoints.URL_CONTRATOS}/grafico-vigencias-contrato?nuContrato=${params.nU_CONTRATO}&nuVigencia=${params.nU_VIGENCIA}`);
      const resp: any = response.data

      // this.listaEvolucaoFinanceira = [this.vigenciaAtual];
      // if (this.vigenciaAnterior) {
      //   this.listaEvolucaoFinanceira = [this.vigenciaAnterior]
      // }
      
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

      return this.rubricas.find(c => c.cO_RUBRICA === params.cO_RUBRICA);
    } catch (error) {
      console.error(error, 'error');

    }
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

  public async obterResumoPagamentos(nuContrato: string, nuVigencia: string, coRubricaSelecionada: string): Promise<any> {

    try {
      const response = await this.apiService.get<ApiResponse<EvolucaoFinanceira[]>>(
        `${Endpoints.URL_CONTRATOS}/detalhe-resumo-pagamento-evolucao-financeira?nuContrato=${nuContrato}&nuVigencia=${nuVigencia}&coRubrica=${coRubricaSelecionada}`
      );

      // this.listaResumoPagamentos = response.data;

      const listaResumo = response.data

      return listaResumo;
    
    } catch (error) {
      console.error('Error fetching data', error);
     
    }
  }

}
