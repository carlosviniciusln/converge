import { Injectable } from '@angular/core';

@Injectable()
export class CargaGerais {
  getObterHistoricoLimites() {
    return {
      succeeded: true,
      data:  [
          {
            nuHistorico: 2,
            nuPlanejamento: 256,
            dhLog: '2025-10-30T17:28:43.333',
            nuPlanejamentoItem: 117487,
            deRegistroAntigo:
              '{"NuPlanejamentoItem":117487,"NuPlanejamento":256,"NuContrato":4,"NuFilial":4,"NuRubrica":10,"NuStatusPlanejamentoItem":3,"NuTipoDemanda":4,"NuVigencia":10,"DeObjeto":"SOLICITAÇÃO PARA CONTRATAÇÃO DE EMPRESA ESPECIALIZADA NA PRESTAÇÃO DE SERVIÇO DE PLANEJAMENTO E GERENCIAMENTO DE CAPACIDADE, ANÁLISE DE DESEMPENHO, USO E CUSTOS PARA PLATAFORMA MAINFRAME IBM, E AQUISIÇÃO DE FERRAMENTAL DE APOIO COM SUPORTE E MANUTENÇÃO","DeObjetivoPDTIC":"5","DeObjetivoPEI":"14","DeJustificativa":"adsdasd","NuPreComprometimento":15454,"NuReserva":4354354,"VrPlanejamentoItem":0.00,"VrJaneiro":776965.38,"VrFevereiro":776965.38,"VrMarco":776965.38,"VrAbril":776965.38,"VrMaio":0.00,"VrJunho":776965.38,"VrJulho":776965.38,"VrAgosto":776965.38,"VrSetembro":776965.38,"VrOutubro":776965.38,"VrNovembro":776965.38,"VrDezembro":4545454545.00,"NuUsuario":325958,"DhCadastro":"2025-10-17T16:11:33.327","DhExclusao":null,"NuUsuarioExclusao":null,"NuUsuarioAlteracao":325949,"DhAlteracao":"2025-10-30T20:21:46","Gcptb001Contrato":null}',
            deRegistroNovo:
              '{"NuPlanejamentoItem":117487,"NuPlanejamento":256,"NuContrato":4,"NuFilial":4,"NuRubrica":10,"NuStatusPlanejamentoItem":3,"NuTipoDemanda":4,"NuVigencia":10,"DeObjeto":"SOLICITAÇÃO PARA CONTRATAÇÃO DE EMPRESA ESPECIALIZADA NA PRESTAÇÃO DE SERVIÇO DE PLANEJAMENTO E GERENCIAMENTO DE CAPACIDADE, ANÁLISE DE DESEMPENHO, USO E CUSTOS PARA PLATAFORMA MAINFRAME IBM, E AQUISIÇÃO DE FERRAMENTAL DE APOIO COM SUPORTE E MANUTENÇÃO","DeObjetivoPDTIC":"5","DeObjetivoPEI":"14","DeJustificativa":"asdasdadasdsadasdsadsadas","NuPreComprometimento":15454,"NuReserva":4354354,"VrPlanejamentoItem":0.0,"VrJaneiro":776965.38,"VrFevereiro":776965.38,"VrMarco":776965.38,"VrAbril":776965.38,"VrMaio":0.0,"VrJunho":776965.38,"VrJulho":776965.38,"VrAgosto":776965.38,"VrSetembro":776965.38,"VrOutubro":776965.38,"VrNovembro":776965.38,"VrDezembro":4545454545.0,"NuUsuario":0,"DhCadastro":"2025-10-30T17:28:43.2733568-03:00","DhExclusao":null,"NuUsuarioExclusao":0,"NuUsuarioAlteracao":325949,"DhAlteracao":"2025-10-30T20:28:43.244Z","Gcptb001Contrato":null}',
            deObservacao: 'Contrato alterado.',
            nuUsuarioAlteracao: 325949,
            noUsuarioAlteracao: 'Danilo Gabriel',
            tpOperacao: 'ALTERACAO',
            nuContrato: null,
            listaDiffs: [
              {
                campo: 'DeJustificativa',
                antes: 'adsdasd',
                depois: 'asdasdadasdsadasdsadsadas',
              },
              {
                campo: 'VrPlanejamentoItem',
                antes: '0.00',
                depois: '0.0',
              },
              {
                campo: 'VrMaio',
                antes: '0.00',
                depois: '0.0',
              },
              {
                campo: 'VrDezembro',
                antes: '4545454545.00',
                depois: '4545454545.0',
              },
              {
                campo: 'NuUsuario',
                antes: '325958',
                depois: '0',
              },
              {
                campo: 'DhCadastro',
                antes: '2025-10-17T16:11:33.327',
                depois: '2025-10-30T17:28:43.2733568-03:00',
              },
              {
                campo: 'NuUsuarioExclusao',
                antes: null,
                depois: '0',
              },
              {
                campo: 'DhAlteracao',
                antes: '2025-10-30T20:21:46',
                depois: '2025-10-30T20:28:43.244Z',
              },
            ],
          },
          {
            nuHistorico: 1,
            nuPlanejamento: 256,
            dhLog: '2025-10-30T17:21:47.373',
            nuPlanejamentoItem: 117487,
            deRegistroAntigo:
              '{"NuPlanejamentoItem":117487,"NuPlanejamento":256,"NuContrato":4,"NuFilial":4,"NuRubrica":10,"NuStatusPlanejamentoItem":3,"NuTipoDemanda":4,"NuVigencia":10,"DeObjeto":"SOLICITAÇÃO PARA CONTRATAÇÃO DE EMPRESA ESPECIALIZADA NA PRESTAÇÃO DE SERVIÇO DE PLANEJAMENTO E GERENCIAMENTO DE CAPACIDADE, ANÁLISE DE DESEMPENHO, USO E CUSTOS PARA PLATAFORMA MAINFRAME IBM, E AQUISIÇÃO DE FERRAMENTAL DE APOIO COM SUPORTE E MANUTENÇÃO","DeObjetivoPDTIC":"5","DeObjetivoPEI":"14","DeJustificativa":"asdad","NuPreComprometimento":15454,"NuReserva":4354354,"VrPlanejamentoItem":0.00,"VrJaneiro":776965.38,"VrFevereiro":776965.38,"VrMarco":776965.38,"VrAbril":776965.38,"VrMaio":0.00,"VrJunho":776965.38,"VrJulho":776965.38,"VrAgosto":776965.38,"VrSetembro":776965.38,"VrOutubro":776965.38,"VrNovembro":776965.38,"VrDezembro":4545454545.00,"NuUsuario":325958,"DhCadastro":"2025-10-17T16:11:33.327","DhExclusao":null,"NuUsuarioExclusao":null,"NuUsuarioAlteracao":325949,"DhAlteracao":"2025-10-30T20:20:04","Gcptb001Contrato":null}',
            deRegistroNovo:
              '{"NuPlanejamentoItem":117487,"NuPlanejamento":256,"NuContrato":4,"NuFilial":4,"NuRubrica":10,"NuStatusPlanejamentoItem":3,"NuTipoDemanda":4,"NuVigencia":10,"DeObjeto":"SOLICITAÇÃO PARA CONTRATAÇÃO DE EMPRESA ESPECIALIZADA NA PRESTAÇÃO DE SERVIÇO DE PLANEJAMENTO E GERENCIAMENTO DE CAPACIDADE, ANÁLISE DE DESEMPENHO, USO E CUSTOS PARA PLATAFORMA MAINFRAME IBM, E AQUISIÇÃO DE FERRAMENTAL DE APOIO COM SUPORTE E MANUTENÇÃO","DeObjetivoPDTIC":"5","DeObjetivoPEI":"14","DeJustificativa":"adsdasd","NuPreComprometimento":15454,"NuReserva":4354354,"VrPlanejamentoItem":0.0,"VrJaneiro":776965.38,"VrFevereiro":776965.38,"VrMarco":776965.38,"VrAbril":776965.38,"VrMaio":0.0,"VrJunho":776965.38,"VrJulho":776965.38,"VrAgosto":776965.38,"VrSetembro":776965.38,"VrOutubro":776965.38,"VrNovembro":776965.38,"VrDezembro":4545454545.0,"NuUsuario":0,"DhCadastro":"2025-10-30T17:21:47.1454037-03:00","DhExclusao":null,"NuUsuarioExclusao":0,"NuUsuarioAlteracao":325949,"DhAlteracao":"2025-10-30T20:21:46.972Z","Gcptb001Contrato":null}',
            deObservacao: 'Contrato alterado.',
            nuUsuarioAlteracao: 325949,
            noUsuarioAlteracao: 'Danilo Gabriel',
            tpOperacao: 'ALTERACAO',
            nuContrato: null,
            listaDiffs: [
              {
                campo: 'DeJustificativa',
                antes: 'asdad',
                depois: 'adsdasd',
              },
              {
                campo: 'VrPlanejamentoItem',
                antes: '0.00',
                depois: '0.0',
              },
              {
                campo: 'VrMaio',
                antes: '0.00',
                depois: '0.0',
              },
              {
                campo: 'VrDezembro',
                antes: '4545454545.00',
                depois: '4545454545.0',
              },
              {
                campo: 'NuUsuario',
                antes: '325958',
                depois: '0',
              },
              {
                campo: 'DhCadastro',
                antes: '2025-10-17T16:11:33.327',
                depois: '2025-10-30T17:21:47.1454037-03:00',
              },
              {
                campo: 'NuUsuarioExclusao',
                antes: null,
                depois: '0',
              },
              {
                campo: 'DhAlteracao',
                antes: '2025-10-30T20:20:04',
                depois: '2025-10-30T20:21:46.972Z',
              },
            ],
          },
           {
            nuHistorico: 1,
            nuPlanejamento: 256,
            dhLog: '2025-10-30T17:21:47.373',
            nuPlanejamentoItem: 117487,
            deRegistroAntigo:
              '{"NuPlanejamentoItem":117487,"NuPlanejamento":256,"NuContrato":4,"NuFilial":4,"NuRubrica":10,"NuStatusPlanejamentoItem":3,"NuTipoDemanda":4,"NuVigencia":10,"DeObjeto":"SOLICITAÇÃO PARA CONTRATAÇÃO DE EMPRESA ESPECIALIZADA NA PRESTAÇÃO DE SERVIÇO DE PLANEJAMENTO E GERENCIAMENTO DE CAPACIDADE, ANÁLISE DE DESEMPENHO, USO E CUSTOS PARA PLATAFORMA MAINFRAME IBM, E AQUISIÇÃO DE FERRAMENTAL DE APOIO COM SUPORTE E MANUTENÇÃO","DeObjetivoPDTIC":"5","DeObjetivoPEI":"14","DeJustificativa":"asdad","NuPreComprometimento":15454,"NuReserva":4354354,"VrPlanejamentoItem":0.00,"VrJaneiro":776965.38,"VrFevereiro":776965.38,"VrMarco":776965.38,"VrAbril":776965.38,"VrMaio":0.00,"VrJunho":776965.38,"VrJulho":776965.38,"VrAgosto":776965.38,"VrSetembro":776965.38,"VrOutubro":776965.38,"VrNovembro":776965.38,"VrDezembro":4545454545.00,"NuUsuario":325958,"DhCadastro":"2025-10-17T16:11:33.327","DhExclusao":null,"NuUsuarioExclusao":null,"NuUsuarioAlteracao":325949,"DhAlteracao":"2025-10-30T20:20:04","Gcptb001Contrato":null}',
            deRegistroNovo:
              '{"NuPlanejamentoItem":117487,"NuPlanejamento":256,"NuContrato":4,"NuFilial":4,"NuRubrica":10,"NuStatusPlanejamentoItem":3,"NuTipoDemanda":4,"NuVigencia":10,"DeObjeto":"SOLICITAÇÃO PARA CONTRATAÇÃO DE EMPRESA ESPECIALIZADA NA PRESTAÇÃO DE SERVIÇO DE PLANEJAMENTO E GERENCIAMENTO DE CAPACIDADE, ANÁLISE DE DESEMPENHO, USO E CUSTOS PARA PLATAFORMA MAINFRAME IBM, E AQUISIÇÃO DE FERRAMENTAL DE APOIO COM SUPORTE E MANUTENÇÃO","DeObjetivoPDTIC":"5","DeObjetivoPEI":"14","DeJustificativa":"adsdasd","NuPreComprometimento":15454,"NuReserva":4354354,"VrPlanejamentoItem":0.0,"VrJaneiro":776965.38,"VrFevereiro":776965.38,"VrMarco":776965.38,"VrAbril":776965.38,"VrMaio":0.0,"VrJunho":776965.38,"VrJulho":776965.38,"VrAgosto":776965.38,"VrSetembro":776965.38,"VrOutubro":776965.38,"VrNovembro":776965.38,"VrDezembro":4545454545.0,"NuUsuario":0,"DhCadastro":"2025-10-30T17:21:47.1454037-03:00","DhExclusao":null,"NuUsuarioExclusao":0,"NuUsuarioAlteracao":325949,"DhAlteracao":"2025-10-30T20:21:46.972Z","Gcptb001Contrato":null}',
            deObservacao: 'Contrato alterado.',
            nuUsuarioAlteracao: 325949,
            noUsuarioAlteracao: 'Danilo Gabriel',
            tpOperacao: 'INCLUSAO',
            nuContrato: null,
            listaDiffs: [
              {
                campo: 'DeJustificativa',
                antes: 'asdad',
                depois: 'adsdasd',
              },
              {
                campo: 'VrPlanejamentoItem',
                antes: '0.00',
                depois: '0.0',
              },
              {
                campo: 'VrMaio',
                antes: '0.00',
                depois: '0.0',
              },
              {
                campo: 'VrDezembro',
                antes: '4545454545.00',
                depois: '4545454545.0',
              },
              {
                campo: 'NuUsuario',
                antes: '325958',
                depois: '0',
              },
              {
                campo: 'DhCadastro',
                antes: '2025-10-17T16:11:33.327',
                depois: '2025-10-30T17:21:47.1454037-03:00',
              },
              {
                campo: 'NuUsuarioExclusao',
                antes: null,
                depois: '0',
              },
              {
                campo: 'DhAlteracao',
                antes: '2025-10-30T20:20:04',
                depois: '2025-10-30T20:21:46.972Z',
              },
            ],
          },
        ],
      errors: [],
    };

  }

    getObterHistoricoPlanejamentoItem() {
        return Promise.resolve(this.getObterHistoricoLimites());
    }
}
