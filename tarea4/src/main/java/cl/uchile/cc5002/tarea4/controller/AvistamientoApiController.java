package cl.uchile.cc5002.tarea4.controller;

import cl.uchile.cc5002.tarea4.dto.AvistamientoBusquedaDTO;
import cl.uchile.cc5002.tarea4.model.Avistamiento;
import cl.uchile.cc5002.tarea4.model.Nota;
import cl.uchile.cc5002.tarea4.repository.AvistamientoRepository;
import cl.uchile.cc5002.tarea4.repository.NotaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/avistamientos")
public class AvistamientoApiController {

    private final AvistamientoRepository avistamientoRepository;
    private final NotaRepository notaRepository;
    private static final DateTimeFormatter FORMATO_DIA = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    public AvistamientoApiController(AvistamientoRepository avistamientoRepository, NotaRepository notaRepository) {
        this.avistamientoRepository = avistamientoRepository;
        this.notaRepository = notaRepository;
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<AvistamientoBusquedaDTO>> buscarAvistamientos(
            @RequestParam(name = "q", defaultValue = "") String query) {

        String textoBuscado = query.trim();
        if (textoBuscado.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        List<Avistamiento> resultados = avistamientoRepository.buscarPorCoincidencia(textoBuscado);
        List<AvistamientoBusquedaDTO> respuesta = new ArrayList<>();

        for (Avistamiento a : resultados) {
            Double promedio = notaRepository.calcularPromedioPorAvistamiento(a.getId());
            String notaFormateada = (promedio == null) ? "-" : String.format(Locale.US, "%.1f", promedio);

            String diaFormateado = (a.getFechaHora() != null)
                    ? a.getFechaHora().format(FORMATO_DIA)
                    : "Sin fecha";

            respuesta.add(new AvistamientoBusquedaDTO(
                    a.getId(),
                    a.getVoluntario().getNombre(),
                    diaFormateado,
                    a.getAve().getNombre(),
                    a.getVoluntario().getComuna().getNombre(),
                    notaFormateada
            ));
        }

        return ResponseEntity.ok(respuesta);
    }

    @PostMapping("/{id}/notas")
    public ResponseEntity<Map<String, Object>> agregarNota(
            @PathVariable("id") Integer avistamientoId,
            @RequestBody Map<String, Object> payload) {

        Map<String, Object> response = new HashMap<>();

        Optional<Avistamiento> avistamientoOpt = avistamientoRepository.findById(avistamientoId);
        if (avistamientoOpt.isEmpty()) {
            response.put("success", false);
            response.put("error", "El avistamiento indicado no existe.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        Object notaObj = payload.get("nota");
        if (!(notaObj instanceof Integer)) {
            response.put("success", false);
            response.put("error", "La nota debe ser un numero entero entre 1 y 7.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        Integer notaValor = (Integer) notaObj;
        if (notaValor < 1 || notaValor > 7) {
            response.put("success", false);
            response.put("error", "La nota debe ser un numero entero entre 1 y 7.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        Nota nuevaNota = new Nota();
        nuevaNota.setAvistamiento(avistamientoOpt.get());
        nuevaNota.setNota(notaValor);
        notaRepository.save(nuevaNota);

        Double nuevoPromedio = notaRepository.calcularPromedioPorAvistamiento(avistamientoId);
        String notaFormateada = (nuevoPromedio == null) ? "-" : String.format(Locale.US, "%.1f", nuevoPromedio);

        response.put("success", true);
        response.put("notaPromedio", notaFormateada);
        return ResponseEntity.ok(response);
    }
}
