import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanejamentoCadastroLegadoComponent } from './planejamento-cadastro-legado.component';

describe('PlanejamentoCadastroLegadoComponent', () => {
  let component: PlanejamentoCadastroLegadoComponent;
  let fixture: ComponentFixture<PlanejamentoCadastroLegadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlanejamentoCadastroLegadoComponent]
    });
    fixture = TestBed.createComponent(PlanejamentoCadastroLegadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
