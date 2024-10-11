import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-listar-libro',
  templateUrl: './listar-libro.page.html',
  styleUrls: ['./listar-libro.page.scss'],
})
export class ListarLibroPage implements OnInit {

  libros: any[] = []; // Aquí guardaremos los libros
  rol: string | null = null; // Variable para almacenar el rol del usuario

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.cargarLibros(); // Cargar libros al iniciar
    this.rol = this.authService.getUserRole(); 
    console.log(this.rol)
  }

  cargarLibros() {
    this.authService.getLibros().subscribe(
      (data) => {
        this.libros = data.map((libro: any) => {
          if (libro.imagen_libro) {
            libro.imagen_libro = `data:image/jpeg;base64,${libro.imagen_libro}`;
          }
          return libro;
        });
      },
      (error) => {
        console.error('Error al cargar libros:', error);
      }
    );
  }

  // Funciones para manejar acciones de usuario y administrador
  accionUsuario(libro: any) {
    console.log('Acción de usuario para el libro:', libro);
    // Implementa la lógica correspondiente para el rol de usuario
  }

  accionAdmin(libro: any) {
    console.log('Acción de administrador para el libro:', libro);
    // Implementa la lógica correspondiente para el rol de administrador
  }
}
