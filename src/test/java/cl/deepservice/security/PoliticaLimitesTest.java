package cl.deepservice.security;

import cl.deepservice.exception.ExcesoSolicitudesException;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class PoliticaLimitesTest {

    private void fallar(PoliticaLimites p, String ip, String correo, int veces) {
        for (int i = 0; i < veces; i++) {
            p.antesDeLogin(ip, correo);
            p.loginFallido(ip, correo);
        }
    }

    @Test
    void bloqueaElSextoIntentoDeLaMismaIpYCorreo() {
        PoliticaLimites p = new PoliticaLimites();
        fallar(p, "1.1.1.1", "admin@x.cl", 5);
        ExcesoSolicitudesException ex = assertThrows(ExcesoSolicitudesException.class,
                () -> p.antesDeLogin("1.1.1.1", "admin@x.cl"));
        assertTrue(ex.getSegundosParaReintentar() >= 1);
    }

    @Test
    void duranteElBloqueoSePideEsperarAunqueLaClaveFueraCorrecta() {
        PoliticaLimites p = new PoliticaLimites();
        fallar(p, "1.1.1.1", "admin@x.cl", 5);
        // El controlador llama antesDeLogin antes de revisar la contraseña, así que ni siquiera se llega a revisarla.
        assertThrows(ExcesoSolicitudesException.class, () -> p.antesDeLogin("1.1.1.1", "admin@x.cl"));
    }

    @Test
    void elCorreoSeNormalizaParaQueNoSeEvadaCambiandoMayusculasOEspacios() {
        PoliticaLimites p = new PoliticaLimites();
        fallar(p, "1.1.1.1", "Admin@X.cl", 3);
        fallar(p, "1.1.1.1", "  admin@x.CL ", 2);
        assertThrows(ExcesoSolicitudesException.class, () -> p.antesDeLogin("1.1.1.1", "ADMIN@x.cl"));
    }

    @Test
    void cambiarDeIpNoPermiteAdivinarSinLimiteLaClaveDeUnCorreo() {
        PoliticaLimites p = new PoliticaLimites();
        for (int i = 0; i < 20; i++) fallar(p, "10.0.0." + i, "admin@x.cl", 1);   // 20 fallos desde 20 IP distintas
        assertThrows(ExcesoSolicitudesException.class, () -> p.antesDeLogin("10.0.9.9", "admin@x.cl"));
    }

    @Test
    void unaIpNoPuedeProbarMuchosCorreosSinLimite() {
        PoliticaLimites p = new PoliticaLimites();
        for (int i = 0; i < 40; i++) fallar(p, "2.2.2.2", "usuario" + i + "@x.cl", 1);
        assertThrows(ExcesoSolicitudesException.class, () -> p.antesDeLogin("2.2.2.2", "otro@x.cl"));
    }

    @Test
    void otraIpConOtroCorreoNoSeVeAfectada() {
        PoliticaLimites p = new PoliticaLimites();
        fallar(p, "1.1.1.1", "admin@x.cl", 5);
        p.antesDeLogin("3.3.3.3", "otra@x.cl");   // no debe lanzar
    }

    @Test
    void unIngresoCorrectoLimpiaLosFallosDeEsaIpYCorreo() {
        PoliticaLimites p = new PoliticaLimites();
        fallar(p, "1.1.1.1", "admin@x.cl", 4);
        p.loginCorrecto("1.1.1.1", "admin@x.cl");
        fallar(p, "1.1.1.1", "admin@x.cl", 4);   // vuelve a contar desde cero: no lanza
    }

    @Test
    void contactoPermiteOchoEnviosPorIpYRechazaElNoveno() {
        PoliticaLimites p = new PoliticaLimites();
        for (int i = 0; i < 8; i++) p.envioDeContacto("1.1.1.1");
        assertThrows(ExcesoSolicitudesException.class, () -> p.envioDeContacto("1.1.1.1"));
        p.envioDeContacto("9.9.9.9");             // otra IP sigue pudiendo escribir
    }

    @Test
    void registroPermiteCincoIntentosPorIp() {
        PoliticaLimites p = new PoliticaLimites();
        for (int i = 0; i < 5; i++) p.intentoDeRegistro("1.1.1.1");
        assertThrows(ExcesoSolicitudesException.class, () -> p.intentoDeRegistro("1.1.1.1"));
    }

    @Test
    void cambioDeClaveSeBloqueaTrasCincoFallos() {
        PoliticaLimites p = new PoliticaLimites();
        for (int i = 0; i < 5; i++) {
            p.antesDeCambiarClave("admin@x.cl");
            p.cambioDeClaveFallido("admin@x.cl");
        }
        assertThrows(ExcesoSolicitudesException.class, () -> p.antesDeCambiarClave("Admin@x.cl"));
        p.cambioDeClaveCorrecto("admin@x.cl");
        p.antesDeCambiarClave("admin@x.cl");      // ya no está bloqueado
    }

    @Test
    void normalizarAcotaYLimpiaElCorreo() {
        assertEquals("", PoliticaLimites.normalizar(null));
        assertEquals("a@b.cl", PoliticaLimites.normalizar("  A@B.cl "));
        assertEquals(180, PoliticaLimites.normalizar("x".repeat(500)).length());
    }
}
