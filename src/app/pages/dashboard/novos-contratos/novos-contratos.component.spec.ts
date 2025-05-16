import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovosContratosComponent } from './novos-contratos.component';

describe('NovosContratosComponent', () => {
  let component: NovosContratosComponent;
  let fixture: ComponentFixture<NovosContratosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NovosContratosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NovosContratosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
