import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxItemComponent } from './checkbox-item.component';

describe('CheckboxItemComponent', () => {
  let component: CheckboxItemComponent;
  let fixture: ComponentFixture<CheckboxItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckboxItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
