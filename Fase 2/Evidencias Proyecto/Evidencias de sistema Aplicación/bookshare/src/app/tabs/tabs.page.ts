import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage implements OnInit, OnDestroy {
  isLoggedIn = false;  // Esta variable controla si el usuario está logueado o no
  userRole: string | null = null;
  notificacionesNoLeidas: number = 0;
  private intervalId: any;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.checkAuthentication();
    this.cargarNotificacionesNoLeidas();
    // Realizar polling cada 5 segundos
    this.intervalId = setInterval(() => {
      this.cargarNotificacionesNoLeidas();
    }, 5000); // 5000ms = 5 segundos
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);  // Limpiar el intervalo cuando el componente se destruye
    }
  }

  checkAuthentication() {
    const token = this.authService.getToken();
    this.isLoggedIn = !!token;  // Si el token existe, el usuario está logueado
    if (this.isLoggedIn) {
      this.userRole = this.authService.getUserRole();  // Obtener el rol del usuario (admin o usuario)
    }
  }

  cargarNotificacionesNoLeidas(): void {
    const correo = this.authService.getUserEmail();
    if (correo) {
      this.authService.obtenerNotificaciones(correo).subscribe(
        (notificaciones: any[]) => {
          this.notificacionesNoLeidas = notificaciones.filter(notificacion => !notificacion.visto).length;
        },
        (error) => {
          console.error('Error al obtener notificaciones:', error);
        }
      );
    }
  }

  logout() {
    this.authService.logout();
    this.checkAuthentication();
    window.location.reload();
  }
}
