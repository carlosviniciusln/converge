import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanejamentoAbaRubricaComponent } from './planejamento-aba-rubrica.component';

describe('PlanejamentoAbaRubrica', () => {
  let component: PlanejamentoAbaRubricaComponent;
  let fixture: ComponentFixture<PlanejamentoAbaRubricaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanejamentoAbaRubricaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanejamentoAbaRubricaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
