import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-listar-intercambio-usuario',
  templateUrl: './listar-intercambio-usuario.page.html',
  styleUrls: ['./listar-intercambio-usuario.page.scss'],
})
export class ListarIntercambioUsuarioPage implements OnInit {

  idUsuarioPropietario: string | null = null; // ID del usuario propietario de los libros
  librosDisponiblesIntercambio: any[] = []; // Lista de libros disponibles para intercambio

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit() {
    // Obtener el id_usuario de la URL
    this.idUsuarioPropietario = this.route.snapshot.paramMap.get('id_usuario');
    
    if (this.idUsuarioPropietario) {
      this.cargarLibrosDisponiblesIntercambio();
    }
  }

  cargarLibrosDisponiblesIntercambio(): void {
    // Convertir el idUsuarioPropietario a un número antes de llamar al servicio
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
}
