package cl.deepservice.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Getter @Setter @NoArgsConstructor
@Entity
@Table(name = "producto")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 140)
    private String slug;

    @Column(nullable = false, length = 160)
    private String nombre;

    @Column(length = 120)
    private String subcategoria;

    @Column(length = 600)
    private String resumen;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    /** Sin imagenes por ahora: el frontend dibuja un marco vacio cuando es null. */
    @Column(name = "imagen_url", length = 500)
    private String imagenUrl;

    @Column(nullable = false)
    private Boolean destacado = false;

    /** false = ficha en preparacion (solo nombre, marca y categoria). */
    @Column(nullable = false)
    private Boolean completo = false;

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(name = "fecha_creacion", nullable = false)
    private OffsetDateTime fechaCreacion = OffsetDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "marca_id")
    private Marca marca;

    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Especificacion> especificaciones = new ArrayList<>();

    public void agregarEspecificacion(Especificacion e) {
        especificaciones.add(e);
        e.setProducto(this);
    }

    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        return Objects.equals(id, ((Producto) o).id);
    }
    @Override public int hashCode() { return Objects.hash(id); }
}
