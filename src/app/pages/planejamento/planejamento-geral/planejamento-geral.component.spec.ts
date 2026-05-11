import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanejamentoGeralComponent } from './planejamento-geral.component';

describe('PlanejamentoGeralComponent', () => {
  let component: PlanejamentoGeralComponent;
  let fixture: ComponentFixture<PlanejamentoGeralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanejamentoGeralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanejamentoGeralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
