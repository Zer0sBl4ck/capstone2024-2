import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

interface Libro {
  isbn: string;
  titulo: string;
  autor: string;
  descripcion: string;
  genero: string;
  imagen_libro_base64?: string; // Si la imagen es opcional
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  libros: Libro[] = []; // Aquí almacenaremos los libros
  isLoggedIn = false;  
  userRole: string | null = null;  
  userEmail: string | null = null;  

  constructor(private authService: AuthService, private router: Router) {}

  ionViewWillEnter() {
    this.checkAuthentication();
    this.cargarLibros(); // Cargar libros al ingresar a la vista
  }

  checkAuthentication() {
    const token = this.authService.getToken();
    this.isLoggedIn = !!token;

    if (this.isLoggedIn) {
      this.userRole = this.authService.getUserRole(); 
      this.userEmail = this.authService.getUserEmail(); 
    } 
  }

  cargarLibros() {
    this.authService.getLibros().subscribe(
      (data) => {
        this.libros = data.map((libro: any) => {
          if (libro.imagen_libro) {
            libro.imagen_libro_base64 = `data:image/jpeg;base64,${libro.imagen_libro}`;
          }
          return libro;
        });
      },
      (error) => {
        console.error('Error al cargar libros:', error);
      }
    );
  }

  goToProfile() {
    if (this.userEmail) {
      this.router.navigate(['/perfil', this.userEmail],{ replaceUrl: true }); 
    }
  }

  goAddBook(){
    this.router.navigate(['/addbook'],{replaceUrl:true});
  }

  goAddBookuser(){
    this.router.navigate(['/addbook-user'],{replaceUrl:true});
  }

  solicitudesadd(){
    this.router.navigate(['/listar-libro-solicitud'],{replaceUrl:true});
  }

  gosoliuser(){
    this.router.navigate(['/solicitud-user'],{replaceUrl:true});
  }

  goBookOwner(){
    this.router.navigate(['/bookowner', this.userEmail],{replaceUrl: true});
  }

  logout() {
    this.authService.logout();
    this.checkAuthentication();
    window.location.reload();
  }
}
