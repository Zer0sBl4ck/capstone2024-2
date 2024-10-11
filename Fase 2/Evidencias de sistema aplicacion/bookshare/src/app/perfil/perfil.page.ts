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

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.correo = params.get('correo') || '';
      if (this.correo) {
        this.authService.getUserProfile(this.correo).subscribe(
          (data) => {
            this.userProfile = data;
            console.log('Datos del perfil:', this.userProfile);
            console.log('Foto de perfil base64:', this.userProfile.foto_perfil_base64);
          },
          (error) => {
            console.error('Error al obtener los datos del perfil:', error);
          }
        );
      }
    });
  }
}