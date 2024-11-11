import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.page.html',
  styleUrls: ['./notificaciones.page.scss'],
})
export class NotificacionesPage implements OnInit {
  notificaciones: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.cargarNotificaciones();
  }

  cargarNotificaciones() {
    const correo = this.authService.getUserEmail();
    if (correo) {
      this.authService.obtenerNotificaciones(correo).subscribe(
        (response) => {
          this.notificaciones = response;
        },
        (error) => {
          console.error('Error al obtener notificaciones:', error);
        }
      );
    }
  }

  marcarComoVisto(idNotificacion: number) {
    this.authService.marcarNotificacionComoVisto(idNotificacion).subscribe(
      () => {
        this.cargarNotificaciones();  // Recargar las notificaciones después de marcar como visto
      },
      (error) => {
        console.error('Error al marcar notificación como vista:', error);
      }
    );
  }

  eliminarNotificacion(idNotificacion: number) {
    this.authService.eliminarNotificacion(idNotificacion).subscribe(
      () => {
        this.cargarNotificaciones();
      },
      (error) => {
        console.error('Error al eliminar la notificación:', error);
      }
    );
  }
}
