import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'; 
import { AlertController } from '@ionic/angular'; 
import { Router } from '@angular/router'; 
import { PopoverController } from '@ionic/angular';
import { VistaLibroPage } from '../vista-libro/vista-libro.page'; // Importa el componente
import { RefresherEventDetail, IonRefresher } from '@ionic/angular';


interface Libro {
  isbn: string;
  titulo: string;
  autor: string;
  descripcion: string;
  genero: string;
  imagen_libro_base64?: string; // Si la imagen es opcional
}

@Component({
  selector: 'app-listar-libro',
  templateUrl: './listar-libro.page.html',
  styleUrls: ['./listar-libro.page.scss'],
})
export class ListarLibroPage implements OnInit {
  libros: Libro[] = []; // Cambiar el tipo de libros a Libro[]
  esAdmin: boolean = false;
  rol: string | null = null; // Variable para almacenar el rol del usuario
  userEmail: string | null = null;  
  genero: string | null = null; // Género seleccionado por el usuario
  librosFiltrados: any[] = [];
  constructor(
    private authService: AuthService, 
    private alertController: AlertController,
    private router: Router,
    private popoverController: PopoverController // Inyectar Router
  ) { }

  ngOnInit() {
    this.cargarLibros(); 
    this.rol = this.authService.getUserRole(); 
    this.verificarRol(); // Asegurarse de verificar el rol del usuario
    this.userEmail = this.authService.getUserEmail(); 
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
        this.filtrarPorGenero(); // Llamar a filtrarPorGenero después de asignar los libros
      },
      (error) => {
        console.error('Error al cargar libros:', error);
      }
    );
  }

  goToBookDetail(isbn: string) {
    this.router.navigate(['/vista-libro'], { queryParams: { isbn: isbn } });
  }

  async agregarLibroABiblioteca(libro: Libro) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que deseas agregar este libro a tu biblioteca?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Operación cancelada');
          }
        },
        {
          text: 'Agregar',
          handler: () => {
            this.confirmarAgregarLibro(libro);
          }
        }
      ]
    });
  
    await alert.present();
  }
  
  confirmarAgregarLibro(libro: Libro) {
    const usuario = this.authService.getUserData();
    console.log('Usuario:', usuario);
    if (usuario) {
      this.authService.agregarLibroABiblioteca(usuario.id_usuario, libro.isbn).subscribe(
        () => {
          console.log('Libro agregado a la biblioteca');
          this.mostrarAlerta('Éxito', 'El libro se ha agregado a tu biblioteca.');

          
        },
        error => {
          console.error('Error al agregar libro a la biblioteca:', error);
          this.mostrarAlerta('Error', 'Este libro ya está en tu biblioteca o hubo un problema al agregarlo.');
        }
      );
    } else {
      console.error('No se ha encontrado el usuario.');
      this.mostrarAlerta('Error', 'No se ha encontrado el usuario.');
    }
    this.router.navigate(['/bookowner', this.userEmail], { replaceUrl: true });
  }

  // Método para ir a la página de personas con el libro
  irAPersonasConLibro(isbn: string) {
    this.router.navigate([`/personas-ownerbook/${isbn}`]);
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

  verificarRol() {
    const usuario = this.authService.getUserData();
    if (usuario && usuario.rol === 'admin') {
      this.esAdmin = true; // Si el usuario es admin, activar la propiedad
    }
  }

  modificarLibro(libro: Libro) { // Cambiar el tipo a Libro
    console.log('Modificar libro:', libro);
    // Aquí se podría abrir una ventana modal o redirigir a la página de edición del libro
  }

  // Función para buscar libros
  buscarLibros(event: any) {
    const query = event.target.value.toLowerCase();
    this.authService.getLibros().subscribe((data) => {
      this.libros = data.filter((libro: Libro) => // Especificar el tipo aquí
        libro.titulo.toLowerCase().includes(query) || 
        libro.autor.toLowerCase().includes(query)|| 
        libro.genero.toLowerCase().includes(query) 
      );
    });
  }
  async agregarAFavoritos(libro: Libro) {
    const usuario = this.authService.getUserData(); // Obtener datos del usuario
    console.log('Usuario:', usuario); // Verifica si el usuario está definido
    if (usuario) {
      this.authService.agregarFavorito(usuario.correo, libro.isbn).subscribe(
        () => {
          console.log('Libro agregado a favoritos');
          this.mostrarAlerta('Éxito', 'El libro se ha agregado a tus favoritos.');
        },
        (error) => {
          console.error('Error al agregar libro a favoritos:', error);
          this.mostrarAlerta('Error', 'Este libro ya está en tus favoritos o hubo un problema al agregarlo.');
        }
      );
    } else {
      console.error('No se ha encontrado el usuario.');
      this.mostrarAlerta('Error', 'No se ha encontrado el usuario.');
    }
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
  filtrarPorGenero() {
    this.librosFiltrados = this.genero
      ? this.libros.filter(libro => libro.genero === this.genero)
      : this.libros;
  }
}
