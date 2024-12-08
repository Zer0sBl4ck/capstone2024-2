import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddbookPage } from './addbook.page';

describe('AddbookPage', () => {
  let component: AddbookPage;
  let fixture: ComponentFixture<AddbookPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddbookPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
