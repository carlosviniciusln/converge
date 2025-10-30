import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-develop',
  templateUrl: './develop.component.html',
  styleUrls: ['./develop.component.scss']
})
export class DevelopComponent implements OnInit {

  // numeroContrato : string = '9999999'
   events: any[] = [];
   totalRegistros: number = 10;
  // historico : any = 4;
  // constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  //   this.historico = [
  //   {
  //     nome: 'Aline Branch de Oliveira',
  //     dhAlteracao : null,
  //     dhInclusao : '2025-04-10 08:15',
  //     operacao: "Inclusão",
  //     dhExclusao: null
  //   },
  //    {
  //     nome: 'Danilo Gabriel',
  //     dhAlteracao : '2025-04-10 08:15',
  //     dhInclusao : '2025-04-10 08:15',
  //     operacao: "Alteração",
  //     dhExclusao: null
  //   },
  //       {
  //     nome: 'Silvio',
  //     dhAlteracao : null,
  //     dhInclusao : '2025-04-10 08:15',
  //     operacao: "Exclusão",
  //     dhExclusao: '2025-04-10 08:15'
  //   }
  // ];

  //     this.events = [
  //     {
  //       nome: 'Aline Branch de Oliveira',
  //       operacao: 'Exclusão',
  //       date: '2025-10-20 10:30',
  //       icon: 'pi pi-trash',
  //       color: '#A80000'
  //     },
  //     {
  //       nome: 'Aline Branch de Oliveira',
  //       operacao: 'Alteração',
  //       date: '2025-10-19 11:00',
  //       icon: 'pi pi-pencil',
  //       color: '#118DFF'
  //     },
  //     {
  //       nome: 'Aline Branch de Oliveira',
  //       operacao: 'Alteração',
  //       date: '2025-10-18 16:15',
  //       icon: 'pi pi-pencil',
  //       color: '#118DFF'
  //     },
  //     {
  //       nome: 'Silvio',
  //       operacao: 'Alteração',
  //       date: '2025-10-17 09:40',
  //       icon: 'pi pi-pencil',
  //       color: '#A80000'
  //     },
  //     {
  //       nome: 'Danilo Gabriel',
  //       operacao: 'Inclusão',
  //       date: '2025-10-10 12:00',
  //       icon: 'pi pi-plus-circle',
  //       color:'#107C10'
  //     }
  //   ];

  this.events = [
 {
 operacao: 'INCLUSÃO',
 descricao: 'Contrato incluído no sistema.',
 data: new Date('2025-10-20T10:00:00'),
 usuario: 'danilo.reis',
 icon: 'pi pi-plus'
 },
 {
 operacao: 'ALTERAÇÃO',
 descricao: 'Contrato alterado.',
 data: new Date('2025-10-22T15:30:00'),
 usuario: 'maria.silva',
 icon: 'pi pi-pencil',
 diff: {
 campos: [
 { campo: 'valor', antes: '1000', depois: '1200' },
 { campo: 'dataFim', antes: '2025-10-01', depois: '2025-12-31' }
 ]
 }
 },
 {
 operacao: 'EXCLUSÃO',
 nome: 'Contrato excluído',
 descricao: 'Contrato removido definitivamente.',
 data: new Date('2025-10-25T09:00:00'),
 usuario: 'joao.santos',
 icon: 'pi pi-trash'
 }
 ];
  }

 numeroContrato = 'SIGVC-2025';
 dialogVisible = false;
 selectedDiff: any = null;
 filtrosSelecionado : string | null = null;
 eventosFiltrados = [...this.events];
filtrarEventos(){
this.eventosFiltrados = this.filtrosSelecionado ? this.events.filter(e => e.operacao === this.filtrosSelecionado) : [...this.events]
}
 filtros = [
  {
    label : 'Todos', value: null
  },
  {
    label : 'Inclusão', value: 'INCLUSAO'
  }
 ]


 verDetalhes(event: any) {
 this.selectedDiff = event.diff;
 this.dialogVisible = true;
 }


 buscarHistorico(event : any){

 }

}
