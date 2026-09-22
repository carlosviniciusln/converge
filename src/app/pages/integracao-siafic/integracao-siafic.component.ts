import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PainelIntegracaoSiafic, RegistroSiafic } from '../../models/siafic-integration';
import { GovernancaContratualService } from '../../services/governanca-contratual.service';
import { ISiaficIntegrationService } from '../../services/siafic-integration.service';

@Component({
  selector: 'app-integracao-siafic',
  templateUrl: './integracao-siafic.component.html',
  styleUrls: ['./integracao-siafic.component.scss'],
})
export class IntegracaoSiaficComponent implements OnInit {
  readonly contratos = this.governanca.listarContratos();
  contratoSelecionado = 148;
  painel?: PainelIntegracaoSiafic;
  carregando = true;
  sincronizando = false;

  constructor(
    private governanca: GovernancaContratualService,
    public siafic: ISiaficIntegrationService,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  async ngOnInit(): Promise<void> {
    const contratoId = Number(this.route.snapshot.queryParamMap.get('contratoId'));
    if (contratoId && this.contratos.some(contrato => contrato.id === contratoId)) {
      this.contratoSelecionado = contratoId;
    }
    await this.carregarPainel();
  }

  async carregarPainel(): Promise<void> {
    this.carregando = true;
    try {
      this.painel = await this.siafic.consultarContrato(this.contratoSelecionado);
    } finally {
      this.carregando = false;
    }
  }

  async sincronizar(): Promise<void> {
    if (this.sincronizando) return;
    this.sincronizando = true;
    try {
      const resultado = await this.siafic.sincronizarContrato(this.contratoSelecionado);
      if (this.painel) {
        this.painel.ultimaSincronizacao = resultado.dataHora;
        this.painel.logs.unshift({
          id: Date.now(),
          dataHora: resultado.dataHora,
          operacao: 'Sincronização manual',
          protocolo: resultado.protocolo,
          resultado: resultado.divergenciasEncontradas ? 'Alerta' : 'Sucesso',
          detalhe: `${resultado.registrosConsultados} registros consultados e ${resultado.divergenciasEncontradas} divergências encontradas.`,
        });
      }
      this.toastr.success(`Protocolo ${resultado.protocolo}`, 'Sincronização demonstrativa concluída');
    } finally {
      this.sincronizando = false;
    }
  }

  registrosDaEtapa(etapa: RegistroSiafic['etapa']): RegistroSiafic[] {
    return this.painel?.registros.filter(registro => registro.etapa === etapa) || [];
  }

  totalEtapa(etapa: RegistroSiafic['etapa']): number {
    return this.registrosDaEtapa(etapa).reduce((total, registro) => total + registro.valor, 0);
  }

  statusClass(status: string): string {
    return status === 'Concluído' || status === 'Sucesso' ? 'success' : status === 'Erro' ? 'danger' : 'warning';
  }
}