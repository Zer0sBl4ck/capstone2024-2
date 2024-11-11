import { Component, OnInit, OnDestroy  } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit, OnDestroy {
  notificacionesNoLeidas: number = 0;
  private intervalId: any;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.cargarNotificacionesNoLeidas();
    // Realizar polling cada 30 segundos
    this.intervalId = setInterval(() => {
      this.cargarNotificacionesNoLeidas();
    }, 5000); // 30000ms = 30 segundos
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);  // Limpiar el intervalo cuando el componente se destruye
    }
  }
  cargarNotificacionesNoLeidas(): void {
    const correo = this.authService.getUserEmail();  // Obtener el correo del usuario actual
    if (correo) {
      this.authService.obtenerNotificaciones(correo).subscribe(
        (notificaciones: any[]) => {
          // Contar las notificaciones no leídas
          this.notificacionesNoLeidas = notificaciones.filter(notificacion => !notificacion.visto).length;
        },
        (error) => {
          console.error('Error al obtener notificaciones:', error);
        }
      );
    } else {
      console.warn('No se pudo obtener el correo del usuario');
    }
  }
}