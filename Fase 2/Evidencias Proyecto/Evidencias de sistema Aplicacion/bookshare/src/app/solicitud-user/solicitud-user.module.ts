import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SolicitudUserPageRoutingModule } from './solicitud-user-routing.module';

import { SolicitudUserPage } from './solicitud-user.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SolicitudUserPageRoutingModule
  ],
  declarations: [SolicitudUserPage]
})
export class SolicitudUserPageModule {}
