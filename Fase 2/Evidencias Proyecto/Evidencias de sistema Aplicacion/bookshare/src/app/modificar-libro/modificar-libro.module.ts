import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModificarLibroPageRoutingModule } from './modificar-libro-routing.module';

import { ModificarLibroPage } from './modificar-libro.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModificarLibroPageRoutingModule
  ],
  declarations: [ModificarLibroPage]
})
export class ModificarLibroPageModule {}
