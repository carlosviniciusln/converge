import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensalizacaoComponent } from './mensalizacao-exec-orcamentaria.component';

describe('MensalizacaoComponent', () => {
  let component: MensalizacaoComponent;
  let fixture: ComponentFixture<MensalizacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MensalizacaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MensalizacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
