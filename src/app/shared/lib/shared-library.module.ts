import { NgModule } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { BreadcrumbModule } from 'primeng/breadcrumb';

//DSC CAIXA
import { DscBreadcrumbComponent, DscBreadcrumbItem } from 'sidsc-components/dsc-breadcrumb';


//PASSAR TODAS AS BIBLIOTECAS IMPORTAS NO PROJETO PARA ESSA LIB

@NgModule({

imports:[

  // PRIMENG

  // ANGULAR MATERIAL

  // DSC CAIXA
  DscBreadcrumbComponent,
  // DscBreadcrumbItem
],
exports:[

  // PRIMENG
    DropdownModule,
    PaginatorModule,
    TagModule,
    InputTextModule,
    DynamicDialogModule,
    BreadcrumbModule,

  // ANGULAR MATERIAL


  // DSC CAIXA

  DscBreadcrumbComponent


]
})
export class SharedLibraryModule { }
