import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VistaLibroPage } from './vista-libro.page';

const routes: Routes = [
  {
    path: ':isbn', // Cambia la ruta para aceptar el parámetro isbn
    component: VistaLibroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VistaLibroPageRoutingModule {}
