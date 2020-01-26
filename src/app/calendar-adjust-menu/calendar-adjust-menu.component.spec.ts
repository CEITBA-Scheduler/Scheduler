import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarAdjustMenuComponent } from './calendar-adjust-menu.component';

describe('CalendarAdjustMenuComponent', () => {
  let component: CalendarAdjustMenuComponent;
  let fixture: ComponentFixture<CalendarAdjustMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarAdjustMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarAdjustMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
