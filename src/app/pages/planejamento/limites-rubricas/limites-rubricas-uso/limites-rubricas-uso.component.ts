import { Component, Input, OnInit } from '@angular/core';
import { ApiResponse } from 'src/app/models/api-response';
import { UsoLimitesRubricaResponse } from 'src/app/models/limites-rubrica-response';
import { ApiService } from 'src/app/services/api.service';
import { Endpoints } from 'src/app/shared/enums/endpoints';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-limites-rubricas-uso',
  templateUrl: './limites-rubricas-uso.component.html',
  styleUrls: ['./limites-rubricas-uso.component.scss'],
})
export class LimitesRubricasUsoComponent implements OnInit {
  @Input() public filtro: any;

  public titulo: string = 'Resumo';
  public subTitulo: string = 'Limites Rubricas';
  public title: string = 'Uso de Limites Orçamentários por Rubrica';

  public listaUsoLimitesRubricaCondensado: UsoLimitesRubricaResponse[] = [];

  public somaUsoLimitesRubrica:UsoLimitesRubricaResponse;

  loading: boolean = true;
  quantidadeTotal: number = 0;

  constructor(
    private apiService: ApiService,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.ObterResumoUsoLimitesRubricasCondensado();
  }

  public async ObterResumoUsoLimitesRubricasCondensado(): Promise<void> {
    try {
      const filtroCorrigido: any = {
        NuAnoOrcamentario: this.filtro.NuAnoOrcamentario,
        NuRubrica: this.filtro.NuRubrica,
        NuGrupoRemanejamento: this.filtro.NuGrupoRemanejamento,
        NuFilial: this.filtro.NuFilial,
        NuPlanejamentoTipo: this.filtro.NuPlanejamentoTipo,
      };

      const response = await this.apiService.get<
        ApiResponse<UsoLimitesRubricaResponse[]>
      >(
        `${Endpoints.URL_ORCAMENTO}/limite-orcamentario/resumo-limites-usados`,
        filtroCorrigido
      );

      //console.log(response.data);

      this.listaUsoLimitesRubricaCondensado = response.data;
      this.quantidadeTotal = response.data.length;
      this.sumariza();
    } catch (error) {}
    this.loading = false;
  }

  sumariza() {
    this.somaUsoLimitesRubrica = {
      nuAnoOrcamentario: null,
      nuRubrica: null,
      nuPlanejamentoTipo: null,
      gcptb003Rubrica: null,
      gcptb010Orcamento: null,
      gcptb019PlanejamentoTipo: null,
      vrLimiteRubricaDisponivelAgrupado: 0,
      vrLimiteRubricaUtilizadoAgrupado: 0,
      peUtilizado: 0,
    };

    this.listaUsoLimitesRubricaCondensado.forEach(element => {
      this.somaUsoLimitesRubrica.vrLimiteRubricaDisponivelAgrupado += element.vrLimiteRubricaDisponivelAgrupado;
      this.somaUsoLimitesRubrica.vrLimiteRubricaUtilizadoAgrupado += element.vrLimiteRubricaUtilizadoAgrupado;
    });
    this.somaUsoLimitesRubrica.peUtilizado = this.somaUsoLimitesRubrica.vrLimiteRubricaUtilizadoAgrupado / this.somaUsoLimitesRubrica.vrLimiteRubricaDisponivelAgrupado;
  }

}
