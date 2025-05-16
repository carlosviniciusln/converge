import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValoresExecutadosComponent } from './valores-executados.component';

describe('ValoresExecutadosComponent', () => {
  let component: ValoresExecutadosComponent;
  let fixture: ComponentFixture<ValoresExecutadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValoresExecutadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValoresExecutadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
