import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportPagamentoComponent } from './export-pagamento.component';

describe('ExportPagamentoComponent', () => {
  let component: ExportPagamentoComponent;
  let fixture: ComponentFixture<ExportPagamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportPagamentoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportPagamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
