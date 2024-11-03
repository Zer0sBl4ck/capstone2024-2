// vista-libro.page.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

interface Libro {
  isbn: string;
  titulo: string;
  autor: string;
  descripcion: string;
  genero: string;
  imagen_libro_base64?: string;
}

@Component({
  selector: 'app-vista-libro',
  templateUrl: './vista-libro.page.html',
  styleUrls: ['./vista-libro.page.scss'],
})
export class VistaLibroPage implements OnInit {
  libro: Libro | undefined;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit() {
    const isbn = this.route.snapshot.paramMap.get('isbn');
    if (isbn) {
      this.cargarLibro(isbn);
    }
  }

  cargarLibro(isbn: string) {
    this.authService.getLibros().subscribe((data) => {
      this.libro = data.find((libro: Libro) => libro.isbn === isbn);
    });
  }
}
