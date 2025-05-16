import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvolucaoFinanceiraAquisicaoComponent } from './evolucao-financeira-aquisicao.component';

describe('EvolucaoFinanceiraAquisicaoComponent', () => {
  let component: EvolucaoFinanceiraAquisicaoComponent;
  let fixture: ComponentFixture<EvolucaoFinanceiraAquisicaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvolucaoFinanceiraAquisicaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvolucaoFinanceiraAquisicaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
