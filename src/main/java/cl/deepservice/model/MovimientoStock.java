package cl.deepservice.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;

/** Registro permanente de cada cambio de stock: qué pasó, cuándo y quién lo hizo. */
@Getter @Setter @NoArgsConstructor
@Entity
@Table(name = "movimiento_stock",
        indexes = @Index(name = "idx_movimiento_producto_fecha", columnList = "producto_id, fecha"))
public class MovimientoStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "producto_id", nullable = false)
    private Long productoId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private TipoMovimiento tipo;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(name = "stock_resultante", nullable = false)
    private Integer stockResultante;

    @Column(length = 200)
    private String motivo;

    /** Correo de quien hizo el movimiento. */
    @Column(nullable = false, length = 180)
    private String usuario;

    @Column(nullable = false)
    private OffsetDateTime fecha = OffsetDateTime.now();
}
