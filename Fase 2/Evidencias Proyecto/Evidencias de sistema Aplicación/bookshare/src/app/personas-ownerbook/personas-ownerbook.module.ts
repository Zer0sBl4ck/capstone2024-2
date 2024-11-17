import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PersonasOwnerbookPageRoutingModule } from './personas-ownerbook-routing.module';

import { PersonasOwnerbookPage } from './personas-ownerbook.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PersonasOwnerbookPageRoutingModule
  ],
  declarations: [PersonasOwnerbookPage]
})
export class PersonasOwnerbookPageModule {}
