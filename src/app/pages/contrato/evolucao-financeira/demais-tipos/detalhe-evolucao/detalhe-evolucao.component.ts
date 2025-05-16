import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/services/api.service';
import { Endpoints } from 'src/app/shared/enums/endpoints';

@Component({
  selector: 'app-detalhe-evolucao',
  templateUrl: './detalhe-evolucao.component.html',
  styleUrls: ['./detalhe-evolucao.component.scss']
})
export class DetalheEvolucaoComponent implements OnInit {
  @Input() dE_PERIODO: string;
  @Input() nU_CONTRATO: number;
  @Input() tipo: string;

  title: string;
  subTitle: string;
  dados: any = null;
  loading: boolean = true;
  isRetencao: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.isRetencao = this.tipo === 'retencao';
    this.title = this.isRetencao ? 'Detalhes da Retenção' : 'Detalhes da Liberação';
    this.subTitle = `Período: ${this.dE_PERIODO}`;
    // this.subTitle = `Contrato: ${this.nU_CONTRATO} - Período: ${this.dE_PERIODO}`;
    this.obterDetalhes();
  }

  async obterDetalhes(): Promise<void> {
    console.log(this.nU_CONTRATO)
    console.log(this.dE_PERIODO)
    try {
      const endpoint = this.isRetencao
        ? `${Endpoints.URL_CONTRATOS}/detalhe-retencao-evolucao-financeira?periodo=${this.dE_PERIODO}&contrato=${this.nU_CONTRATO}`
        : `${Endpoints.URL_CONTRATOS}/detalhe-liberacao-evolucao-financeira?periodo=${this.dE_PERIODO}&contrato=${this.nU_CONTRATO}`;

      const response = await this.apiService.get<any>(endpoint);

      if (response.succeeded) {
        this.dados = response.data;
      } else {
        console.error('Erro ao buscar os detalhes', response.errors);
      }
    } catch (error) {
      console.error('Erro na requisição do modal', error);
    } finally {
      this.loading = false;
    }
  }
}