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
  private refreshInterval: any;
  

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.idUsuarioLogeado = this.authService.getUserData()?.id_usuario;
    if (this.idUsuarioLogeado) {
      this.cargarIntercambiosComoSolicitante();
      this.cargarIntercambiosComoPrestamista();
    } else {
      console.error('No se pudo obtener el ID del usuario logueado.');
    }
    this.cargarIntercambiosComoPrestamista();
    this.cargarIntercambiosComoSolicitante();
    this.refreshInterval = setInterval(() => {
      this.cargarIntercambiosComoPrestamista();
      this.cargarIntercambiosComoSolicitante();

    },2000);

  }

  

// Carga los intercambios como solicitante
cargarIntercambiosComoSolicitante(): void {
  this.authService.obtenerIntercambiosSolicitante(this.idUsuarioLogeado!).subscribe(
    (response) => {
      // Ordenar los intercambios como solicitante por id de mayor a menor (más reciente primero)
      this.intercambiosComoSolicitante = response.sort((a: any, b: any) => b.id - a.id);
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
      // Ordenar los intercambios como prestamista por id de mayor a menor (más reciente primero)
      this.intercambiosComoPrestamista = response.sort((a: any, b: any) => b.id - a.id);
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
  actualizarEstadoIntercambio(idIntercambio: string, estado: string): void {
    if (idIntercambio) {
      const idIntercambioNumber = Number(idIntercambio); // Convertir a número si es necesario
  
      this.authService.actualizarEstadoIntercambio(idIntercambioNumber, estado).subscribe(
        (response) => {
          console.log('Estado del intercambio actualizado a "' + estado + '":', response);
        },
        (error) => {
          console.error('Error al actualizar el estado del intercambio:', error);
        }
      );
    } else {
      console.error('ID de intercambio no válido:', idIntercambio);
    }
  }
  crearChatDeIntercambio(idIntercambio: string): void {
    console.log("hola");
    if (idIntercambio) {
      this.authService.crearChatIntercambio(idIntercambio).subscribe(
        (response) => {
          console.log('Chat de intercambio creado con éxito:', response);
        },
        (error) => {
          console.error('Error al crear el chat de intercambio:', error);
        }
      );
    } else {
      console.error('ID de intercambio no válido:', idIntercambio);
    }
  }
  obtenerChat(id_estado: number): void {
    this.authService.obtenerIdCha(id_estado).subscribe({
      next: (response) => {
        this.router.navigate(['/chat-contacto', response.id_chat]);
        console.log('ID del Chat:', response.id_chat);
      },
      error: (err) => {
        console.error('Error al obtener el chat:', err);
      }
    });
  }
  reportarUsuario(usuarioReportado: number, usuarioReportante: number): void {
    this.authService.reportarUsuario(usuarioReportado, usuarioReportante).subscribe(
      (response) => {
        console.log('Usuario reportado correctamente:', response);
        const reportes = response.reportes;
        alert(`Usuario reportado correctamente. El usuario reportado lleva ${reportes} reportes.`);
        // Puedes mostrar un mensaje de éxito o actualizar el UI aquí
      },
      (error) => {
        console.error('Error al reportar usuario:', error);
      }
    );
  }
}