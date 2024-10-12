import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Asegúrate de importar Router
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  userProfile: any = null;
  correo: string = '';
  correoLogueado: string | null = '';  // Variable para almacenar el correo del usuario logueado

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router // Inyecta Router
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.correo = params.get('correo') || '';
      this.correoLogueado = this.authService.getUserEmail(); // Obtener el correo del usuario logueado
      if (this.correo) {
        this.authService.getUserProfile(this.correo).subscribe(
          (data) => {
            this.userProfile = data;
          },
          (error) => {
            console.error('Error al obtener los datos del perfil:', error);
          }
        );
      }
    });
  }

  // Método para comparar si el usuario actual está viendo su propio perfil
  esMiPerfil(): boolean {
    return this.correo === this.correoLogueado; // Verificar si el correo actual es igual al del usuario logueado
  }

  // Método para manejar el clic en el botón de editar perfil
  editarPerfil(): void {
    if (this.esMiPerfil()) { // Verifica que sea su propio perfil
      this.router.navigate(['/update-perfil', this.correo]); // Navega a la ruta de edición
    }
  }
}
