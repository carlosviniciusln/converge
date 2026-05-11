import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitesRubricasUsoComponent } from './limites-rubricas-uso.component';

describe('LimitesRubricasUsoComponent', () => {
  let component: LimitesRubricasUsoComponent;
  let fixture: ComponentFixture<LimitesRubricasUsoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LimitesRubricasUsoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LimitesRubricasUsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
