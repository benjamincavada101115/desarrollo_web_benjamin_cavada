# desarrollo_web_benjamin_cavada

## Arquitectura y Base de Datos

Al modelo relacional se le agregó la tabla **comentario**, además de implementar la vista de **indicadores** según lo indicado en las instrucciones.

- **comentario:** Registro de comentarios asociados a cada avistamiento, incluyendo nombre del autor, texto y fecha de creación.

### Módulo de Comentarios
* **Modelo de Datos:** Se integró la tabla `comentario` en MySQL mediante el script `tabla-comentario.sql`, asociándola a la entidad `Avistamiento` mediante una clave foránea (`avistamiento_id`).

* **Endpoints API (Servidor):**
  - `GET /api/avistamiento/<id>/comentarios`: Retorna el listado de comentarios ordenados de manera descendente por fecha en formato JSON.
  - `POST /api/avistamiento/<id>/comentarios`: Procesa la inserción de nuevos comentarios.

* **Validaciones Cliente y Servidor:**
  - **Nombre:** Obligatorio, entre 3 y 50 caracteres.
  - **Texto:** Obligatorio, mínimo 5 caracteres (formulario con área de texto de 3 filas y 40 columnas).
  - Si el servidor detecta errores, responde con un estado HTTP 400 y un objeto JSON con los detalles sin refrescar la página.

* **Procesamiento Asíncrono (AJAX / fetch):** Implementado en `static/js/comentarios.js`. Carga y envía datos sin recargas de página.

* **Seguridad (XSS):** Implementación de la función `escapeHTML()` en JavaScript para limpiar los caracteres especiales al inyectar los comentarios en el DOM.

### Módulo de Indicadores
* **Librería Externa Utilizada:** Highcharts (v10+ cargada mediante CDN). Se eligió por su facilidad de integración, interactividad y renderizado nativo vectorizado (SVG).

* **Endpoint API (`/api/estadisticas`):** Procesa los datos directamente en MySQL mediante consultas agregadas de SQLAlchemy (`db.func.count()` y `db.func.date()`), retornando la estructura necesaria para los gráficos.

* **Gráficos Generados:**
  - **Líneas:** Cantidad de avistamientos registrados por día.
  - **Torta (Pie):** Total de avistamientos por tipo de ave.
  - **Barras (Column):** Total de voluntarios registrados agrupados por comuna.

* **Navegación:** Enlace directo al final de la vista para regresar a la portada del sistema (`/`).

## Decisiones de Arquitectura

* **Separación entre Vistas HTML y Endpoints API:** La vista `/avistamiento/<id>` únicamente entrega la plantilla HTML estática, delegando la carga y publicación de comentarios a una API JSON en segundo plano.

* **Procesamiento de Datos en BD (`db.func`):** El cálculo de totales y agrupaciones por fecha o comuna se realiza en la base de datos en lugar de procesarse en Python, optimizando la memoria del servidor y minimizando el tamaño del JSON enviado al navegador.