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

  // Método para registrar un nuevo usuario
  register(nombre_usuario: string, correo: string, contrasena: string, ubicacion: string): Observable<any> {
    const userData = { nombre_usuario, correo, contrasena, ubicacion };
    return this.http.post(`${this.apiUrl}/usuarios`, userData);
  }

  // Método para iniciar sesión
  login(correo: string, contrasena: string): Observable<any> {
    const loginData = { correo, contrasena }; // Asegúrate de que la propiedad sea 'contrasena'
    console.log(loginData)
    return this.http.post(`${this.apiUrl}/login`, loginData);
  }
}
