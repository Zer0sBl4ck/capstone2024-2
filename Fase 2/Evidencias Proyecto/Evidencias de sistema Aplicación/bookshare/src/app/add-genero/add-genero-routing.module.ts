import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddGeneroPage } from './add-genero.page';

const routes: Routes = [
  {
    path: '',
    component: AddGeneroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddGeneroPageRoutingModule {}
