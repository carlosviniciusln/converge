import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiResponse } from 'src/app/models/generics/api-response';
import { Login } from 'src/app/models/generics/login';
import { ApiService } from 'src/app/shared/services/api.service';
import { TokenStorageService } from 'src/app/shared/services/token-storage.service';
import { Endpoints } from 'src/app/models/enums/endpoints';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public form: FormGroup;

  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  submitted = false;

  checked1: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private tokenStorage: TokenStorageService) {
      if (this.tokenStorage.getToken()) {
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
      }
    }

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      matricula: ['', [Validators.required]],
      senha: ['', [Validators.required]],
    });
  }

  get f(){
    return this.form.controls;
  }

  public async onSubmit() :  Promise<void>{
    try{
      this.submitted = true;
      if (this.form.invalid) {
        return;
      }
      const response = await this.apiService.post<ApiResponse<Login>>(`${Endpoints.URL_LOGIN}`,this.form.value);
      this.tokenStorage.saveToken(response.data.accessToken);
      this.tokenStorage.saveUser(response.data);
      this.isLoginFailed = false;
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
      this.reloadPage();

    } catch (error) {
      console.error(error,"aquirsd");
    //this.loading = true;
    }
  }

  reloadPage(): void {
    window.location.reload();
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }
}
