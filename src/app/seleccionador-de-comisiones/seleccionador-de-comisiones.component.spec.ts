import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionadorDeComisionesComponent } from './seleccionador-de-comisiones.component';

describe('SeleccionadorDeComisionesComponent', () => {
  let component: SeleccionadorDeComisionesComponent;
  let fixture: ComponentFixture<SeleccionadorDeComisionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeleccionadorDeComisionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeleccionadorDeComisionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
