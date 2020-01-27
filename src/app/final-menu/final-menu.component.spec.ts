import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalMenuComponent } from './final-menu.component';

describe('FinalMenuComponent', () => {
  let component: FinalMenuComponent;
  let fixture: ComponentFixture<FinalMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinalMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
