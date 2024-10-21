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

  // Función para eliminar una solicitud recibida
  eliminarSolicitud(id_prestamo: number): void {
    this.authService.eliminarSolicitud(id_prestamo).subscribe(
      (response) => {
        console.log('Solicitud eliminada:', response);
        // Vuelve a cargar las solicitudes después de eliminar
        this.cargarSolicitudesRecibidas();
      },
      (error) => {
        console.error('Error al eliminar la solicitud:', error);
      }
    );
  }

  // Función para actualizar el estado de una solicitud recibida a 'desarrollo'
  modificarEstadoSolicitud(id_prestamo: number): void {
    this.authService.actualizarEstadoSolicitud(id_prestamo).subscribe(
      (response) => {
        console.log('Estado de la solicitud actualizado a "desarrollo":', response);
        
        // Crear el chat después de actualizar el estado
        this.authService.crearChatPrestamo(id_prestamo).subscribe(
          (chatResponse) => {
            console.log('Chat creado exitosamente:', chatResponse);
            // Aquí puedes agregar código adicional si necesitas manejar el chat creado
          },
          (chatError) => {
            console.error('Error al crear el chat:', chatError);
          }
        );
  
        // Vuelve a cargar las solicitudes después de modificar el estado
        this.cargarSolicitudesRecibidas();
      },
      (error) => {
        console.error('Error al actualizar el estado de la solicitud:', error);
      }
    );
  }
}
