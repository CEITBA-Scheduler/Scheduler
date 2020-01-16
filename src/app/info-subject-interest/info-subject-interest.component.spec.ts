import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoSubjectInterestComponent } from './info-subject-interest.component';

describe('InfoSubjectInterestComponent', () => {
  let component: InfoSubjectInterestComponent;
  let fixture: ComponentFixture<InfoSubjectInterestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoSubjectInterestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoSubjectInterestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
