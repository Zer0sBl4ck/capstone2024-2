import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListarLibroSolicitudPageRoutingModule } from './listar-libro-solicitud-routing.module';

import { ListarLibroSolicitudPage } from './listar-libro-solicitud.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListarLibroSolicitudPageRoutingModule
  ],
  declarations: [ListarLibroSolicitudPage]
})
export class ListarLibroSolicitudPageModule {}
