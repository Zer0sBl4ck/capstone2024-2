import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'addbook',
    loadChildren: () => import('./addbook/addbook.module').then( m => m.AddbookPageModule)
  },
  {
    path: 'listar-libro',
    loadChildren: () => import('./listar-libro/listar-libro.module').then( m => m.ListarLibroPageModule)
  },
  {
    path: 'bookowner/:usuario',  
    loadChildren: () => import('./bookowner/bookowner.module').then(m => m.BookownerPageModule)
  },
  {
    path: 'perfil/:correo',  
    loadChildren: () => import('./perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: 'update-perfil',
    loadChildren: () => import('./update-perfil/update-perfil.module').then( m => m.UpdatePerfilPageModule)
  },
  {
    path: 'update-perfil/:correo', 
    loadChildren: () => import('./update-perfil/update-perfil.module').then(m => m.UpdatePerfilPageModule)
  },
  {
    path: 'addbook-user',
    loadChildren: () => import('./addbook-user/addbook-user.module').then( m => m.AddbookUserPageModule)
  },
  {
    path: 'listar-libro-solicitud',
    loadChildren: () => import('./listar-libro-solicitud/listar-libro-solicitud.module').then( m => m.ListarLibroSolicitudPageModule)
  },
  {
    path: 'personas-ownerbook/:isbn',
    loadChildren: () => import('./personas-ownerbook/personas-ownerbook.module').then(m => m.PersonasOwnerbookPageModule)
  },
  {
    path: 'solicitud-user',
    loadChildren: () => import('./solicitud-user/solicitud-user.module').then( m => m.SolicitudUserPageModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./chat/chat.module').then( m => m.ChatPageModule)
  },
  {
    path: 'chat-contacto/:id_chat',
    loadChildren: () => import('./chat-contacto/chat-contacto.module').then(m => m.ChatContactoPageModule)
  },  {
    path: 'vista-libro',
    loadChildren: () => import('./vista-libro/vista-libro.module').then( m => m.VistaLibroPageModule)
  },

  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
