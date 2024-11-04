import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular'; // Importa NavParams y PopoverController
import { AuthService } from '../services/auth.service';

interface Libro {
  isbn: string;
  titulo: string;
  autor: string;
  descripcion: string;
  genero: string;
  imagen_libro_base64?: string;
}

@Component({
  selector: 'app-vista-libro',
  templateUrl: './vista-libro.page.html',
  styleUrls: ['./vista-libro.page.scss'],
})
export class VistaLibroPage implements OnInit {
  libro: Libro | undefined;

  constructor(
    private navParams: NavParams, // Cambia a NavParams
    private authService: AuthService,
    private popoverController: PopoverController // Inyecta PopoverController
  ) { }

  ngOnInit() {
    const isbn = this.navParams.get('isbn'); // Obtiene el ISBN desde navParams
    if (isbn) {
      this.cargarLibro(isbn);
    }
  }

  cargarLibro(isbn: string) {
    this.authService.getLibros().subscribe((data) => {
      this.libro = data.find((libro: Libro) => libro.isbn === isbn);
    });
  }

  closePopover() {
    this.popoverController.dismiss(); // Cierra el popover
  }
}
