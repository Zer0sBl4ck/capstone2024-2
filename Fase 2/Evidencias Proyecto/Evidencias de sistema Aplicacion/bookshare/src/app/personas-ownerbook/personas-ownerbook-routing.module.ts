import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PersonasOwnerbookPage } from './personas-ownerbook.page';

const routes: Routes = [
  {
    path: '',
    component: PersonasOwnerbookPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersonasOwnerbookPageRoutingModule {}
