// src/app/services/socket.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  private messagesSubject = new Subject<any>(); // Cambia el tipo según la estructura de tu mensaje

  constructor() {
    // Conectar al servidor de Socket.IO (cambia la URL si es necesario)
    this.socket = io('http://localhost:3000'); 
    this.listenForMessages();
  }

  private listenForMessages() {
    // Escuchar el evento 'nuevo-mensaje' desde el servidor
    this.socket.on('nuevo-mensaje', (mensaje) => {
      this.messagesSubject.next(mensaje);
    });
  }

  sendMessage(mensaje: string) {
    // Emitir un nuevo mensaje al servidor
    this.socket.emit('nuevo-mensaje', mensaje);
  }

  getMessages() {
    // Retornar un Observable para que los componentes se suscriban
    return this.messagesSubject.asObservable();
  }

  disconnect() {
    // Desconectar el socket si es necesario
    this.socket.disconnect();
  }
}
