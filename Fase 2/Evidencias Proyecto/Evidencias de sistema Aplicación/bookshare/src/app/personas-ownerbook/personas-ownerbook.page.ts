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

}
