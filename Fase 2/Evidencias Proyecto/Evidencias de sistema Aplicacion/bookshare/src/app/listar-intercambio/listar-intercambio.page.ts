import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-listar-intercambio',
  templateUrl: './listar-intercambio.page.html',
  styleUrls: ['./listar-intercambio.page.scss'],
})
export class ListarIntercambioPage implements OnInit {
  intercambiosComoSolicitante: any[] = []; // Almacenará los intercambios donde el usuario es solicitante
  intercambiosComoPrestamista: any[] = []; // Almacenará los intercambios donde el usuario es prestamista
  idUsuarioLogeado: number | undefined; // ID del usuario logueado

  constructor(private authService: AuthService,private router: Router ) { }

  ngOnInit() {
    this.idUsuarioLogeado = this.authService.getUserData()?.id_usuario;
    if (this.idUsuarioLogeado) {
      this.cargarIntercambiosComoSolicitante();
      this.cargarIntercambiosComoPrestamista();
    } else {
      console.error('No se pudo obtener el ID del usuario logueado.');
    }
  }

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
  irAIntercambioUsuario(idSolicitante: number): void {
    console.log(idSolicitante)
    this.router.navigate(['/listar-intercambio-usuario', idSolicitante]);
  }
}
