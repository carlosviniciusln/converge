import { PedidoStatus } from './../../models/DTOs/Gcptb062Dotacao';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { ApiResponse } from 'src/app/models/generics/api-response';
import { Gcptb062DotacaoDTO } from 'src/app/models/DTOs/Gcptb062Dotacao';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/shared/services/api.service';
import { DotacaoModelResponse } from 'src/app/models/response/DotacaoModelResponse';
import { TableLazyLoadEvent } from 'primeng/table';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-dotacao',
  templateUrl: './dotacao.component.html',
  styleUrls: ['./dotacao.component.scss'],
})
export class DotacaoComponent implements OnInit {

  /*ATRIBUTOS*/

  public listaPedidos: Gcptb062DotacaoDTO[] = [];
  public statuses!: PedidoStatus[];
  public listaDoadores: any[] = [];
  public selectedPedidos!: Gcptb062DotacaoDTO;
  public selectedDoadores!: Gcptb062DotacaoDTO;
  public totalRecords = 0;
  public selectTab: number = 0;
  public loading: boolean = false;
  public visible: boolean = false;
  public filtroRegistros: any = {
    paginaAtual: 1,
    tamanhoPagina: 10
  };

  /*CONSTRUTOR*/

  constructor(
    private dialogService: DialogService,
    private toastr: ToastrService,
    private apiService : ApiService
  ) {}

  /*METODOS HERDADOS*/

  ngOnInit(): void {
    this.obterPedidos();
    this.cargaDoadores();
    this.montarBuildSearchText();
  }


  /*METODOS*/


  public async obterPedidos(): Promise<void>{

    try {

      const filtrosLimpos = this.limparFiltrosNulos(this.filtroRegistros);
      const response = await this.apiService.get<ApiResponse<DotacaoModelResponse>>(
        `v1/external/listar-pedidos-suplementacao-orcamentaria`, filtrosLimpos
      );

      console.log(response, "response dotação");
      this.listaPedidos = response.data.pedidos;
      this.totalRecords = response.data.totalRecords;
      this.montarBuildSearchText();
    } catch (error) {
      console.log(error);
    }
      this.loading = true;
  }

  montarBuildSearchText(){
    this.listaPedidos = this.listaPedidos.map((p) => ({
        ...p,
        searchText: this.buildSearchText(p),
     }));
  }

  loadPage(event: TableLazyLoadEvent) {
      const page = (event.first || 0) / (event.rows || this.filtroRegistros.tamanhoPagina) + 1;
      const pageSize = event.rows || this.filtroRegistros.tamanhoPagina;

      if (page !== this.filtroRegistros.paginaAtual || pageSize !== this.filtroRegistros.tamanhoPagina) {
        this.filtroRegistros.paginaAtual = page;
        this.filtroRegistros.tamanhoPagina = pageSize;
        this.obterPedidos();
      }
  }



  getSeverity(status: string) {
    switch (status) {
      case 'cancelado':
        return 'danger';

      case 'Aberta':
        return 'success';

      case 'Concluída':
        return 'info';

      case 'Em Atendimento':
        return 'warning';

      case 'renewal':
        return null;
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

  onGlobalFilter(event: Event, dt: any) {
    const value = (event.target as HTMLInputElement).value;
    dt.filterGlobal(value, 'contains');
  }

  exportExcel() {
     this.toastr.info('Funcionalidade não desenvolvida', 'INFO');
  }

  private buildSearchText(p: any): string {
    const contratos = p.contratos ?? [];
    const contratosText = contratos.map((c: any) => c.coContrato).join(' ');

    const rubricasText = contratos
      .flatMap((c: any) => c.rubrica ?? [])
      .map((r: any) => `${r.coRubrica ?? ''} ${r.deRubrica ?? ''}`)
      .join(' ');

    return [
      p.codigo,
      p.requerente,
      p.dataAbertura,
      p.status,
      p.setor,
      p.justificativa,
      contratosText,
      rubricasText,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase(); // deixa case-insensitive
  }

  showDialog() {
    this.visible = true;
  }

  cargaDoadores(){
     this.listaDoadores = [{
      contrato: '0001/2025',
      objeto: 'OBJETO X',
      classificacaoDigital: 'DIGITAL',
      unidadeDemandante: 'GEGAT',
      rubrica: '3561-5',
      vrPlanejamento: 700,// PLANEJEI GASTAR TANTO NO CONTRATO
      vrTotalReserva: 200, // VALOR NO TIPO RESERVA DA RUBRICA
      vrTotalPreComprementimento: 200, // VALOR NO TIPO RESERVA DA RUBRICA
      vrPedido: 300, // VALOR NO TIPO RESERVA DA RUBRICA
      vrPagamentos: 100, // O QUE FOI JÁ PAGO ?
      vrFaturamento: 600 // O VALOR QUE ESTÁ SENDO PAGO FATURAMENTO ?

    },
    {
      contrato: '0002/2025',
      objeto: 'CHAVE X',
      classificacaoDigital: 'NÃO DIGITAL',
      unidadeDemandante: 'CEAUS',
      rubrica: '3561-6',
      vrPlanejamento: 700,// PLANEJEI GASTAR TANTO NO CONTRATO
      vrTotalReserva: 200, // VALOR NO TIPO RESERVA DA RUBRICA
      vrTotalPreComprementimento: 200, // VALOR NO TIPO RESERVA DA RUBRICA
      vrPedido: 300, // VALOR NO TIPO RESERVA DA RUBRICA
      vrPagamentos: 100, // O QUE FOI JÁ PAGO ?
      vrFaturamento: 600 // O VALOR QUE ESTÁ SENDO PAGO FATURAMENTO ?

    }
  ]
  }
}
