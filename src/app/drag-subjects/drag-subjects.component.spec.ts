import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DragSubjectsComponent } from './drag-subjects.component';

describe('DragSubjectsComponent', () => {
  let component: DragSubjectsComponent;
  let fixture: ComponentFixture<DragSubjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DragSubjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DragSubjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
