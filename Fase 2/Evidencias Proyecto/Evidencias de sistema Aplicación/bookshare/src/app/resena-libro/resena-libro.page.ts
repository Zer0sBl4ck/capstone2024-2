import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Asegúrate de que la ruta sea correcta
import { Router } from '@angular/router';

@Component({
  selector: 'app-resena-libro',
  templateUrl: './resena-libro.page.html',
  styleUrls: ['./resena-libro.page.scss'],
})
export class ResenaLibroPage implements OnInit {

  idPrestamo: number = 0;         // Inicializa idPrestamo con 0
  libro: any = {};                // Inicializa 'libro' como un objeto vacío
  calificacionLibro: number = 0;  // Calificación del libro
  comentarioLibro: string = '';   // Comentario del libro
  calificacionPrestamista: number = 0;  // Calificación del prestamista
  comentarioPrestamista: string = '';   // Comentario del prestamista

  constructor(
    private route: ActivatedRoute, 
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Obtiene los parámetros de la URL (queryParams)
    this.route.queryParams.subscribe(params => {
      this.idPrestamo = params['id_prestamo'];
      this.libro = {
        isbn: params['isbn'],
        titulo: params['titulo'],
        prestamista: params['prestamista'],
        autor: params['autor'],
        descripcion: params['descripcion'],
        genero: params['genero']
      };
      console.log('ID del préstamo recibido:', this.idPrestamo);
      console.log('Datos del libro recibidos:', this.libro);
    });
  }

  agregarResena(): void {
    const id_usuario_solicitante = this.authService.getUserData()?.id_usuario; // Obtén el ID del usuario actual
    console.log('ID del usuario que agrega la reseña:', id_usuario_solicitante);  // Log

    // Validación de calificación y comentario antes de hacer la llamada al servicio
    if (this.calificacionLibro && this.comentarioLibro && this.calificacionPrestamista && this.comentarioPrestamista) {
      console.log('Enviando reseña con calificación del libro:', this.calificacionLibro, 'y comentario del libro:', this.comentarioLibro);  // Log
      console.log('Enviando reseña con calificación del prestamista:', this.calificacionPrestamista, 'y comentario del prestamista:', this.comentarioPrestamista);  // Log
      
      // Llamada al servicio para agregar la reseña del libro
      this.authService.agregarResena(id_usuario_solicitante, this.libro.isbn, this.calificacionLibro, this.comentarioLibro).subscribe(
        (response) => {
          console.log('Reseña del libro agregada con éxito:', response);  // Log

          // Llamada al servicio para agregar la reseña del prestamista
          this.authService.agregarResenaPrestamista(this.idPrestamo, this.calificacionPrestamista, this.comentarioPrestamista).subscribe(
            (response) => {
              console.log('Reseña del prestamista agregada con éxito:', response);  // Log
              alert('¡Reseña agregada con éxito!');
              // Redirigir o realizar alguna otra acción (ej. volver a la página de libros o al perfil)
              this.router.navigate(['/solicitud-user']);
            },
            (error) => {
              console.error('Error al agregar la reseña del prestamista:', error);
              alert('Hubo un error al agregar la reseña del prestamista.');
            }
          );
        },
        (error) => {
          console.error('Error al agregar la reseña del libro:', error);
          alert('Hubo un error al agregar la reseña del libro.');
        }
      );
    } else {
      console.warn('Por favor, complete todas las calificaciones y comentarios antes de enviar la reseña');  // Log
      alert('Por favor, complete todas las calificaciones y comentarios.');
    }
  }

  retroceder() {
    window.history.back();
  }
}