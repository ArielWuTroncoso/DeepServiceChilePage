package cl.deepservice.model;

import cl.deepservice.exception.ReglaNegocioException;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;

/**
 * Existencias de un equipo. Es información interna: vive en su propia tabla y
 * jamás forma parte de los datos públicos del catálogo.
 */
@Getter @Setter @NoArgsConstructor
@Entity
@Table(name = "inventario")
public class Inventario {

    /** Tope razonable para detectar errores de tipeo (un cero de más). */
    public static final int STOCK_MAXIMO = 1_000_000;

    @Id
    @Column(name = "producto_id")
    private Long productoId;

    @Column(nullable = false)
    private Integer stock = 0;

    /** Bajo este nivel el equipo se marca como "stock bajo". */
    @Column(name = "stock_minimo", nullable = false)
    private Integer stockMinimo = 0;

    @Column(name = "actualizado_en", nullable = false)
    private OffsetDateTime actualizadoEn = OffsetDateTime.now();

    public Inventario(Long productoId) {
        this.productoId = productoId;
    }

    /**
     * Aplica un movimiento y devuelve el stock resultante. Nunca deja el stock
     * negativo: una salida mayor a lo disponible se rechaza.
     */
    public int aplicar(TipoMovimiento tipo, int cantidad) {
        if (tipo == null) {
            throw new ReglaNegocioException("Indica el tipo de movimiento");
        }
        int actual = stock == null ? 0 : stock;
        long nuevo;
        switch (tipo) {
            case ENTRADA -> {
                if (cantidad < 1) throw new ReglaNegocioException("La cantidad debe ser de al menos 1");
                nuevo = (long) actual + cantidad;
            }
            case SALIDA -> {
                if (cantidad < 1) throw new ReglaNegocioException("La cantidad debe ser de al menos 1");
                if (cantidad > actual) {
                    throw new ReglaNegocioException("Stock insuficiente: hay " + actual
                            + " unidades y se intenta retirar " + cantidad);
                }
                nuevo = (long) actual - cantidad;
            }
            case AJUSTE -> {
                if (cantidad < 0) throw new ReglaNegocioException("El stock no puede ser negativo");
                nuevo = cantidad;
            }
            default -> throw new ReglaNegocioException("Tipo de movimiento no válido");
        }
        if (nuevo > STOCK_MAXIMO) {
            throw new ReglaNegocioException("El stock no puede superar " + STOCK_MAXIMO + " unidades");
        }
        stock = (int) nuevo;
        actualizadoEn = OffsetDateTime.now();
        return stock;
    }
}
