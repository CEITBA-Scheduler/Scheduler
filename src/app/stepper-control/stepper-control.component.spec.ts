import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperControlComponent } from './stepper-control.component';

describe('StepperControlComponent', () => {
  let component: StepperControlComponent;
  let fixture: ComponentFixture<StepperControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StepperControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepperControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
