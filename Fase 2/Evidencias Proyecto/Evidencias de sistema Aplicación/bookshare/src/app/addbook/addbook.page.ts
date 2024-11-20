import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
  
import { RefresherEventDetail, IonRefresher } from '@ionic/angular';

@Component({
  selector: 'app-addbook',
  templateUrl: './addbook.page.html',
  styleUrls: ['./addbook.page.scss'],
})
export class AddbookPage implements OnInit {
  isbn: string = ''; // Agregado para capturar el ISBN
  titulo: string = '';
  autor: string = '';
  descripcion: string = '';
  genero: string = '';
  imagen_libro: string | null = null; 

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

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

  onSubmit() {
    if (!this.imagen_libro) {
      console.error('Por favor, selecciona una imagen antes de agregar el libro.');
      return;
    }
    // Se pasa el ISBN junto con otros campos
    this.authService.agregarLibro(this.isbn, this.titulo, this.autor, this.descripcion, this.genero, this.imagen_libro)
      .subscribe(
        response => {
          console.log('Libro agregado:', response);
          this.limpiarFormulario(); 
          this.router.navigate(['/']); 
        },
        error => {
          console.error('Error al agregar libro:', error);
        }
      );
  }

  limpiarFormulario() {
    this.isbn = ''; // Limpiar el campo ISBN
    this.titulo = '';
    this.autor = '';
    this.descripcion = '';
    this.genero = '';
    this.imagen_libro = null; 
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
