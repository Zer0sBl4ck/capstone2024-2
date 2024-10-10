import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  isLoggedIn = false;  // Para controlar si el usuario está logueado
  userRole: string | null = null;  // Para almacenar el rol del usuario

  constructor(private authService: AuthService, private router: Router) {}

  // Ejecutar cuando la vista está por mostrarse
  ionViewWillEnter() {
    this.checkAuthentication(); // Comprobar si está autenticado
  }

  // Comprobar autenticación y obtener rol
  checkAuthentication() {
    const token = this.authService.getToken();
    this.isLoggedIn = !!token;  // Si hay token, está logueado

    if (this.isLoggedIn) {
      this.userRole = this.authService.getUserRole(); // Obtener el rol del usuario
    } 
  }

  // Cerrar sesión
  logout() {
    this.authService.logout();  // Llamar al método logout del servicio de autenticación
    this.checkAuthentication();  // Verificar si sigue autenticado
    window.location.reload();  // Recargar la página para actualizar el estado
  }
}
