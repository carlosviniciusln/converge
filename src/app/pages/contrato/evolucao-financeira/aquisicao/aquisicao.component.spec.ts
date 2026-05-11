import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AquisicaoComponent } from './aquisicao.component';

describe('AquisicaoComponent', () => {
  let component: AquisicaoComponent;
  let fixture: ComponentFixture<AquisicaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AquisicaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AquisicaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
