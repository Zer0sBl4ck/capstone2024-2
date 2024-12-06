import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResenaLibroPage } from './resena-libro.page';

describe('ResenaLibroPage', () => {
  let component: ResenaLibroPage;
  let fixture: ComponentFixture<ResenaLibroPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResenaLibroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
