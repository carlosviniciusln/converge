import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { Endpoints } from 'src/app/shared/enums/endpoints';

@Component({
  selector: 'app-modal-reiniciar',
  templateUrl: './modal-reiniciar.component.html',
  styleUrls: ['./modal-reiniciar.component.scss']
})
export class ModalReiniciarComponent implements OnInit {
  @Output() atualizarPagina: EventEmitter<boolean> = new EventEmitter();
  public vigencia;
  public nuContrato;
  public nuVigenciaRubrica;
  public form: FormGroup;
  submitted = false;
  constructor(
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    public token: TokenStorageService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nuContrato: new FormControl(this.nuContrato, [Validators.required]),
      nuVigencia: new FormControl(this.vigencia, [Validators.required]),
      icReinicio: new FormControl(true, [Validators.required]),
    });
  }

  get f() {
    return this.form.controls;
  }

  public async onSubmit(): Promise<void> {
    this.Alterar();
  }

  public async Alterar(): Promise<void> {
    try {
      this.submitted = true;

      if (this.form.invalid) {
        return;
      }

      await this.apiService.post<any>(
        `${Endpoints.URL_CONTRATOS}/reiniciar-mensalizacao`,
        this.form.value
      );

      this.toastr.success('Alteração efetuada com sucesso.', 'Sucesso');
      this.atualizarPagina.emit(true);
      this.activeModal.dismiss();
      setTimeout(() => {
        location.reload(); 
     }, 2000);
    } catch (error) {
      this.atualizarPagina.emit(false);
      this.toastr.error('Erro ao efetuar alteração', 'error');
    }
  }

}
