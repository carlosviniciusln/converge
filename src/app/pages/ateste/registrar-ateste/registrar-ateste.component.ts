import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-registrar-ateste',
  templateUrl: './registrar-ateste.component.html',
  styleUrls: ['./registrar-ateste.component.scss']
})
export class RegistrarAtesteComponent implements OnInit {

  constructor(
       public activeModal: NgbActiveModal,
  ) { }

  public form: FormGroup;
  ngOnInit(): void {
  }

}
