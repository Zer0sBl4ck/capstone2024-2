import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListarIntercambioUsuarioPageRoutingModule } from './listar-intercambio-usuario-routing.module';

import { ListarIntercambioUsuarioPage } from './listar-intercambio-usuario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListarIntercambioUsuarioPageRoutingModule
  ],
  declarations: [ListarIntercambioUsuarioPage]
})
export class ListarIntercambioUsuarioPageModule {}
