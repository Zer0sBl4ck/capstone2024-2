import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { RefresherEventDetail, IonRefresher } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.page.html',
  styleUrls: ['./notificaciones.page.scss'],
})
export class NotificacionesPage implements OnInit {
  notificaciones: any[] = [];
  private refreshInterval: any;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.cargarNotificaciones();

    // Configurar el intervalo para refrescar la página cada 3 segundos (3000 ms)
    this.refreshInterval = setInterval(() => {
      this.cargarNotificaciones();
    }, 3000); // 3000 ms = 3 segundos
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
  onNotificacionClick(notificacion: any) {
    this.router.navigate(['/solicitud-user'], { queryParams: { id: notificacion.id, section: 'realizadas' } });
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
  refreshData(event: CustomEvent<RefresherEventDetail>) {
    console.log('Refrescando...');
    this.cargarNotificaciones();

    setTimeout(() => {
      const refresher = event.target;

      if (refresher instanceof IonRefresher) {
        refresher.complete();  // Indica que el refresco se completó
      }
    }, 2000);
  }
}
