package cl.deepservice.model;

/** Tipos de movimiento de inventario. */
public enum TipoMovimiento {
    /** Suma unidades (compra, devolución de un cliente, etc.). */
    ENTRADA,
    /** Resta unidades (venta, instalación, merma, etc.). */
    SALIDA,
    /** Fija el stock en una cantidad exacta (conteo físico). */
    AJUSTE
}
