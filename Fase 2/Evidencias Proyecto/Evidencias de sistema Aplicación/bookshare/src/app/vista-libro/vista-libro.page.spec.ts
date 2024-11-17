import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VistaLibroPage } from './vista-libro.page';

describe('VistaLibroPage', () => {
  let component: VistaLibroPage;
  let fixture: ComponentFixture<VistaLibroPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VistaLibroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
