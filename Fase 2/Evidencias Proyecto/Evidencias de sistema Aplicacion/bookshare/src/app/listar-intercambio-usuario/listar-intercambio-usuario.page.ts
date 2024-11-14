import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RefresherEventDetail, IonRefresher } from '@ionic/angular';

@Component({
  selector: 'app-listar-intercambio-usuario',
  templateUrl: './listar-intercambio-usuario.page.html',
  styleUrls: ['./listar-intercambio-usuario.page.scss'],
})
export class ListarIntercambioUsuarioPage implements OnInit {

  idUsuarioPropietario: string | null = null;
  idIntercambio: string | null = null;
  librosDisponiblesIntercambio: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.idUsuarioPropietario = this.route.snapshot.paramMap.get('id_usuario');
    this.idIntercambio = this.route.snapshot.paramMap.get('id_intercambio');

    if (this.idUsuarioPropietario) {
      this.cargarLibrosDisponiblesIntercambio();
    }
  }

  cargarLibrosDisponiblesIntercambio(): void {
    const idUsuarioNumber = Number(this.idUsuarioPropietario);

    if (!isNaN(idUsuarioNumber)) {
      this.authService.obtenerLibrosDisponiblesIntercambio(idUsuarioNumber).subscribe(
        (response) => {
          this.librosDisponiblesIntercambio = response;
          console.log('Libros disponibles para intercambio:', this.librosDisponiblesIntercambio);
        },
        (error) => {
          console.error('Error al cargar libros para intercambio:', error);
        }
      );
    } else {
      console.error('ID de usuario propietario no válido:', this.idUsuarioPropietario);
    }
  }

  actualizarIntercambio(idBiblioteca: number): void {
    if (this.idIntercambio) {
      const idIntercambioNumber = Number(this.idIntercambio);

      this.authService.actualizarBibliotecaPrestamista(idIntercambioNumber, idBiblioteca).subscribe(
        (response) => {
          console.log('Intercambio actualizado correctamente:', response);
        },
        (error) => {
          console.error('Error al actualizar el intercambio:', error);
        }
      );
    } else {
      console.error('ID de intercambio no válido:', this.idIntercambio);
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
