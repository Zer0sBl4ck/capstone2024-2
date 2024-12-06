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
  reviews: any[] = [];
  displayedReviews: any[] = []; // Propiedad para almacenar las reseñas mostradas
  showMore: boolean = false; 
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
            this.establecerEstrellas(); // Asegúrate de establecer las estrellas después de obtener el promedio
          },
          (error) => {
            console.error('Error al obtener el promedio de calificación:', error);
          }
        );
  
        // Obtener las reseñas del usuario
        this.obtenerResenasUsuario(); // Asegúrate de llamar a esta función
      }
    });
  }
  obtenerResenasUsuario() {
    console.log('Llamando al servicio para obtener reseñas del usuario'); // Log adicional para verificar la llamada al servicio
    this.authService.obtenerResenasUsuario(this.correo).subscribe(
      (response) => {
        console.log('Reseñas del usuario recibidas:', response); // Log para verificar las reseñas recibidas
        this.reviews = response.map((resena: any) => ({
          id_resena: resena.id_resena,
          isbn: resena.isbn,
          calificacion: resena.calificacion,
          comentario: resena.comentario,
          creado_en: resena.creado_en,
          nombreUsuario: resena.nombreUsuario,
          imagenUsuario: resena.imagenUsuario ? 'data:image/jpeg;base64,' + resena.imagenUsuario : 'assets/imagenes/default-avatar.png',
          titulo: resena.titulo,
          autor: resena.autor,
        }));
        this.displayedReviews = this.reviews.slice(0, 4); // Mostrar solo las primeras 4 reseñas inicialmente
      },
      (error) => {
        console.error('Error al obtener las reseñas del usuario:', error);
      }
    );
  }

  toggleShowMore() {
    this.showMore = !this.showMore;
    if (this.showMore) {
      this.displayedReviews = this.reviews; // Mostrar todas las reseñas
    } else {
      this.displayedReviews = this.reviews.slice(0, 4); // Mostrar solo las primeras 4 reseñas
    }
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
