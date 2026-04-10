import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanejamentoGeralV2Component } from './planejamento-geral-v2.component';

describe('PlanejamentoGeralV2Component', () => {
  let component: PlanejamentoGeralV2Component;
  let fixture: ComponentFixture<PlanejamentoGeralV2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlanejamentoGeralV2Component]
    });
    fixture = TestBed.createComponent(PlanejamentoGeralV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
