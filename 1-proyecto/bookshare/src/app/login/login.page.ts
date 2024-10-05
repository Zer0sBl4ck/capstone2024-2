import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../app/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  correo: string = '';
  contrasena: string = ''; // Asegúrate de que esta propiedad sea 'contrasena'
  errorMessage: string = ''; // Inicializa como cadena vacía para evitar mensajes previos

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    const userData = {
      correo: this.correo,
      contrasena: this.contrasena, // Asegúrate de que aquí sea 'contrasena'
    };

    this.authService.login(userData.correo, userData.contrasena)
      .subscribe(
        response => {
          console.log('Token:', response.token);
          localStorage.setItem('token', response.token); // Almacena el token
          this.router.navigate(['/']); // Redirige a la página principal
        },
        (error: HttpErrorResponse) => {
          console.error('Error al iniciar sesión:', error);
          if (error.error && error.error.message) {
            this.errorMessage = error.error.message; // Asignar mensaje de error
          } else {
            this.errorMessage = 'Error desconocido. Inténtalo de nuevo más tarde.';
          }
        }
      );
  }
}
