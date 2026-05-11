import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse } from 'src/app/models/generics/api-response';
import { Gcpvw049ResumoPlanejamento } from 'src/app/models/generics/Gcpvw49ResumoPlanejamento';
import { ApiService } from 'src/app/shared/services/api.service';
import { PerfisEnum, TokenStorageService } from 'src/app/shared/services/token-storage.service';
import Swal from 'sweetalert2';


 interface DomainDTO {
  value: string,
  label: string,
  message: string,
  position: string
}

@Component({
  selector: 'app-modal-planejamento-v2',
  templateUrl: './modal-planejamento-v2.component.html',
  styleUrls: ['./modal-planejamento-v2.component.scss']
})
export class ModalPlanejamentoV2Component implements OnInit {

  @Input() public anoSelecionado: number;
  @Output() atualizarPagina: EventEmitter<boolean> = new EventEmitter();
  public form: FormGroup;
  public gcpvw049ResumoPlanejamento: Gcpvw049ResumoPlanejamento[] = [];
  public labelButtonsLeft : DomainDTO = {label: null, value: null, message: null, position: null};
  public labelButtonsRight : DomainDTO = {label: null, value: null, message: null,  position: null};
  public ultimoPlanejamento: Gcpvw049ResumoPlanejamento;
  public isPerfilPrivilegiado : boolean = false;
  public currentProfile: PerfisEnum;


  constructor(
      private apiService: ApiService,
      private toastr: ToastrService,
      public activeModal: NgbActiveModal,
      private router : Router,
      public token: TokenStorageService
  ){

  }
  ngOnInit(): void {
    this.obterPlanejamentosPorExercicio();
    this.currentProfile = this.token.getUserPerfil();

    if(this.currentProfile === 'Administrador' || this.currentProfile === 'Orçamento'){
      this.isPerfilPrivilegiado = true;
    }

  }

 async obterPlanejamentosPorExercicio(): Promise<void> {
    try {
      const response = await this.apiService.get<
        ApiResponse<Gcpvw049ResumoPlanejamento[]>
      >('v1/PlanejamentoOrcamentarioV/resumo-planejamento?coExercicio='+this.anoSelecionado);

      if (!response?.succeeded) {
        console.error('Erro da API:', response?.errors);
        this.gcpvw049ResumoPlanejamento = [];
        return;
      }

      this.gcpvw049ResumoPlanejamento = response.data ?? [];
      this.atualizarPagina.emit(true);

      if(this.gcpvw049ResumoPlanejamento.length){
        this.montarPlanejamentosModal(this.gcpvw049ResumoPlanejamento);
      }

    } catch (error) {
      console.error('Erro ao consumir API', error);
      this.gcpvw049ResumoPlanejamento = [];
    }
  }


    montarPlanejamentosModal(lista: Gcpvw049ResumoPlanejamento[]) {

      if (lista.length > 0) {
        this.ultimoPlanejamento = lista[this.gcpvw049ResumoPlanejamento.length - 1];
        this.validarBotoes(this.ultimoPlanejamento);
      }
      else{
        this.validarBotoes(lista[0]);
      }

    }

     validarBotoes(ultimoPlanejamento: Gcpvw049ResumoPlanejamento): void {
        const tipo = ultimoPlanejamento?.dePlanejamentoTipo.replace(/^\d+\s*-\s*/, "").trim();

        switch (tipo) {
          case "Programação":
            switch (ultimoPlanejamento.statusPlanejamento) {
              case "Aberta":
                this.labelButtonsLeft = {
                  label: 'Validar Programação',
                  value: 'validado',
                  message: 'Tem certeza que deseja validar o planejamento',
                  position: 'left'
                };
                this.labelButtonsRight = {
                  label: 'Cancelar Programação',
                  value: 'cancelar',
                  message: 'Tem certeza que deseja cancelar o planejamento',
                  position: 'right'
                };
                break;

              case "Criado":
                this.labelButtonsLeft = {
                  label: 'Validar Programação',
                  value: 'validado',
                  message: 'Tem certeza que deseja validar o planejamento',
                  position: 'left'
                };
                this.labelButtonsRight = {
                  label: 'Cancelar Programação',
                  value: 'cancelar',
                  message: 'Tem certeza que deseja cancelar o planejamento',
                  position: 'right'
                };
                break;

              case "Validado":
                this.labelButtonsLeft = {
                  label: 'Nova Reprogramação',
                  value: 'nova',
                  message: 'Tem certeza que deseja gerar uma nova reprogramação do planejamento',
                  position: 'left'
                };

                this.labelButtonsRight = null;
                break;

              default:
                this.labelButtonsLeft = null;
                this.labelButtonsRight = null;
                break;
            }
            break;

          case "Reprogramação":
            switch (ultimoPlanejamento.statusPlanejamento) {
              case "Aberta":
                this.labelButtonsLeft = {
                  label: 'Validar Reprogramação',
                  value: 'validado',
                  message: 'Tem certeza que deseja validar o planejamento',
                  position: 'left'
                };
                this.labelButtonsRight = {
                  label: 'Cancelar Reprogramação',
                  value: 'cancelar',
                  message: 'Tem certeza que deseja cancelar o planejamento',
                  position: 'right'
                };
                break;

              case "Criado":
                this.labelButtonsLeft = {
                  label: 'Validar Reprogramação',
                  value: 'validado',
                  message: 'Tem certeza que deseja validar o planejamento',
                  position: 'left'
                };
                this.labelButtonsRight = {
                  label: 'Cancelar Reprogramação',
                  value: 'cancelar',
                  message: 'Tem certeza que deseja cancelar o planejamento',
                  position: 'right'
                };
                break;

              case "Validado":
                this.labelButtonsLeft = {
                  label: 'Nova Reprogramação',
                  value: 'nova',
                  message: 'Tem certeza que deseja gerar uma nova reprogramação do planejamento',
                  position: 'left'
                };

                this.labelButtonsRight = null;
                break;

              case "Cancelado":
                this.labelButtonsLeft = {
                  label: 'Nova Reprogramação',
                  value: 'nova',
                  message: 'Tem certeza que deseja gerar uma nova reprogramação do planejamento',
                  position: 'left'
                };
                this.labelButtonsRight = null;
                break;
              default:
                this.labelButtonsLeft = {
                  label: 'Nova Reprogramação',
                  value: 'nova',
                  message: 'Tem certeza que deseja gerar uma nova reprogramação do planejamento',
                  position: 'left'
                };
                this.labelButtonsRight = null;
                break;
            }
            break;

          default:

            break;
        }
      }

 async executarCenario(cenario: any) {

    const alert = await Swal.fire({
      title: `Exercício ${this.anoSelecionado}`,
      text: cenario.message + ` ${this.ultimoPlanejamento.dePlanejamentoTipo}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim!',
      cancelButtonText: 'Não!',
    }).then((result) => {
      if (result.value) {
        return true;
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        return false;
      }
    });

    if (!alert) {
      return;
    }
    this.atualizarPlanejamento(cenario.value);
  }

    async atualizarPlanejamento(cenario : any) {


      try{
      const toastRef = this.toastr.warning(
      `Aguarde, gerando a nova programação, isso pode levar alguns minutos...`,
      '',
      {
        disableTimeOut: true,
        closeButton: true,
        tapToDismiss: false,
      },
    );

      const response = await this.apiService.post<ApiResponse<Gcpvw049ResumoPlanejamento[]>>('v1/PlanejamentoOrcamentarioV/atualizar-planejamento', {
        coExercicio : this.anoSelecionado,
        acao: cenario,
        ordem: this.ultimoPlanejamento.ordem,
        dePlanejamentoTipo: this.ultimoPlanejamento.dePlanejamentoTipo,
        nuPlanejamento: this.ultimoPlanejamento.nuPlanejamento
      });


      if (!response?.succeeded) {
        console.error('Erro da API:', response?.errors);
        this.gcpvw049ResumoPlanejamento = [];
        return;
        }

      this.gcpvw049ResumoPlanejamento = response.data; // OBS
      this.toastr.clear(toastRef.toastId);
      this.toastr.success('Alteração efetuada com sucesso.', 'Sucesso');
      this.obterPlanejamentosPorExercicio();
    }
    catch (error){
        console.error('Erro da API:', error);
        this.toastr.clear();
        this.gcpvw049ResumoPlanejamento = [];
        this.obterPlanejamentosPorExercicio();
    }

    }

  onRowClick(item: Gcpvw049ResumoPlanejamento) {
    this.activeModal.close();
    this.router.navigate(['/planejamento-orcamentario-detalhe-novo'],
    {
      queryParams: {
        coExercicio: item.coExercicio,
        tipo: item.dePlanejamentoTipo,
        statusPlanejamento: item.statusPlanejamento,
        nuPlanejamento: item.nuPlanejamento
      }
    }
  );
  }
}
