import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddbookPage } from './addbook.page';

const routes: Routes = [
  {
    path: '',
    component: AddbookPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddbookPageRoutingModule {}
