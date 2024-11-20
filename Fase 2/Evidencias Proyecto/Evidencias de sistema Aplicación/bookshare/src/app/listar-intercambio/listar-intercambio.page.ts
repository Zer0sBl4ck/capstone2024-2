import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router'; 
import { RefresherEventDetail, IonRefresher } from '@ionic/angular';

@Component({
  selector: 'app-listar-intercambio',
  templateUrl: './listar-intercambio.page.html',
  styleUrls: ['./listar-intercambio.page.scss'],
})
export class ListarIntercambioPage implements OnInit {
  intercambiosComoSolicitante: any[] = []; // Almacenará los intercambios donde el usuario es solicitante
  intercambiosComoPrestamista: any[] = []; // Almacenará los intercambios donde el usuario es prestamista
  idUsuarioLogeado: number | undefined; // ID del usuario logueado
  segmentoSeleccionado: string = 'solicitante'; // Controla el segmento seleccionado

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.idUsuarioLogeado = this.authService.getUserData()?.id_usuario;
    if (this.idUsuarioLogeado) {
      this.cargarIntercambiosComoSolicitante();
      this.cargarIntercambiosComoPrestamista();
    } else {
      console.error('No se pudo obtener el ID del usuario logueado.');
    }
  }

  // Carga los intercambios como solicitante
  cargarIntercambiosComoSolicitante(): void {
    this.authService.obtenerIntercambiosSolicitante(this.idUsuarioLogeado!).subscribe(
      (response) => {
        this.intercambiosComoSolicitante = response;
        console.log('Intercambios como solicitante:', this.intercambiosComoSolicitante);
      },
      (error) => {
        console.error('Error al cargar intercambios como solicitante:', error);
      }
    );
  }

  // Carga los intercambios como prestamista
  cargarIntercambiosComoPrestamista(): void {
    this.authService.obtenerIntercambiosPrestamista(this.idUsuarioLogeado!).subscribe(
      (response) => {
        this.intercambiosComoPrestamista = response;
        console.log('Intercambios como prestamista:', this.intercambiosComoPrestamista);
      },
      (error) => {
        console.error('Error al cargar intercambios como prestamista:', error);
      }
    );
  }

  // Cambia el segmento seleccionado
  cambiarSegmento(event: any): void {
    this.segmentoSeleccionado = event.detail.value;
    console.log('Segmento seleccionado:', this.segmentoSeleccionado);
  }

  // Navega a la página de intercambio de un usuario
  irAIntercambioUsuario(idSolicitante: number, id_intercambio: number): void {
    console.log(idSolicitante);
    this.router.navigate(['/listar-intercambio-usuario', idSolicitante, id_intercambio]);
  }

  // Refresca los datos
  refreshData(event: CustomEvent<RefresherEventDetail>) {
    console.log('Refrescando...');
    window.location.reload();

    // Simula un delay para el refresco
    setTimeout(() => {
      const refresher = event.target;

      if (refresher instanceof IonRefresher) {
        refresher.complete();  // Indica que el refresco se completó
      }
    }, 2000);
  }
}
