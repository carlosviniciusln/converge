import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetencaoCadastroComponent } from './retencao-cadastro.component';

describe('RetencaoCadastroComponent', () => {
  let component: RetencaoCadastroComponent;
  let fixture: ComponentFixture<RetencaoCadastroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RetencaoCadastroComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetencaoCadastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
