import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { IonicSlides } from '@ionic/angular';

interface Book {
  title: string;
  image: string;
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
  stars: number[] = Array(5).fill(0); // Un array para representar las 5 estrellas
  swiperModules = [IonicSlides];

  // Lista de libros con calificaciones
  books: Book[] = [
    {
      title: 'Harry Potter y las reliquias 2',
      image: 'assets/imagenes/harrypotterreliquias.png',
      selectedRating: 0,
    },
    {
      title: 'Como agua para chocolate',
      image: 'assets/imagenes/comoaguaparachocolate.png',
      selectedRating: 0,
    },
    {
      title: 'Harry Potter y las reliquias',
      image: 'assets/imagenes/harrypotterreliquias.png',
      selectedRating: 0,
    },
    {
      title: 'Harry Potter y las reliquias Parte 3',
      image: 'assets/imagenes/harrypotterreliquias.png',
      selectedRating: 0,
    },
  ];
  
  constructor(private authService: AuthService, private router: Router) {}

  ionViewWillEnter() {
    this.checkAuthentication();
  }

  checkAuthentication() {
    const token = this.authService.getToken();
    this.isLoggedIn = !!token;

    if (this.isLoggedIn) {
      this.userRole = this.authService.getUserRole(); 
      this.userEmail = this.authService.getUserEmail(); 
    } 
  }

  rateBook(bookIndex: number, rating: number) {
    this.books[bookIndex].selectedRating = rating; // Actualiza la calificación seleccionada del libro
    console.log(`Calificación seleccionada para ${this.books[bookIndex].title}: ${rating}`);
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
    this.router.navigate(['/chat'], { replaceUrl: true });
  }

  logout() {
    this.authService.logout();
    this.checkAuthentication();
    window.location.reload();
  }
}
