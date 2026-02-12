import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DotacaoDoadoresComponent } from './dotacao-doadores.component';

describe('DotacaoDoadoresComponent', () => {
  let component: DotacaoDoadoresComponent;
  let fixture: ComponentFixture<DotacaoDoadoresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DotacaoDoadoresComponent]
    });
    fixture = TestBed.createComponent(DotacaoDoadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
