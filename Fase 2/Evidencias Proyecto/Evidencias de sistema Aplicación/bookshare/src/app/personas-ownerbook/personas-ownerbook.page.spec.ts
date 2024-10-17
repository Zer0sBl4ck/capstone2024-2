import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonasOwnerbookPage } from './personas-ownerbook.page';

describe('PersonasOwnerbookPage', () => {
  let component: PersonasOwnerbookPage;
  let fixture: ComponentFixture<PersonasOwnerbookPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonasOwnerbookPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
