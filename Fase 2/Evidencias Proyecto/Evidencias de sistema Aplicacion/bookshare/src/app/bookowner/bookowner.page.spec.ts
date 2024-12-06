import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookownerPage } from './bookowner.page';

describe('BookownerPage', () => {
  let component: BookownerPage;
  let fixture: ComponentFixture<BookownerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BookownerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
