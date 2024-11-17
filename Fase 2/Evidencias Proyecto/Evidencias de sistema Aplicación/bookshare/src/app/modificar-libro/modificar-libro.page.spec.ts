import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificarLibroPage } from './modificar-libro.page';

describe('ModificarLibroPage', () => {
  let component: ModificarLibroPage;
  let fixture: ComponentFixture<ModificarLibroPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificarLibroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
