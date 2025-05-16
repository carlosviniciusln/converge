import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContratoPendenteComponent } from './contrato-pendente.component';

describe('ContratoPendenteComponent', () => {
  let component: ContratoPendenteComponent;
  let fixture: ComponentFixture<ContratoPendenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContratoPendenteComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContratoPendenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
