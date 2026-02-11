import { Gcptb062DotacaoDTO } from './../../../models/DTOs/Gcptb062Dotacao';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DotacaoService {

  public listaPedidos! : Gcptb062DotacaoDTO[];
  constructor() { }

  mockeDotacao(){
      this.listaPedidos = [
      {
        codigo: 'DEM000000001885',
        requerente: 'P614706 - Lucas',
        dataAbertura: '2026-02-5',
        status: 'Aberta',
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
        status: 'Em Atendimento',
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
        status: 'Aberta',
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
        status: 'Concluída',
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
  }
}
