import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'; // Asegúrate de importar tu servicio

@Component({
  selector: 'app-listar-libro',
  templateUrl: './listar-libro.page.html',
  styleUrls: ['./listar-libro.page.scss'],
})
export class ListarLibroPage implements OnInit {

  libros: any[] = []; // Aquí guardaremos los libros

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.cargarLibros(); // Cargar libros al iniciar
  }
  cargarLibros() {
    this.authService.getLibros().subscribe(
      (data) => {
        this.libros = data.map((libro: any) => {
          if (libro.imagen_libro) {
            // Si el libro tiene imagen en base64, creamos una URL
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
}