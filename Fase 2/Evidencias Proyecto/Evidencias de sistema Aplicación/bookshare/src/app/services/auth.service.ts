// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api'; // Cambia la URL si es necesario

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
}
