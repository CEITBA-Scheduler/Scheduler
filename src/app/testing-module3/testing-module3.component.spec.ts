import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestingModule3Component } from './testing-module3.component';

describe('TestingModule3Component', () => {
  let component: TestingModule3Component;
  let fixture: ComponentFixture<TestingModule3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestingModule3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestingModule3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
