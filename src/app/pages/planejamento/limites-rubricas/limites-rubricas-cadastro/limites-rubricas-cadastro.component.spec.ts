import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitesRubricasCadastroComponent } from './limites-rubricas-cadastro.component';

describe('LimitesRubricasCadastroComponent', () => {
  let component: LimitesRubricasCadastroComponent;
  let fixture: ComponentFixture<LimitesRubricasCadastroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LimitesRubricasCadastroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LimitesRubricasCadastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
