import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs/home',  // Redirige a la página de inicio dentro de las pestañas
    pathMatch: 'full'
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'addbook',
    loadChildren: () => import('./addbook/addbook.module').then(m => m.AddbookPageModule)
  },
  {
    path: 'listar-libro',
    loadChildren: () => import('./listar-libro/listar-libro.module').then(m => m.ListarLibroPageModule)
  },
  {
    path: 'bookowner/:usuario',
    loadChildren: () => import('./bookowner/bookowner.module').then(m => m.BookownerPageModule)
  },
  {
    path: 'perfil/:correo',
    loadChildren: () => import('./perfil/perfil.module').then(m => m.PerfilPageModule)
  },
  {
    path: 'update-perfil',
    loadChildren: () => import('./update-perfil/update-perfil.module').then(m => m.UpdatePerfilPageModule)
  },
  {
    path: 'update-perfil/:correo',
    loadChildren: () => import('./update-perfil/update-perfil.module').then(m => m.UpdatePerfilPageModule)
  },
  {
    path: 'addbook-user',
    loadChildren: () => import('./addbook-user/addbook-user.module').then(m => m.AddbookUserPageModule)
  },
  {
    path: 'listar-libro-solicitud',
    loadChildren: () => import('./listar-libro-solicitud/listar-libro-solicitud.module').then(m => m.ListarLibroSolicitudPageModule)
  },
  {
    path: 'personas-ownerbook/:isbn',
    loadChildren: () => import('./personas-ownerbook/personas-ownerbook.module').then(m => m.PersonasOwnerbookPageModule)
  },
  {
    path: 'solicitud-user',
    loadChildren: () => import('./solicitud-user/solicitud-user.module').then(m => m.SolicitudUserPageModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./chat/chat.module').then(m => m.ChatPageModule)
  },
   { path: 'chat/:id_prestamo', loadChildren: () => import('./chat/chat.module').then(m => m.ChatPageModule) },
  {
    path: 'chat-contacto/:id_chat',
    loadChildren: () => import('./chat-contacto/chat-contacto.module').then(m => m.ChatContactoPageModule)
  },
  {
    path: 'vista-libro',
    loadChildren: () => import('./vista-libro/vista-libro.module').then(m => m.VistaLibroPageModule)
  },
  {
    path: 'modificar-libro',
    loadChildren: () => import('./modificar-libro/modificar-libro.module').then(m => m.ModificarLibroPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'favoritos',
    loadChildren: () => import('./favoritos/favoritos.module').then( m => m.FavoritosPageModule)
  },
  {
    path: 'resena-libro',
    loadChildren: () => import('./resena-libro/resena-libro.module').then( m => m.ResenaLibroPageModule)
  },
  {
    path: 'listar-intercambio',
    loadChildren: () => import('./listar-intercambio/listar-intercambio.module').then( m => m.ListarIntercambioPageModule)
  },
  {
    path: 'listar-intercambio-usuario/:id_usuario/:id_intercambio',
    loadChildren: () => import('./listar-intercambio-usuario/listar-intercambio-usuario.module').then(m => m.ListarIntercambioUsuarioPageModule)
  },
  {
    path: 'notificaciones',
    loadChildren: () => import('./notificaciones/notificaciones.module').then( m => m.NotificacionesPageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
