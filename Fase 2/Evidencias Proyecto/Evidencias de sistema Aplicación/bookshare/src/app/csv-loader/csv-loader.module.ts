import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CsvLoaderPageRoutingModule } from './csv-loader-routing.module';

import { CsvLoaderPage } from './csv-loader.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CsvLoaderPageRoutingModule
  ],
  declarations: [CsvLoaderPage]
})
export class CsvLoaderPageModule {}
