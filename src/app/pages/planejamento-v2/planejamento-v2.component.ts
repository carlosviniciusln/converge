import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse } from 'src/app/models/generics/api-response';
import { Gcpvw049ResumoPlanejamento } from 'src/app/models/generics/Gcpvw49ResumoPlanejamento';
import { ApiService } from 'src/app/shared/services/api.service';
import { TokenStorageService } from 'src/app/shared/services/token-storage.service';
import { ModalPlanejamentoComponent } from '../planejamento/planejamento-lista/modal-planejamento/modal-planejamento.component';
import Swal from 'sweetalert2';
import { ModalPlanejamentoV2Component } from './modal-planejamento-v2/modal-planejamento-v2.component';

@Component({
  selector: 'app-planejamento-v2',
  templateUrl: './planejamento-v2.component.html',
  styleUrls: ['./planejamento-v2.component.scss'],
})
export class PlanejamentoV2Component implements OnInit {

  public gcpvw049ResumoPlanejamento: Gcpvw049ResumoPlanejamento[] = [];
  public perfil: string = '';

  constructor(
    private apiService: ApiService,
    private modalService: NgbModal,
    public token: TokenStorageService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.obterPlanejamentos();
    this.perfil = this.token.getUserPerfil();
  }

  async novoExercicio() {

    const anoAtual = new Date();
    const exercicio = this.gcpvw049ResumoPlanejamento.length ?
     this.gcpvw049ResumoPlanejamento[this.gcpvw049ResumoPlanejamento.length - 1]?.coExercicio + 1
      : anoAtual.getFullYear();

    const alert = await Swal.fire({
      title: '',
      text:
        'Tem certeza de que deseja gerar o Planejamento Orçamentário do exercício ' +
        exercicio +
        '?',
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

    // if (exercicio === anoAtual.getFullYear()) {
    //   const alert = await Swal.fire({
    //     title: '',
    //     text: `Exercício ${exercicio} já foi gerado o Planejamento, por segurança, não é possível ser gerado novamente.`,
    //     icon: 'warning',
    //     showCancelButton: false,
    //     confirmButtonText: 'Ok!',
    //   }).then((result) => {
    //     console.log(result, 'Result');
    //   });

    //   return;
    // }

    await this.gerarNovoExercicio(exercicio);

  }


  async gerarNovoExercicio(exercicio : number){

     const toastRef = this.toastr.warning(
      `Aguarde, gerando o exercício ${exercicio}, isso pode levar alguns minutos...`,
      '',
      {
        disableTimeOut: true,
        closeButton: true,
        tapToDismiss: false,
      },
    );


    try{

    const response = await this.apiService.post<ApiResponse<Gcpvw049ResumoPlanejamento[]>>(
          'v1/PlanejamentoOrcamentarioV/novo-exercicio', {coExercicio : exercicio});

      if (!response?.succeeded) {
        console.error('Erro da API:', response?.errors);
        this.gcpvw049ResumoPlanejamento = [];
        return;
      }

        this.gcpvw049ResumoPlanejamento = response.data;
        this.toastr.clear(toastRef.toastId);
        this.toastr.success('Exercício ' + exercicio + ' gerado com sucesso.');
        this.obterPlanejamentos();
      }
      catch (error){
        console.error('Erro ao consumir API', error);
        this.toastr.clear(toastRef.toastId);
        this.obterPlanejamentos();
      }
  }

  openModalPlanejamento(anoSelecionado: string) {

    const modalRef = this.modalService.open(ModalPlanejamentoV2Component, {
      ariaLabelledBy: 'modal-basic-title',
     windowClass: 'modal-80',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.anoSelecionado = anoSelecionado;
  }

  async obterPlanejamentos(): Promise<void> {
    try {
      const response = await this.apiService.get<
        ApiResponse<Gcpvw049ResumoPlanejamento[]>
      >('v1/PlanejamentoOrcamentarioV/resumo-planejamento');

      if (!response?.succeeded) {
        console.error('Erro da API:', response?.errors);
        this.gcpvw049ResumoPlanejamento = [];
        return;
      }

      this.gcpvw049ResumoPlanejamento = response.data ?? [];
    } catch (error) {
      console.error('Erro ao consumir API', error);
      this.gcpvw049ResumoPlanejamento = [];
    }
  }
}
