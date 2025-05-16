import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitesRubricasComponent } from './limites-rubricas.component';

describe('LimitesRubricasComponent', () => {
  let component: LimitesRubricasComponent;
  let fixture: ComponentFixture<LimitesRubricasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LimitesRubricasComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LimitesRubricasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
