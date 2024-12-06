import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarLibroSolicitudPage } from './listar-libro-solicitud.page';

describe('ListarLibroSolicitudPage', () => {
  let component: ListarLibroSolicitudPage;
  let fixture: ComponentFixture<ListarLibroSolicitudPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarLibroSolicitudPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
