import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update-perfil',
  templateUrl: './update-perfil.page.html',
  styleUrls: ['./update-perfil.page.scss'],
})
export class UpdatePerfilPage implements OnInit {
  usuarioData = {
    nombre_usuario: '',
    telefono: '',
    ubicacion: '',
    foto_perfil: ''
  };

  correo: string = '';
  fotoSeleccionada: string | ArrayBuffer | null = ''; // Para la previsualización de la imagen

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.correo = params.get('correo') || '';
      this.obtenerPerfil();
    });
  }

  obtenerPerfil() {
    this.authService.getUserProfile(this.correo).subscribe(
      data => {
        this.usuarioData = data;
        this.fotoSeleccionada = data.foto_perfil; // Cargar la imagen existente
      },
      error => {
        console.error('Error al obtener el perfil:', error);
      }
    );
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // Usamos un tipo de aserción para indicar que e.target.result no será undefined aquí
        this.fotoSeleccionada = e.target?.result as string || ''; // Previsualiza la imagen
        this.usuarioData.foto_perfil = (this.fotoSeleccionada as string).split(',')[1]; // Guarda solo la parte base64
      };
      reader.readAsDataURL(file); // Lee el archivo como Data URL
    }
  }

  guardarCambios() {
    this.authService.updateUserProfile(this.correo, this.usuarioData).subscribe(
      response => {
        console.log('Perfil actualizado:', response);
      },
      error => {
        console.error('Error al actualizar el perfil:', error);
      }
    );
  }
}
