package cl.deepservice.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
@Entity
@Table(name = "marca")
public class Marca {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 60)
    private String slug;

    @Column(nullable = false, length = 120)
    private String nombre;

    @Column(length = 400)
    private String descripcion;

    /** Ruta del logotipo. Se deja vacío hasta contar con el material grafico. */
    @Column(name = "logo_url", length = 400)
    private String logoUrl;

    @Column(nullable = false)
    private Boolean destacada = false;

    public Marca(String slug, String nombre, String descripcion, Boolean destacada) {
        this.slug = slug; this.nombre = nombre;
        this.descripcion = descripcion; this.destacada = destacada;
    }
}
