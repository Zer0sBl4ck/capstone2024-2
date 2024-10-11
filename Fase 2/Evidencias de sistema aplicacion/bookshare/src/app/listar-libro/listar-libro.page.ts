import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'; 
import { AlertController } from '@ionic/angular'; // Importar AlertController

@Component({
  selector: 'app-listar-libro',
  templateUrl: './listar-libro.page.html',
  styleUrls: ['./listar-libro.page.scss'],
})
export class ListarLibroPage implements OnInit {
  libros: any[] = []; 

  constructor(private authService: AuthService, private alertController: AlertController) { } // Inyectar AlertController

  ngOnInit() {
    this.cargarLibros(); 
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

  async agregarLibroABiblioteca(libro: any) {
    const usuario = this.authService.getUserData(); // Obtener datos del usuario
    console.log('Usuario:', usuario); // Verifica si el usuario está definido
    if (usuario) {
      this.authService.agregarLibroABiblioteca(usuario.id_usuario, libro.id_libro).subscribe(
        () => { 
          console.log('Libro agregado a la biblioteca');
          this.mostrarAlerta('Éxito', 'El libro se ha agregado a tu biblioteca.'); // Mostrar alerta de éxito
        },
        error => {
          console.error('Error al agregar libro a la biblioteca:', error);
          this.mostrarAlerta('Error', 'Este libro ya está en tu biblioteca o hubo un problema al agregarlo.'); // Mostrar alerta de error
        }
      );
    } else {
      console.error('No se ha encontrado el usuario.'); // Log si no se encuentra el usuario
      this.mostrarAlerta('Error', 'No se ha encontrado el usuario.'); // Alerta si no se encuentra el usuario
    }
  }

  // Método para mostrar alertas
  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['Aceptar'],
    });

    await alert.present();
  }
}
