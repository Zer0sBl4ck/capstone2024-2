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
      foto_perfil,  // Aquí enviamos la imagen en base64 como parte del objeto JSON
    };

    return this.http.post(`${this.apiUrl}/usuarios`, userData);
  }



  login(correo: string, contrasena: string): Observable<any> {
    const loginData = { correo, contrasena }; // Asegúrate de que la propiedad sea 'contrasena'
    console.log(loginData);
    return this.http.post(`${this.apiUrl}/login`, loginData);
  }

  
  saveUserData(token: string, user: any): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user)); // Guardar datos del usuario como JSON
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
}
