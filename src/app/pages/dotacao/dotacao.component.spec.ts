import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DotacaoComponent } from './dotacao.component';

describe('DotacaoComponent', () => {
  let component: DotacaoComponent;
  let fixture: ComponentFixture<DotacaoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DotacaoComponent]
    });
    fixture = TestBed.createComponent(DotacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
