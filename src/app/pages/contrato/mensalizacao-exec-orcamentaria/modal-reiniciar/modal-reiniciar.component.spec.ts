import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalReiniciarComponent } from './modal-reiniciar.component';

describe('ModalReiniciarComponent', () => {
  let component: ModalReiniciarComponent;
  let fixture: ComponentFixture<ModalReiniciarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalReiniciarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalReiniciarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
