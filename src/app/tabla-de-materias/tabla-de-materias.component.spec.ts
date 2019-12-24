import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaDeMateriasComponent } from './tabla-de-materias.component';

describe('TablaDeMateriasComponent', () => {
  let component: TablaDeMateriasComponent;
  let fixture: ComponentFixture<TablaDeMateriasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaDeMateriasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaDeMateriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
