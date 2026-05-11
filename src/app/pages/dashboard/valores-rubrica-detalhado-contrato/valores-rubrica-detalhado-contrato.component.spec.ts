import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValoresRubricaDetalhadoContratoComponent } from './valores-rubrica-detalhado-contrato.component';

describe('ValoresRubricaDetalhadoContratoComponent', () => {
  let component: ValoresRubricaDetalhadoContratoComponent;
  let fixture: ComponentFixture<ValoresRubricaDetalhadoContratoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValoresRubricaDetalhadoContratoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValoresRubricaDetalhadoContratoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
