import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  userProfile: any = null;
  correo: string = '';
  correoLogueado: string | null = '';  // Variable para almacenar el correo del usuario logueado

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.correo = params.get('correo') || '';
      this.correoLogueado = this.authService.getUserData()?.correo || null;  // Obtener el correo del usuario logueado
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

  // Método para comparar si el usuario actual está viendo su propio perfil
  esMiPerfil(): boolean {
    return this.correo === this.correoLogueado;
  }
}
