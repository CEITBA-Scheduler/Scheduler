import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestingModule2Component } from './testing-module2.component';

describe('TestingModule2Component', () => {
  let component: TestingModule2Component;
  let fixture: ComponentFixture<TestingModule2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestingModule2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestingModule2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
