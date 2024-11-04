import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { IonicSlides } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { VistaLibroPage } from '../vista-libro/vista-libro.page'; // Importa el componente


interface Book {
  isbn: string;
  titulo: string;
  autor: string;
  descripcion: string;
  genero: string;
  imagen_libro: string;
  selectedRating: number; // Almacena la calificación seleccionada para cada libro
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  isLoggedIn = false;  
  userRole: string | null = null;  
  userEmail: string | null = null;  
  userName: string | null = null;
  stars: number[] = Array(5).fill(0);
  swiperModules = [IonicSlides];
  books: Book[] = []; 

  constructor(private authService: AuthService, private router: Router, private popoverController: PopoverController) {}

  ionViewWillEnter() {
    this.checkAuthentication();
    this.getLibros();
  }

  checkAuthentication() {
    const token = this.authService.getToken();
    this.isLoggedIn = !!token;

    if (this.isLoggedIn) {
      this.userRole = this.authService.getUserRole(); 
      this.userEmail = this.authService.getUserEmail(); 
      this.userName = this.authService.getUserName();
    } 
  }
  ngOnInit() {
    this.getLibros(); // Cargar libros al inicializar la página
  }

  getLibros() {
    this.authService.getLibros().subscribe(
      (response) => {
        console.log('Libros recibidos:', response); // Verifica la respuesta
        this.books = response.map((libro: any) => ({
          isbn: libro.isbn,
          titulo: libro.titulo,
          autor: libro.autor,
          descripcion: libro.descripcion,
          imagen_libro: libro.imagen_libro_base64 ? 'data:image/jpeg;base64,' + libro.imagen_libro_base64 : 'assets/imagenes/default.png', // Usa imagen_libro_base64 aquí
          selectedRating: 0, // Calificación inicial
        }));
      },
      (error) => {
        console.error('Error al cargar los libros:', error);
      }
    );
  }

  async goToBookDetail(isbn: string) {
    const popover = await this.popoverController.create({
      component: VistaLibroPage,
      componentProps: { isbn: isbn }, // Pasa el ISBN al popover
      cssClass: 'custom-popover',
      translucent: true,
    });
    return await popover.present();
  }

  rateBook(bookIndex: number, rating: number) {
    this.books[bookIndex].selectedRating = rating; // Actualiza la calificación seleccionada del libro
    console.log(`Calificación seleccionada para ${this.books[bookIndex].titulo}: ${rating}`);
    // Aquí puedes agregar lógica adicional, como guardar la calificación en una base de datos
  }

  goToProfile() {
    if (this.userEmail) {
      this.router.navigate(['/perfil', this.userEmail], { replaceUrl: true }); 
    }
  }

  goAddBook() {
    this.router.navigate(['/addbook'], { replaceUrl: true });
  }

  goAddBookuser() {
    this.router.navigate(['/addbook-user'], { replaceUrl: true });
  }

  solicitudesadd() {
    this.router.navigate(['/listar-libro-solicitud'], { replaceUrl: true });
  }

  gosoliuser() {
    this.router.navigate(['/solicitud-user'], { replaceUrl: true });
  }

  goBookOwner() {
    this.router.navigate(['/bookowner', this.userEmail], { replaceUrl: true });
  }

  gochat() {
    this.router.navigate(['/tabs/chat'], { replaceUrl: true });
  }

  logout() {
    this.authService.logout();
    this.checkAuthentication();
    window.location.reload();
  }
}

