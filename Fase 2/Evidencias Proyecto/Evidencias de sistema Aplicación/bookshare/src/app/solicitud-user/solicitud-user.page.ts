import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-solicitud-user',
  templateUrl: './solicitud-user.page.html',
  styleUrls: ['./solicitud-user.page.scss'],
})
export class SolicitudUserPage implements OnInit {

  solicitudesRecibidas: any[] = [];  // Array para almacenar solicitudes recibidas
  solicitudesRealizadas: any[] = []; // Array para almacenar solicitudes realizadas
  mostrarRecibidas: boolean = true;  // Variable para alternar entre recibidas y realizadas

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.cargarSolicitudesRecibidas();   // Cargar solicitudes recibidas al iniciar
    this.cargarSolicitudesRealizadas();  // Cargar solicitudes realizadas al iniciar
  }

  // Cargar solicitudes recibidas (donde el usuario es prestamista)
  cargarSolicitudesRecibidas(): void {
    const correo = this.authService.getUserEmail();
    if (correo) {
      this.authService.getSolicitudesPrestamo(correo).subscribe(
        (response) => {
          this.solicitudesRecibidas = response; // Guardar las solicitudes recibidas
        },
        (error) => {
          console.error('Error al obtener las solicitudes recibidas:', error);
        }
      );
    }
  }

  // Cargar solicitudes realizadas (donde el usuario es solicitante)
  cargarSolicitudesRealizadas(): void {
    const correo = this.authService.getUserEmail();
    if (correo) {
      this.authService.getSolicitudesSolicitante(correo).subscribe(
        (response) => {
          this.solicitudesRealizadas = response; // Guardar las solicitudes realizadas
        },
        (error) => {
          console.error('Error al obtener las solicitudes realizadas:', error);
        }
      );
    }
  }

  // Alternar entre solicitudes recibidas y realizadas
  alternarSolicitudes(event: any): void {
    const tipo = event.detail.value;
    this.mostrarRecibidas = (tipo === 'recibidas');
  }
}
