import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListarLibroPageRoutingModule } from './listar-libro-routing.module';

import { ListarLibroPage } from './listar-libro.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListarLibroPageRoutingModule
  ],
  declarations: [ListarLibroPage]
})
export class ListarLibroPageModule {}
