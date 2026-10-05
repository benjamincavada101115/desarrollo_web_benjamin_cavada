# desarrollo_web_benjamin_cavada

## Arquitectura y Base de Datos

El modelo relacional mapeado mediante **SQLAlchemy** está compuesto por las siguientes entidades:

- **Region / Comuna:** Manejo geográfico. Incluye la ruta `/get_comunas/<region_id>` para la carga dinámica de comunas mediante AJAX.
- **Voluntario:** Datos personales y comuna asociada.
- **Ave:** Catálogo de aves disponibles.
- **Avistamiento:** Registro con voluntario, ave, lugar, fecha/hora y campo opcional de `descripcion`.
- **Registro:** Almacenamiento de rutas de archivos multimedia asociados a cada avistamiento.

### Registro de Voluntarios
* **Servidor (Flask) y Cliente (JS):**
  - Nombre y apellido con mínimo 3 caracteres cada uno.
  - Correo electrónico en formato válido (`@`).
  - Teléfono numérico exacto de 9 dígitos.
  - Región y comuna obligatorias.

### Registro de Avistamientos
* **Servidor (Flask) y Cliente (JS):**
  - Selección obligatoria de Voluntario y Ave desde la base de datos.
  - Lugar con un mínimo de 3 caracteres.
  - Fecha y hora obligatorias.
  - **Fecha/Hora:** No puede ser una fecha futura ni tener más de 1 año de antigüedad respecto al momento del registro.
  - **Descripción:** Campo opcional con un límite máximo de 500 caracteres.
  - **Multimedia:** Subida obligatoria de al menos un archivo (imagen o video), procesado de forma segura con `secure_filename` y almacenado en `static/uploads/`.

## Funcionalidades del Sistema

* **Inicio (`/`):** Muestra los últimos 2 avistamientos registrados ordenados por ID de forma descendente.
* **Consulta de Avistamientos (`/consultar_avistamientos`):**
  - Filtrado dinámico por tipo de ave.
  - Ordenamiento por fecha o lugar (ascendente / descendente).
  - Paginación en servidor (3 avistamientos por página).
* **Detalle del Avistamiento (`/avistamiento/<id>`):** Vista individual centrada con la información del avistamiento, descripción y galería de archivos multimedia (imágenes/videos).