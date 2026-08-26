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
      items.push({ title: 'Início', icon: 'home', url: '/dashboard' });
    }

    if (this.canView(ModuleEnum.Contratos)) {
      items.push({
        title: 'Execução',
        icon: 'description',
        children: [
          { title: 'Contratos',                url: '/contrato' },
          { title: 'Atas de Registro',         url: '/contrato/atas' },
          { title: 'Pagamentos Art.81',        url: '/contrato/artigos' },
          { title: 'Conciliação de Registros', url: '/contrato/conciliacao' },
        ]
      });
    }

    if (this.canCreate(ModuleEnum.Contratos)) {
      items.push({
        title: 'Cadastros',
        icon: 'add_box',
        children: [
          { title: 'Contrato',  url: '/contrato/create' },
          { title: 'Pagamento', url: '/contrato?modo=cadastro-pagamento' },
          { title: 'Ateste',    url: '/ateste' },
        ]
      });
    }

    const orcamentoChildren: DscMenu[] = [];
    if (this.canView(ModuleEnum.Planejamento)) {
      orcamentoChildren.push(
        { title: 'Planejamento',           url: '/novo-planejamento' },
        { title: 'Valores Executados',     url: '/valores-executados' },
        { title: 'Extração de Pagamentos', url: '/export-data-pagamento' },
        { title: 'Planejamento Legado',    url: '/planejamento' },
      );
    }
    if (this.canView(ModuleEnum.Limites)) {
      orcamentoChildren.push(
        { title: 'Limites',        url: '/orcamento/limites' },
        { title: 'Limites Legado', url: '/planejamento/limites' },
      );
    }
    if (orcamentoChildren.length > 0) {
      items.push({ title: 'Orçamento', icon: 'savings', children: orcamentoChildren });
    }

    if (this.canView(ModuleEnum.Relatorios)) {
      items.push({
        title: 'Relatórios',
        icon: 'settings_suggest',
        children: [
          { title: 'Relatório de Pagamentos', url: '/pagamento' },
          { title: 'Relatório de Consumo',    url: '/consumo' },
          { title: 'Relatório de Contratos',  url: '/relatorio-contrato' },
        ]
      });
    }

    if (this.canView(ModuleEnum.Usuarios)) {
      items.push({ title: 'Usuários', icon: 'person', url: '/usuarios' });
    }

    items.push(
      { title: 'Comentários e sugestões', icon: 'chat',      externalUrl: 'mailto:sigvc@caixa.gov.br' },
      { title: 'Manual do usuário',       icon: 'menu_book', externalUrl: '/assets/manual/manual-sigvc.pdf' },
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