import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  isLoggedIn = false;  // Para controlar si el usuario está logueado
  userRole: string | null = null;  // Para almacenar el rol del usuario
  userEmail: string | null = null;  // Para almacenar el correo del usuario

  constructor(private authService: AuthService, private router: Router) {}

  ionViewWillEnter() {
    this.checkAuthentication();
  }

  checkAuthentication() {
    const token = this.authService.getToken();
    this.isLoggedIn = !!token;

    if (this.isLoggedIn) {
      this.userRole = this.authService.getUserRole(); // Obtener el rol del usuario
      this.userEmail = this.authService.getUserEmail(); // Obtener el correo del usuario
    } 
  }

  goToProfile() {
    if (this.userEmail) {
      this.router.navigate(['/perfil', this.userEmail],{ replaceUrl: true }); 
    }
  }

  goAddBook(){
    this.router.navigate(['/addbook'],{replaceUrl:true})
  }
  goBookOwner(){
    this.router.navigate(['/bookowner',this.userEmail],{replaceUrl: true})
  }

  logout() {
    this.authService.logout();
    this.checkAuthentication();
    window.location.reload();
  }
}
