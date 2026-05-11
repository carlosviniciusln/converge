import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabelaMensalizacaoComponent } from './tabela-mensalizacao.component';

describe('TabelaMensalizacaoComponent', () => {
  let component: TabelaMensalizacaoComponent;
  let fixture: ComponentFixture<TabelaMensalizacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabelaMensalizacaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabelaMensalizacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
