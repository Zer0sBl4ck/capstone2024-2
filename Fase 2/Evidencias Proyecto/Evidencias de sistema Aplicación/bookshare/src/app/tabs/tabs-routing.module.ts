import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'chat',
        loadChildren: () => import('../chat/chat.module').then(m => m.ChatPageModule)
      },
      {
        path: 'listar-libro',
        loadChildren: () => import('../listar-libro/listar-libro.module').then(m => m.ListarLibroPageModule)
      },
      {
      path: 'notificaciones',
        loadChildren: () => import('../notificaciones/notificaciones.module').then(m => m.NotificacionesPageModule)
      },
      {
        path: 'solicitud-user',
          loadChildren: () => import('../solicitud-user/solicitud-user.module').then(m => m.SolicitudUserPageModule)
      },
      {
        path: 'listar-intercambio',
          loadChildren: () => import('../listar-intercambio/listar-intercambio.module').then(m => m.ListarIntercambioPageModule)
      },
      {
        
        path: '',
        redirectTo: 'home',  // Redirige a la pestaña de inicio por defecto
        pathMatch: 'full'
      }
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
