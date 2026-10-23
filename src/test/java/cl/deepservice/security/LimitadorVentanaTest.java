package cl.deepservice.security;

import org.junit.jupiter.api.Test;

import java.util.concurrent.atomic.AtomicLong;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class LimitadorVentanaTest {

    private final AtomicLong ahora = new AtomicLong(1_000_000);

    private LimitadorVentana limitador(long ventanaMs, int maxClaves) {
        return new LimitadorVentana(ventanaMs, maxClaves, ahora::get);
    }

    @Test
    void cuentaLosEventosDentroDeLaVentanaYLosOlvidaAlVencer() {
        LimitadorVentana l = limitador(60_000, 10);
        l.registrar("a");
        ahora.addAndGet(30_000);
        l.registrar("a");
        assertEquals(2, l.contar("a"));

        ahora.addAndGet(30_001);              // el primero ya salió de la ventana
        assertEquals(1, l.contar("a"));

        ahora.addAndGet(30_000);              // el segundo también
        assertEquals(0, l.contar("a"));
        assertEquals(0, l.claves());          // y la clave vacía no ocupa lugar
    }

    @Test
    void cadaClaveSeCuentaPorSeparado() {
        LimitadorVentana l = limitador(60_000, 10);
        l.registrar("a");
        l.registrar("a");
        l.registrar("b");
        assertEquals(2, l.contar("a"));
        assertEquals(1, l.contar("b"));
        assertEquals(0, l.contar("c"));
    }

    @Test
    void olvidarBorraElHistorialDeLaClave() {
        LimitadorVentana l = limitador(60_000, 10);
        l.registrar("a");
        l.olvidar("a");
        assertEquals(0, l.contar("a"));
    }

    @Test
    void nuncaGuardaMasClavesQueElMaximoYDescartaLaMenosUsada() {
        LimitadorVentana l = limitador(60_000, 3);
        l.registrar("a");
        l.registrar("b");
        l.registrar("c");
        l.contar("a");                        // "a" se usó hace poco; la más antigua pasa a ser "b"
        l.registrar("d");
        assertEquals(3, l.claves());
        assertEquals(0, l.contar("b"));
        assertEquals(1, l.contar("a"));
        assertEquals(1, l.contar("d"));
    }

    @Test
    void unAtacanteQueInventaClavesNoAgotaLaMemoria() {
        LimitadorVentana l = limitador(60_000, 100);
        for (int i = 0; i < 10_000; i++) l.registrar("ip-" + i);
        assertEquals(100, l.claves());
    }

    @Test
    void segundosParaLiberarRedondeaHaciaArribaConMinimoUno() {
        LimitadorVentana l = limitador(60_000, 10);
        assertEquals(1, l.segundosParaLiberar("nadie"));
        l.registrar("a");
        assertEquals(60, l.segundosParaLiberar("a"));
        ahora.addAndGet(59_500);
        assertEquals(1, l.segundosParaLiberar("a"));
        ahora.addAndGet(100);
        assertEquals(1, l.segundosParaLiberar("a"));
    }

    @Test
    void rechazaParametrosInvalidos() {
        assertThrows(IllegalArgumentException.class, () -> new LimitadorVentana(0, 10));
        assertThrows(IllegalArgumentException.class, () -> new LimitadorVentana(1000, 0));
    }
}
