import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'; // Asegúrate de que la ruta sea correcta
import { Router,ActivatedRoute } from '@angular/router';
import { RefresherEventDetail, IonRefresher } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-personas-ownerbook',
  templateUrl: './personas-ownerbook.page.html',
  styleUrls: ['./personas-ownerbook.page.scss'],
})
export class PersonasOwnerbookPage implements OnInit {

  personas: any[] = [];  // Array para almacenar las personas con el libro
  isbn: string = '';     // Variable para almacenar el ISBN
  idUsuarioLogeado: number | null = null;
  ubicacionSeleccionada: string = '';
  
  constructor(
    private authService: AuthService,  // Inyectamos el AuthService
    private route: ActivatedRoute,      // Inyectamos ActivatedRoute para acceder a los parámetros de la URL
    private alertController: AlertController,
    private router: Router
  ) { }

  ngOnInit() {
    // Obtener el parámetro 'isbn' de la URL
    this.ubicacionSeleccionada=""
    this.idUsuarioLogeado = this.authService.getUserData()?.id_usuario || null;
    this.route.paramMap.subscribe((params) => {
      this.isbn = params.get('isbn') || '';
      if (this.isbn && this.idUsuarioLogeado !== null) {
        this.cargarPersonasConLibro();
      }
    });
  }

  // Método para llamar al servicio y cargar las personas
  // Método para llamar al servicio y cargar las personas
  cargarPersonasConLibro(): void {
    if (this.idUsuarioLogeado !== null) {
      this.authService.getPersonasConLibro(this.isbn, this.idUsuarioLogeado).subscribe(
        (response) => {
          this.personas = response;
        },
        (error) => {
          console.error('Error al obtener las personas con el libro:', error);
        }
      );
    } else {
      console.error('ID de usuario logeado no disponible.');
    }
  }
  notificacion_prestamo(correo: string): void {
    const titulo = 'Solicitud de Préstamo';
    const fechaActual = new Date().toLocaleString(); // Formateamos la fecha actual
    const descripcion = `Se ha solicitado un préstamo de uno de sus libros el ${fechaActual}.`;
    const tipo = 'Solicitud de préstamo';  // Asignamos el tipo de notificación
  
    // Llamada al servicio para crear la notificación
    this.authService.crearNotificacionPrestamo(correo, titulo, descripcion, tipo).subscribe(
      (notificacionResponse) => {
        console.log('Notificación creada con éxito:', notificacionResponse);
        this.router.navigate(['/solicitud-user'], { replaceUrl: true });
      },
      (notificacionError) => {
        console.error('Error al crear la notificación:', notificacionError);
        // Aquí puedes agregar lógica adicional para manejar el error de la notificación
      }
    );
  }
  
  
  // Método para solicitar un préstamo
  async solicitarPrestamo(id_usuario_prestamista: string, id_biblioteca: string, correo: string) {
    const alert = await this.alertController.create({
      header: 'Confirmación de Préstamo',
      message: '¿Estás seguro de que deseas solicitar este préstamo?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Solicitud de préstamo cancelada');
          }
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.confirmarPrestamo(id_usuario_prestamista, id_biblioteca, correo);
            
          }
        }
      ]
    });
  
    await alert.present();
  }
  confirmarPrestamo(id_usuario_prestamista: string, id_biblioteca: string, correo: string): void {
    const id_usuario_solicitante = this.authService.getUserData()?.id_usuario;
    const correoPrestamista = this.authService.getUserData()?.correo;
    this.notificacion_prestamo(correo);
    if (id_usuario_solicitante && correoPrestamista) {
      this.authService.crearPrestamo(id_usuario_solicitante, id_usuario_prestamista, id_biblioteca).subscribe(
        (response) => {
          console.log('Préstamo solicitado exitosamente:', response);
        },
        (error) => {
          console.error('Error al solicitar el préstamo:', error);
        }
      );
    } else {
      console.error('No se pudo obtener el ID del usuario solicitante o el correo del prestamista.');
    }
  }
  notificacion_intercambio(correo: string): void {
    const titulo = 'Solicitud de Intercambio de Libro';
    const fechaActual = new Date().toLocaleString(); // Formateamos la fecha actual
    const descripcion = `Se ha solicitado un intercambio de libros el ${fechaActual}.`;
    this.authService.crearNotificacionPrestamo(correo, titulo, descripcion).subscribe(
      (notificacionResponse) => {
        console.log('Notificación creada con éxito:', notificacionResponse);
      },
      (notificacionError) => {
        console.error('Error al crear la notificación:', notificacionError);
      }
    );
  }
  async solicitarIntercambio(isbn: string, id_usuario_prestamista: number) {
    const alert = await this.alertController.create({
      header: 'Confirmación de Intercambio',
      message: '¿Estás seguro de que deseas solicitar este intercambio?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Solicitud de intercambio cancelada');
          }
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.confirmarIntercambio(isbn, id_usuario_prestamista);
          }
        }
      ]
    });
  
    await alert.present();
  }
  confirmarIntercambio(isbn: string, id_usuario_prestamista: number): void {
    const id_usuario_solicitante = this.authService.getUserData()?.id_usuario;
    if (id_usuario_solicitante) {
      this.authService.obtenerIdBiblioteca(isbn, id_usuario_prestamista).subscribe(
        (response) => {
          const id_biblioteca_prestamista = response.id_biblioteca;
          this.authService.insertarIntercambio(id_usuario_prestamista, id_usuario_solicitante, id_biblioteca_prestamista)
            .subscribe(
              (response) => {
                console.log('Intercambio insertado exitosamente:', response);
                this.router.navigate(['/listar-intercambio'], { replaceUrl: true });
              },
              (error) => {
                console.error('Error al insertar el intercambio:', error);
              }
            );
        },
        (error) => {
          console.error('Error al obtener la id_biblioteca_prestamista:', error);
        }
      );
    } else {
      console.error('Error: No se pudo obtener el ID del usuario logueado');
    }
  }
  personasFiltradas(): any[] {
    if (this.ubicacionSeleccionada) {
      return this.personas.filter(persona => persona.ubicacion === this.ubicacionSeleccionada);
    }
    return this.personas;
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
