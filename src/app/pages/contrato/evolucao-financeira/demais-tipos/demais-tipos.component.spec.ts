import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemaisTiposComponent } from './demais-tipos.component';

describe('DemaisTiposComponent', () => {
  let component: DemaisTiposComponent;
  let fixture: ComponentFixture<DemaisTiposComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemaisTiposComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemaisTiposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
