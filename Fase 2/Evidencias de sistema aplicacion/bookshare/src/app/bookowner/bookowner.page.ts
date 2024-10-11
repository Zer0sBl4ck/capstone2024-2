import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-bookowner',
  templateUrl: './bookowner.page.html',
  styleUrls: ['./bookowner.page.scss'],
})
export class BookownerPage implements OnInit {
  libros: any[] = []; // Array para almacenar los libros
  errorMessage: string | null = null; // Para almacenar mensajes de error

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const correo = params['usuario']; // Extraer el correo electrónico de la URL
      this.cargarLibros(correo); // Cargar los libros usando el correo extraído
    });
  }

  cargarLibros(correo: string) {
    if (correo) {
      this.authService.getLibrosPorCorreo(correo).subscribe(
        (response) => {
          this.libros = response; // Almacenar los libros en el array
          console.log(this.libros); // Verifica que el campo imagen_base64 tenga datos válidos
        },
        (error) => {
          console.error('Error al cargar libros:', error);
          this.errorMessage = 'No se pudieron cargar los libros. Inténtalo de nuevo más tarde.'; // Mensaje de error
        }
      );
    } else {
      this.errorMessage = 'No se ha encontrado el usuario. Asegúrate de que estás logueado.'; // Alerta si no se encuentra el usuario
      this.router.navigate(['/login']); // Redirigir a la página de login si no hay usuario
    }
  }
}
