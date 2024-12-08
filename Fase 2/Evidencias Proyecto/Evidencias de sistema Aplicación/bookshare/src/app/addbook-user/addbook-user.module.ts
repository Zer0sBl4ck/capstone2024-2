import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddbookUserPageRoutingModule } from './addbook-user-routing.module';

import { AddbookUserPage } from './addbook-user.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddbookUserPageRoutingModule
  ],
  declarations: [AddbookUserPage]
})
export class AddbookUserPageModule {}
