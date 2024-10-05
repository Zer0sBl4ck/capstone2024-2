// src/app/pages/register/register.page.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../app/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  nombre_usuario: string = '';
  correo: string = '';
  contrasena: string = '';
  ubicacion: string = '';
  errorMessage: string = ''; // Agregar mensaje de error

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    const userData = {
      nombre_usuario: this.nombre_usuario,
      correo: this.correo,
      contrasena: this.contrasena,
      ubicacion: this.ubicacion,
    };

    this.authService.register(userData.nombre_usuario, userData.correo, userData.contrasena, userData.ubicacion)
      .subscribe(
        response => {
          console.log('Mensaje:', response.message);
          this.router.navigate(['/login']);
        },
        (error: HttpErrorResponse) => {
          console.error('Error al registrar usuario:', error);
          // Manejo de errores
          if (error.error && error.error.message) {
            this.errorMessage = error.error.message; // Asignar mensaje de error
          } else {
            this.errorMessage = 'Error desconocido. Inténtalo de nuevo más tarde.';
          }
        }
      );
  }
}
