import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoArtigoComponent } from './grafico-artigo.component'; 

describe('GraficoComponent', () => {
  let component: GraficoArtigoComponent;
  let fixture: ComponentFixture<GraficoArtigoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraficoArtigoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraficoArtigoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
