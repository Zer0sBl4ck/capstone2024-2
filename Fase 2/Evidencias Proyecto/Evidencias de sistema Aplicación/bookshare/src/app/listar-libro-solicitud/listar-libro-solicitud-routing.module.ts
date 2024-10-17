import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListarLibroSolicitudPage } from './listar-libro-solicitud.page';

const routes: Routes = [
  {
    path: '',
    component: ListarLibroSolicitudPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListarLibroSolicitudPageRoutingModule {}
