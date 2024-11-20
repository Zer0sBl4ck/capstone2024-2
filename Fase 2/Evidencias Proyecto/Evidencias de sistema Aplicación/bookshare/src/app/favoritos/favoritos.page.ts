import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';
import { RefresherEventDetail, IonRefresher } from '@ionic/angular';
interface LibroFavorito {
  isbn: string;
  titulo: string;
  autor: string;
  imagen:string
}

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage implements OnInit {
  favoritos: LibroFavorito[] = [];
  correoUsuario: string = '';

  constructor(
    private authService: AuthService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.correoUsuario = this.authService.getUserData()?.correo || '';
    this.cargarFavoritos();
  }

  cargarFavoritos() {
    if (this.correoUsuario) {
      this.authService.getLibrosFavoritos(this.correoUsuario).subscribe(
        (data) => {
          this.favoritos = data;
          console.log(data)
        },
        (error) => {
          console.error('Error al cargar favoritos:', error);
        }
      );
    }
  }

  async eliminarFavorito(isbn: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar este libro de tus favoritos?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.authService.eliminarFavorito(this.correoUsuario, isbn).subscribe(
              () => {
                // Actualiza la lista de favoritos después de la eliminación
                this.favoritos = this.favoritos.filter(libro => libro.isbn !== isbn);
              },
              (error) => {
                console.error('Error al eliminar favorito:', error);
              }
            );
          },
        },
      ],
    });
    await alert.present();
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
