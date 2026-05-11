import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValoresRubricaComponent } from './valores-rubrica.component';

describe('ValoresRubricaComponent', () => {
  let component: ValoresRubricaComponent;
  let fixture: ComponentFixture<ValoresRubricaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValoresRubricaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValoresRubricaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
