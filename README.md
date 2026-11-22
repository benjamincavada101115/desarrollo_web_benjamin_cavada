# desarrollo_web_benjamin_cavada

## Decisiones de Implementación

### 1. Backend (Spring Boot 4.2 + Java 17 + JPA)
* **Persistencia con Spring Data JPA:** Se mapearon las entidades existentes (`Comuna`, `Voluntario`, `Ave`, `Avistamiento`) y la nueva tabla `Nota` (`tabla-nota.sql`) sobre la base de datos `tarea2` utilizando `spring.jpa.hibernate.ddl-auto=validate` para garantizar compatibilidad sin alterar las tablas previas.
* **DTO (`AvistamientoBusquedaDTO`):** Se utilizó un objeto de transferencia de datos para exponer únicamente los campos requeridos por la interfaz (`id`, `voluntario`, `dia`, `ave`, `comuna` y `nota`), evitando ciclos de serialización JSON entre entidades JPA.
* **Cálculo de promedio en base de datos:** El promedio de notas de cada avistamiento se calcula mediante consulta JPQL (`AVG(n.nota)`), devolviendo `"-"` cuando el registro aún no posee evaluaciones.

### 2. Validaciones (Cliente y Servidor)
* **Doble validación de notas:** Tanto en JavaScript (`buscador.js`) como en el controlador REST (`POST /api/avistamientos/{id}/notas`) se valida estrictamente que la nota sea un número entero entre `1` y `7` (ambos inclusivos), rechazando cualquier valor fuera de rango con código HTTP `400 Bad Request`.

### 3. Frontend y Llamadas Asíncronas (`fetch`)
* **Búsqueda en tiempo real:** Mediante el evento `input` y `fetch` asíncrono (`GET /api/avistamientos/buscar?q=...`), la lista se actualiza automáticamente a medida que el usuario escribe, sin recargar la página.
* **Resaltado seguro contra XSS:** Las coincidencias de texto se destacan utilizando `<mark>` construido mediante nodos DOM (`document.createTextNode` y `document.createElement`) en lugar de `innerHTML`, previniendo inyección de código HTML.
* **Estándares W3C:** Tanto `index.html` como `styles.css` fueron verificados sin errores en los validadores oficiales de HTML5 y CSS3 de W3C.