import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContratoDetalheComponent } from './contrato-detalhe.component';

describe('ContratoDetalheComponent', () => {
  let component: ContratoDetalheComponent;
  let fixture: ComponentFixture<ContratoDetalheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContratoDetalheComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContratoDetalheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
