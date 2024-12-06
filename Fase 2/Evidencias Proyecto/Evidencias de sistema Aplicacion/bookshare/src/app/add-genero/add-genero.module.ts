import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddGeneroPageRoutingModule } from './add-genero-routing.module';

import { AddGeneroPage } from './add-genero.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddGeneroPageRoutingModule
  ],
  declarations: [AddGeneroPage]
})
export class AddGeneroPageModule {}
