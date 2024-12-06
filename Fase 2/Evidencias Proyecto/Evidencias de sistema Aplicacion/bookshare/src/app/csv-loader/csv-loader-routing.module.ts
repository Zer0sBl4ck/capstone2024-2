import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CsvLoaderPage } from './csv-loader.page';

const routes: Routes = [
  {
    path: '',
    component: CsvLoaderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CsvLoaderPageRoutingModule {}
