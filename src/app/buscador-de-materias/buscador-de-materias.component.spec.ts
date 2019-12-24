import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscadorDeMateriasComponent } from './buscador-de-materias.component';

describe('BuscadorDeMateriasComponent', () => {
  let component: BuscadorDeMateriasComponent;
  let fixture: ComponentFixture<BuscadorDeMateriasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuscadorDeMateriasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscadorDeMateriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
