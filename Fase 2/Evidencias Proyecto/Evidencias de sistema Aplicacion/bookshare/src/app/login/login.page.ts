import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../app/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
  
import { RefresherEventDetail, IonRefresher } from '@ionic/angular';

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
  refreshData(event: CustomEvent<RefresherEventDetail>) {
    // Aquí va la lógica para actualizar los datos
    console.log('Refrescando...');
    window.location.reload();
    // Simula un delay para el refresco
    setTimeout(() => {
      // Verificar si event.target es un IonRefresher
      const refresher = event.target;

      if (refresher instanceof IonRefresher) {
        refresher.complete();  // Indica que el refresco se completó
      }
    }, 2000);
  }
}
