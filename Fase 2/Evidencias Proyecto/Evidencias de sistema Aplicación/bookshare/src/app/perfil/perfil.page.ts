import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; 
import { AuthService } from '../services/auth.service';
import { RefresherEventDetail, IonRefresher } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  userProfile: any = null;
  correo: string = '';
  correoLogueado: string | null = '';  
  promedioCalificacion: number | null = null;
  estrellas: string[] = []; // Para almacenar el estado de las estrellas

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router 
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.correo = params.get('correo') || '';
      this.correoLogueado = this.authService.getUserEmail(); 
      if (this.correo) {
        // Obtener el perfil del usuario
        this.authService.getUserProfile(this.correo).subscribe(
          (data) => {
            this.userProfile = data;
          },
          (error) => {
            console.error('Error al obtener los datos del perfil:', error);
          }
        );

        // Obtener el promedio de calificación del usuario
        this.authService.obtenerPromedioCalificacion(this.correo).subscribe(
          (data) => {
            this.promedioCalificacion = data.promedio_calificacion;
            this.establecerEstrellas(); // Actualizar las estrellas
          },
          (error) => {
            console.error('Error al obtener el promedio de calificación:', error);
            this.promedioCalificacion = null;
          }
        );
      }
    });
  }

  // Establecer las estrellas según el promedio
  establecerEstrellas() {
    const calificacion = this.promedioCalificacion || 0;
    this.estrellas = [];
    
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(calificacion)) {
        this.estrellas.push('filled');  // Estrella llena
      } else if (i === Math.ceil(calificacion) && calificacion % 1 !== 0) {
        this.estrellas.push('half');  // Estrella media
      } else {
        this.estrellas.push('empty');  // Estrella vacía
      }
    }
  }

  esMiPerfil(): boolean {
    return this.correo === this.correoLogueado; 
  }

  editarPerfil(): void {
    if (this.esMiPerfil()) { 
      this.router.navigate(['/update-perfil', this.correo]); 
    }
  }

  refreshData(event: CustomEvent<RefresherEventDetail>) {
    console.log('Refrescando...');
    window.location.reload();
    setTimeout(() => {
      const refresher = event.target;
      if (refresher instanceof IonRefresher) {
        refresher.complete();
      }
    }, 2000);
  }
}
