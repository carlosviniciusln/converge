import { NgModule } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';



@NgModule({
exports:[
    DropdownModule,
    PaginatorModule
]
})
export class SharedLibraryModule { }
