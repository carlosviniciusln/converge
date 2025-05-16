import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanejamentoCadastroComponent } from './planejamento-cadastro.component';

describe('PlanejamentoCadastroComponent', () => {
  let component: PlanejamentoCadastroComponent;
  let fixture: ComponentFixture<PlanejamentoCadastroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanejamentoCadastroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanejamentoCadastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
