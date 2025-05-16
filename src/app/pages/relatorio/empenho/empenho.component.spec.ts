import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpenhoComponent } from './empenho.component';

describe('EmpenhoComponent', () => {
  let component: EmpenhoComponent;
  let fixture: ComponentFixture<EmpenhoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpenhoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpenhoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
