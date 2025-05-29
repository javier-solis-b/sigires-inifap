# Inventario INIFAP

Este proyecto es un sistema de inventario desarrollado para el INIFAP. Está compuesto por un backend en Node.js y un frontend en Vue.js, permitiendo la gestión de almacenes, recursos, soluciones y usuarios.

## Estructura del Proyecto

- **Backend/**: API RESTful construida con Node.js.
  - `src/`: Código fuente del backend.
  - `docs/`: Documentación y ejemplos de peticiones HTTP.
  - `sigires_bd.sql`: Script de base de datos.
- **frontend/**: Aplicación web construida con Vue.js y Vuetify.
  - `src/`: Código fuente del frontend.
  - `public/`: Archivos públicos y recursos estáticos.

## Instalación

### Requisitos
- Node.js >= 14.x
- npm >= 6.x

### Backend
1. Ir a la carpeta `Backend`:
   ```powershell
   cd Backend
   ```
2. Instalar dependencias:
   ```powershell
   npm install
   ```
3. Configurar variables de entorno en `src/Shared/env.js`.
4. Iniciar el servidor:
   ```powershell
   npm start
   ```

### Frontend
1. Ir a la carpeta `frontend`:
   ```powershell
   cd frontend
   ```
2. Instalar dependencias:
   ```powershell
   npm install
   ```
3. Iniciar la aplicación:
   ```powershell
   npm run serve
   ```

## Uso

- Accede a la aplicación web desde tu navegador en `http://localhost:8080` (por defecto).
- El backend corre en `http://localhost:3000` (por defecto).

## Funcionalidades principales
- Gestión de almacenes, recursos y soluciones de stock.
- Autenticación y autorización de usuarios.
- Interfaz moderna y responsiva con Vuetify.

## Documentación
- Consulta la carpeta `Backend/docs/` para ejemplos de peticiones HTTP y documentación de endpoints.

## Base de Datos

El proyecto utiliza una base de datos relacional (MySQL o compatible). El script para crear la estructura y tablas necesarias se encuentra en:

- `Backend/sigires_bd.sql`

Para instalar la base de datos:
1. Abre tu gestor de base de datos (por ejemplo, MySQL Workbench).
2. Ejecuta el script `sigires_bd.sql` para crear la base y las tablas requeridas.
3. Configura la conexión a la base de datos en el archivo `Backend/src/Shared/env.js`.

## Estructura de la Base de Datos

El sistema utiliza las siguientes tablas principales:

- **catalogos**: Almacenes registrados.
  - id (int, PK)
  - nombre_almacen (varchar)

- **recursos**: Recursos o materiales almacenados.
  - id (int, PK)
  - nombre (varchar)
  - tipo_recurso (varchar)
  - no_inventario (varchar)
  - marca (varchar)
  - pm (varchar)
  - formula (varchar)
  - capacidad_r (double)
  - lote (varchar)
  - recipientes_actuales (float)
  - catalogo_id (int, FK a catalogos)
  - unidad_medida (varchar)
  - fecha_caducidad (date)

- **solucionesstocks**: Soluciones o medios de cultivo preparados.
  - id (int, PK)
  - medios_cultivo (varchar)
  - nombre_solucion (varchar)

- **solucionesrecursos**: Relación entre soluciones y recursos usados.
  - id (int, PK)
  - solucion_id (int, FK a solucionesstocks)
  - recurso_id (int, FK a recursos)
  - cantidad_usada (double)

- **users**: Usuarios del sistema.
  - id (varchar, PK)
  - name (text, único)
  - password (text, hash)
  - isAdmin (int, 0=usuario, 1=admin)

## Pruebas para Usuarios

Puedes probar la API y el sistema de las siguientes formas:

### 1. Usando la Interfaz Web
- Ingresa a la aplicación en `http://localhost:8080`.
- Inicia sesión con un usuario registrado (por ejemplo, `user` o `admin`).
- Navega por los módulos de almacenes, recursos y soluciones para realizar pruebas de alta, consulta, edición y eliminación.

### 2. Usando Peticiones HTTP
- En la carpeta `Backend/docs/` hay archivos `.http` con ejemplos de peticiones para probar los endpoints (puedes usar extensiones como REST Client en VS Code).
- Modifica y ejecuta las peticiones para probar el backend directamente.

### 3. Usuarios de Prueba
- El script de la base de datos incluye usuarios de ejemplo:
  - Usuario: `user` / Contraseña: `user` (no admin)
  - Usuario: `admin` / Contraseña: `admin` (admin)

## Contacto

Para dudas o sugerencias puedes contactar vía LinkedIn:
 [Perfil de LinkedIn](https://www.linkedin.com/in/francisco-javier-solis-bamaca-5776a21ba/)

## Licencia
Proyecto desarrollado para fines internos del INIFAP.
