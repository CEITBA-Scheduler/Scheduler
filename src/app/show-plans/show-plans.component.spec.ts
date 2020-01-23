import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowPlansComponent } from './show-plans.component';

describe('ShowPlansComponent', () => {
  let component: ShowPlansComponent;
  let fixture: ComponentFixture<ShowPlansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowPlansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
