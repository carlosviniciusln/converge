import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from 'src/app/models/generics/login';
import { TokenStorageService } from 'src/app/shared/services/token-storage.service';

// ─── Credenciais de acesso local (mock hardcoded) ────────────────────────────
const MOCK_CREDENTIALS = { matricula: 'usuario', senha: 'senha' };

// JWT fake com exp=9999999999 (ano 2286) para que isTokenExpired() retorne false
const MOCK_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
  '.eyJzdWIiOiJ1c3VhcmlvIiwibm9tZSI6IlVzdcOhcmlvIE1vY2siLCJtYXRyaWN1bGEiOiJ1c3VhcmlvIiwicGVyZmlsIjoiQWRtaW5pc3RyYWRvciIsInJvbGVzIjpbIkFkbWluaXN0cmFkb3IiXSwiZXhwIjo5OTk5OTk5OTk5fQ' +
  '.mock-signature';

const MOCK_USER: Login = {
  accessToken: MOCK_TOKEN,
  expiresIn:   3600,
  coMatricula: 'usuario',
  noUsuario:   'Jonathas',
  nuUsuario:   1,
  noPerfil:    'Administrador',
  claims: [{
    type:  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role',
    value: 'Administrador'
  }]
};

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  form!: FormGroup;
  submitted     = false;
  isLoginFailed = false;
  errorMessage  = '';
  showPassword  = false;
  loading       = false;

  readonly year = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private tokenStorage: TokenStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.tokenStorage.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
    this.form = this.fb.group({
      matricula: ['', Validators.required],
      senha:     ['', Validators.required]
    });
  }

  get f() { return this.form.controls; }

  onSubmit(): void {
    this.submitted    = true;
    this.isLoginFailed = false;
    if (this.form.invalid) { return; }

    this.loading = true;

    const { matricula, senha } = this.form.value as { matricula: string; senha: string };

    setTimeout(() => {
      if (matricula === MOCK_CREDENTIALS.matricula && senha === MOCK_CREDENTIALS.senha) {
        this.tokenStorage.saveToken(MOCK_USER.accessToken);
        this.tokenStorage.saveUser(MOCK_USER);
        this.router.navigate(['/dashboard']);
      } else {
        this.isLoginFailed = true;
        this.errorMessage  = 'Usuário ou senha inválidos. Verifique suas credenciais.';
        this.loading       = false;
      }
    }, 600); // simula latência de rede
  }
}
