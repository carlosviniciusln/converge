import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { DialogModule } from 'primeng/dialog';

import { FooterComponent } from "./footer/footer.component";
import { ConfirmacaoModalComponent} from "./modal-confirmacao/confirmacao-modal";
import { NavbarComponent } from "./navbar/navbar.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DevelopComponent } from './develop/develop.component';

@NgModule({
  imports: [
    CommonModule, 
    RouterModule, 
    NgbModule,
    ReactiveFormsModule,
    DialogModule            
  ],
  declarations: [FooterComponent, NavbarComponent, SidebarComponent, DevelopComponent, ConfirmacaoModalComponent],
  exports: [FooterComponent, NavbarComponent, SidebarComponent, ConfirmacaoModalComponent]
})
export class ComponentsModule {}
