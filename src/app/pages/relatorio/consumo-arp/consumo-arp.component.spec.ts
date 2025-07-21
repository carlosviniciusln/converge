import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumoArpComponent } from './consumo-arp.component'; 

describe('ConsumoComponent', () => {
  let component: ConsumoArpComponent;
  let fixture: ComponentFixture<ConsumoArpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsumoArpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumoArpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
