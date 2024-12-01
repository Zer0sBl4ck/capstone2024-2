import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service'; // Asegúrate de tener la ruta correcta
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-csv-loader',
  templateUrl: 'csv-loader.page.html',
  styleUrls: ['csv-loader.page.scss'],
})
export class CsvLoaderPage {
  csvFile: File | null = null;

  constructor(private authService: AuthService) {}  // Inyectamos el servicio

  // Maneja el cambio de archivo
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      this.csvFile = file;
    } else {
      this.csvFile = null;
      alert('Por favor, selecciona un archivo CSV.');
    }
  }

  // Envia el archivo al backend usando el servicio
  onSubmit() {
    if (!this.csvFile) return;

    const formData = new FormData();
    formData.append('archivo', this.csvFile, this.csvFile.name);

    // Usamos el método del servicio AuthService
    this.authService.subirCSV(formData).subscribe(
      (response) => {
        console.log('Archivo cargado exitosamente', response);
      },
      (error) => {
        console.error('Error al cargar archivo:', error);
      }
    );
  }
}
