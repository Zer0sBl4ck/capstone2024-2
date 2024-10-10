import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  isLoggedIn: boolean = false; // Variable para controlar si el usuario está logueado

  constructor(public authService: AuthService) {
    this.checkAuthentication(); // Verifica la autenticación al inicializar
  }

  checkAuthentication() {
    this.isLoggedIn = this.authService.isAuthenticated(); // Actualiza el estado basado en el token
  }

  logout() {
    this.authService.logout(); 
    this.checkAuthentication(); 
    window.location.reload();
  }
}
