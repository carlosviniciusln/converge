import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoAquisicaoGeralComponent } from './grafico-aquisicao-geral.component';

describe('GraficoAquisicaoGeralComponent', () => {
  let component: GraficoAquisicaoGeralComponent;
  let fixture: ComponentFixture<GraficoAquisicaoGeralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraficoAquisicaoGeralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraficoAquisicaoGeralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
