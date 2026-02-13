import { NgModule } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { DynamicDialogModule } from 'primeng/dynamicdialog';

//PASSAR TODAS AS BIBLIOTECAS IMPORTAS NO PROJETO PARA ESSA LIB

@NgModule({
exports:[
    DropdownModule,
    PaginatorModule,
    TagModule,
    InputTextModule,
    DynamicDialogModule


]
})
export class SharedLibraryModule { }
