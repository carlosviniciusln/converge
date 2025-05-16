import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtigoPagamentoComponent } from './artigo-pagamento.component';

describe('DemaisTiposComponent', () => {
  let component: ArtigoPagamentoComponent;
  let fixture: ComponentFixture<ArtigoPagamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArtigoPagamentoComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtigoPagamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
