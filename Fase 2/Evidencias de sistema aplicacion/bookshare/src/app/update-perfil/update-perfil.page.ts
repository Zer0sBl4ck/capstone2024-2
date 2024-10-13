import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router'; 

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
  fotoSeleccionada: string | ArrayBuffer | null = ''; 

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router 
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
        this.fotoSeleccionada = data.foto_perfil; 
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
        this.fotoSeleccionada = e.target?.result as string || ''; 
        this.usuarioData.foto_perfil = (this.fotoSeleccionada as string).split(',')[1]; 
      };
      reader.readAsDataURL(file); 
    }
  }

  guardarCambios() {
    this.authService.updateUserProfile(this.correo, this.usuarioData).subscribe(
      response => {
        console.log('Perfil actualizado:', response);
        this.volverAlPerfil() 
      },
      error => {
        console.error('Error al actualizar el perfil:', error);
      }
    );
  }

  
  volverAlPerfil() {
    const correoLogueado = this.authService.getUserEmail(); 
    if (correoLogueado) {
      this.router.navigate(['/perfil', correoLogueado]); 
    }
  }
}
