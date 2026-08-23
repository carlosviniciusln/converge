import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponse } from 'src/app/models/generics/api-response';
import { ApiService } from 'src/app/shared/services/api.service';
import { Endpoints } from 'src/app/models/enums/endpoints';
import * as html2pdf from 'html2pdf.js';
import { Location } from '@angular/common';
import { EvolucaoFinanceiraAquisicao } from 'src/app/models/generics/evolucao-financeira-aquisicao';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  ActionPolicies,
  ModuleEnum,
  TokenStorageService,
} from 'src/app/shared/services/token-storage.service';

@Component({
  selector: 'app-aquisicao',
  templateUrl: './aquisicao.component.html',
  styleUrls: ['./aquisicao.component.scss'],
})
export class AquisicaoComponent implements OnInit {
  @Input()
  nuContrato: string;
  @Input()
  nuServicoTipo?: number;

  permissions: ActionPolicies;

  loading: boolean = true;

  listaEvolucaoFinanceira: EvolucaoFinanceiraAquisicao[];

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private location: Location,
    public spinner: NgxSpinnerService,
    public token: TokenStorageService
  ) {
    this.obterPermissoes();
  }

  obterPermissoes() {
    this.permissions = this.token.getActionPolicies(ModuleEnum.Contratos);
  }

  ngOnInit(): void {
    //this.nuContrato = this.route.snapshot.paramMap.get('id');
    this.obterEvolucaoFinanceira(this.nuServicoTipo);
  }

  public async obterEvolucaoFinanceira(nuServicoTipo?: number): Promise<void> {
    try {
      const response = await this.apiService.get<
        ApiResponse<EvolucaoFinanceiraAquisicao[]>
      >(
        `${Endpoints.URL_CONTRATOS_EVOLUCAO_FINANCEIRA_AQUISICAO}/${this.nuContrato}/${nuServicoTipo}`
      );

      this.listaEvolucaoFinanceira = response.data;
      console.log(this.listaEvolucaoFinanceira);
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
    this.spinner.show();
    var grafico = document.getElementById('divGrafico');
    grafico.style.width = '1050px';

    setTimeout(() => {
      var element = document.getElementById('divPDF');

      const elementCopy = element.cloneNode(true) as HTMLElement; // copy of the element to be printed
      const tableBodies = elementCopy.querySelectorAll('.cl-body'); // store div of table body
      const maxRowsPerPage = 13;

      // For each table
      for (let k = 0; k < tableBodies?.length; k++) {
        // Check table size
        const tableRows = tableBodies[k].getElementsByTagName('tr');

        // Ignore table if it is less or equal than maximum
        if (tableRows?.length <= maxRowsPerPage) continue;

        // Get number of new tables
        const newTableCount = Math.ceil(
          (tableRows?.length - 1) / maxRowsPerPage
        );

        // Create array of resulting tables
        const newTableBodies: HTMLElement[] = [];

        // Copy table body and clean content
        const tableBodyClean = tableBodies[k].cloneNode(true) as HTMLElement;
        const toDeleteRows = tableBodyClean.getElementsByTagName('tr');
        while (toDeleteRows.length > 1) {
          const toDeleteRow = toDeleteRows[1];
          toDeleteRow.parentNode?.removeChild(toDeleteRow);
        }

        // Break the table in smaller ones
        for (let i = 0; i < newTableCount; i++) {
          // Creating new table
          const newTable = tableBodyClean.cloneNode(true) as HTMLElement;
          const dataTables =
            newTable.getElementsByClassName('p-datatable-tbody');
          const dataTable = dataTables?.length > 0 ? dataTables[0] : null;
          if (dataTable == null) break;

          // Adding rows to new table
          const startIndex = i * maxRowsPerPage + 1;
          const endIndex = Math.min(
            (i + 1) * maxRowsPerPage + 1,
            tableRows.length
          );
          for (let j = startIndex; j < endIndex; j++) {
            const row = tableRows[j].cloneNode(true) as HTMLTableRowElement;
            dataTable.appendChild(row);
          }

          // Adding new table to array
          newTableBodies.push(newTable);
        }

        tableBodies[k].parentNode?.replaceChild(
          newTableBodies[0],
          tableBodies[k]
        );
        for (let i = 1; i < newTableBodies.length; i++) {
          elementCopy
            .querySelectorAll('.cl-table-component')
            [k].insertAdjacentElement('beforeend', newTableBodies[i]);
        }
      }

      var opt = {
        margin: [5, 5, 5, 5],
        filename: 'Mensal.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, dpi: 192, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
        pagebreak: { before: '.cl-body', mode: 'avoid-all' },
      };

      html2pdf().from(elementCopy).set(opt).save();

      grafico.style.width = 'auto';
      this.spinner.hide();
      elementCopy.remove();
    }, 1000);
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
