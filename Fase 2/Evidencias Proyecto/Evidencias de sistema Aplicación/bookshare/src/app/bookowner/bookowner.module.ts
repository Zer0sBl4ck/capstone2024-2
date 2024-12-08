import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookownerPageRoutingModule } from './bookowner-routing.module';

import { BookownerPage } from './bookowner.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BookownerPageRoutingModule
  ],
  declarations: [BookownerPage]
})
export class BookownerPageModule {}
