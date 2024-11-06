// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api'; //http://localhost:3000/api ip http://192.168.1.26:3000/api

  constructor(private http: HttpClient) { }

  register(
    nombre_usuario: string,
    correo: string,
    contrasena: string,
    telefono: string,
    ubicacion: string,
    foto_perfil: string | null
  ): Observable<any> {
    const userData = {
      nombre_usuario,
      correo,
      contrasena,
      telefono,
      ubicacion,
      foto_perfil,  
    };

    return this.http.post(`${this.apiUrl}/usuarios`, userData);
  }



  login(correo: string, contrasena: string): Observable<any> {
    const loginData = { correo, contrasena }; 
    console.log(loginData);
    return this.http.post(`${this.apiUrl}/login`, loginData);
  }

  
  saveUserData(token: string, user: any): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('role', user.rol);  
  }

 
  getUserData(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }


  getToken(): string | null {
    return localStorage.getItem('token');
  }

 
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  isAuthenticated(): boolean {
    return this.getToken() !== null; 
  }

  getUserRole(): string | null {
    return localStorage.getItem('role');
  }

  agregarLibro(isbn: string, titulo: string, autor: string, descripcion: string, genero: string, imagen_libro?: string): Observable<any> {
    const libroData = {
      isbn,
      titulo,
      autor,
      descripcion,
      genero,
      imagen_libro 
    };

    return this.http.post(`${this.apiUrl}/libros`, libroData);
  }

  getLibros(): Observable<any> {
    return this.http.get(`${this.apiUrl}/libros`);
  }

  agregarLibroABiblioteca(id_usuario: string, isbn: string): Observable<any> {
    const bibliotecaData = {
      id_usuario,
      isbn
    };

    return this.http.post(`${this.apiUrl}/biblioteca`, bibliotecaData);
  }

  getLibrosPorCorreo(correo: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/libros/${correo}`);
  }

  getUserProfile(correo: string): Observable<any> {
    const url = `${this.apiUrl}/perfil/${correo}`;
    return this.http.get(url);
  }

  updateUserProfile(correo: string, usuarioData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/usuarios/correo/${correo}`, usuarioData);
  }
  getUserEmail(): string | null {
    const user = this.getUserData(); 
    return user ? user.correo : null; 
  }
  getUserName(): string | null {
    const user = this.getUserData(); 
    return user ? user.nombre_usuario : null; 
  }

  agregarLibroEstadoFalse(isbn: string, titulo: string, autor: string, descripcion: string, genero: string, imagen_libro?: string): Observable<any> {
    const libroData = {
      isbn,
      titulo,
      autor,
      descripcion,
      genero,
      imagen_libro
    };

    return this.http.post(`${this.apiUrl}/libros/estado-false`, libroData);
  }
  listarLibrosEstadoFalse(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/libros-estado-false`);
  }

  modificarLibroEstado(isbn: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/libros-modificar/${isbn}`, { estado: true });
  }

  eliminarLibro(isbn: string): Observable<any> {
  return this.http.delete<any>(`${this.apiUrl}/libros-eliminar/${isbn}`);
  }

  modificarEstadoPrestamo(isbn: string, disponible_prestamo: boolean): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/libros-cambio-prestamo/${isbn}`, { disponible_prestamo });
  }
  
  modificarEstadoIntercambio(isbn: string, disponible_intercambio: boolean): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/libros-cambio-intercambio/${isbn}`, { disponible_intercambio });
  }
  getPersonasConLibro(isbn: string): Observable<any> {
    const url = `${this.apiUrl}/personas-con-libro/${isbn}`;
    return this.http.get<any>(url);
  }

  crearPrestamo(id_usuario_solicitante: string, id_usuario_prestamista: string, id_biblioteca: string): Observable<any> {
    const prestamoData = {
      id_usuario_solicitante,
      id_usuario_prestamista,
      id_biblioteca
    };

    return this.http.post(`${this.apiUrl}/prestamo`, prestamoData);
  }
  crearNotificacionPrestamo(correo_prestamista: string, titulo: string, descripcion: string): Observable<any> {
    const notificacionData = {
      correo: correo_prestamista, // Enviar el correo del prestamista
      titulo, // Enviar el título de la notificación
      descripcion // Enviar la descripción de la notificación
    };
    console.log(notificacionData)

    return this.http.post(`${this.apiUrl}/notificacion_prestamo`, notificacionData);
  }

  getSolicitudesPrestamo(correo: string): Observable<any> {
    const url = `${this.apiUrl}/ps/${correo}`;
    return this.http.get<any>(url);
  }
  getSolicitudesSolicitante(correo: string): Observable<any> {
    const url = `${this.apiUrl}/ss/${correo}`;
    return this.http.get<any>(url);
  }
  eliminarSolicitud(id_prestamo: number): Observable<any> {
    const url = `${this.apiUrl}/solicitud/${id_prestamo}`;
    return this.http.delete(url);
  }

  actualizarEstadoSolicitud(id_prestamo: number): Observable<any> {
    const url = `${this.apiUrl}/solicitud/${id_prestamo}/desarrollo`;
    return this.http.put(url, {});
  }
  actualizarEstadoSolicitudAceptado(id_prestamo: number): Observable<any> {
    const url = `${this.apiUrl}/solicitud/${id_prestamo}/entregado`;
    return this.http.put(url, {});
  }
  actualizarEstadoSolicitudDevolucion(id_prestamo: number): Observable<any> {
    const url = `${this.apiUrl}/solicitud/${id_prestamo}/devolucion`;
    return this.http.put(url, {});
  }
  crearChatPrestamo(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear-chat-prestamo/${id}`, {});
  }

  // Método para listar chats por correo del usuario
  listarChats(correoUsuario: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/listar-chats/${correoUsuario}`);
  }

  insertarMensaje(idChat: number, idUsuarioRemitente: number, contenido: string): Observable<any> {
    const body = {
      id_chat: idChat,
      id_usuario_remitente: idUsuarioRemitente,
      contenido: contenido
    };
    return this.http.post(`${this.apiUrl}/enviar-mensaje`, body);
  }

  // Función para listar los mensajes de un chat
  listarMensajes(idChat: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/listar-mensajes/${idChat}`);
  }
  eliminarLibroBiblioteca(isbn: string, id_usuario: number): Observable<any> {
    console.log("eliminando libro")
    const url = `${this.apiUrl}/${isbn}/${id_usuario}`; 
    return this.http.delete(url);
  }
  actualizarFechaDevolucion(id_prestamo: number, fecha_devolucion: string): Observable<any> {
    const url = `${this.apiUrl}/prestamo/devolucion`;
    const body = { id_prestamo, fecha_devolucion };
    return this.http.put(url, body);
  }
  agregarFavorito(correo: string, isbn: string): Observable<any> {
    const url = `${this.apiUrl}/agregar-favorito`; 
    const data = { correo, isbn };
    return this.http.post(url, data);
  }
  getLibrosFavoritos(correo: string): Observable<any> {
    const url = `${this.apiUrl}/favoritos/${correo}`;
    return this.http.get(url);
  }

  // Método para eliminar un libro de favoritos
  eliminarFavorito(correo: string, isbn: string): Observable<any> {
    const url = `${this.apiUrl}/eliminar-favorito`;
    const data = { correo, isbn };
    return this.http.request('delete', url, { body: data });
  }
  
}
