import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValoresRubricaDetalhadoComponent } from './valores-rubrica-detalhado.component';

describe('ValoresRubricaDetalhadoComponent', () => {
  let component: ValoresRubricaDetalhadoComponent;
  let fixture: ComponentFixture<ValoresRubricaDetalhadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValoresRubricaDetalhadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValoresRubricaDetalhadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
