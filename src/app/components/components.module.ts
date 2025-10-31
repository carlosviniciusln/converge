import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { DialogModule } from 'primeng/dialog';
import { ConfirmacaoModalComponent} from "./modal-confirmacao/confirmacao-modal";
import { NavbarComponent } from "./navbar/navbar.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DevelopComponent } from './develop/develop.component';
import { MatTabGroup, MatTabsModule } from "@angular/material/tabs";
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import { TimelineModule } from 'primeng/timeline';
import { CardModule } from 'primeng/card';
import { TableModule } from "primeng/table";
import { DropdownModule } from "primeng/dropdown";
import { PaginatorModule } from "primeng/paginator";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    MatDividerModule,
    MatTabsModule,
    ReactiveFormsModule,
    DialogModule,
    MatListModule,
    TimelineModule,
    CardModule,
    TableModule,
    DropdownModule,
    FormsModule,
    PaginatorModule
],
  declarations: [
    NavbarComponent,
    SidebarComponent,
    DevelopComponent,
    ConfirmacaoModalComponent
    ],
  exports: [
    NavbarComponent,
    SidebarComponent,
    ConfirmacaoModalComponent]
})
export class ComponentsModule {}
