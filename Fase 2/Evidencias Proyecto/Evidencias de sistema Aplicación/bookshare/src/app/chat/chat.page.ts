import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  chats: any[] = [];
  errorMessage: string | null = null;
  correoUsuario: string | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    // Supongamos que tienes un método para obtener los datos del usuario logeado
    this.correoUsuario = this.authService.getUserEmail();

    if (this.correoUsuario) {
      this.listarChats(this.correoUsuario);
    } else {
      this.errorMessage = 'No se encontró el correo del usuario logeado.';
    }
  }

  listarChats(correoUsuario: string): void {
    this.authService.listarChats(correoUsuario).subscribe(
      (response) => {
        this.chats = response.chats;
      },
      (error) => {
        console.error('Error al listar los chats:', error);
        this.errorMessage = 'Error al listar los chats. Inténtalo de nuevo más tarde.';
      }
    );
  }

  irAlChat(idChat: number) {
    this.router.navigate([`/chat-contacto/${idChat}`]);
  }
}
