import { Component, OnInit } from '@angular/core';
import { RefresherEventDetail, IonRefresher } from '@ionic/angular';
@Component({
  selector: 'app-modificar-libro',
  templateUrl: './modificar-libro.page.html',
  styleUrls: ['./modificar-libro.page.scss'],
})
export class ModificarLibroPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  refreshData(event: CustomEvent<RefresherEventDetail>) {
    // Aquí va la lógica para actualizar los datos
    console.log('Refrescando...');
    window.location.reload();
    // Simula un delay para el refresco
    setTimeout(() => {
      // Verificar si event.target es un IonRefresher
      const refresher = event.target;

      if (refresher instanceof IonRefresher) {
        refresher.complete();  // Indica que el refresco se completó
      }
    }, 2000);
  }

}
