import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { RefresherEventDetail, IonRefresher } from '@ionic/angular';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  chats: any[] = []; // Lista de chats de préstamo
  chatsIntercambio: any[] = []; // Lista de chats de intercambio
  errorMessage: string | null = null;
  correoUsuario: string | null = null;
  selectedSegment: string = 'prestamo'; // Segmento seleccionado por defecto

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.correoUsuario = this.authService.getUserEmail();

    if (this.correoUsuario) {
      // Carga los chats de préstamo e intercambio
      this.listarChats(this.correoUsuario); 
      this.listarChatsIntercambio(this.correoUsuario);
    } else {
      this.errorMessage = 'No se encontró el correo del usuario logeado.';
    }
  }

  // Cambia el segmento seleccionado
  segmentChanged(event: any) {
    console.log('Segmento seleccionado:', this.selectedSegment);
  }

  // Listar chats de préstamo
  listarChats(correoUsuario: string): void {
    this.authService.listarChats(correoUsuario).subscribe(
      (response) => {
        // Ordenar los chats por id_chat de mayor a menor
        this.chats = response.chats.sort((a: any, b: any) => b.id_chat - a.id_chat);
      },
      (error) => {
        console.error('Error al listar los chats de préstamo:', error);
      }
    );
  }

  // Listar chats de intercambio
  listarChatsIntercambio(correoUsuario: string): void {
    this.authService.listarChatsIntercambio(correoUsuario).subscribe(
      (response) => {
        // Ordenar los chats por id_chat de mayor a menor
        this.chatsIntercambio = response.chats.sort((a: any, b: any) => b.id_chat - a.id_chat);
      },
      (error) => {
        console.error('Error al listar los chats de intercambio:', error);
      }
    );
  }

  // Eliminar un chat de préstamo
  eliminarChat(chatId: number): void {
    this.authService.eliminarChat(chatId).subscribe(
      () => {
        // Eliminar de la lista de chats de préstamo
        this.chats = this.chats.filter(chat => chat.id_chat !== chatId);
        console.log('Chat eliminado');
      },
      (error) => {
        console.error('Error al eliminar el chat:', error);
      }
    );
  }

  // Eliminar un chat de intercambio
  eliminarChatIntercambio(idChat: string): void {
    this.authService.eliminarChatIntercambio(idChat).subscribe(
      () => {
        // Eliminar de la lista de chats de intercambio
        this.chatsIntercambio = this.chatsIntercambio.filter(chat => chat.id_chat !== idChat);
        console.log('Chat de intercambio eliminado con éxito:', idChat);
      },
      (error) => {
        console.error('Error al eliminar el chat de intercambio:', error);
      }
    );
  }

  // Navegar al chat seleccionado
  irAlChat(idChat: number) {
    this.router.navigate([`/chat-contacto/${idChat}`]);
  }

  // Refrescar datos de la página
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
