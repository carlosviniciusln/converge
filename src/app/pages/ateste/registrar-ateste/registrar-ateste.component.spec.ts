import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarAtesteComponent } from './registrar-ateste.component';

describe('RegistrarAtesteComponent', () => {
  let component: RegistrarAtesteComponent;
  let fixture: ComponentFixture<RegistrarAtesteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrarAtesteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarAtesteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
