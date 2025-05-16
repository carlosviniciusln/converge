import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router'
import { ContratoItem } from 'src/app/models/Gcptb001ContratoResponse';
import { NovosContratosComponent } from '../novos-contratos/novos-contratos.component';

@Component({
  selector: 'app-modal-redirect',
  templateUrl: './modal-redirect.component.html',
  styleUrls: ['./modal-redirect.component.scss']
})
export class ModalRedirectComponent implements OnInit {
  @Input() public url: string;
  @Input() public contratos: ContratoItem[];
  @Input() public quantidadeTotal: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal) { }

  isSigvc: boolean = false

  ngOnInit(): void {
    this.checkUrl();
  }

  checkUrl() {
    this.isSigvc = this.url.includes('sigvc')
  }

  openModalNovosContratos() {
    const modalRef = this.modalService.open(NovosContratosComponent, {
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'modal-dialog-medium-width',
    });
    modalRef.componentInstance.contratos = this.contratos;
    modalRef.componentInstance.quantidadeTotal = this.quantidadeTotal;
  }

  fecharModal(){
    this.activeModal.dismiss('cross click');
    this.openModalNovosContratos();
  }
}
