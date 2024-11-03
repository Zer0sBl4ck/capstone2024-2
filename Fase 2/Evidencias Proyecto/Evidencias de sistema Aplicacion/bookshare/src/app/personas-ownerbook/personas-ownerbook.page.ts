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

  constructor(
    private authService: AuthService,  // Inyectamos el AuthService
    private route: ActivatedRoute      // Inyectamos ActivatedRoute para acceder a los parámetros de la URL
  ) { }

  ngOnInit() {
    // Obtener el parámetro 'isbn' de la URL
    this.route.paramMap.subscribe((params) => {
      this.isbn = params.get('isbn') || ''; // Si no hay ISBN, usa un string vacío
      if (this.isbn) {
        // Llamamos al método para cargar las personas que tienen el libro
        this.cargarPersonasConLibro();
      }
    });
  }

  // Método para llamar al servicio y cargar las personas
  cargarPersonasConLibro(): void {
    this.authService.getPersonasConLibro(this.isbn).subscribe(
      (response) => {
        this.personas = response; // Guardamos las personas obtenidas en el array
      },
      (error) => {
        console.error('Error al obtener las personas con el libro:', error);
      }
    );
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

}
