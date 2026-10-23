package cl.deepservice.model;

import cl.deepservice.exception.ReglaNegocioException;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class InventarioTest {

    private Inventario con(int stock) {
        Inventario i = new Inventario(1L);
        i.setStock(stock);
        return i;
    }

    @Test
    void laEntradaSuma() {
        assertEquals(8, con(5).aplicar(TipoMovimiento.ENTRADA, 3));
    }

    @Test
    void laSalidaResta() {
        Inventario i = con(5);
        assertEquals(2, i.aplicar(TipoMovimiento.SALIDA, 3));
        assertEquals(2, (int) i.getStock());
    }

    @Test
    void nuncaQuedaNegativoYElStockNoCambiaSiSeRechaza() {
        Inventario i = con(2);
        ReglaNegocioException ex = assertThrows(ReglaNegocioException.class, () -> i.aplicar(TipoMovimiento.SALIDA, 3));
        assertTrue(ex.getMessage().contains("Stock insuficiente"));
        assertEquals(2, (int) i.getStock());
    }

    @Test
    void sePuedeRetirarTodoElStock() {
        assertEquals(0, con(4).aplicar(TipoMovimiento.SALIDA, 4));
    }

    @Test
    void elAjusteFijaElTotalIncluidoCero() {
        assertEquals(12, con(5).aplicar(TipoMovimiento.AJUSTE, 12));
        assertEquals(0, con(5).aplicar(TipoMovimiento.AJUSTE, 0));
    }

    @Test
    void entradaYSalidaExigenAlMenosUnaUnidad() {
        assertThrows(ReglaNegocioException.class, () -> con(5).aplicar(TipoMovimiento.ENTRADA, 0));
        assertThrows(ReglaNegocioException.class, () -> con(5).aplicar(TipoMovimiento.SALIDA, 0));
        assertThrows(ReglaNegocioException.class, () -> con(5).aplicar(TipoMovimiento.AJUSTE, -1));
    }

    @Test
    void respetaElMaximoYNoDesbordaElEntero() {
        assertEquals(Inventario.STOCK_MAXIMO, con(Inventario.STOCK_MAXIMO - 1).aplicar(TipoMovimiento.ENTRADA, 1));
        assertThrows(ReglaNegocioException.class, () -> con(Inventario.STOCK_MAXIMO).aplicar(TipoMovimiento.ENTRADA, 1));
        assertThrows(ReglaNegocioException.class, () -> con(1).aplicar(TipoMovimiento.ENTRADA, Integer.MAX_VALUE));
        assertThrows(ReglaNegocioException.class, () -> con(0).aplicar(TipoMovimiento.AJUSTE, Inventario.STOCK_MAXIMO + 1));
    }

    @Test
    void sinTipoSeRechaza() {
        assertThrows(ReglaNegocioException.class, () -> con(5).aplicar(null, 1));
    }
}
