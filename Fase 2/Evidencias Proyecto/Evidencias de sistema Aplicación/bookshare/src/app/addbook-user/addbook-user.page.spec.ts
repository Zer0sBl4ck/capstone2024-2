import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddbookUserPage } from './addbook-user.page';

describe('AddbookUserPage', () => {
  let component: AddbookUserPage;
  let fixture: ComponentFixture<AddbookUserPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddbookUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
