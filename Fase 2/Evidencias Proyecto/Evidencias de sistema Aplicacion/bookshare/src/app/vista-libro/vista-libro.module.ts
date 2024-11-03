import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VistaLibroPageRoutingModule } from './vista-libro-routing.module';

import { VistaLibroPage } from './vista-libro.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VistaLibroPageRoutingModule
  ],
  declarations: [VistaLibroPage]
})
export class VistaLibroPageModule {}
