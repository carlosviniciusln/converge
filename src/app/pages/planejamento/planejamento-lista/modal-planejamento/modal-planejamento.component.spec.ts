import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPlanejamentoComponent } from './modal-planejamento.component';

describe('ModalSimulacaoComponent', () => {
  let component: ModalPlanejamentoComponent;
  let fixture: ComponentFixture<ModalPlanejamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPlanejamentoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPlanejamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
