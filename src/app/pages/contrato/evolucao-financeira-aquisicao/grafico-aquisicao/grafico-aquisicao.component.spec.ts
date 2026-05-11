import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoAquisicaoComponent } from './grafico-aquisicao.component';

describe('GraficoAquisicaoComponent', () => {
  let component: GraficoAquisicaoComponent;
  let fixture: ComponentFixture<GraficoAquisicaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraficoAquisicaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraficoAquisicaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
