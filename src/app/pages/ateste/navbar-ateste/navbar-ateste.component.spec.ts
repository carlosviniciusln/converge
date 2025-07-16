import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarAtesteComponent } from './navbar-ateste.component';

describe('NavbarAtesteComponent', () => {
  let component: NavbarAtesteComponent;
  let fixture: ComponentFixture<NavbarAtesteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarAtesteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarAtesteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
