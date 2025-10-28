import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-develop',
  templateUrl: './develop.component.html',
  styleUrls: ['./develop.component.scss']
})
export class DevelopComponent implements OnInit {

  numeroContrato : string = '123456'
   events: any[] = [];
  historico : any = 4;
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.historico = [
    {
      nome: 'Aline Branch de Oliveira',
      dhAlteracao : null,
      dhInclusao : '2025-04-10 08:15',
      operacao: "Inclusão",
      dhExclusao: null
    },
     {
      nome: 'Danilo Gabriel',
      dhAlteracao : '2025-04-10 08:15',
      dhInclusao : '2025-04-10 08:15',
      operacao: "Alteração",
      dhExclusao: null
    },
        {
      nome: 'Silvio',
      dhAlteracao : null,
      dhInclusao : '2025-04-10 08:15',
      operacao: "Exclusão",
      dhExclusao: '2025-04-10 08:15'
    }
  ];

      this.events = [
      {
        nome: 'Aline Branch de Oliveira',
        operacao: 'Exclusão',
        date: '2025-10-20 10:30',
        icon: 'pi pi-trash'
      },
      {
        nome: 'Aline Branch de Oliveira',
        operacao: 'Alteração',
        date: '2025-10-19 11:00',
        icon: 'pi pi-pencil'
      },
      {
        nome: 'Aline Branch de Oliveira',
        operacao: 'Alteração',
        date: '2025-10-18 16:15',
        icon: 'pi pi-pencil'
      },
      {
        nome: 'Silvio',
        operacao: 'Alteração',
        date: '2025-10-17 09:40',
        icon: 'pi pi-pencil'
      },
      {
        nome: 'Danilo Gabriel',
        operacao: 'Inclusão',
        date: '2025-10-10 12:00',
        icon: 'pi pi-plus-circle'
      }
    ];
  }

}
