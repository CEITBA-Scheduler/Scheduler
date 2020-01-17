import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrashCardComponent } from './trash-card.component';

describe('TrashCardComponent', () => {
  let component: TrashCardComponent;
  let fixture: ComponentFixture<TrashCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrashCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrashCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
