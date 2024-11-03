import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-bookowner',
  templateUrl: './bookowner.page.html',
  styleUrls: ['./bookowner.page.scss'],
})
export class BookownerPage implements OnInit {
  libros: any[] = []; 
  errorMessage: string | null = null; 

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const correo = params['usuario']; 
      this.cargarLibros(correo); 
    });
  }

  cargarLibros(correo: string) {
    if (correo) {
      this.authService.getLibrosPorCorreo(correo).subscribe(
        (response) => {
          this.libros = response; 
          console.log(this.libros); 
        },
        (error) => {
          console.error('Error al cargar libros:', error);
          this.errorMessage = 'No se pudieron cargar los libros. Inténtalo de nuevo más tarde.'; 
        }
      );
    } else {
      this.errorMessage = 'No se ha encontrado el usuario. Asegúrate de que estás logueado.'; 
      this.router.navigate(['/login']); 
    }
  }

  cambiarEstadoPrestamo(isbn: string, disponible: boolean) {
    this.authService.modificarEstadoPrestamo(isbn, disponible).subscribe(
      (response) => {
        console.log(response.message);
        this.cargarLibros(this.route.snapshot.params['usuario']); // Recargar libros para reflejar cambios
      },
      (error) => {
        console.error('Error al cambiar estado de préstamo:', error);
        this.errorMessage = 'No se pudo cambiar el estado de préstamo. Inténtalo de nuevo más tarde.';
      }
    );
  }

  cambiarEstadoIntercambio(isbn: string, disponible: boolean) {
    this.authService.modificarEstadoIntercambio(isbn, disponible).subscribe(
      (response) => {
        console.log(response.message);
        this.cargarLibros(this.route.snapshot.params['usuario']); // Recargar libros para reflejar cambios
      },
      (error) => {
        console.error('Error al cambiar estado de intercambio:', error);
        this.errorMessage = 'No se pudo cambiar el estado de intercambio. Inténtalo de nuevo más tarde.';
      }
    );
  }
}
