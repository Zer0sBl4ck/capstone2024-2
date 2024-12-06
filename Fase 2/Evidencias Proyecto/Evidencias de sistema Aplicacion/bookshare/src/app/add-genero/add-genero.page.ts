import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';  // Importamos ToastController

@Component({
  selector: 'app-add-genero',
  templateUrl: './add-genero.page.html',
  styleUrls: ['./add-genero.page.scss'],
})
export class AddGeneroPage implements OnInit {
  nuevoGenero: string = ''; // Variable para almacenar el nuevo género

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController // Inyectamos ToastController
  ) {}

  ngOnInit() {}

  async onSubmit() {
    if (this.nuevoGenero.trim() === '') {
      console.error('El género no puede estar vacío');
      return;
    }

    // Llamar al servicio para agregar el género
    this.authService.agregarGenero(this.nuevoGenero).subscribe(
      async (response) => {
        console.log('Género agregado:', response);
        // Mostrar la alerta de éxito usando ion-toast
        const toast = await this.toastController.create({
          message: 'Género agregado exitosamente',
          duration: 2000,
          color: 'success',
        });
        toast.present();
        this.nuevoGenero = ''; // Limpiar el campo después de agregar
        this.router.navigate(['/']); // Redirigir al inicio u otra página
      },
      (error) => {
        console.error('Error al agregar género:', error);
        // Mostrar alerta de error
        this.showErrorToast();
      }
    );
  }

  // Método para mostrar un toast de error
  async showErrorToast() {
    const toast = await this.toastController.create({
      message: 'Hubo un error al agregar el género',
      duration: 2000,
      color: 'danger',
    });
    toast.present();
  }
}
