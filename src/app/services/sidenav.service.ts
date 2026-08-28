import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DscMenu } from 'sidsc-components/dsc-sidenav';
import { ModuleEnum, TokenStorageService } from '../shared/services/token-storage.service';

@Injectable({ providedIn: 'root' })
export class SidenavService {

  private _opened = new BehaviorSubject<boolean>(false);
  opened$ = this._opened.asObservable();

  menuItems: DscMenu[];

  constructor(private tokenStorage: TokenStorageService) {
    this.menuItems = this.buildMenu();
  }

  buildMenu(): DscMenu[] {
    const items: DscMenu[] = [];

    if (this.canView(ModuleEnum.Dashboard)) {
      items.push({ title: 'Início', icon: 'icon-bank', url: '/dashboard' });
    }

    const operacionalChildren: DscMenu[] = [];
    if (this.canView(ModuleEnum.Contratos)) {
      operacionalChildren.push({
        title: 'Contratos',
        children: [
          { title: 'Consultar',                url: '/contrato' },
          { title: 'Atas de Registro',         url: '/contrato/atas' },
          // { title: 'Pagamentos Art.81',        url: '/contrato/artigos' },
          // { title: 'Conciliação de Registros', url: '/contrato/conciliacao' },
        ]
      });
    }
    if (this.canView(ModuleEnum.Contratos) || this.canCreate(ModuleEnum.Contratos)) {
      const faturamentoChildren: DscMenu[] = [
        { title: 'Ateste', url: '/ateste' },
        { title: 'Validação da NF', url: '/cadastros?aba=documentos&tipoDocumento=nota-fiscal' },
      ];
      if (this.canCreate(ModuleEnum.Contratos)) {
        faturamentoChildren.unshift({ title: 'Pagamento', url: '/contrato?modo=cadastro-pagamento' });
      }
      operacionalChildren.push(
        { title: 'Faturamento', children: faturamentoChildren },
        { title: 'Penalidades', url: '/ateste' },
      );
    }
    if (operacionalChildren.length > 0) {
      items.push({ title: 'Operacional', icon: 'icon-settings', children: operacionalChildren });
    }

    const orcamentoChildren: DscMenu[] = [];
    if (this.canView(ModuleEnum.Planejamento)) {
      orcamentoChildren.push(
        { title: 'Planejamento',           url: '/novo-planejamento' },
        // { title: 'Valores Executados',     url: '/valores-executados' },
        // { title: 'Extração de Pagamentos', url: '/export-data-pagamento' },
        // { title: 'Planejamento Legado',    url: '/planejamento' },
      );
    }
    if (this.canView(ModuleEnum.Limites)) {
      orcamentoChildren.push(
        { title: 'Limites',        url: '/orcamento/limites' },
        // { title: 'Limites Legado', url: '/planejamento/limites' },
      );
    }
    if (orcamentoChildren.length > 0) {
      items.push({ title: 'Orçamento', icon: 'icon-coins', children: orcamentoChildren });
    }

    const cadastroChildren: DscMenu[] = [];
    if (this.canView(ModuleEnum.Usuarios)) {
      cadastroChildren.push(
        { title: 'Funcionários',    url: '/cadastros?aba=usuarios' },
        { title: 'Departamentos',   url: '/cadastros?aba=departamentos' },
        { title: 'Fornecedores',    url: '/cadastros?aba=fornecedores' },
        { title: 'Representantes',  url: '/cadastros?aba=representantes' },
        { title: 'Documentos',      url: '/cadastros?aba=documentos' },
      );
    }
    if (this.canView(ModuleEnum.Contratos)) {
      cadastroChildren.splice(Math.min(4, cadastroChildren.length), 0,
        { title: 'Contratos', url: '/cadastros?aba=contratos' }
      );
    }
    if (cadastroChildren.length > 0) {
      items.push({ title: 'Cadastros', icon: 'icon-simple-add', children: cadastroChildren });
    }

    if (this.canView(ModuleEnum.Relatorios)) {
      items.push({
        title: 'Relatórios',
        icon: 'icon-puzzle-10',
        children: [
          { title: 'Relatório de Pagamentos', url: '/pagamento' },
          { title: 'Relatório de Consumo',    url: '/consumo' },
          { title: 'Relatório de Contratos',  url: '/relatorio-contrato' },
        ]
      });
    }

    items.push(
      { title: 'Comentários e sugestões', icon: 'icon-chat-33',       externalUrl: 'mailto:Converge@caixa.gov.br' },
      { title: 'Manual do usuário',       icon: 'icon-book-bookmark', externalUrl: '/assets/manual/manual-Converge.pdf' },
    );

    return items;
  }

  private canView(module: ModuleEnum): boolean {
    const policies = this.tokenStorage.getActionPolicies(module);
    return !!(policies && policies.Consultar);
  }

  private canCreate(module: ModuleEnum): boolean {
    const policies = this.tokenStorage.getActionPolicies(module);
    return !!(policies && policies.Cadastrar);
  }

  toggle(): void {
    this._opened.next(!this._opened.value);
  }

  close(): void {
    this._opened.next(false);
  }

  setOpened(value: boolean): void {
    this._opened.next(value);
  }
}