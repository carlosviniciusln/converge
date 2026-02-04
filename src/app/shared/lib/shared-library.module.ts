import { NgModule } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import { TagModule } from 'primeng/tag';

//PASSAR TODAS AS BIBLIOTECAS IMPORTAS NO PROJETO PARA ESSA LIB

@NgModule({
exports:[
    DropdownModule,
    PaginatorModule,
    TagModule
]
})
export class SharedLibraryModule { }
