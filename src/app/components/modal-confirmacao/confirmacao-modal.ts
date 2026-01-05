import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmacao-modal',
  templateUrl: './confirmacao-modal.html',
  styleUrls: ['./confirmacao-modal.scss']
})
export class ConfirmacaoModalComponent {
  @Input() title = 'Confirmar ação';
  @Input() message = 'Tem certeza que deseja prosseguir?';
  @Input() confirmLabel = 'Confirmar';
  @Input() cancelLabel = 'Cancelar';
  @Input() icon = 'pi pi-exclamation-triangle';
  @Input() iconClass = 'text-warning';

  constructor(public activeModal: NgbActiveModal) {}

  onConfirm(): void {
    this.activeModal.close(true);
  }

  onCancel(): void {
    this.activeModal.dismiss('cancel');
    window.location.reload();
  }
}