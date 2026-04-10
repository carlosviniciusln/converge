import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanejamentoCadastroV2Component } from './planejamento-cadastro-v2.component';

describe('PlanejamentoCadastroV2Component', () => {
  let component: PlanejamentoCadastroV2Component;
  let fixture: ComponentFixture<PlanejamentoCadastroV2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlanejamentoCadastroV2Component]
    });
    fixture = TestBed.createComponent(PlanejamentoCadastroV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
