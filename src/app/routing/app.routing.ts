import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";
import { PagesComponent } from "../pages/pages.component";
import { LoginPageComponent } from "../pages/login/login-page.component";
import { SplashComponent } from "../pages/splash/splash.component";
import { AuthGuard } from "../core/guards/auth.guard";
import { LoginGuard } from "../core/guards/login.guard";
import { MobileSplashGuard } from "../core/guards/mobile-splash.guard";

const routes: Routes = [
  {
    path: "login",
    component: LoginPageComponent,
    canActivate: [LoginGuard]
  },
  {
    // Rota inicial: no mobile exibe a splashscreen da marca por 2s e em
    // seguida abre o login (deslogado) ou o dashboard (logado).
    // No desktop o guard redireciona diretamente, sem splash.
    path: "",
    component: SplashComponent,
    canActivate: [MobileSplashGuard],
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
