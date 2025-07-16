import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalharAtesteComponent } from './detalhar-ateste.component';

describe('DetalharAtesteComponent', () => {
  let component: DetalharAtesteComponent;
  let fixture: ComponentFixture<DetalharAtesteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalharAtesteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalharAtesteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
