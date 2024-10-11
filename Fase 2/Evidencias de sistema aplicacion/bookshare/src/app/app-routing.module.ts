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
    path: 'bookowner/:usuario',  // Definimos el parámetro de la ruta
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
    path: 'update-perfil/:correo', // Asegúrate de tener un parámetro para el correo
    loadChildren: () => import('./update-perfil/update-perfil.module').then(m => m.UpdatePerfilPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
