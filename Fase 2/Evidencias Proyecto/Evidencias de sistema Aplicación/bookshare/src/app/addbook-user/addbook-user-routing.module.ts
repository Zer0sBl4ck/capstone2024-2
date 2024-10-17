import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddbookUserPage } from './addbook-user.page';

const routes: Routes = [
  {
    path: '',
    component: AddbookUserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddbookUserPageRoutingModule {}
