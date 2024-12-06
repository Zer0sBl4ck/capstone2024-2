import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListarIntercambioPageRoutingModule } from './listar-intercambio-routing.module';

import { ListarIntercambioPage } from './listar-intercambio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListarIntercambioPageRoutingModule
  ],
  declarations: [ListarIntercambioPage]
})
export class ListarIntercambioPageModule {}
