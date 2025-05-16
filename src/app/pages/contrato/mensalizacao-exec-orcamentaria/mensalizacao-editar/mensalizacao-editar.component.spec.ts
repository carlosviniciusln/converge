import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensalizacaoEditarComponent } from './mensalizacao-editar.component';

describe('MensalizacaoEditarComponent', () => {
  let component: MensalizacaoEditarComponent;
  let fixture: ComponentFixture<MensalizacaoEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MensalizacaoEditarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MensalizacaoEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
