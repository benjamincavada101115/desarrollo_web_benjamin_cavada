package cl.uchile.cc5002.tarea4.dto;

public class AvistamientoBusquedaDTO {

    private Integer id;
    private String voluntario;
    private String dia;
    private String ave;
    private String comuna;
    private String nota;

    public AvistamientoBusquedaDTO(Integer id, String voluntario, String dia, String ave, String comuna, String nota) {
        this.id = id;
        this.voluntario = voluntario;
        this.dia = dia;
        this.ave = ave;
        this.comuna = comuna;
        this.nota = nota;
    }

    public Integer getId() {
        return id;
    }

    public String getVoluntario() {
        return voluntario;
    }

    public String getDia() {
        return dia;
    }

    public String getAve() {
        return ave;
    }

    public String getComuna() {
        return comuna;
    }

    public String getNota() {
        return nota;
    }
}