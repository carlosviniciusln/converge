import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiResponsePaginado } from 'src/app/models/api-response';
import { Usuario } from 'src/app/models/usuario';
import { ApiService } from 'src/app/services/api.service';
import {
  ActionPolicies,
  ModuleEnum,
  PerfisEnum,
  TokenStorageService,
} from 'src/app/services/token-storage.service';
import { Endpoints } from 'src/app/shared/enums/endpoints';
import { PrimeNGConfig } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import { NavigationService } from 'src/app/services/navigation-service';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss'],
})
export class UsuarioComponent implements OnInit {
  permissions: ActionPolicies;

  listaUsuarios: Usuario[];
  listaUsuariosAutorizados: Usuario[];

  selectedPerfil: number;

  quantidadeTotal: number = 0;
  quantidadeTotalAutorizados: number = 0;
  loading: boolean = true;
  previousPage: any;
  previousPageAutorizados: any;
  currentUser: any;
  currentProfile: string;

  arrayUsuarios: number[] = [];
  arrayUsuariosAutorizados: number[] = [];

  listaSelecaoPerfis: any = [
    { value: 2, label: PerfisEnum.Usuario },
    { value: 3, label: PerfisEnum.Orcamento },
    { value: 4, label: PerfisEnum.Pagadoria },
    { value: 5, label: PerfisEnum.GestorOperacional },
    { value: 6, label: PerfisEnum.TorresGEGAT },
  ];

  constructor(
    private apiService: ApiService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private token: TokenStorageService,
    private primengConfig: PrimeNGConfig,
    private navigation: NavigationService,
    private confirmationService: ConfirmationService
  ) {
    this.currentUser = this.token.getUser();
  }

  ngOnInit(): void {
    this.obterPermissoes();

    this.obterUsuarios();
    this.obterUsuariosAutorizados();
    this.primengConfig.ripple = true;
  }

  public filtroRegistros: any = {
    pageNumber: 1,
    pageSize: 11,
    nuPerfil: null,
    filtro: '',
  };

  public filtroRegistrosAutorizados: any = {
    pageNumber: 1,
    pageSize: 11,
    nuPerfil: null,
    filtro: '',
  };


  obterPermissoes() {
    this.permissions= this.token.getActionPolicies(ModuleEnum.Usuarios);
  }

  onChangeInput(event: any) {
    this.filtroRegistros.filtro = event.target.value;
    this.obterUsuarios();
  }

  onChangeInputAutorizados(event: any) {
    this.filtroRegistrosAutorizados.filtro = event.target.value;
    this.obterUsuariosAutorizados();
  }

  loadPage(page: number) {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.filtroRegistros.pageNumber = page;
      this.obterUsuarios();
    }
  }

  loadPageAutorizados(page: number) {
    if (page !== this.previousPageAutorizados) {
      this.previousPageAutorizados = page;
      this.filtroRegistrosAutorizados.pageNumber = page;
      this.obterUsuariosAutorizados();
    }
  }

  public async obterUsuarios(): Promise<void> {
    try {
      this.filtroRegistros.nuPerfil = null;
      const response = await this.apiService.get<ApiResponsePaginado<Usuario>>(
        `${Endpoints.URL_USUARIO_PAGINADO}`,
        this.filtroRegistros
      );

      this.listaUsuarios = response.data.results;
      this.quantidadeTotal = response.data.totalRecords;

      this.loading = false;
    } catch (error) {
      console.error(error, 'aquirsd1');
    }
  }

  public async obterUsuariosAutorizados(): Promise<void> {
    try {
      this.filtroRegistrosAutorizados.nuPerfil = 1;
      const response = await this.apiService.get<ApiResponsePaginado<Usuario>>(
        `${Endpoints.URL_USUARIO_PAGINADO}`,
        this.filtroRegistrosAutorizados
      );

      this.listaUsuariosAutorizados = response.data.results;
      this.quantidadeTotalAutorizados = response.data.totalRecords;

      this.loading = false;
    } catch (error) {
      console.error(error, 'aquirsd2');
    }
  }

  public onChangeUsuario(event) {
    if (event.target.checked) {
      this.arrayUsuarios.push(Number(event.target.value));
    } else {
      this.arrayUsuarios.forEach((value, index) => {
        if (value == Number(event.target.value))
          this.arrayUsuarios.splice(index, 1);
      });
    }

    // console.log(event.target.checked + ' - ' + event.target.value);
    // console.log(this.arrayUsuarios);
  }

  public onChangeUsuarioAutorizados(event) {
    if (event.target.checked) {
      this.arrayUsuariosAutorizados.push(Number(event.target.value));
    } else {
      this.arrayUsuariosAutorizados.forEach((value, index) => {
        if (value == Number(event.target.value))
          this.arrayUsuariosAutorizados.splice(index, 1);
      });
    }

    console.log(event.target.checked + ' - ' + event.target.value);
    console.log(this.arrayUsuariosAutorizados);
  }

  limparListasUsuariosSelecionados() {
    this.arrayUsuarios = [];
    this.arrayUsuariosAutorizados = [];
  }

  onSelectedPerfilChange(e) {
    this.selectedPerfil = e.value;
  }

  public async Autorizar(): Promise<void> {
    this.confirmationService.confirm({
      accept: () => {
        this.atualizaPerfilUsuarios(true, this.selectedPerfil);
      },
    });
  }

  public async atualizaPerfilUsuarios(
    autorizar: boolean,
    nuPerfil: number = 0
  ) {
    try {
      const data = {
        nuUsuarios: autorizar
          ? this.arrayUsuarios
          : this.arrayUsuariosAutorizados,
        nuPerfil: nuPerfil,
      };

      await this.apiService.put<any>(`${Endpoints.URL_USUARIO}`, data);

      this.limparListasUsuariosSelecionados();

      this.obterUsuarios();
      this.obterUsuariosAutorizados();

      this.toastr.success('Alteração efetuada com sucesso.', 'Sucesso');
    } catch (error) {
      console.error(error);
    }
  }

  // openModalUsuario() {
  //   const modalRef = this.modalService.open(, {
  //     ariaLabelledBy: 'modal-basic-title',
  //     size: 'lg',
  //     windowClass: 'custom-class',
  //   });
  // }
}
