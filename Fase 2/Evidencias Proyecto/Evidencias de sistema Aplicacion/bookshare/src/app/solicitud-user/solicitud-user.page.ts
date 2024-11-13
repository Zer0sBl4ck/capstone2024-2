 import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'; // Asegúrate de que la ruta sea correcta
import { ActionSheetController } from '@ionic/angular';
import { RefresherEventDetail, IonRefresher } from '@ionic/angular';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-solicitud-user',
  templateUrl: './solicitud-user.page.html',
  styleUrls: ['./solicitud-user.page.scss'],
})
export class SolicitudUserPage implements OnInit {

  solicitudesRecibidas: any[] = [];  // Array para almacenar solicitudes recibidas
  solicitudesRealizadas: any[] = []; // Array para almacenar solicitudes realizadas
  mostrarRecibidas: boolean = true;  // Variable para alternar entre recibidas y realizadas

  constructor(private authService: AuthService, private actionSheetController: ActionSheetController, private router: Router) { }

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

  esSolicitante(solicitud: any): boolean {
    // Compara el ID del usuario actual con el ID del solicitante de la solicitud
    return solicitud.id_usuario_solicitante === this.authService.getCurrentUserId();
  }
  irAResena(id_prestamo: number): void {
    this.authService.obtenerDetallesLibroPorPrestamo(id_prestamo).subscribe(
      (response) => {
        console.log('Datos del libro obtenidos:', response); // Log para verificar los datos obtenidos
        // Navega a la página de reseñas pasando todos los datos del libro
        this.router.navigate(['/resena-libro'], {
          queryParams: {
            id_prestamo: id_prestamo,
            isbn: response.isbn,
            titulo: response.titulo,
            autor: response.autor,
            descripcion: response.descripcion,
            genero: response.genero,
            prestamista: response.nombre_usuario
          }
        });
      },
      (error) => {
        console.error('Error al obtener los detalles del libro:', error);
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

  
    marcarEstadoComoEntregado(id_prestamo: number): void {
    this.authService.marcarEstadoComoEntregado(id_prestamo).subscribe(
      (response) => {
        console.log('Estado de la solicitud actualizado a "Entregado":', response);
        // Recargar las solicitudes después de modificar el estado
        this.cargarSolicitudesRecibidas();
      },
      (error) => {
        console.error('Error al actualizar el estado de la solicitud:', error);
      }
    );
  }
  actualizarEstadoSolicitudAceptado(id_prestamo: number, solicitud: any): void {
    const correoSolicitante = solicitud.correo; // Obtener el correo del solicitante
  
    if (!correoSolicitante) {
      console.error('No se pudo obtener el correo del solicitante');
      return; // Salir si no se puede obtener el correo
    }
  
    // Actualizar el estado de la solicitud a "Aceptado"
    this.authService.actualizarEstadoSolicitudAceptado(id_prestamo).subscribe(
      (response) => {
        console.log('Estado de la solicitud actualizado a "Aceptado":', response);
  
        const titulo = 'Préstamo Aceptado';
        const descripcion = 'Tu solicitud de préstamo ha sido aceptada. Dirígete al chat para más detalles.';
  
        // Llamar al servicio para crear la notificación de aceptación solo para el solicitante
        this.authService.crearNotificacion_aceptacion(correoSolicitante, titulo, descripcion).subscribe(
          (notifResponse) => {
            console.log('Notificación de aceptación enviada al solicitante:', notifResponse);
          },
          (notifError) => {
            console.error('Error al enviar la notificación de aceptación al solicitante:', notifError);
          }
        );
  
        // Recargar las solicitudes después de modificar el estado
        this.cargarSolicitudesRecibidas();
      },
      (error) => {
        console.error('Error al actualizar el estado de la solicitud:', error);
      }
    );
  }
  
  
  
  
  
  
  modificarFechaDevolucion(id_prestamo: number, solicitud: any): void {
    const actionSheet = this.actionSheetController.create({
      header: 'Selecciona la duración de la devolución',
      buttons: [
        {
          text: '1 Semana',
          handler: () => {
            this.actualizarFechaDevolucion(id_prestamo, 1);
            // Pasar solicitud.correo al actualizar el estado y enviar la notificación
            this.actualizarEstadoSolicitudAceptado(id_prestamo, solicitud);
          }
        },
        {
          text: '2 Semanas',
          handler: () => {
            this.actualizarFechaDevolucion(id_prestamo, 2);
            // Pasar solicitud.correo al actualizar el estado y enviar la notificación
            this.actualizarEstadoSolicitudAceptado(id_prestamo, solicitud);
          }
        },
        {
          text: '3 Semanas',
          handler: () => {
            this.actualizarFechaDevolucion(id_prestamo, 3);
            // Pasar solicitud.correo al actualizar el estado y enviar la notificación
            this.actualizarEstadoSolicitudAceptado(id_prestamo, solicitud);
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Selección cancelada');
          }
        }
      ]
    });
  
 
  
    actionSheet.then(actionSheetElement => {
      actionSheetElement.present();
    });
  }
  
  
  actualizarFechaDevolucion(id_prestamo: number, semanas: number): void {
    // Obtener la fecha actual
    const fechaActual = new Date();
    // Sumar las semanas seleccionadas
    fechaActual.setDate(fechaActual.getDate() + (semanas * 7));
  
    // Formatear la fecha a formato 'yyyy-mm-dd'
    const fechaISO = fechaActual.toISOString().split('T')[0];
  
    this.authService.actualizarFechaDevolucion(id_prestamo, fechaISO).subscribe(
      (response) => {
        console.log('Fecha de devolución actualizada:', response);
        this.cargarSolicitudesRecibidas();
      },
      (error) => {
        console.error('Error al actualizar la fecha de devolución:', error);
      }
    );
  }

  // Función para validar el formato de fecha dd-mm-yyyy
  private validarFechaFormato(fecha: string): boolean {
    const regex = /^(\d{2})-(\d{2})-(\d{4})$/;
    if (!regex.test(fecha)) return false;

    const [dia, mes, año] = fecha.split('-').map(Number);
    const fechaObj = new Date(año, mes - 1, dia);
    return (
      fechaObj.getFullYear() === año &&
      fechaObj.getMonth() === mes - 1 &&
      fechaObj.getDate() === dia
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
  reportarUsuario(usuarioReportado: number, usuarioReportante: number): void {
    this.authService.reportarUsuario(usuarioReportado, usuarioReportante).subscribe(
      (response) => {
        console.log('Usuario reportado correctamente:', response);
        // Puedes mostrar un mensaje de éxito o actualizar el UI aquí
      },
      (error) => {
        console.error('Error al reportar usuario:', error);
      }
    );
  }
}