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
  contrasena: string = ''; 
  errorMessage: string = ''; 

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    const userData = {
      correo: this.correo,
      contrasena: this.contrasena, 
    };

    this.authService.login(userData.correo, userData.contrasena)
      .subscribe(
        response => {
          console.log('Token:', response.token);
          this.authService.saveUserData(response.token, response.user); 
          this.router.navigate(['/']).then(() => {
            window.location.reload(); 
          });
        },
        (error: HttpErrorResponse) => {
          console.error('Error al iniciar sesión:', error);
          if (error.error && error.error.message) {
            this.errorMessage = error.error.message; 
          } else {
            this.errorMessage = 'Error desconocido. Inténtalo de nuevo más tarde.';
          }
        }
      );
  }
}
