<ion-header class="fondo">
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-button routerLink="/login">
        <ion-icon slot="icon-only" name="arrow-back-outline"></ion-icon>
      </ion-button>
    </ion-buttons>
    <ion-title class="titulo">Registro</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  <form (ngSubmit)="register()" #registroForm="ngForm">
    <ion-item>
      <ion-label position="stacked">Nombre de usuario</ion-label>
      <ion-input [(ngModel)]="nombre_usuario" name="nombre_usuario" required></ion-input>
    </ion-item>
    <div *ngIf="registroForm.controls['nombre_usuario']?.invalid && (registroForm.controls['nombre_usuario']?.touched || registroForm.submitted)">
      <ion-label color="danger">El nombre de usuario es obligatorio.</ion-label>
    </div>

    <br>

    <ion-item>
      <ion-label position="stacked">Correo</ion-label>
      <ion-input [(ngModel)]="correo" name="correo" type="email" required pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"></ion-input>
    </ion-item>
    <div *ngIf="registroForm.controls['correo']?.invalid && (registroForm.controls['correo']?.touched || registroForm.submitted)">
      <ion-label color="danger">
        El correo es obligatorio y debe ser válido (ejemplo: ejemplo&#64;dominio.com).
      </ion-label>
    </div>

    <br>

    <ion-item>
      <ion-label position="stacked">Contraseña</ion-label>
      <ion-input [(ngModel)]="contrasena" name="contrasena" type="password" required minlength="6"></ion-input>
    </ion-item>
    <div *ngIf="registroForm.controls['contrasena']?.invalid && (registroForm.controls['contrasena']?.touched || registroForm.submitted)">
      <ion-label color="danger">
        La contraseña es obligatoria y debe tener al menos 6 caracteres.
      </ion-label>
    </div>

    <br>

    <ion-item>
      <ion-label position="stacked">Teléfono</ion-label>
      <ion-input [(ngModel)]="telefono" name="telefono" required pattern="^[0-9]*$"></ion-input>
    </ion-item>
    <div *ngIf="registroForm.controls['telefono']?.invalid && (registroForm.controls['telefono']?.touched || registroForm.submitted)">
      <ion-label color="danger">El teléfono es obligatorio.</ion-label>
    </div>

    <br>

    <ion-item>
      <ion-label position="stacked">Ubicación</ion-label>
      <ion-input [(ngModel)]="ubicacion" name="ubicacion" required></ion-input>
    </ion-item>
    <div *ngIf="registroForm.controls['ubicacion']?.invalid && (registroForm.controls['ubicacion']?.touched || registroForm.submitted)">
      <ion-label color="danger">La ubicación es obligatoria.</ion-label>
    </div>

    <br>

    <ion-item>
      <ion-label position="stacked">Foto de perfil</ion-label>
      <input class="foto" type="file" (change)="onImageSelected($event)" accept="image/*">
    </ion-item>

    <ion-item *ngIf="foto_perfil">
      <img [src]="foto_perfil" alt="Vista previa" />
    </ion-item>

    <ion-item *ngIf="errorMessage">
      <ion-label color="danger">{{ errorMessage }}</ion-label>
    </ion-item>

    <ion-button expand="full" type="submit" [disabled]="registroForm.invalid">Registrar</ion-button>

    <div style="text-align: center;">
      <a class="aqui" routerLink="/login" style="color: #229E88;">Si tienes cuenta, pulsa <strong>Aquí</strong></a>
    </div>
  </form>
</ion-content>
