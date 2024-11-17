import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarIntercambioPage } from './listar-intercambio.page';

describe('ListarIntercambioPage', () => {
  let component: ListarIntercambioPage;
  let fixture: ComponentFixture<ListarIntercambioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarIntercambioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
