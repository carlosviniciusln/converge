import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContratoVigenciaComponent } from './contrato-vigencia.component';

describe('ContratoVigenciaComponent', () => {
  let component: ContratoVigenciaComponent;
  let fixture: ComponentFixture<ContratoVigenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContratoVigenciaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContratoVigenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
