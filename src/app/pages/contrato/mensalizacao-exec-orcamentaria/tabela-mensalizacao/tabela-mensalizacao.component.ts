import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiResponse } from 'src/app/models/api-response';
import { EvolucaoFinanceira } from 'src/app/models/evolucao-financeira';
import { TotalPorRubrica } from 'src/app/models/Gcptb001ContratoResponse';
import { ApiService } from 'src/app/services/api.service';
import { TokenStorageService, ModuleEnum, ActionPolicies } from 'src/app/services/token-storage.service';
import { Endpoints } from 'src/app/shared/enums/endpoints';
import { MensalizacaoEditarComponent } from '../mensalizacao-editar/mensalizacao-editar.component';
import { ModalReiniciarComponent } from '../modal-reiniciar/modal-reiniciar.component';

@Component({
  selector: 'app-tabela-mensalizacao',
  templateUrl: './tabela-mensalizacao.component.html',
  styleUrls: ['./tabela-mensalizacao.component.scss']
})
export class TabelaMensalizacaoComponent implements OnInit {
  @Input() vigenciaSelecionada: any;
  @Input() vigenciaAtual: any;
  @Input() nuContrato: any;
  rubricasVigencia = [];
  loading: boolean = true;
  totalRubrica: number;
  tblTotalRubrica: TotalPorRubrica[] = [];
  totalPorRubricaVigencia: any;
  permissions: ActionPolicies;
  listaPagamentosMensalizadosRubrica: { rubrica: string, totalMensalizado: number }[] = []
  totalPagamentosRubrica: { rubrica: string, totalMensalizado: number }[] = []
  constructor(
    private apiService: ApiService,
    private modalService: NgbModal,
    public token: TokenStorageService
  ) {
    this.obterPermissoes();
  }

  obterPermissoes() {
    this.permissions = this.token.getActionPolicies(ModuleEnum.Contratos);
  }

  ngOnInit(): void {
    if (this.vigenciaAtual != undefined) {
      this.obterDadosTabelaVigencias(this.vigenciaAtual)
    }
    else {
      this.obterDadosTabelaVigencias(this.vigenciaSelecionada)
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.vigenciaSelecionada) {
      this.vigenciaSelecionada = changes.vigenciaSelecionada.currentValue;
      this.obterDadosTabelaVigencias(this.vigenciaSelecionada);
    }
  }
  public async obterDadosTabelaVigencias(params): Promise<void> {
    try {
      const response = await this.apiService.get<
        ApiResponse<EvolucaoFinanceira[]>
      >(`${Endpoints.URL_CONTRATOS}/grafico-vigencias-contrato?nuContrato=${params.nU_CONTRATO}&nuVigencia=${params.nU_VIGENCIA}`);
      const resp: any = response.data

      this.rubricasVigencia = this.agruparDadosPorRubrica(resp);
      console.log('this.rubricasVigenciathis.rubricasVigenciathis.rubricasVigenciathis.rubricasVigencia',this.rubricasVigencia)
      this.loading = false;
    } catch (error) {
      console.error('tabela-mensalizacao: obterDadosTabelaVigencias', error);
    }
  }

  agruparDadosPorRubrica(array) {
    const agrupados = [];
    array.forEach(item => {
      const { cO_RUBRICA, vR_EXECUTADO_MENSAL, vR_VIGENCIA_MENSAL, dE_PERIODO, nU_VIGENCIA_RUBRICA, observacao } = item;
      if (!agrupados[cO_RUBRICA]) {
        agrupados[cO_RUBRICA] = { cO_RUBRICA: cO_RUBRICA, valoresExecutados: [], valoresMensais: [], periodos: [], nu_VIGENCIA_RUBRICA: nU_VIGENCIA_RUBRICA, observacao: [] }
      }
      agrupados[cO_RUBRICA].valoresExecutados.push(vR_EXECUTADO_MENSAL);
      agrupados[cO_RUBRICA].valoresMensais.push(vR_VIGENCIA_MENSAL);
      agrupados[cO_RUBRICA].periodos.push(dE_PERIODO);
      agrupados[cO_RUBRICA].observacao.push(observacao);
      if (observacao != null) {
        this.listaPagamentosMensalizadosRubrica.push({rubrica: cO_RUBRICA, totalMensalizado: vR_VIGENCIA_MENSAL})
      }
      this.totalPagamentosRubrica.push({rubrica: cO_RUBRICA, totalMensalizado: vR_VIGENCIA_MENSAL})
    })
    return Object.values(agrupados)

  }

  agruparPagamentosPorRubrica(array) : any {
    const agrupado = array.reduce((acc, item) => {
        if(!acc[item.rubrica]){
          acc[item.rubrica] = 0;
        }
          acc[item.rubrica] += item.totalMensalizado;
        return acc;
    }, {} as Record<string, number>);
    return Object.keys(agrupado).map(rubrica => ({
      rubrica: rubrica,
      totalMensalizado: agrupado[rubrica]
    }));
  }

  openModalEdicao(dados?, rubrica?) {
    const modalRef = this.modalService.open(
      MensalizacaoEditarComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'sm',
      windowClass: 'custom-class',
      backdrop: 'static',
      keyboard: false,
    });
    const nuVigenciaEditada = this.vigenciaAtual?.nU_VIGENCIA != null ? this.vigenciaAtual?.nU_VIGENCIA : this.vigenciaSelecionada.nU_VIGENCIA;
    modalRef.componentInstance.dE_PERIODO = dados?.periodo;
    modalRef.componentInstance.valorExecutado = dados?.valoresExecutados;
    modalRef.componentInstance.valorPlanejado = dados?.valoresMensais;
    modalRef.componentInstance.observacao = dados?.observacao;
    modalRef.componentInstance.nuContrato = this.nuContrato;
    modalRef.componentInstance.nuVigenciaEditada = nuVigenciaEditada;
    modalRef.componentInstance.nuVigenciaRubrica = rubrica.nu_VIGENCIA_RUBRICA;
    modalRef.componentInstance.listaPagamentosMensalizadosRubrica = this.agruparPagamentosPorRubrica(this.listaPagamentosMensalizadosRubrica)
    modalRef.componentInstance.totalPagamentosRubrica = this.agruparPagamentosPorRubrica(this.totalPagamentosRubrica)
    modalRef.componentInstance.coRubricaSelecionada = rubrica.cO_RUBRICA
    modalRef.componentInstance.dadosCoRubrica = rubrica
  }

  public filtraRubrica(rubrica: string): any[] {
    let listaFiltrada;
    let listaFormatada;
    if (rubrica == 'TOTAL') {
      listaFiltrada = this.rubricasVigencia.map(rubrica => ({
        ...rubrica,
        periodos: rubrica.periodos.filter(periodo => periodo !== 0)
      }))
    }
    else {
      listaFiltrada = this.rubricasVigencia.map(rubrica => ({
        ...rubrica,
        periodos: rubrica.periodos.filter(periodo => periodo !== rubrica.nu_VIGENCIA_RUBRICA)
      })).filter(x => x.cO_RUBRICA === rubrica);
    }

    this.totalRubrica = 0;

    listaFiltrada.forEach(rubricaFiltrada => {
      this.totalRubrica += rubricaFiltrada.vR_PLANEJADO;
    });
    const existsRubrica = this.tblTotalRubrica.find(item => item.rubrica === rubrica)

    if (!existsRubrica) {
      if (rubrica == 'TOTAL') {
        this.tblTotalRubrica.push({ rubrica: rubrica, total: this.totalRubrica });
      } else {
        this.tblTotalRubrica.unshift({ rubrica: rubrica, total: this.totalRubrica });
      }
    }

    listaFormatada = listaFiltrada[0].periodos.map((periodo, index) => ({
      periodo: periodo,
      valoresExecutados: listaFiltrada[0].valoresExecutados[index],
      valoresMensais: listaFiltrada[0].valoresMensais[index],
      observacao: listaFiltrada[0].observacao[index]
    }))
    this.groupAndSumData(this.rubricasVigencia)
    return listaFormatada;
  }

  groupAndSumData(data) {
    this.totalPorRubricaVigencia = new Map<string, any>();
    data.forEach(item => {
      const period = item.periodos;
      if (!this.totalPorRubricaVigencia.has(period)) {
        this.totalPorRubricaVigencia.set(period, { ...item, total_vR_PLANEJADO: 0, total_vR_EXECUTADO: 0 });
      }
      const currentItem = this.totalPorRubricaVigencia.get(period);
      if (currentItem.cO_RUBRICA != null) {
        !currentItem.cO_RUBRICA.includes(item.cO_RUBRICA) ? currentItem.cO_RUBRICA = currentItem.cO_RUBRICA + `, ${item.cO_RUBRICA}` : null;
      }
      currentItem.total_vR_PLANEJADO = item.valoresMensais.reduce((acc, current) => acc + current, 0);
      currentItem.total_vR_EXECUTADO += item.valoresExecutados.reduce((acc, current) => acc + current, 0);
    });

    let groupedData = Array.from(this.totalPorRubricaVigencia.values());

    groupedData = groupedData;
    this.totalPorRubricaVigencia = groupedData
    return groupedData;
  }

  reiniciaMensalizacao(vigencia: any) {
    const modalRef = this.modalService.open(
      ModalReiniciarComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'sm',
      windowClass: 'custom-class',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.vigencia = vigencia;
    modalRef.componentInstance.nuContrato = this.nuContrato;
  }
}
