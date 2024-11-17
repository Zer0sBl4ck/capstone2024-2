import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RefresherEventDetail, IonRefresher } from '@ionic/angular';

@Component({
  selector: 'app-bookowner',
  templateUrl: './bookowner.page.html',
  styleUrls: ['./bookowner.page.scss'],
})
export class BookownerPage implements OnInit {
  libros: any[] = []; 
  errorMessage: string | null = null;
  correoLogueado: string | null = null; 
  esPropietario: boolean = false;  // Nueva variable para verificar si es el propietario

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.correoLogueado = this.authService.getUserEmail(); // Obtener correo del usuario logueado
    this.route.params.subscribe(params => {
      const correo = params['usuario'];
      this.esPropietario = this.correoLogueado === correo; // Comparar correos
      this.cargarLibros(correo); 
    });
    if (this.correoLogueado) {
      this.authService.getUserProfile(this.correoLogueado).subscribe(
        (response) => {
          console.log('ID del usuario logueado:', response.id_usuario); 
        },
        (error) => {
          console.error('Error al obtener el perfil del usuario:', error);
        }
      );
    } else {
      console.error('No se ha encontrado el correo del usuario logueado.');
    }
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

  eliminarLibroBiblioteca(isbn: string) {
    if (this.correoLogueado) {
      // Obtén el perfil del usuario para obtener su `id_usuario`
      this.authService.getUserProfile(this.correoLogueado).subscribe(
        (response) => {
          const id_usuario = response.id_usuario; // Asegúrate de que 'id_usuario' coincide con el campo en tu respuesta de la API
          this.authService.eliminarLibroBiblioteca(isbn, id_usuario).subscribe(
            (result) => {
              console.log(result.message);
              if (this.correoLogueado) {
                this.cargarLibros(this.correoLogueado); 
                window.location.reload();
              }
            },
            (error) => {
              console.error('Error al eliminar el libro:', error);
              this.errorMessage = 'No se pudo eliminar el libro. Inténtalo de nuevo más tarde.';
            }
          );
        },
        (error) => {
          console.error('Error al obtener el perfil del usuario:', error);
        }
      );
    } else {
      console.error('No se ha encontrado el correo del usuario logueado.');
    }
  
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
