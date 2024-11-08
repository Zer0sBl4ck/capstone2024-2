import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResenaLibroPage } from './resena-libro.page';

const routes: Routes = [
  {
    path: '',
    component: ResenaLibroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResenaLibroPageRoutingModule {}
