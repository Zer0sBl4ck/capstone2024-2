import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SolicitudUserPage } from './solicitud-user.page';

const routes: Routes = [
  {
    path: '',
    component: SolicitudUserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SolicitudUserPageRoutingModule {}
