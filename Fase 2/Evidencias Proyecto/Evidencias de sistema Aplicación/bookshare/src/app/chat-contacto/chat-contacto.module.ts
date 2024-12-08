import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatContactoPageRoutingModule } from './chat-contacto-routing.module';

import { ChatContactoPage } from './chat-contacto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatContactoPageRoutingModule
  ],
  declarations: [ChatContactoPage]
})
export class ChatContactoPageModule {}
