import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComissionCardComponent } from './comission-card.component';

describe('ComissionCardComponent', () => {
  let component: ComissionCardComponent;
  let fixture: ComponentFixture<ComissionCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComissionCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComissionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
