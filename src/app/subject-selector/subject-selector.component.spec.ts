import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionadorDeMateriasComponent } from './seleccionador-de-materias.component';

describe('SeleccionadorDeMateriasComponent', () => {
  let component: SeleccionadorDeMateriasComponent;
  let fixture: ComponentFixture<SeleccionadorDeMateriasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeleccionadorDeMateriasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeleccionadorDeMateriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
