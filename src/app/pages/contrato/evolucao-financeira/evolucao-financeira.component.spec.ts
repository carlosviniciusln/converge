import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvolucaoFinanceiraComponent } from './evolucao-financeira.component';

describe('EvolucaoFinanceiraComponent', () => {
  let component: EvolucaoFinanceiraComponent;
  let fixture: ComponentFixture<EvolucaoFinanceiraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvolucaoFinanceiraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvolucaoFinanceiraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
