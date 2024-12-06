import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListarIntercambioPage } from './listar-intercambio.page';

const routes: Routes = [
  {
    path: '',
    component: ListarIntercambioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListarIntercambioPageRoutingModule {}
