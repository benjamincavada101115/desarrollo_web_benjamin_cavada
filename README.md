# desarrollo_web_benjamin_cavada

## Registro de voluntarios

Se valida:

- Nombre con mínimo 3 caracteres.
- Apellido con mínimo 3 caracteres.
- Correo electrónico válido.
- Teléfono de 9 dígitos.
- Región obligatoria.
- Comuna con mínimo 3 caracteres.

## Registro de avistamientos

Se valida:

- Tipo de ave con mínimo 3 caracteres.
- Nombre del ave con mínimo 3 caracteres.
- Lugar con mínimo 3 caracteres.
- Fecha y hora obligatorias.
- Foto o video obligatorio.
- La fecha y hora del avistamiento no pueden ser futuras.
- La fecha del avistamiento no puede ser de más de un año atrás.

## Fecha y hora de los avistamientos

Para validar que un avistamiento no sea futuro, se combinan la fecha y la hora ingresadas por el usuario en un objeto `Date` de JavaScript y se compara con la fecha y hora actual.
Para este prototipo se estableció como límite que los avistamientos no pueden tener más de un año de antigüedad.

## Datos utilizados

Como la tarea corresponde solamente a un prototipo y no requiere almacenar información en un servidor, los datos de voluntarios y avistamientos utilizados en las páginas de consulta e indicadores están definidos directamente en arreglos de JavaScript.

## Consulta de avistamientos

La página de consultas permite:

- Filtrar por tipo de ave.
- Ordenar por fecha, hora o lugar.
- Ordenar de forma ascendente o descendente.
- Mostrar los resultados mediante paginación.

Se utilizan datos de ejemplo para demostrar el funcionamiento de estas opciones.

## Indicadores

La página de indicadores calcula:

- Total de voluntarios.
- Región con mayor cantidad de voluntarios.
- Cantidad de voluntarios por región.
- Total de avistamientos.
- Ave más observada.
- Lugar con más avistamientos.
- Promedio de avistamientos por día.
- Cantidad de avistamientos por lugar.
- Cantidad de avistamientos por tipo de ave.

Los gráficos fueron implementados directamente con HTML, CSS y JavaScript,
sin utilizar librerías externas.