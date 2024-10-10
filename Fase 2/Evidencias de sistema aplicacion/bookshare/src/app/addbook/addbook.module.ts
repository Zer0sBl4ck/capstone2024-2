import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddbookPageRoutingModule } from './addbook-routing.module';

import { AddbookPage } from './addbook.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddbookPageRoutingModule
  ],
  declarations: [AddbookPage]
})
export class AddbookPageModule {}
