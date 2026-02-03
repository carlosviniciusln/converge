import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponse } from 'src/app/models/generics/api-response';
import { ApiService } from 'src/app/shared/services/api.service';
import { Endpoints } from 'src/app/models/enums/endpoints';
import * as html2pdf from 'html2pdf.js';
import { Location } from '@angular/common';
import { EvolucaoFinanceiraAquisicao } from 'src/app/models/generics/evolucao-financeira-aquisicao';
import {
  ActionPolicies,
  ModuleEnum,
  TokenStorageService,
} from 'src/app/shared/services/token-storage.service';

@Component({
  selector: 'app-evolucao-financeira-aquisicao',
  templateUrl: './evolucao-financeira-aquisicao.component.html',
  styleUrls: ['./evolucao-financeira-aquisicao.component.scss'],
})
export class EvolucaoFinanceiraAquisicaoComponent implements OnInit {
  permissions: ActionPolicies;

  loading: boolean = true;
  nuContrato: string;
  listaEvolucaoFinanceira: EvolucaoFinanceiraAquisicao[];

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private location: Location,
    public token: TokenStorageService
  ) {
    this.obterPermissoes();
  }

  obterPermissoes() {
    this.permissions = this.token.getActionPolicies(ModuleEnum.Contratos);
  }

  ngOnInit(): void {
    this.nuContrato = this.route.snapshot.paramMap.get('id');
    this.obterEvolucaoFinanceira();
  }

  public async obterEvolucaoFinanceira(): Promise<void> {
    try {
      const response = await this.apiService.get<
        ApiResponse<EvolucaoFinanceiraAquisicao[]>
      >(
        `${Endpoints.URL_CONTRATOS_EVOLUCAO_FINANCEIRA_AQUISICAO}/` +
          this.nuContrato
      );

      this.listaEvolucaoFinanceira = response.data;
      this.loading = false;
    } catch (error) {
      console.error(error, 'aquirsd');
      //this.loading = true;
    }
  }

  getLatestDate(lista) {
    if (lista.length) {
      //return Math.max(...lista.resumo.map(e => new Date(e.dtPagamentoEfetivo)))
      return lista.reduce((m, v, i) =>
        v.dtPagamentoEfetivo > m.dtPagamentoEfetivo && i ? v : m
      ).dtPagamentoEfetivo;
    }
  }

  downloadPDF() {
    var element = document.getElementById('pdfTable');
    var grafico = document.getElementById('divGrafico');
    var graficoGeral = document.getElementById('divGraficoGeral');

    element.style.fontSize = '12px';
    //grafico.style.width = "599px";
    //grafico.style.width = "599px";

    var opt = {
      margin: [5, 5, 5, 5],
      filename: 'output.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, dpi: 192, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a3', orientation: 'p' },
    };

    // New Promise-based usage:
    html2pdf().from(element).set(opt).save();
  }

  public downloadExcel() {
    return this.apiService.downloadfile(
      `${Endpoints.URL_CONTRATOS_EVOLUCAO_FINANCEIRA}/excel/` + this.nuContrato
    );
  }

  goBackToPrevPage(): void {
    this.location.back();
  }
}
