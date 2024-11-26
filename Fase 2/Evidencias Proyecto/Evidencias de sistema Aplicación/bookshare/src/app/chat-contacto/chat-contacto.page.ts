import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service'; 
import { Router, ActivatedRoute } from '@angular/router'; 
  
import { RefresherEventDetail, IonRefresher } from '@ionic/angular';

@Component({
  selector: 'app-chat-contacto',
  templateUrl: './chat-contacto.page.html',
  styleUrls: ['./chat-contacto.page.scss'],
})
export class ChatContactoPage implements OnInit, OnDestroy {
  idChat!: number; // Usar non-null assertion
  mensajes: any[] = [];
  nuevoMensaje: string = '';
  idUsuarioActual!: number; // Usar non-null assertion
  emailUsuarioActual: string | null = null; // Cambiar la declaración aquí
  nombreOtroUsuario: string | null = null; // Agregar variable para almacenar el nombre del otro usuario
  private intervalId: any; // Variable para almacenar el ID del intervalo

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    // Obtener el idChat de los parámetros de la ruta
    this.route.params.subscribe(params => {
      this.idChat = params['id_chat']; // Asegúrate de convertir el idChat a número
      this.idUsuarioActual = this.authService.getUserData().id_usuario; // Asegúrate de tener el ID del usuario
      this.emailUsuarioActual = this.authService.getUserEmail(); // Obtener el email del usuario logueado
      
      this.listarMensajes(); // Obtener los mensajes
  
      // Llamar a listarMensajes cada 2 segundos
      this.intervalId = setInterval(() => {
        this.listarMensajes();
      }, 2000);
    });
  }
  
  listarMensajes() {
    this.authService.listarMensajes(this.idChat).subscribe(
      (data) => {
        console.log('Datos recibidos:', data); // Verifica los datos recibidos
        this.mensajes = Array.isArray(data.mensajes) ? data.mensajes : []; // Asigna el array de mensajes
  
        // Al obtener los mensajes, intenta obtener el nombre del otro usuario
        this.nombreOtroUsuario = this.obtenerNombreOtroUsuario();
      },
      (error) => {
        console.error('Error al listar los mensajes:', error);
      }
    );
  }
  
  // Función para obtener el nombre del otro usuario en el chat
  obtenerNombreOtroUsuario(): string | null {
    // Verifica si los mensajes están disponibles
    if (this.mensajes.length > 0 && this.emailUsuarioActual) {
      // Buscar el primer mensaje cuyo correo no sea el del usuario actual
      const otroUsuario = this.mensajes.find(mensaje => mensaje.correo_remitente !== this.emailUsuarioActual);
      
      // Si encontramos un mensaje de otro usuario, obtenemos su nombre
      if (otroUsuario) {
        return otroUsuario.nombre_usuario || 'Chats'; // Devuelve el nombre o un valor por defecto
      }
    }
    
    return 'Chats'; // Si no se encuentra el otro usuario
  }
  
  
  
  salirChat() {
    console.log('Saliendo del chat');
    this.router.navigate(['/otra-pagina']); // Cambia 'otra-pagina' por la ruta deseada
  }



  enviarMensaje() {
    if (this.nuevoMensaje.trim()) {
      this.authService.insertarMensaje(this.idChat, this.idUsuarioActual, this.nuevoMensaje).subscribe(
        () => {
          this.nuevoMensaje = ''; // Limpiar el campo de mensaje después de enviar
          this.listarMensajes(); // Actualizar la lista de mensajes
        },
        (error) => {
          console.error('Error al enviar el mensaje:', error);
        }
      );
    }
  }

  // Función para verificar si el mensaje es del usuario actual
  esMensajeDelUsuario(mensaje: any): boolean {
    return mensaje.correo_remitente === this.emailUsuarioActual;
  }

  ngOnDestroy() {
    clearInterval(this.intervalId); // Limpiar el intervalo al salir
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

  retroceder() {
    window.history.back();
  }
}
