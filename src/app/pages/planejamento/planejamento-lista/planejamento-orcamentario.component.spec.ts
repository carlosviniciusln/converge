import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanejamentoOrcamentarioComponent } from './planejamento-orcamentario.component'; 

describe('DashboardComponent', () => {
  let component: PlanejamentoOrcamentarioComponent;
  let fixture: ComponentFixture<PlanejamentoOrcamentarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanejamentoOrcamentarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanejamentoOrcamentarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
