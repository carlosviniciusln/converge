import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoGeralComponent } from './grafico-geral.component';

describe('GraficoGeralComponent', () => {
  let component: GraficoGeralComponent;
  let fixture: ComponentFixture<GraficoGeralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraficoGeralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraficoGeralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
