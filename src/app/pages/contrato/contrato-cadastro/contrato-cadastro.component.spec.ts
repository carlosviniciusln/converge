import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContratoCadastroComponent } from './contrato-cadastro.component';

describe('ContratoCadastroComponent', () => {
  let component: ContratoCadastroComponent;
  let fixture: ComponentFixture<ContratoCadastroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContratoCadastroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContratoCadastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
