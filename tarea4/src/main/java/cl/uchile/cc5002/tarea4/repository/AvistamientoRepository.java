package cl.uchile.cc5002.tarea4.repository;

import cl.uchile.cc5002.tarea4.model.Avistamiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface AvistamientoRepository extends JpaRepository<Avistamiento, Integer> {

    @Query("SELECT a FROM Avistamiento a " +
           "WHERE LOWER(a.ave.nombre) LIKE LOWER(CONCAT('%', :texto, '%')) " +
           "OR LOWER(a.voluntario.nombre) LIKE LOWER(CONCAT('%', :texto, '%')) " +
           "OR LOWER(a.voluntario.comuna.nombre) LIKE LOWER(CONCAT('%', :texto, '%')) " +
           "ORDER BY a.fechaHora DESC")
    List<Avistamiento> buscarPorCoincidencia(@Param("texto") String texto);
}