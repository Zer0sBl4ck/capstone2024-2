 import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'; // Asegúrate de que la ruta sea correcta
import { ActionSheetController } from '@ionic/angular';
import { RefresherEventDetail, IonRefresher } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router'; 
import { LocalNotifications } from '@capacitor/local-notifications';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-solicitud-user',
  templateUrl: './solicitud-user.page.html',
  styleUrls: ['./solicitud-user.page.scss'],
})
export class SolicitudUserPage implements OnInit {

  solicitudesRecibidas: any[] = [];  // Array para almacenar solicitudes recibidas
  solicitudesRealizadas: any[] = []; // Array para almacenar solicitudes realizadas
  mostrarRecibidas: boolean = true;  // Variable para alternar entre recibidas y realizadas
  private refreshInterval: any;
  segmentValue: string = 'recibidas'; // Valor por defecto
  constructor(private authService: AuthService, private actionSheetController: ActionSheetController, private router: Router,  private route: ActivatedRoute,   private alertController: AlertController) { }

  
  ngOnInit() {
    this.cargarSolicitudesRecibidas();   // Cargar solicitudes recibidas al iniciar
    this.cargarSolicitudesRealizadas();  // Cargar solicitudes realizadas al iniciar
    this.mostrarAdvertencia();
    // Configurar el intervalo para refrescar la página cada 3 segundos (3000 ms)
    this.refreshInterval = setInterval(() => {
      this.cargarSolicitudesRecibidas();
      this.cargarSolicitudesRealizadas();
      this.verificarFechasDevolucion();
    }, 3000); // 3000 ms = 3 segundos
    this.route.queryParams.subscribe(params => {
      if (params['section'] === 'realizadas') {
        this.segmentValue = 'realizadas';
        this.mostrarRecibidas = false;
      } else {
        this.segmentValue = 'recibidas';
        this.mostrarRecibidas = true;
      }
    });
  
  }
  async mostrarAdvertencia() {
    const advertenciaMostrada = localStorage.getItem('advertenciaMostrada');
    if (!advertenciaMostrada) {
      const alert = await this.alertController.create({
        header: 'Advertencia',
        message: 'Los préstamos son bajo responsabilidad del usuario y BookShare no se hace responsable.',
        buttons: ['OK'],
        cssClass: 'custom-alert'
      });

      await alert.present();
      localStorage.setItem('advertenciaMostrada', 'true');
    }
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
  verificarFechasDevolucion(): void {
    const fechaActual = new Date();
    this.solicitudesRecibidas.forEach(solicitud => {
      const fechaDev = new Date(solicitud.fecha_devolucion);
      const diasRestantes = (fechaDev.getTime() - fechaActual.getTime()) / (1000 * 3600 * 24);
      if (diasRestantes <= 3 && solicitud.estado_prestamo !== 'Notificado') {
        this.enviarNotificacionLocal(solicitud);
        solicitud.estado_prestamo = 'Notificado'; // Actualizar el estado para evitar múltiples notificaciones
      }
    });
  }

  enviarNotificacionLocal(solicitud: any): void {
    const mensaje = `El tiempo de devolución del libro "${solicitud.titulo}" se está acabando.`;
    LocalNotifications.schedule({
      notifications: [
        {
          title: 'Recordatorio de Devolución',
          body: mensaje,
          id: new Date().getTime(),
          schedule: { at: new Date(Date.now() + 1000 * 5) }, // Notificación en 5 segundos
          sound: undefined,
          attachments: undefined,
          actionTypeId: '',
          extra: null,
        },
      ],
    }).then(() => {
      console.log('Notificación local programada');
    }).catch(error => {
      console.error('Error al programar la notificación local:', error);
    });
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
  devolverLibro(id_prestamo: number): void {
    // Implementa la lógica para devolver el libro
    this.authService.devolverLibro(id_prestamo).subscribe(
      (response) => {
        console.log('Libro devuelto:', response);
        this.cargarSolicitudesRecibidas();
        this.cargarSolicitudesRealizadas();
      },
      (error) => {
        console.error('Error al devolver el libro:', error);
      }
    );
  }
 
  mostrarBotonDevolver(fechaDevolucion: string): boolean {
    const fechaActual = new Date();
    const fechaDev = new Date(fechaDevolucion);
    const diasRestantes = (fechaDev.getTime() - fechaActual.getTime()) / (1000 * 3600 * 24);
    return diasRestantes <= 3; // Mostrar el botón si faltan 3 días o menos para la fecha de devolución
  }
  eliminarSolicitud1(id_prestamo: number): void {
    this.authService.eliminarSolicitud(id_prestamo).subscribe(
      (response) => {
        console.log('Solicitud eliminada:', response);
        this.cargarSolicitudesRecibidas();
        
      },
      (error) => {
        console.error('Error al eliminar la solicitud:', error);
      }
    );
  }

  cancelarSolicitud(id_prestamo: number): void {
    this.authService.cancelarSolicitud(id_prestamo).subscribe(
      (response) => {
        console.log('Solicitud cancelada:', response);
        this.cargarSolicitudesRecibidas();
      },
      (error) => {
        console.error('Error al cancelar la solicitud:', error);
      }
    );
  }
 async abrirFormularioResena(solicitud: any) {
    const alert = await this.alertController.create({
      header: 'Reseña',
      inputs: [
        {
          name: 'calificacion',
          type: 'number',
          placeholder: 'Ingrese la calificación (1-5)',
          min: 1,
          max: 5
        },
        {
          name: 'comentario',
          type: 'textarea',
          placeholder: 'Ingrese el comentario'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Formulario cancelado');
          }
        },
        {
          text: 'Enviar',
          handler: (data) => {
            const calificacion = data.calificacion;
            const comentario = data.comentario;
            if (calificacion && comentario) {
              this.agregarResenaSolicitante(solicitud.id_prestamo, parseInt(calificacion), comentario, solicitud);
            } else {
              this.alertController.create({
                header: 'Error',
                message: 'Por favor, complete la calificación y el comentario.',
                buttons: ['OK']
              }).then(alert => alert.present());
            }
          }
        }
      ]
    });

    await alert.present();
  }
  
  agregarResenaSolicitante(id_prestamo: number, calificacion: number, comentario: string, solicitud: any): void {
  this.authService.agregarResenaSolicitante(id_prestamo, calificacion, comentario).subscribe(
    (response) => {
      console.log('Reseña agregada:', response);
      solicitud.estado_prestamo = 'Reseña Agregada'; // Actualiza el estado de la solicitud
      this.cargarSolicitudesRecibidas();
      this.cargarSolicitudesRealizadas();
    },
    (error) => {
      console.error('Error al agregar la reseña:', error);
    }
  );
}

  esSolicitante(solicitud: any): boolean {
    // Compara el ID del usuario actual con el ID del solicitante de la solicitud
    return solicitud.id_usuario_solicitante === this.authService.getCurrentUserId();
  }
  irAResena(id_prestamo: number): void {
    // Llamada para actualizar el estado de la reseña
    this.authService.actualizarEstadoResena(id_prestamo).subscribe(
      (response) => {
        console.log('Estado de la solicitud actualizado a "Reseña Exitosa":', response);
  
        // Luego, obtenemos los detalles del libro y navegamos a la página de reseñas
        this.authService.obtenerDetallesLibroPorPrestamo(id_prestamo).subscribe(
          (response) => {
          console.log('Datos del libro obtenidos:', response); // Log para  los datos obtenidos
            
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
      },
      (error) => {
        console.error('Error al actualizar el estado de la solicitud:', error);
      }
    );
  }
  

  // Función para actualizar el estado de una solicitud recibida a 'desarrollo'
  modificarEstadoSolicitud(id_prestamo: number): void {
    // Obtener los detalles del préstamo
    this.authService.obtenerDetallesPrestamo(id_prestamo).subscribe(
      (prestamo) => {
        const correoSolicitante = prestamo.correo_solicitante; // Obtener el correo del solicitante
  
        if (!correoSolicitante) {
          console.error('No se pudo obtener el correo del solicitante');
          return; // Salir si no se puede obtener el correo
        }
  
        // Actualizar el estado de la solicitud a "Aceptado"
        this.authService.actualizarEstadoSolicitud(id_prestamo).subscribe(
          (response) => {
            console.log('Estado de la solicitud actualizado a "Aceptado":', response);
  
            const titulo = 'Préstamo Aceptado';
            const descripcion = 'Tu solicitud de préstamo ha sido aceptada. Dirígete al chat para más detalles.';
  
            // Verificar los datos antes de enviar la solicitud
            console.log('Datos de la notificación:', { correo: correoSolicitante, titulo, descripcion });
  
            // Llamar al servicio para crear la notificación de aceptación solo para el solicitante
            this.authService.crearNotificacionAceptacion(correoSolicitante, titulo, descripcion).subscribe(
              (notifResponse) => {
                console.log('Notificación de aceptación enviada al solicitante:', notifResponse);
              },
              (notifError) => {
                console.error('Error al enviar la notificación de aceptación al solicitante:', notifError);
              }
            );
  
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
  
            // Recargar las solicitudes después de modificar el estado
            this.cargarSolicitudesRecibidas();
          },
          (error) => {
            console.error('Error al actualizar el estado de la solicitud:', error);
          }
        );
      },
      (error) => {
        console.error('Error al obtener los detalles del préstamo:', error);
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
  actualizarEstadoSolicitudAceptado(id_prestamo: number): void {
    // Obtener los detalles del préstamo
    this.authService.obtenerDetallesPrestamo(id_prestamo).subscribe(
      (prestamo) => {
        const correoSolicitante = prestamo.correo_solicitante; // Obtener el correo del solicitante
  
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
  
            // Verificar los datos antes de enviar la solicitud
            console.log('Datos de la notificación:', { correo: correoSolicitante, titulo, descripcion });
  
            // Llamar al servicio para crear la notificación de aceptación solo para el solicitante
            this.authService.crearNotificacionAceptacion(correoSolicitante, titulo, descripcion).subscribe(
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
      },
      (error) => {
        console.error('Error al obtener los detalles del préstamo:', error);
      }
    );
  }
  
  
  
  
  
  modificarFechaDevolucion(id_prestamo: number, correoSolicitante: string): void {
    const actionSheet = this.actionSheetController.create({
      header: 'Selecciona la duración de la devolución',
      buttons: [
        {
          text: '1 Semana',
          handler: () => {
            this.actualizarFechaDevolucion(id_prestamo, 1);
            this.cambiarEstado(String(id_prestamo), 'Por entregar');
            this.programarNotificacionDevolucion(id_prestamo, 7, correoSolicitante);
          }
        },
        {
          text: '2 Semanas',
          handler: () => {
            this.actualizarFechaDevolucion(id_prestamo, 2);
            this.cambiarEstado(String(id_prestamo), 'Por entregar');
            this.programarNotificacionDevolucion(id_prestamo, 14, correoSolicitante);
          }
        },
        {
          text: '3 Semanas',
          handler: () => {
            this.actualizarFechaDevolucion(id_prestamo, 3);
            this.cambiarEstado(String(id_prestamo), 'Por entregar');
            this.programarNotificacionDevolucion(id_prestamo, 21, correoSolicitante);
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
    actionSheet.then(sheet => sheet.present());
  }
  programarNotificacionDevolucion(id_prestamo: number, dias: number, correoSolicitante: string): void {
    console.log(`Programando notificación para el préstamo ID: ${id_prestamo}, días: ${dias}`);
    const titulo = 'Recordatorio de Devolución';
    const descripcion = `El libro debe devolverse en ${dias} días.`;

    // Llamar al servicio para crear la notificación de devolución para el solicitante
    this.authService.crearNotificacionDevolucion(correoSolicitante, titulo, descripcion).subscribe(
      (notifResponse) => {
        console.log('Notificación de devolución enviada al solicitante:', notifResponse);
      },
      (notifError) => {
        console.error('Error al enviar la notificación de devolución al solicitante:', notifError);
      }
    );

    LocalNotifications.schedule({
      notifications: [
        {
          title: titulo,
          body: descripcion,
          id: new Date().getTime(),
          schedule: { at: new Date(Date.now() + 1000 * 5) }, // Notificación en 5 segundos para prueba
          sound: undefined,
          attachments: undefined,
          actionTypeId: '',
          extra: null,
        },
      ],
    }).then(() => {
      console.log('Notificación local programada');
    }).catch(error => {
      console.error('Error al programar la notificación local:', error);
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
  // Refrescar los datos manualmente
  refreshData(event: CustomEvent<RefresherEventDetail>) {
    window.location.reload();
    this.cargarSolicitudesRecibidas();
    this.cargarSolicitudesRealizadas();

    setTimeout(() => {
      const refresher = event.target;

      if (refresher instanceof IonRefresher) {
        refresher.complete();  // Indica que el refresco se completó
      }
    }, 3500);
  }
  reportarUsuario(usuarioReportado: number, usuarioReportante: number): void {
    this.authService.reportarUsuario(usuarioReportado, usuarioReportante).subscribe(
      (response) => {
        console.log('Usuario reportado correctamente:', response);
        const reportes = response.reportes;
        alert(`Usuario reportado correctamente. El usuario reportado lleva ${reportes} reportes.`);
        // Puedes mostrar un mensaje de éxito o actualizar el UI aquí
      },
      (error) => {
        console.error('Error al reportar usuario:', error);
      }
    );
  }
  
  cambiarEstado(id: string, nuevoEstado: string) {
    this.authService.actualizarEstadoSolicitudx(id, nuevoEstado).subscribe(
      (response) => {
        console.log('Estado actualizado:', response);
        // Aquí puedes mostrar un mensaje de éxito o hacer alguna otra acción
      },
      (error) => {
        console.error('Error al actualizar el estado:', error);
        // Aquí puedes mostrar un mensaje de error o manejar el error
      }
    );
  }
  obtenerIdChat(id_estado: string): void {
    this.authService.obtenerIdChat(id_estado).subscribe(
      (response) => {
        const idChat = response.id_chat;
        this.router.navigate(['/chat-contacto', idChat]);
      },
      (error) => {
        console.error('Error al obtener el ID del chat:', error);
      }
    );
  }  
  
}