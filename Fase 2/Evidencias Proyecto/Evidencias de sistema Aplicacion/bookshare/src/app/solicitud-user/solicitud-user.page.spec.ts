import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudUserPage } from './solicitud-user.page';

describe('SolicitudUserPage', () => {
  let component: SolicitudUserPage;
  let fixture: ComponentFixture<SolicitudUserPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
