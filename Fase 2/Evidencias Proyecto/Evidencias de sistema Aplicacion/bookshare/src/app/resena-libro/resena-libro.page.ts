import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-resena-libro',
  templateUrl: './resena-libro.page.html',
  styleUrls: ['./resena-libro.page.scss'],
})
export class ResenaLibroPage implements OnInit {

  idPrestamo: number = 0;         // Inicializa idPrestamo con 0
  libro: any = {};                // Inicializa 'libro' como un objeto vacío
  calificacion: number = 0;       // Calificación de la reseña
  comentario: string = '';        // Comentario de la reseña

  constructor(
    private route: ActivatedRoute, 
    private authService: AuthService
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
    if (this.calificacion && this.comentario) {
      console.log('Enviando reseña con calificación:', this.calificacion, 'y comentario:', this.comentario);  // Log
      this.authService.agregarResena(id_usuario_solicitante, this.libro.isbn, this.calificacion, this.comentario).subscribe(
        (response) => {
          console.log('Reseña agregada con éxito:', response);  // Log
          alert('¡Reseña agregada con éxito!');
          // Redirigir o realizar alguna otra acción (ej. volver a la página de libros o al perfil)
        },
        (error) => {
          console.error('Error al agregar la reseña:', error);
          alert('Hubo un error al agregar la reseña.');
        }
      );
    } else {
      console.warn('Por favor, complete la calificación y el comentario antes de enviar la reseña');  // Log
      alert('Por favor, complete la calificación y el comentario.');
    }
  }
}
