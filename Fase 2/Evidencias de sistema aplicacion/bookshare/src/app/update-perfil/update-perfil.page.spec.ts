import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdatePerfilPage } from './update-perfil.page';

describe('UpdatePerfilPage', () => {
  let component: UpdatePerfilPage;
  let fixture: ComponentFixture<UpdatePerfilPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePerfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
