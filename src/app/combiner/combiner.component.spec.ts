import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CombinerComponent } from './combiner.component';

describe('CombinerComponent', () => {
  let component: CombinerComponent;
  let fixture: ComponentFixture<CombinerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CombinerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CombinerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
