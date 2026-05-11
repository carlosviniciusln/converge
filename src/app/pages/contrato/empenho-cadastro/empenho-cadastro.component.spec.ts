import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpenhoCadastroComponent } from './empenho-cadastro.component';

describe('EmpenhoCadastroComponent', () => {
  let component: EmpenhoCadastroComponent;
  let fixture: ComponentFixture<EmpenhoCadastroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpenhoCadastroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpenhoCadastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
