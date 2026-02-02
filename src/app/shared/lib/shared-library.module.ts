import { NgModule } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';

//PASSAR TODAS AS BIBLIOTECAS IMPORTAS NO PROJETO PARA ESSA LIB

@NgModule({
exports:[
    DropdownModule,
    PaginatorModule
]
})
export class SharedLibraryModule { }
