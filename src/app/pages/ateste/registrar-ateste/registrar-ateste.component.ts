import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-registrar-ateste',
  templateUrl: './registrar-ateste.component.html',
  styleUrls: ['./registrar-ateste.component.scss']
})
export class RegistrarAtesteComponent implements OnInit {

  constructor(
       public activeModal: NgbActiveModal,
        private formBuilder: FormBuilder
  ) { }

  public form: FormGroup;
  ngOnInit(): void {
    this.formulario();
    this. adicionarFaturamentosFake();
  }

    formulario() {
      this.form = this.formBuilder.group({
        nuContrato: [0],
        coContrato: ['', [Validators.required]],
        noEmpresa: ['', [Validators.required]],
        noObjeto: ['', [Validators.required]],
        faturamentos: new FormArray([]),
      });
    }

    get faturamentos(): FormArray {
      return this.form.get('faturamentos') as FormArray;
    }
  
    adicionarFaturamentosFake() {
      const dadosFake = [
        { item: 'Serviço de Manutenção', valor: 1500 },
        { item: 'Consultoria Técnica', valor: 3200 },
        { item: 'Suporte Mensal', valor: 800 }
      ];
    
      dadosFake.forEach(dado => {
        this.faturamentos.push(
          this.formBuilder.group({
            id: [''], // ou algum UUID
            item: [dado.item, Validators.required],
            valor: [dado.valor, [Validators.required, Validators.min(0)]]
          })
        );
      });
    }

    
adicionarFaturamento() {
  this.faturamentos.push(
    this.formBuilder.group({
      item: ['', Validators.required],
      valor: [0, [Validators.required, Validators.min(0)]]
    })
  );
}

removerFaturamento(index: number) {
  this.faturamentos.removeAt(index);
}

    
}
