import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdatePerfilPageRoutingModule } from './update-perfil-routing.module';

import { UpdatePerfilPage } from './update-perfil.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdatePerfilPageRoutingModule
  ],
  declarations: [UpdatePerfilPage]
})
export class UpdatePerfilPageModule {}
