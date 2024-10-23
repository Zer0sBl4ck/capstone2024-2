import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  isLoggedIn = false;  
  userRole: string | null = null;  
  userEmail: string | null = null;  

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

  goToProfile() {
    if (this.userEmail) {
      this.router.navigate(['/perfil', this.userEmail],{ replaceUrl: true }); 
    }
  }

  goAddBook(){
    this.router.navigate(['/addbook'],{replaceUrl:true})
  }
  goAddBookuser(){
    this.router.navigate(['/addbook-user'],{replaceUrl:true})
  }
  solicitudesadd(){
    this.router.navigate(['/listar-libro-solicitud'],{replaceUrl:true})
  }

  gosoliuser(){
    this.router.navigate(['/solicitud-user'],{replaceUrl:true})
  }
  

  goBookOwner(){
    this.router.navigate(['/bookowner',this.userEmail],{replaceUrl: true})
  }

  gochat(){
    this.router.navigate(['/chat'],{replaceUrl: true})
  }

  logout() {
    this.authService.logout();
    this.checkAuthentication();
    window.location.reload();
  }
}