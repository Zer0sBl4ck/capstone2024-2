import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BookownerPage } from './bookowner.page';

const routes: Routes = [
  {
    path: '',
    component: BookownerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookownerPageRoutingModule {}
