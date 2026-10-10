package cl.deepservice.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
@Entity
@Table(name = "categoria")
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 60)
    private String slug;

    @Column(nullable = false, length = 120)
    private String nombre;

    @Column(length = 400)
    private String descripcion;

    @Column(length = 40)
    private String icono;

    @Column(nullable = false)
    private Integer orden = 0;

    public Categoria(String slug, String nombre, String descripcion, String icono, Integer orden) {
        this.slug = slug; this.nombre = nombre;
        this.descripcion = descripcion; this.icono = icono; this.orden = orden;
    }
}
