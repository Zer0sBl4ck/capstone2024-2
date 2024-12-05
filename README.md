## General

Bookshare es una aplicación móvil diseñada para fomentar la lectura y el intercambio cultural entre las personas. Al permitir a los usuarios intercambiar y prestar libros de forma gratuita, promueve el acceso al conocimiento, la formación de comunidades lectoras y el uso sostenible de los recursos al darle una nueva vida a libros que podrían estar en desuso

Estructura del Repositorio
---------------------------------------------------------------------------------------------------
El repositorio incluye todos los componentes necesarios para el desarrollo, implementación y ejecución del proyecto Bookshare. A continuación, se detalla el contenido del repositorio:

1. Carpeta raíz (capstone2024-2)
Contiene la base principal del proyecto y las subcarpetas organizadas por fases.

2. Carpeta Fase 2
Esta carpeta incluye los entregables correspondientes a la segunda fase del proyecto, tales como evidencias de diseño, implementación y pruebas del sistema.
---------------------------------------------------------------------------------------------------
Subcarpetas principales:
---------------------------------------------------------------------------------------------------
1. Evidencias Proyecto: Contiene documentos y archivos que respaldan el desarrollo del sistema, como diagramas, reportes y más.
2. Evidencias de sistema Aplicación: Aquí se encuentran los componentes del sistema organizados en diferentes subcarpetas:
3. backend: Contiene la API del sistema, la cual se encarga de manejar las solicitudes del cliente, la lógica del negocio y la conexión con la base de datos.

Archivos destacados:
server.js: Punto de entrada de la API.
Archivos relacionados con rutas, controladores y modelos para manejar datos.
bookshare:
Incluye el frontend del sistema basado en Ionic y Angular, encargado de la interfaz de usuario.

Archivos destacados:
Código de la aplicación móvil (HTML, SCSS, TypeScript).
Configuraciones del framework Ionic para servir el proyecto.
Otros archivos importantes:
base de datos:
Contiene el archivo de exportación de la base de datos Bookshare, necesario para configurarla en phpMyAdmin.



## Proceso de instalación
Primero debes instalar las dependencias del sistema
1. npm install @ionic/angular @ionic/storage-angular @ionic-native/core
2. npm install @angular/core @angular/common @angular/forms @angular/router rxjs
3. npm install socket.io
4. npm install file-saver --save
5. npm install multer csv-parser
6. npm install swiper



Versiones 
---------------------------------------------------------------------------------------------------
Ionic:

   Ionic CLI                     : 7.2.0 (/usr/local/lib/node_modules/@ionic/cli)
   Ionic Framework               : @ionic/angular 8.3.2
   @angular-devkit/build-angular : 18.2.7
   @angular-devkit/schematics    : 18.2.7
   @angular/cli                  : 18.2.7
   @ionic/angular-toolkit        : 11.0.1

Capacitor:

   Capacitor CLI      : 6.1.2
   @capacitor/core    : 6.1.2

Utility:

   cordova-res : not installed globally
   native-run  : 2.0.1

System:

   NodeJS : v18.19.1 (/usr/bin/node)
   npm    : 9.2.0
   OS     : Linux 6.8  Y Windows 10 

---------------------------------------------------------------------------------------------------
una vez intalados y configurados procedes a abrir XAMPP e inicias Apache y Mysql
1. entras en el phpmyadmin y crear la base de datos llamada bookshare
2. inserta la BD que adjuntamos en la direccion "capstone2024-2\Fase 2\Evidencias Proyecto\Evidencias de sistema Aplicación\base de datos"
   

PROCESO DE ARRANQUE VISUAL ESTUDIO CODE

ARRANQUE DE LA API
---------------------------------------------------------------------------------------------------
Una vez clonado el repositorio en tu equipo, en la terminal tendras una ruta como esta de ejemplo 
"C:\capstone2024-2>"

Cuando llegues aqui  procederas a entrar a la carpeta FASE 2
C:\capstone2024-2/Fase 2> 

luego ingresaras a evidencias del proyecto 
C:\capstone2024-2/Fase 2\Evidencias Proyecto>

Cuando estes en en ese punto entras a  evidencias del sistema de la aplicacion
"C:\capstone2024-2\Fase 2\Evidencias Proyecto\Evidencias de sistema Aplicación> 

llegado a ese punto entras en la carpeta llamada backend
C:\capstone2024-2\Fase 2\Evidencias Proyecto\Evidencias de sistema Aplicación\backend> 

luego entramos en la api 
C:\capstone2024-2\Fase 2\Evidencias Proyecto\Evidencias de sistema Aplicación\backend\api>

despues ejecutas el comando node server.js y sigues con el siguiente paso.

---------------------------------------------------------------------------------------------------

Abrimos otra terminal con la cual ejecutaremos el software 
"C:\capstone2024-2>"

Cuando llegues aqui  procederas a entrar a la carpeta FASE 2
C:\capstone2024-2/Fase 2> 

luego ingresaras a evidencias del proyecto 
C:\capstone2024-2/Fase 2\Evidencias Proyecto>

Cuando estes en en ese punto entras a evidencias del sistema de la aplicacion
"C:\capstone2024-2\Fase 2\Evidencias Proyecto\Evidencias de sistema Aplicación> 

llegado a ese punto entras en la carpeta llamada bookshare
C:\capstone2024-2\Fase 2\Evidencias Proyecto\Evidencias de sistema Aplicación\bookshare>

Despues ejecutas el comando ionic serve  y listo.

---------------------------------------------------------------------------------------------------
