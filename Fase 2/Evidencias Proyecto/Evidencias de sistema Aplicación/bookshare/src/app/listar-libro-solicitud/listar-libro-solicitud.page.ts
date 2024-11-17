import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'; // Asegúrate de que la ruta sea correcta
import { RefresherEventDetail, IonRefresher } from '@ionic/angular';

@Component({
  selector: 'app-listar-libro-solicitud',
  templateUrl: './listar-libro-solicitud.page.html',
  styleUrls: ['./listar-libro-solicitud.page.scss'],
})
export class ListarLibroSolicitudPage implements OnInit {
  libros: any[] = []; // Cambia 'any' a un tipo más específico si es necesario

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.cargarLibros();
  }

  cargarLibros(): void {
    this.authService.listarLibrosEstadoFalse().subscribe(
      (data) => {
        this.libros = data;
        console.log(data)
      },
      (error) => {
        console.error('Error al cargar los libros:', error);
      }
    );
  }

  modificarEstado(isbn: string): void {
    this.authService.modificarLibroEstado(isbn).subscribe(
      () => {
        this.cargarLibros(); // Recargar la lista después de modificar el estado
      },
      (error) => {
        console.error('Error al modificar el estado del libro:', error);
      }
    );
  }

  eliminarLibro(isbn: string): void {
    this.authService.eliminarLibro(isbn).subscribe(
      () => {
        this.cargarLibros(); // Recargar la lista después de eliminar
      },
      (error) => {
        console.error('Error al eliminar el libro:', error);
      }
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
  
}
