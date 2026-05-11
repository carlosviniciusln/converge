import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSimulacaoComponent } from './modal-simulacao.component';

describe('ModalSimulacaoComponent', () => {
  let component: ModalSimulacaoComponent;
  let fixture: ComponentFixture<ModalSimulacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalSimulacaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSimulacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
