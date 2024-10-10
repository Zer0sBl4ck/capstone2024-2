import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';  // Importar Router para la redirección

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  nombre_usuario: string = '';
  correo: string = '';
  contrasena: string = '';
  telefono: string = '';
  ubicacion: string = '';
  foto_perfil: string | null = null;
  errorMessage: string = '';  

  constructor(private authService: AuthService, private router: Router) {}

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.foto_perfil = reader.result as string;  // Convertimos la imagen a base64
      };
      reader.readAsDataURL(file);
    }
  }

  register() {
    this.authService.register(
      this.nombre_usuario,
      this.correo,
      this.contrasena,
      this.telefono,
      this.ubicacion,
      this.foto_perfil
    ).subscribe(
      response => {
        console.log('Registro exitoso', response);
        this.errorMessage = '';  // Limpiar el mensaje de error
        this.router.navigate(['/login']);  // Redirigir al login cuando el registro es exitoso
      },
      error => {
        console.error('Error al registrar usuario', error);
        this.errorMessage = 'Las credenciales son incorrectas o ya están registradas.';  // Mensaje de error
      }
    );
  }
}
