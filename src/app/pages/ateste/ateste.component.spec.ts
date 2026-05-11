import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtesteComponent } from './ateste.component';

describe('AtesteComponent', () => {
  let component: AtesteComponent;
  let fixture: ComponentFixture<AtesteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtesteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AtesteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
