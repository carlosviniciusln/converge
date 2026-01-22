import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioContratoComponent } from './relatorio-contrato.component';

describe('RelatorioContratoComponent', () => {
  let component: RelatorioContratoComponent;
  let fixture: ComponentFixture<RelatorioContratoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RelatorioContratoComponent]
    });
    fixture = TestBed.createComponent(RelatorioContratoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
