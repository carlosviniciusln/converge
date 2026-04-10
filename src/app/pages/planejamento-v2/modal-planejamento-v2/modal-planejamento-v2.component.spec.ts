import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPlanejamentoV2Component } from './modal-planejamento-v2.component';

describe('ModalPlanejamentoV2Component', () => {
  let component: ModalPlanejamentoV2Component;
  let fixture: ComponentFixture<ModalPlanejamentoV2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalPlanejamentoV2Component]
    });
    fixture = TestBed.createComponent(ModalPlanejamentoV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
