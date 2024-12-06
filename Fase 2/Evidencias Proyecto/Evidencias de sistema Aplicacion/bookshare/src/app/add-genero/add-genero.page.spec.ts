import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddGeneroPage } from './add-genero.page';

describe('AddGeneroPage', () => {
  let component: AddGeneroPage;
  let fixture: ComponentFixture<AddGeneroPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGeneroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
