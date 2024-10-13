import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; 
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  userProfile: any = null;
  correo: string = '';
  correoLogueado: string | null = '';  

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router 
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.correo = params.get('correo') || '';
      this.correoLogueado = this.authService.getUserEmail(); 
      if (this.correo) {
        this.authService.getUserProfile(this.correo).subscribe(
          (data) => {
            this.userProfile = data;
          },
          (error) => {
            console.error('Error al obtener los datos del perfil:', error);
          }
        );
      }
    });
  }

  
  esMiPerfil(): boolean {
    return this.correo === this.correoLogueado; 
  }

  
  editarPerfil(): void {
    if (this.esMiPerfil()) { 
      this.router.navigate(['/update-perfil', this.correo]); 
    }
  }
}
