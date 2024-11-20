import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListarLibroPage } from './listar-libro.page';

const routes: Routes = [
  {
    path: '',
    component: ListarLibroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListarLibroPageRoutingModule {}
