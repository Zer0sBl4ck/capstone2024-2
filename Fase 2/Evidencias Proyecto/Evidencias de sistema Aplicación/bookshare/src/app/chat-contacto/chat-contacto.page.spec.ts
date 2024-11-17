import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatContactoPage } from './chat-contacto.page';

describe('ChatContactoPage', () => {
  let component: ChatContactoPage;
  let fixture: ComponentFixture<ChatContactoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatContactoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
