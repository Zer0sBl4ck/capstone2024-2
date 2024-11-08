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
    this.route.queryParams.subscribe(params => {
      this.idPrestamo = params['id_prestamo']; // Obtiene el id del préstamo
      if (this.idPrestamo) {
        this.obtenerDatosLibro(); // Si existe el id, obtiene los datos del libro
      }
    });
  }

  obtenerDatosLibro(): void {
    // Aquí usas el idPrestamo para obtener los datos del libro (como el ISBN)
    this.authService.getPrestamoPorId(this.idPrestamo).subscribe(
      (response) => {
        if (response && response.isbn) {
          this.libro = response; // Asigna los datos del libro a la propiedad 'libro'
        } else {
          console.error('Datos del libro no encontrados');
        }
      },
      (error) => {
        console.error('Error al obtener los datos del libro:', error);
      }
    );
  }

  agregarResena(): void {
    const usuarioId = 1; // Aquí debes obtener el id del usuario actual, puedes usar `this.authService.getUserData().id`

    if (this.calificacion && this.comentario) {
      this.authService.agregarResena(usuarioId, this.libro.isbn, this.calificacion, this.comentario).subscribe(
        (response) => {
          console.log('Reseña agregada con éxito:', response);
          alert('¡Reseña agregada con éxito!');
          // Redirigir o realizar alguna otra acción
        },
        (error) => {
          console.error('Error al agregar la reseña:', error);
          alert('Hubo un error al agregar la reseña.');
        }
      );
    } else {
      alert('Por favor, complete la calificación y el comentario.');
    }
  }
}
