import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionSelectorComponent } from './seleccionador-de-comisiones.component';

describe('CommissionSelectorComponent', () => {
  let component: CommissionSelectorComponent;
  let fixture: ComponentFixture<CommissionSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommissionSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommissionSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
