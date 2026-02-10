import { PedidoStatus } from './../../models/DTOs/Gcptb062Dotacao';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Gcptb062DotacaoDTO } from 'src/app/models/DTOs/Gcptb062Dotacao';
import { Customer, Representative } from 'src/app/models/generics/Customer';
import { DotacaoDoadoresComponent } from './dotacao-doadores/dotacao-doadores.component';
import { MessageService } from 'primeng/api';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-dotacao',
  templateUrl: './dotacao.component.html',
  styleUrls: ['./dotacao.component.scss'],
})
export class DotacaoComponent implements OnInit {
  /*ATRIBUTOS*/

  listaPedidos: Gcptb062DotacaoDTO[] = [];
  listaDoadores: any[] = [];
  selectedPedidos!: Gcptb062DotacaoDTO;
  selectedDoadores!: Gcptb062DotacaoDTO;
  totalRecords = 0;
  statuses!: PedidoStatus[];
  loading: boolean = false;
  activityValues: number[] = [0, 100];
  public selectTab: number = 0;
  visible: boolean = false;

  /*CONSTRUTOR*/

  constructor(
    public dialogService: DialogService,
    public messageService: MessageService,
  ) {}

  /*METODOS HERDADOS*/

  ngOnInit(): void {
    this.listaPedidos = [
      {
        codigo: 'DEM000000001885',
        requerente: 'P614706 - Lucas',
        dataAbertura: '2026-02-5',
        status: 'aberto',
        contratos: [
          {
            coContrato: '0001/2025',
            vrTotalContrato: 15000,
            unidadeDemandante: 'GEAUS',
            classificacaoDigital: 'DIGITAL',
            rubrica: [
              {
                coRubrica: '3567-5',
                deRubrica: 'Rubrica descrição rubrica',
                vrRubrica: 7500,
              },
              {
                coRubrica: '3457-6',
                deRubrica: 'Rubrica teste da rubrica',
                vrRubrica: 7500,
              },
            ],
          },
          {
            coContrato: '0001/2025',
            vrTotalContrato: 2000,
            unidadeDemandante: 'GEAUS',
            classificacaoDigital: 'DIGITAL',
            rubrica: [
              {
                coRubrica: '3567-5',
                deRubrica: 'Rubrica descrição rubrica',
                vrRubrica: 1000,
              },
              {
                coRubrica: '3457-6',
                deRubrica: 'Rubrica teste da rubrica',
                vrRubrica: 1000,
              },
            ],
          },
        ],
        justificativa: 'Solicitar suplementação orçamentária',
        setor: 'CEGTI',
        vrTotalPedido: 17000,
      },

      // ✅ EXEMPLO 1
      {
        codigo: 'DEM000000001886',
        requerente: 'P702113 - Mariana',
        dataAbertura: '2026-02-04',
        status: 'em_atendimento',
        contratos: [
          {
            coContrato: '0012/2025',
            unidadeDemandante: 'GEAUS',
            classificacaoDigital: 'DIGITAL',
            vrTotalContrato: 9800,
            rubrica: [
              {
                coRubrica: '4110-2',
                deRubrica: 'Serviços de manutenção de infraestrutura',
                vrRubrica: 5300,
              },
              {
                coRubrica: '4111-0',
                deRubrica: 'Materiais de consumo - TI',
                vrRubrica: 4500,
              },
            ],
          },
          {
            coContrato: '0018/2025',
            vrTotalContrato: 4200,
            unidadeDemandante: 'GEAUS',
            classificacaoDigital: 'DIGITAL',
            rubrica: [
              {
                coRubrica: '5220-9',
                deRubrica: 'Licenças e assinaturas de software',
                vrRubrica: 3000,
              },
              {
                coRubrica: '5221-7',
                deRubrica: 'Serviços de suporte especializado',
                vrRubrica: 1200,
              },
            ],
          },
        ],
        justificativa: 'Solicitar remanejamento de dotação',
        setor: 'DIPLAN',
        vrTotalPedido: 14000,
      },

      // ✅ EXEMPLO 2
      {
        codigo: 'DEM000000001887',
        requerente: 'P655920 - João Pedro',
        dataAbertura: '2026-02-03',
        status: 'aberto',
        contratos: [
          {
            coContrato: '0007/2024',
            classificacaoDigital: 'DIGITAL',
            unidadeDemandante: 'GEAUS',
            vrTotalContrato: 25000,
            rubrica: [
              {
                coRubrica: '3001-4',
                deRubrica:
                  'Aquisição de equipamentos (computadores/servidores)',
                vrRubrica: 18000,
              },
              {
                coRubrica: '3002-2',
                deRubrica: 'Periféricos e acessórios',
                vrRubrica: 7000,
              },
            ],
          },
        ],
        justificativa: 'Solicitar crédito adicional',
        setor: 'CEGTI',
        vrTotalPedido: 25000,
      },

      // ✅ EXEMPLO 3
      {
        codigo: 'DEM000000001888',
        requerente: 'P688401 - Aline',
        dataAbertura: '2026-02-02',
        status: 'concluido',
        contratos: [
          {
            coContrato: '0021/2025',
            classificacaoDigital: 'DIGITAL',
            unidadeDemandante: 'GEAUS',
            vrTotalContrato: 6300,
            rubrica: [
              {
                coRubrica: '7100-8',
                deRubrica: 'Capacitação e treinamentos',
                vrRubrica: 2800,
              },
              {
                coRubrica: '7101-6',
                deRubrica: 'Diárias e deslocamentos',
                vrRubrica: 3500,
              },
            ],
          },
          {
            coContrato: '0023/2025',
            classificacaoDigital: 'NÃO DIGITAL',
            unidadeDemandante: 'GEAUS',
            vrTotalContrato: 3700,
            rubrica: [
              {
                coRubrica: '8200-1',
                deRubrica: 'Serviços gráficos e comunicação',
                vrRubrica: 1700,
              },
              {
                coRubrica: '8201-9',
                deRubrica: 'Materiais administrativos',
                vrRubrica: 2000,
              },
            ],
          },
        ],
        justificativa: 'Regularizar saldo e reforçar rubricas',
        setor: 'SEFIN',
        vrTotalPedido: 10000,
      },
    ];

    this.loading = false;

    this.listaPedidos = this.listaPedidos.map((p) => ({
      ...p,
      searchText: this.buildSearchText(p),
    }));

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

  /*METODOS*/

  getSeverity(status: string) {
    switch (status) {
      case 'cancelado':
        return 'danger';

      case 'aberto':
        return 'success';

      case 'fechado':
        return 'info';

      case 'negotiation':
        return 'warning';

      case 'renewal':
        return null;
    }
  }

  onGlobalFilter(event: Event, dt: any) {
    const value = (event.target as HTMLInputElement).value;
    dt.filterGlobal(value, 'contains');
  }

  exportExcel() {
    // const dadosFiltrados = this.listaValoresExecutados.map(item => {
    //     return {
    //         Ano: item.ano,
    //         Contrato: item.contrato,
    //         UD: item.gn,
    //         Objeto: item.objeto,
    //         "Total Executado": item.vrTotalExecutado,
    //         "Total Previsto": item.vrTotalPrevisto
    //     }
    // })
    // import("xlsx").then(xlsx => {
    //     const worksheet = xlsx.utils.json_to_sheet(dadosFiltrados);
    //     const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    //     const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    //     this.saveAsExcelFile(excelBuffer, "contratos");
    // });
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
}
