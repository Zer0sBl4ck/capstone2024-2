import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'; // Asegúrate de que la ruta sea correcta
import { ActivatedRoute } from '@angular/router';

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
    private route: ActivatedRoute      // Inyectamos ActivatedRoute para acceder a los parámetros de la URL
  ) { }

  ngOnInit() {
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

  notificacion_prestamo(correo: string): void{
    const titulo = 'Solicitud de Préstamo';
    const fechaActual = new Date().toLocaleString(); // Formateamos la fecha actual
    const descripcion = `Se ha solicitado un préstamo de uno de sus libros el ${fechaActual}.`;
    this.authService.crearNotificacionPrestamo(correo, titulo, descripcion).subscribe(
      (notificacionResponse) => {
        console.log('Notificación creada con éxito:', notificacionResponse);
        
      },
      (notificacionError) => {
        console.error('Error al crear la notificación:', notificacionError);
        // Aquí puedes agregar lógica adicional para manejar el error de la notificación
      }
    );
  }

  // Método para solicitar un préstamo
  solicitarPrestamo(id_usuario_prestamista: string, id_biblioteca: string,correo:string): void {
    const id_usuario_solicitante = this.authService.getUserData()?.id_usuario; // Obtén el ID del usuario logueado
    const correoPrestamista = this.authService.getUserData()?.correo; // Obtén el correo del prestamista
    this.notificacion_prestamo(correo)
    if (id_usuario_solicitante && correoPrestamista) {
      this.authService.crearPrestamo(id_usuario_solicitante, id_usuario_prestamista, id_biblioteca).subscribe(
        (response) => {
          console.log('Préstamo solicitado exitosamente:', response);
  
        },
        (error) => {
          console.error('Error al solicitar el préstamo:', error);
          // Aquí puedes agregar lógica adicional para manejar el error
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
  solicitarIntercambio(isbn: string, id_usuario_prestamista: number): void {
    const id_usuario_solicitante = this.authService.getUserData()?.id_usuario; // Obtener ID del usuario logueado
    console.log(id_usuario_solicitante) // bien
    console.log(isbn, " ", id_usuario_prestamista) // bien
    if (id_usuario_solicitante) {
      // Primero, obtener la id_biblioteca_prestamista a partir del ISBN
      this.authService.obtenerIdBiblioteca(isbn,id_usuario_prestamista).subscribe(
        (response) => {
          const id_biblioteca_prestamista = response.id_biblioteca; // Obtener la ID de la biblioteca
          console.log("id_biblioteca: ",id_biblioteca_prestamista) // bien
          // Ahora que tenemos todos los datos necesarios, podemos insertar el intercambio
          this.authService.insertarIntercambio(id_usuario_prestamista, id_usuario_solicitante, id_biblioteca_prestamista)
            .subscribe(
              (response) => {
                console.log('Intercambio insertado exitosamente:', response);
                // Aquí puedes agregar una notificación o mensaje de confirmación
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
  
}
