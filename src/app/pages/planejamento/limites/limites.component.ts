import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { LimitesModel } from 'src/app/models/limites-model';
import * as fileSaver from 'file-saver';
import { ActionPolicies, ModuleEnum, PerfisEnum, TokenStorageService } from 'src/app/services/token-storage.service';
import { ApiResponse } from 'src/app/models/api-response';
import { ApiService } from 'src/app/services/api.service';
import { Endpoints } from 'src/app/shared/enums/endpoints';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ModalLimitesComponent } from './modal-limites/modal-limites.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-limites',
  templateUrl: './limites.component.html',
  styleUrls: ['./limites.component.scss'],
  animations: [
    trigger('rowExpansionTrigger', [
        state('void', style({
            transform: 'translateX(-10%)',
            opacity: 0
        })),
        state('active', style({
            transform: 'translateX(0)',
            opacity: 1
        })),
        transition('* <=> *', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
]
})
export class LimitesComponent implements OnInit {
  @Input() anoExercio : number;
  @Input() tipoExercicio : string;
  permissions: ActionPolicies;
  public currentProfile: PerfisEnum;
  public isPerfilAdminOrcamento = false;
  listaLimites: LimitesModel[] = [];
  listaLimitesCompleta: LimitesModel[] = [];
  ultimoDetalheLimite: LimitesModel;
  constructor(private apiService: ApiService,
    private modalService: NgbModal,
    private token: TokenStorageService) { }

ngOnInit() {
    this.obterPermissoes();
    this.obterValores();

}

// ngOnChanges(changes: SimpleChanges) {
//   if (changes['nuPlanejamento'] && changes['nuPlanejamento'].currentValue) {

//   }
// }

//PERMISSOES
    obterPermissoes() {
        this.permissions = this.token.getActionPolicies(ModuleEnum.Limites);
        this.currentProfile = this.token.getUserPerfil();

        if(this.currentProfile === 'Orçamento' || this.currentProfile === 'Administrador'){
          this.isPerfilAdminOrcamento = true;
        }
    }

//EXPORTAR EXCEL
  exportExcel() {
    const dadosFiltrados = this.listaLimites.map(item => {
        return {
            Ano: item.cO_EXERCICIO,
            Rubrica: item.cO_RUBRICA,
            'Valor Planejamento': item.vR_PLANEJAMENTO
        }
    })
    import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(dadosFiltrados);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, "contratos");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
    });
    fileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  //FILTRO


filterItem(value: string) {
  if (!value) {
    this.listaLimites = this.listaLimitesCompleta;
    return;
  }

  const lowerCaseValue = value.toLowerCase();

  const matchAndClean = (item: LimitesModel): LimitesModel | null => {
    // Verifica se o item principal corresponde
    const matchPrincipal =
      item.cO_EXERCICIO.toString().includes(lowerCaseValue) ||
      (item.dE_PLANEJAMENTO_TIPO && item.dE_PLANEJAMENTO_TIPO.toLowerCase().includes(lowerCaseValue)) ||
      (item.nO_RUBRICA_TIPO && item.nO_RUBRICA_TIPO.toLowerCase().includes(lowerCaseValue)) ||
      (item.dE_RUBRICA && item.dE_RUBRICA.toLowerCase().includes(lowerCaseValue)) ||
      (item.nO_STATUS && item.nO_STATUS.toLowerCase().includes(lowerCaseValue)) ||
      (item.sG_FILIAL && item.sG_FILIAL.toLowerCase().includes(lowerCaseValue));

    // Filtra os subníveis
    const detalhesFiltrados = item.detalhes?.map(matchAndClean).filter(Boolean) ?? [];
    const segundoNivelFiltrado = item.segundoNivel?.map(matchAndClean).filter(Boolean) ?? [];
    const terceiroNivelFiltrado = item.terceiroNivel?.map(matchAndClean).filter(Boolean) ?? [];

    // Se o item principal ou algum subnível corresponde, retorna o item com subníveis filtrados
    if (matchPrincipal || detalhesFiltrados.length || segundoNivelFiltrado.length || terceiroNivelFiltrado.length) {
      return {
        ...item,
        detalhes: detalhesFiltrados,
        segundoNivel: segundoNivelFiltrado,
        terceiroNivel: terceiroNivelFiltrado
      };
    }

    return null;
  };

  this.listaLimites = this.listaLimitesCompleta
    .map(matchAndClean)
    .filter(Boolean) as LimitesModel[];
}



//requisições
public async obterValores() {
  try {
      const response = await this.apiService.get<
          ApiResponse<LimitesModel[]>
      >(`${Endpoints.URL_PLANEJAMENTO_ORCAMENTARIO_LIMITE_NIVEL1}`);
      this.listaLimitesCompleta = response.data;
      this.listaLimites = response.data;
      console.log(this.listaLimites)
  } catch (error) {
      console.error(error, 'obterValores nivel 1');
  }
}

async detalharPorTipoRubrica(registro: LimitesModel) {
  try {
      registro.expanded = !registro.expanded;
      if (registro.expanded && !registro.detalhes) {
          const response = await this.apiService.get<
              ApiResponse<LimitesModel[]>
          >(`${Endpoints.URL_PLANEJAMENTO_ORCAMENTARIO_LIMITE_NIVEL2}?nuPlanejamento=${registro.nU_PLANEJAMENTO}`)
          registro.detalhes = response.data;
          console.log(registro.detalhes)
      }
  } catch (error) {
      console.error(error, 'obterValores nivel 2');
  }
}

async detalharPorRubricaTipo(registro: LimitesModel, limite: any) {
  this.ultimoDetalheLimite = limite;
  try {
      if (!limite.segundoNivel) {
        limite.segundoNivel = [];
      }
      limite.expanded = !limite.expanded;
      if (limite.expanded && !limite.segundoNivel.data) {
          const response = await
          this.apiService.get<ApiResponse<LimitesModel[]>>
          (`${Endpoints.URL_PLANEJAMENTO_ORCAMENTARIO_LIMITE_NIVEL3}?nuPlanejamento=${registro.nU_PLANEJAMENTO}&rubricaTipo=${limite.nO_RUBRICA_TIPO}`);
          registro.segundoNivel = response?.data;
      }
  }
  catch (error) {
      console.error(error, 'obterValores nivel 3');
  }
}

async detalharPorUd(registro: LimitesModel, detalhe: any) {
  console.log(this.ultimoDetalheLimite )
  try {
      if (!detalhe.terceiroNivel) {
          detalhe.terceiroNivel = [];
      }
      detalhe.expanded = !detalhe.expanded;
      if (detalhe.expanded && !detalhe.terceiroNivel.data) {
          const response = await
          this.apiService.get<ApiResponse<LimitesModel[]>>
          (`${Endpoints.URL_PLANEJAMENTO_ORCAMENTARIO_LIMITE_NIVEL4}?nuPlanejamento=${registro.nU_PLANEJAMENTO}&rubricaTipo=${this.ultimoDetalheLimite.nO_RUBRICA_TIPO}&nuRubrica=${detalhe.nU_RUBRICA}`);
          registro.terceiroNivel = response.data;
      }
  }
  catch (error) {
      console.error(error, 'obterValores nivel 4');
  }
}

openModalPlanejamento() {
  const modalRef = this.modalService.open(ModalLimitesComponent, {
    ariaLabelledBy: 'modal-basic-title',
    size: 'md',
    windowClass: 'custom-class',
    backdrop: 'static',
    keyboard: false,
  });
  //modalRef.componentInstance.anoSelecionado = anoSelecionado;
}

}
