import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-addbook-user',
  templateUrl: './addbook-user.page.html',
  styleUrls: ['./addbook-user.page.scss'],
})
export class AddbookUserPage implements OnInit {
  isbn: string = ''; // Captura el ISBN
  titulo: string = '';
  autor: string = '';
  descripcion: string = '';
  genero: string = '';
  imagen_libro: string | null = null; 

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  // Maneja la selección de archivo para la imagen
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        this.imagen_libro = e.target?.result as string; 
      };

      reader.readAsDataURL(file); 
    }
  }

  // Maneja el envío del formulario
  onSubmit() {
    if (!this.imagen_libro) {
      console.error('Por favor, selecciona una imagen antes de agregar el libro.');
      return;
    }

    // Llama al servicio para agregar el libro con estado false
    this.authService.agregarLibroEstadoFalse(this.isbn, this.titulo, this.autor, this.descripcion, this.genero, this.imagen_libro)
      .subscribe(
        response => {
          console.log('Libro de usuario agregado:', response);
          this.limpiarFormulario(); 
          this.router.navigate(['/']); // Navegar a la página principal o donde desees
        },
        error => {
          console.error('Error al agregar libro de usuario:', error);
        }
      );
  }

  // Limpia el formulario
  limpiarFormulario() {
    this.isbn = ''; 
    this.titulo = '';
    this.autor = '';
    this.descripcion = '';
    this.genero = '';
    this.imagen_libro = null; 
  }
}
