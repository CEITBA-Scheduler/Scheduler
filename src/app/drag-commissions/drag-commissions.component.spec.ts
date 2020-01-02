import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DragCommissionsComponent } from './drag-commissions.component';

describe('DragCommissionsComponent', () => {
  let component: DragCommissionsComponent;
  let fixture: ComponentFixture<DragCommissionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DragCommissionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DragCommissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
