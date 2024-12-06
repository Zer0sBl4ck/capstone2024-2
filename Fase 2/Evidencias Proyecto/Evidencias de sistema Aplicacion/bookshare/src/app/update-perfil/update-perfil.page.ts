import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router'; 
import { ToastController } from '@ionic/angular'; // Importa ToastController
import { RefresherEventDetail, IonRefresher } from '@ionic/angular';

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
    private router: Router,
    private toastController: ToastController 
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

  async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000, 
      position: 'bottom', 
      color: 'success', 
    });

    await toast.present();
  }

  guardarCambios() {
    this.authService.updateUserProfile(this.correo, this.usuarioData).subscribe(
      response => {
        console.log('Perfil actualizado:', response);
        this.mostrarToast('Tu perfil ha sido actualizado con éxito.'); 
        this.volverAlPerfil(); 
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
  refreshData(event: CustomEvent<RefresherEventDetail>) {
    // Aquí va la lógica para actualizar los datos
    console.log('Refrescando...');
    window.location.reload();
    // Simula un delay para el refresco
    setTimeout(() => {
      // Verificar si event.target es un IonRefresher
      const refresher = event.target;

      if (refresher instanceof IonRefresher) {
        refresher.complete();  // Indica que el refresco se completó
      }
    }, 2000);
  }
}
