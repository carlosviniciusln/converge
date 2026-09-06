import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";
import { PagesComponent } from "../pages/pages.component";
import { LoginPageComponent } from "../pages/login/login-page.component";
import { AuthGuard } from "../core/guards/auth.guard";
import { LoginGuard } from "../core/guards/login.guard";

const routes: Routes = [
  {
    path: "login",
    component: LoginPageComponent,
    canActivate: [LoginGuard]
  },
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full"
  },
  {
    path: "",
    component: PagesComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "",
        loadChildren: () => import ("../pages/pages.module").then(m => m.PagesModule)
      }
    ]
  },
  {
    path: "**",
    redirectTo: "login"
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  exports: [RouterModule]
})
export class AppRouting {}
