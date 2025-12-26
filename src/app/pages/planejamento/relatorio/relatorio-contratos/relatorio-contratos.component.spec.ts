import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioContratosComponent } from './relatorio-contratos.component';

describe('RelatorioContratosComponent', () => {
  let component: RelatorioContratosComponent;
  let fixture: ComponentFixture<RelatorioContratosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RelatorioContratosComponent]
    });
    fixture = TestBed.createComponent(RelatorioContratosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
