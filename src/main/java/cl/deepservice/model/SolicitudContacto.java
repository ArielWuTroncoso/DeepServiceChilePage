package cl.deepservice.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter @Setter @NoArgsConstructor
@Entity
@Table(name = "solicitud_contacto")
public class SolicitudContacto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(length = 150)
    private String empresa;

    @Column(nullable = false, length = 180)
    private String correo;

    @Column(length = 30)
    private String telefono;

    @Column(length = 180)
    private String embarcacion;

    @Column(length = 80)
    private String interes;

    @Column(name = "producto_slug", length = 140)
    private String productoSlug;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String mensaje;

    @Column(nullable = false)
    private Boolean atendida = false;

    @Column(name = "fecha_creacion", nullable = false)
    private OffsetDateTime fechaCreacion = OffsetDateTime.now();
}
