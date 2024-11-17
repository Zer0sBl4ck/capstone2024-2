import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListarIntercambioUsuarioPage } from './listar-intercambio-usuario.page';

const routes: Routes = [
  {
    path: '',
    component: ListarIntercambioUsuarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListarIntercambioUsuarioPageRoutingModule {}
