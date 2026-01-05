import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLimitesComponent } from './modal-limites.component';

describe('ModalSimulacaoComponent', () => {
  let component: ModalLimitesComponent;
  let fixture: ComponentFixture<ModalLimitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalLimitesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalLimitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
