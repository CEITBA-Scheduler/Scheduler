import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselCommissionSelectComponent } from './carousel-commission-select.component';

describe('CarouselCommissionSelectComponent', () => {
  let component: CarouselCommissionSelectComponent;
  let fixture: ComponentFixture<CarouselCommissionSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarouselCommissionSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarouselCommissionSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
