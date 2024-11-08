import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResenaLibroPageRoutingModule } from './resena-libro-routing.module';

import { ResenaLibroPage } from './resena-libro.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResenaLibroPageRoutingModule
  ],
  declarations: [ResenaLibroPage]
})
export class ResenaLibroPageModule {}
