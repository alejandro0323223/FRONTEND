import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaopcionesComponent } from './listaopciones.component';

describe('ListaopcionesComponent', () => {
  let component: ListaopcionesComponent;
  let fixture: ComponentFixture<ListaopcionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaopcionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaopcionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
