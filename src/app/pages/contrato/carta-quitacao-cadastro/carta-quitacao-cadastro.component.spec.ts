import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartaQuitacaoCadastroComponent } from './carta-quitacao-cadastro.component';

describe('CartaQuitacaoCadastroComponent', () => {
  let component: CartaQuitacaoCadastroComponent;
  let fixture: ComponentFixture<CartaQuitacaoCadastroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartaQuitacaoCadastroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartaQuitacaoCadastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
