import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponse } from 'src/app/models/api-response';
import { ApiService } from 'src/app/services/api.service';
import { Endpoints } from 'src/app/shared/enums/endpoints';
import { DatePipe, Location } from '@angular/common';
import { Gcptb002ContratoTipo } from 'src/app/models/Gcptb001ContratoResponse';
import {
  ActionPolicies,
  ModuleEnum,
  TokenStorageService,
} from 'src/app/services/token-storage.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalSimulacaoComponent } from '../modal-simulacao/modal-simulacao.component';
import { ContratoResponse } from 'src/app/models/contrato-response';

@Component({
  selector: 'app-evolucao-financeira',
  templateUrl: './evolucao-financeira.component.html',
  styleUrls: ['./evolucao-financeira.component.scss'],
})
export class EvolucaoFinanceiraComponent implements OnInit, AfterViewInit {
  permissions: ActionPolicies;
  loading: boolean = true;
  nuContrato: string;
  gcptb002ContratoTipo: Gcptb002ContratoTipo;
  vigenciasAnteriores: any[];
  todasVigencias: any[];
  vigenciaAtual: any;
  showSelect = false;
  vigenciaAnterior: any;
  vigenciaAnteriorSelect: any;
  vigenciaSelecionada: any;
  contrato: any;
  rubricaAtiva: string = '';
  noEmpresa: string = '';
  isRotaAtas: boolean = false;
  isDerivadoAta: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private location: Location,
    public token: TokenStorageService,
    private datePipe: DatePipe,
    private modalService: NgbModal
  ) {
    this.obterPermissoes();
  }

  ngAfterViewInit(): void {
    this.montaTituloVigenciaAtual();
  }

  obterPermissoes() {
    this.permissions = this.token.getActionPolicies(ModuleEnum.Contratos);
  }

  ngOnInit(): void {
    this.nuContrato = this.route.snapshot.paramMap.get('id');
    this.obterVigenciasContrato(this.nuContrato);
    this.detalhesContrato(this.nuContrato);
  }

  rubricaSelecionada(rubrica: string) {
    if (rubrica == '0') {
      this.rubricaAtiva = 'Rubrica Selecionada: TOTAL';
    } else {
      this.rubricaAtiva = 'Rubrica Selecionada: ' + rubrica;
    }
  }

  async obterVigenciasContrato(nuContrato: string): Promise<void> {
    try {
      const response = await this.apiService.get<
        ApiResponse<Gcptb002ContratoTipo>
      >(`${Endpoints.URL_CONTRATOS}/vigencias-contrato?nuContrato=${nuContrato}`);
      const resp: any = response.data;
      this.todasVigencias = resp;
      this.vigenciaAtual = resp.find(item => item.iC_VIGENCIA_ATUAL == true && item.cO_RUBRICA == 'TOTAL');
      this.vigenciasAnteriores = resp.filter(item => item.iC_VIGENCIA_ATUAL == false && item.cO_RUBRICA == 'TOTAL');
      if(!this.vigenciaAtual){
         this.vigenciaAnterior = this.vigenciasAnteriores[0];
         this.rubricaAtiva = this.vigenciaAnterior?.nU_RUBRICA
         this.vigenciaAnteriorSelect = this.vigenciaAnterior;
      }
      else{
      this.vigenciaAnterior = this.vigenciasAnteriores[0];
      this.rubricaAtiva = this.vigenciaAtual?.nU_RUBRICA
      this.rubricaSelecionada(this.rubricaAtiva)
      }
      this.loading = false;
    } catch (error) {
      console.error(error);
      this.loading = false;
    }
  }

  public async detalhesContrato(nuContrato: string) {
    const response = await this.apiService.get<ApiResponse<ContratoResponse>>(
      `${Endpoints.URL_CONTRATOS}/${nuContrato}`
    );

    this.contrato = response.data
    this.noEmpresa = this.contrato.noEmpresa;
    this.rubricaSelecionada('0');
    this.validarRotaAtas();
  }

  onTabChange(event) {
    event.tab.textLabel == 'OUTRAS VIGÊNCIAS' ? this.showSelect = true : this.showSelect = false;
  }

  linkContrato() {
    const partesContrato = this.contrato.coContrato.split('/');
    const contratoFormatado = this.contrato.coContrato.replace('/', '_');
    window.open('https://caixa.sharepoint.com/:f:/r/sites/Arquivos7550/Documentos%20Compartilhados/TIPO_2_DIGITAL/' + partesContrato[1] + '/' + contratoFormatado, '_blank');
  }

  montaTituloVigenciaAtual(): string {
    if (this.vigenciaAtual == null) {
      return "Encerrada"
    } else {
      return 'VIGÊNCIA ATUAL (' + this.datePipe.transform(this.vigenciaAtual.iniciO_VIGENCIA, 'dd/MM/yyyy') + ' a ' + this.datePipe.transform(this.vigenciaAtual.fiM_VIGENCIA, 'dd/MM/yyyy') + ')'
    }
  }

  openModalSimulacao(nuContrato: string) {
    const modalRef = this.modalService.open(ModalSimulacaoComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      windowClass: 'custom-class',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.nuContrato = nuContrato;
    modalRef.componentInstance.coContrato = this.contrato.data[0]?.cO_CONTRATO;
  }

  public async receberAbaAtiva(rubricavigenciaSelecionada: string): Promise<void> {
    try {
      this.vigenciaAnterior = this.todasVigencias.filter(x => x.nU_VIGENCIA == rubricavigenciaSelecionada.split(',')[1] && x.cO_RUBRICA == rubricavigenciaSelecionada.split(',')[0])[0]
      this.rubricaSelecionada(this.vigenciaAnterior.cO_RUBRICA)

      this.loading = false;
    } catch (error) {
      console.error(error);
      this.loading = false;
    }
  }

  public async receberAbaAtivaVigenciaAtual(rubricavigenciaSelecionada: string): Promise<void> {
    try {
      this.vigenciaAtual = this.todasVigencias.find(item => item.iC_VIGENCIA_ATUAL == true && item.cO_RUBRICA == rubricavigenciaSelecionada.split(',')[0])
      this.loading = false;
    } catch (error) {
      console.error(error);
      this.loading = false;
    }
  }

  validarRotaAtas() {
    this.isRotaAtas = (this.contrato && this.contrato.no_Tipo_Arp == 'ATA_DE_REGISTRO_DE_PRECOS' && this.contrato.ic_Arp) ? true : false;
    this.isDerivadoAta = (this.contrato && this.contrato.no_Tipo_Arp == 'CONTRATO_DERIVADO_ATA_REGISTRO_PRECOS' && this.contrato.ic_Arp) ? true : false;
  }
}
