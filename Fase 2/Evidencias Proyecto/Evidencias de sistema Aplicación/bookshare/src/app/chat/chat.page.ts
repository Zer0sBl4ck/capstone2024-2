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
  chats: any[] = [];
  chatsIntercambio: any[] = [];
  errorMessage: string | null = null;
  correoUsuario: string | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.correoUsuario = this.authService.getUserEmail();

    if (this.correoUsuario) {
      this.listarChats(this.correoUsuario);           // Para los chats de préstamo
      this.listarChatsIntercambio(this.correoUsuario); // Para los chats de intercambio
    } else {
      this.errorMessage = 'No se encontró el correo del usuario logeado.';
    }
  }

  listarChats(correoUsuario: string): void {
    this.authService.listarChats(correoUsuario).subscribe(
      (response) => {
        // Ordenar los chats por id_chat de mayor a menor (más reciente primero)
        this.chats = response.chats.sort((a: any, b: any) => b.id_chat - a.id_chat);
      },
      (error) => {
        console.error('Error al listar los chats de préstamo:', error);
        this.errorMessage = 'Error al listar los chats. Inténtalo de nuevo más tarde.';
      }
    );
  }

  listarChatsIntercambio(correoUsuario: string): void {
    this.authService.listarChatsIntercambio(correoUsuario).subscribe(
      (response) => {
        // Ordenar los chats de intercambio por id_chat de mayor a menor (más reciente primero)
        this.chatsIntercambio = response.chats.sort((a: any, b: any) => b.id_chat - a.id_chat);
      },
      (error) => {
        console.error('Error al listar los chats de intercambio:', error);
        this.errorMessage = 'Error al listar los chats de intercambio. Inténtalo de nuevo más tarde.';
      }
    );
  }


    // Método para eliminar un chat
  eliminarChat(chatId: number): void {
    // Llamada a tu servicio para eliminar el chat
    this.authService.eliminarChat(chatId).subscribe(
      () => {
        // Si el chat se elimina correctamente, se elimina de la lista
        this.chats = this.chats.filter(chat => chat.id_chat !== chatId);
        console.log('Chat eliminado');
      },
      (error) => {
        console.error('Error al eliminar el chat:', error);
      }
    );
  }

  

  irAlChat(idChat: number) {
    this.router.navigate([`/chat-contacto/${idChat}`]);
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
