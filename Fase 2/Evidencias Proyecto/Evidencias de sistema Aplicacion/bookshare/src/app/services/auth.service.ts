// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
//http://localhost:3000/api ip http://192.168.1.26:3000/api

  private apiUrl = 'http://192.168.1.26:3000/api'; //http://localhost:3000/api ip http://192.168.1.26:3000/api


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
  getPrestamoPorId(id_prestamo: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/prestamo/${id_prestamo}`);
  }
  agregarResena(id_usuario: number, isbn: string, calificacion: number, comentario: string): Observable<any> {
    const resena = { id_usuario, isbn, calificacion, comentario };
    return this.http.post(`${this.apiUrl}/resenas`, resena);
  }
  getLibroPorIsbn(isbn: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/libro/${isbn}`);
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
  // Obtener notificaciones del usuario
  obtenerNotificaciones(correo: string) {
    return this.http.get<any[]>(`http://localhost:3000/api/notificaciones/${correo}`);
  }
  enviarNotificacionAceptada(correoSolicitante: string) {
    const correoPrestamista = this.getUserEmail(); // Correo del prestamista (actual usuario)
    const titulo = 'Préstamo Aceptado';
    const descripcion = 'Tu solicitud de préstamo ha sido aceptada. Dirígete al chat para más detalles.';
    
    console.log('Correo solicitante:', correoSolicitante);
    console.log('Correo prestamista:', correoPrestamista);
    console.log('Título:', titulo);
    console.log('Descripción:', descripcion);
  
    return this.http.post('http://localhost:3000/api/notificar-aceptacion', {
      correoSolicitante,
      correoPrestamista,
      titulo,
      descripcion
    });
  }
  
  
  
  // Crear una nueva notificación
  crearNotificacion(correo: string, titulo: string, descripcion: string, tipo: string): Observable<any> {
    const payload = { correo, titulo, descripcion, tipo };
    return this.http.post<any>(`${this.apiUrl}/notificaciones`, payload);
  }
 // Llama al backend para obtener la cantidad de notificaciones no leídas
 getNotificacionesNoLeidas(correo: string): Observable<number> {
  return this.http.get<number>(`${this.apiUrl}/notificaciones/no-leidas?correo=${correo}`);
}

  // Marcar una notificación como vista
  marcarNotificacionComoVisto(idNotificacion: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/notificaciones/${idNotificacion}/visto`, {});
  }

  // Eliminar una notificación
  eliminarNotificacion(idNotificacion: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/notificaciones/${idNotificacion}`);
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
  getPersonasConLibro(isbn: string, idUsuarioLogeado: number): Observable<any> {
    const url = `${this.apiUrl}/personas-con-libro/${isbn}/${idUsuarioLogeado}`;
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

  // authService.ts

crearNotificacion_aceptacion(correoSolicitante: string, titulo: string, descripcion: string): Observable<any> {
  
  const body = {
    correoSolicitante,
    
    titulo,
    descripcion
  };
  return this.http.post('http://localhost:3000/api/notificacion_aceptacion', body);
}

  crearNotificacionPrestamo(correo: string, titulo: string, descripcion: string, tipo: string = 'Solicitud de préstamo'): Observable<Object> {
    const body = {
      correo: correo,
      titulo: titulo,
      descripcion: descripcion,
      tipo: tipo,  // Asegúrate de que tipo esté bien definido
      visto: false, // Notificación no vista por defecto
      fecha_creacion: new Date().toISOString(), // Fecha de creación
    };
  
    // Asegúrate de imprimir en consola el body para revisar los valores antes de enviarlos
    console.log('Cuerpo de la notificación:', body);
  
    // Asegúrate de enviar el POST a la ruta correcta
    return this.http.post('http://localhost:3000/api/notificacion_prestamo', body);
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
    const url = `${this.apiUrl}/solicitud/${id_prestamo}/por-entregar`; // Cambiar el estado a "Por entregar" en el backend
    return this.http.put(url, {});
}
// authService.ts
obtenerCorreoSolicitante(id_prestamo: number): Observable<string> {
  return this.http.get<{ correo: string }>(`${this.apiUrl}/prestamos/${id_prestamo}/correo`).pipe(
    map(response => response.correo)
  );
}
marcarEstadoComoEntregado(id_prestamo: number): Observable<any> {
  const url = `${this.apiUrl}/solicitud/${id_prestamo}/entregado`; // Cambiar el estado a "Por entregar" en el backend
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
  insertarIntercambio(id_usuario_ofertante: number, id_usuario_solicitante: number, id_biblioteca_prestamista: number): Observable<any> {
    const url = `${this.apiUrl}/insertar-intercambio`;
    const data = { 
      id_usuario_ofertante, 
      id_usuario_solicitante, 
      id_biblioteca_prestamista, 
      id_biblioteca_solicitante: null, 
      estado: 'Pendiente'              
    };
    return this.http.post(url, data);
  }
  obtenerIdBiblioteca(isbn: string, id_usuario: number): Observable<any> {
    const url = `${this.apiUrl}/obtener-id-biblioteca/${isbn}/${id_usuario}`;
    return this.http.get(url);
  }

  obtenerIntercambiosSolicitante(id_usuario: number): Observable<any> {
    const url = `${this.apiUrl}/intercambios-solicitante/${id_usuario}`;
    return this.http.get(url);
  }
  
  obtenerIntercambiosPrestamista(id_usuario: number): Observable<any> {
    const url = `${this.apiUrl}/intercambios-prestamista/${id_usuario}`;
    return this.http.get(url);
  }
  obtenerLibrosDisponiblesIntercambio(idUsuario: number): Observable<any> {
    console.log(idUsuario)
    const url = `${this.apiUrl}/libros-disponibles-intercambio/${idUsuario}`;
    return this.http.get(url);
  }
  actualizarBibliotecaPrestamista(idIntercambio: number, idBibliotecaPrestamista: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/actualizarBibliotecaPrestamista`, {
      id_intercambio: idIntercambio,
      id_biblioteca_prestamista: idBibliotecaPrestamista
    });
  }

  reportarUsuario(usuarioReportado: number, usuarioReportante: number): Observable<any> {
    console.log('Reportando usuario:', usuarioReportado, usuarioReportante);
  
    return this.http.post<any>(`${this.apiUrl}/reportar`, {
      usuario_reportado: usuarioReportado,
      usuario_reportante: usuarioReportante
    });
  }
  
  
  
  
}
