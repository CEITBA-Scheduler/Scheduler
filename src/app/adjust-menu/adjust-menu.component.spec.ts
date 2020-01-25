import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustMenuComponent } from './adjust-menu.component';

describe('AdjustMenuComponent', () => {
  let component: AdjustMenuComponent;
  let fixture: ComponentFixture<AdjustMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdjustMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjustMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
