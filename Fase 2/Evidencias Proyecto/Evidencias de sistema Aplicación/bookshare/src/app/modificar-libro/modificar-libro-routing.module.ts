import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModificarLibroPage } from './modificar-libro.page';

const routes: Routes = [
  {
    path: '',
    component: ModificarLibroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModificarLibroPageRoutingModule {}
