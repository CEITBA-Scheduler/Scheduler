import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveIconComponent } from './save-icon.component';

describe('SaveIconComponent', () => {
  let component: SaveIconComponent;
  let fixture: ComponentFixture<SaveIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
