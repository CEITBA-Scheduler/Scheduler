import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavouriteButtonComponent } from './favourite-button.component';

describe('FavouriteButtonComponent', () => {
  let component: FavouriteButtonComponent;
  let fixture: ComponentFixture<FavouriteButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavouriteButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavouriteButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
