import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IonicSlides } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { VistaLibroPage } from '../vista-libro/vista-libro.page'; // Importa el componente
import { RefresherEventDetail, IonRefresher } from '@ionic/angular';


interface Book {
  isbn: string;
  titulo: string;
  autor: string;
  descripcion: string;
  genero: string;
  imagen_libro: string;
  selectedRating: number; // Almacena la calificación seleccionada para cada libro
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  isLoggedIn = false;  
  userRole: string | null = null;  
  userEmail: string | null = null;  
  userName: string | null = null;
  stars: number[] = Array(5).fill(0);
  swiperModules = [IonicSlides];
  books: Book[] = []; 
  userProfile: any = null;
  correo: string = '';
  correoLogueado: string | null = '';  
  profileImage: string | null = null;
  resenas: any[] = [];
  notificacionesNoLeidas: number = 0;
  private intervalId: any;

  constructor(private authService: AuthService, private router: Router, private popoverController: PopoverController, private route: ActivatedRoute,) {}

  ionViewWillEnter() {
    this.checkAuthentication();
    this.getLibros();
  }

  checkAuthentication() {
    const token = this.authService.getToken();
    this.isLoggedIn = !!token;

    if (this.isLoggedIn) {
      this.userRole = this.authService.getUserRole(); 
      this.userEmail = this.authService.getUserEmail(); 
      this.userName = this.authService.getUserName();
    } 
  }
  ngOnInit() {
    const correo = this.authService.getUserEmail();  // Obtener el correo del usuario logueado
    if (correo) {
      this.authService.getUserProfile(correo).subscribe(
        (data) => {
          this.userProfile = data;  // Asignar la respuesta a userProfile
          if (this.userProfile && this.userProfile.foto_perfil_base64) {
            this.profileImage = 'data:image/jpeg;base64,' + this.userProfile.foto_perfil_base64;  // Asignar la imagen
          }
        },
        (error) => {
          console.error('Error al obtener los datos del perfil:', error);
        }
      );
      this.cargarNotificacionesNoLeidas();
      // Realizar polling cada 30 segundos
      this.intervalId = setInterval(() => {
        this.cargarNotificacionesNoLeidas();
      }, 5000); // 30000ms = 30 segundos
    }
  

    this.getLibros(); // Cargar libros al inicializar la página
    this.obtenerResenas();
  }

  getLibros() {
    this.authService.getLibros().subscribe(
      (response) => {
        console.log('Libros recibidos:', response); // Verifica la respuesta
        this.books = response.map((libro: any) => ({
          isbn: libro.isbn,
          titulo: libro.titulo,
          autor: libro.autor,
          descripcion: libro.descripcion,
          imagen_libro: libro.imagen_libro_base64 ? 'data:image/jpeg;base64,' + libro.imagen_libro_base64 : 'assets/imagenes/default.png', // Usa imagen_libro_base64 aquí
          selectedRating: 0, // Calificación inicial
        }));
      },
      (error) => {
        console.error('Error al cargar los libros:', error);
      }
    );
  }
  obtenerResenas() {
    console.log('Llamando al servicio para obtener reseñas'); // Log adicional para verificar la llamada al servicio
    this.authService.obtenerResenas().subscribe(
      (response) => {
        console.log('Reseñas recibidas:', response); // Log para verificar las reseñas recibidas
        this.resenas = response.map((resena: any) => ({
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
      },
      (error) => {
        console.error('Error al obtener las reseñas:', error);
      }
    );
  
  }
  async goToBookDetail(isbn: string) {
    const popover = await this.popoverController.create({
      component: VistaLibroPage,
      componentProps: { isbn: isbn }, // Pasa el ISBN al popover
      cssClass: 'custom-popover',
      translucent: true,
    });
    return await popover.present();
  }

  rateBook(bookIndex: number, rating: number) {
    this.books[bookIndex].selectedRating = rating; // Actualiza la calificación seleccionada del libro
    console.log(`Calificación seleccionada para ${this.books[bookIndex].titulo}: ${rating}`);
    // Aquí puedes agregar lógica adicional, como guardar la calificación en una base de datos
  }

  goToProfile() {
    if (this.userEmail) {
      this.router.navigate(['/perfil', this.userEmail], { replaceUrl: true }); 
    }
  }

  goAddBook() {
    this.router.navigate(['/addbook'], { replaceUrl: true });
  }

  goAddBookuser() {
    this.router.navigate(['/addbook-user'], { replaceUrl: true });
  }

  solicitudesadd() {
    this.router.navigate(['/listar-libro-solicitud'], { replaceUrl: true });
  }

  gosoliuser() {
    this.router.navigate(['/solicitud-user'], { replaceUrl: true });
  }

  goBookOwner() {
    this.router.navigate(['/bookowner', this.userEmail], { replaceUrl: true });
  }

  gochat() {
    this.router.navigate(['/tabs/chat'], { replaceUrl: true });
  }
  goIntercambio() {
    this.router.navigate(['/listar-intercambio'], { replaceUrl: true });
  }
  

  logout() {
    this.authService.logout();
    this.checkAuthentication();
    window.location.reload();
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
  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);  // Limpiar el intervalo cuando el componente se destruye
    }
  }
  cargarNotificacionesNoLeidas(): void {
    const correo = this.authService.getUserEmail();  // Obtener el correo del usuario actual
    if (correo) {
      this.authService.obtenerNotificaciones(correo).subscribe(
        (notificaciones: any[]) => {
          // Contar las notificaciones no leídas
          this.notificacionesNoLeidas = notificaciones.filter(notificacion => !notificacion.visto).length;
        },
        (error) => {
          console.error('Error al obtener notificaciones:', error);
        }
      );
    } else {
      console.warn('No se pudo obtener el correo del usuario');
    }
  }
  
}

