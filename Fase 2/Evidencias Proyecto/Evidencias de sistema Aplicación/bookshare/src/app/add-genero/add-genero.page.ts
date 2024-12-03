import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-genero',
  templateUrl: './add-genero.page.html',
  styleUrls: ['./add-genero.page.scss'],
})
export class AddGeneroPage implements OnInit {
  nuevoGenero: string = ''; // Variable para almacenar el nuevo género

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  onSubmit() {
    if (this.nuevoGenero.trim() === '') {
      console.error('El género no puede estar vacío');
      return;
    }

    // Llamar al servicio para agregar el género
    this.authService.agregarGenero(this.nuevoGenero).subscribe(
      (response) => {
        console.log('Género agregado:', response);
        alert('Género agregado exitosamente');
        this.nuevoGenero = ''; // Limpiar el campo después de agregar
        this.router.navigate(['/']); // Redirigir al inicio u otra página
      },
      (error) => {
        console.error('Error al agregar género:', error);
        alert('Hubo un error al agregar el género');
      }
    );
  }
}
