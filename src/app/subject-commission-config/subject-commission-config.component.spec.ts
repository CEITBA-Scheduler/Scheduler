import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectCommissionConfigComponent } from './subject-commission-config.component';

describe('SubjectCommissionConfigComponent', () => {
  let component: SubjectCommissionConfigComponent;
  let fixture: ComponentFixture<SubjectCommissionConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectCommissionConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectCommissionConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
