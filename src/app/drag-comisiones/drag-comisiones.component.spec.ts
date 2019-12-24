import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DragComisionesComponent } from './drag-comisiones.component';

describe('DragComisionesComponent', () => {
  let component: DragComisionesComponent;
  let fixture: ComponentFixture<DragComisionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DragComisionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DragComisionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
