import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';  
import { ToastController } from '@ionic/angular'; // Importar ToastController
import { RefresherEventDetail, IonRefresher } from '@ionic/angular';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  nombre_usuario: string = '';
  correo: string = '';
  contrasena: string = '';
  telefono: string = '';
  ubicacion: string = '';
  foto_perfil: string | null = null;
  errorMessage: string = '';  

  constructor(
    private authService: AuthService, 
    private router: Router,
    private toastController: ToastController // Inyectar ToastController
  ) {}

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.foto_perfil = reader.result as string;  
      };
      reader.readAsDataURL(file);
    }
  }

  async register() { // Marcar como async
    this.authService.register(
      this.nombre_usuario,
      this.correo,
      this.contrasena,
      this.telefono,
      this.ubicacion,
      this.foto_perfil
    ).subscribe(
      async response => { // Cambiar a async
        console.log('Registro exitoso', response);
        this.errorMessage = '';  
        await this.showToast('Registro exitoso.'); // Mostrar el toast
        this.router.navigate(['/login']);  
      },
      async error => { // Cambiar a async
        console.error('Error al registrar usuario', error);
        this.errorMessage = 'Las credenciales son incorrectas o ya están registradas.';  
        await this.showToast(this.errorMessage); // Mostrar el toast de error
      }
    );
  }

  // Método para mostrar el toast
  async showToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000, // Duración en milisegundos
      position: 'bottom', // Posición del toast
    });
    await toast.present();
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
