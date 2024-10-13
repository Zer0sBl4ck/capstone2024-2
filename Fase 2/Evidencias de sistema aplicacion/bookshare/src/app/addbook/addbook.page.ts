import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-addbook',
  templateUrl: './addbook.page.html',
  styleUrls: ['./addbook.page.scss'],
})
export class AddbookPage implements OnInit {
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
    this.authService.agregarLibro(this.titulo, this.autor, this.descripcion, this.genero, this.imagen_libro)
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
    this.titulo = '';
    this.autor = '';
    this.descripcion = '';
    this.genero = '';
    this.imagen_libro = null; 
  }
}
