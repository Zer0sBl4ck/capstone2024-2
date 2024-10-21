import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatContactoPage } from './chat-contacto.page';

const routes: Routes = [
  {
    path: '',
    component: ChatContactoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatContactoPageRoutingModule {}
