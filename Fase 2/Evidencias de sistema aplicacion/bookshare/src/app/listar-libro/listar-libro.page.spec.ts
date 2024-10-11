import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarLibroPage } from './listar-libro.page';

describe('ListarLibroPage', () => {
  let component: ListarLibroPage;
  let fixture: ComponentFixture<ListarLibroPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarLibroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
