import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionCardV2Component } from './commission-card-v2.component';

describe('CommissionCardV2Component', () => {
  let component: CommissionCardV2Component;
  let fixture: ComponentFixture<CommissionCardV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommissionCardV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommissionCardV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
