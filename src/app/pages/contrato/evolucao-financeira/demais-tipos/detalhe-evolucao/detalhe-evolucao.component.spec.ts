import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalheEvolucaoComponent } from './detalhe-evolucao.component';

describe('DetalheEvolucaoComponent', () => {
  let component: DetalheEvolucaoComponent;
  let fixture: ComponentFixture<DetalheEvolucaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalheEvolucaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalheEvolucaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
