import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestingModule1Component } from './testing-module1.component';

describe('TestingModule1Component', () => {
  let component: TestingModule1Component;
  let fixture: ComponentFixture<TestingModule1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestingModule1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestingModule1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
