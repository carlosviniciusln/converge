import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanejamentoV2Component } from './planejamento-v2.component';

describe('PlanejamentoV2Component', () => {
  let component: PlanejamentoV2Component;
  let fixture: ComponentFixture<PlanejamentoV2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlanejamentoV2Component]
    });
    fixture = TestBed.createComponent(PlanejamentoV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
