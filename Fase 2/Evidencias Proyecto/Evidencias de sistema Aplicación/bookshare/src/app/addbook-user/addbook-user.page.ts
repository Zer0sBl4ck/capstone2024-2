import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Asegúrate de que la ruta sea correcta
import { ToastController } from '@ionic/angular'; // Importa ToastController
import { RefresherEventDetail, IonRefresher } from '@ionic/angular';

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
  toastMessage = { isOpen: false, message: '', color: '' }; // Manejo del toast

  constructor(private authService: AuthService, private router: Router, private toastController: ToastController) { }
  generos: any[] = [];
  ngOnInit() {
    this.cargarGeneros();
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

  // Muestra un toast
  async showToast(message: string, color: string) {
    this.toastMessage.message = message;
    this.toastMessage.color = color;
    this.toastMessage.isOpen = true;
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
    });
    toast.present();
  }

  // Maneja el envío del formulario
  onSubmit() {
    if (!this.imagen_libro) {
      this.showToast('Por favor, selecciona una imagen antes de agregar el libro.', 'danger');
      return;
    }

    // Llama al servicio para agregar el libro con estado false
    this.authService.agregarLibroEstadoFalse(this.isbn, this.titulo, this.autor, this.descripcion, this.genero, this.imagen_libro)
      .subscribe(
        response => {
          console.log('Libro de usuario agregado:', response);
          this.showToast('Libro solicitado con éxito.', 'success'); // Mensaje de éxito
          this.limpiarFormulario(); 
          this.router.navigate(['/']); 
        },
        error => {
          console.error('Error al agregar libro de usuario:', error);
          this.showToast('Error al agregar el libro.', 'danger'); // Mensaje de error
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
  cargarGeneros() {
    this.authService.obtenerGeneros().subscribe(
      (data) => {
        this.generos = data;
        console.log(this.generos)
      },
      (error) => {
        console.error('Error al cargar los géneros', error);
      }
    );
  }
}
