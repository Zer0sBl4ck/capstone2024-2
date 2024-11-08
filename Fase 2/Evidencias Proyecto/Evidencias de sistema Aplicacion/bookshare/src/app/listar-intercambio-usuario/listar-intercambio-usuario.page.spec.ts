import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarIntercambioUsuarioPage } from './listar-intercambio-usuario.page';

describe('ListarIntercambioUsuarioPage', () => {
  let component: ListarIntercambioUsuarioPage;
  let fixture: ComponentFixture<ListarIntercambioUsuarioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarIntercambioUsuarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
