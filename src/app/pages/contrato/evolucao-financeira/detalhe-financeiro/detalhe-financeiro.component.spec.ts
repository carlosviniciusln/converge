import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalheFinanceiroComponent } from './detalhe-financeiro.component';

describe('DetalheFinanceiroComponent', () => {
  let component: DetalheFinanceiroComponent;
  let fixture: ComponentFixture<DetalheFinanceiroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalheFinanceiroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalheFinanceiroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
