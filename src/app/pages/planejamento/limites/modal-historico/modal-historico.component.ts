import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse } from 'src/app/models/generics/api-response';
import { Gcptb061LimitePlanejamentoHistoricoDTO } from 'src/app/models/DTOs/Gcptb061LimitePlanejamentoHistoricoDTO';
import { Gcptb061LimitePlanejamentoHistoricoResponse } from 'src/app/models/response/Gcptb061LimitePlanejamentoHistoricoResponse';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-modal-historico',
  templateUrl: './modal-historico.component.html',
  styleUrls: ['./modal-historico.component.scss']
})
export class ModalHistoricoComponent implements OnInit {




  @Input() nuLimitePlanejamento : number;
  @Input() noRubrica : string = null;
  @Input() noUnidadeDemandante : string = null;
  @Input() dePlanejamento : string;
  @Input() nuPlanejamento : number;

  public ListaLimitePlanejamentoHistorico: Gcptb061LimitePlanejamentoHistoricoDTO[] = [];
  public titulo = "Histórico Limites"
  public subTitulo = `${this.noRubrica} - ${this.noUnidadeDemandante}` ;

  public filtrosSelecionado: string | null = null;
  public loading: boolean = true;
  public dialogVisible = false;
  public selectedDiff: any = null;

   filtros = [
    {
      label: 'Todos',
      value: null,
    },
    {
      label: 'Inclusão',
      value: 'INCLUSAO',
    },
    {
      label: 'Alteração',
      value: 'ALTERACAO',
    },
    {
      label: 'Exclusão',
      value: 'EXCLUSAO',
    },
  ];

    public filtroRegistros: any = {
    paginaAtual: 1,
    tamanhoPagina: 10,
    nuPlanejamento: null,
    tpOperacao: null,
    nuLimitePlanejamento: null
  };


  constructor(
     public activeModal: NgbActiveModal,
     private apiService: ApiService,
     private toastr: ToastrService
  ) { }

  async ngOnInit() {
    await this.obterLimitePlanejamentoHistorico();
  }

   async filtrarEventos(e, op: number): Promise<void> {
    this.loading = true;
    switch (op) {
      case 1: {
        this.filtroRegistros.tpOperacao = e.value;
        if (e.value == null || this.filtros.length > 1) {
          await this.obterLimitePlanejamentoHistorico();
        }
        break;
      }
      default: {
        await this.obterLimitePlanejamentoHistorico();
        break;
      }
    }
    this.loading = false;
  }


  verDetalhes(event: any) {
    this.selectedDiff = event;
    this.dialogVisible = true;
  }

   public async obterLimitePlanejamentoHistorico(): Promise<void> {
      try {

        this.filtroRegistros.nuLimitePlanejamento = this.nuLimitePlanejamento;
        this.filtroRegistros.nuPlanejamento = this.nuPlanejamento;

        const response = await this.apiService.get<
          ApiResponse<Gcptb061LimitePlanejamentoHistoricoResponse>
        >(
          `v1/Limites/obter-historico-limites-planejamento`,
          this.filtroRegistros
        );

        if(response.data.listaHistorico.length == 0){

          if(this.noRubrica){
              this.toastr.warning(`Rubrica ${this.noRubrica} sem histórico.`, "Aviso");
          }else{
             this.toastr.warning(`Planejamento ${this.dePlanejamento} sem histórico.`, "Aviso");
          }

        }

        this.ListaLimitePlanejamentoHistorico = response.data.listaHistorico;
      } catch (error) {
        console.error(error);
      }
    }


}
