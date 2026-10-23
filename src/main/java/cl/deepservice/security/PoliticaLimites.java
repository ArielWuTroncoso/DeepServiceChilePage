package cl.deepservice.security;

import cl.deepservice.exception.ExcesoSolicitudesException;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Límites de intentos del sitio. Todos son en memoria y se reinician al reiniciar el servidor.
 *
 * Ingreso de administradores (frena la fuerza bruta):
 *   · 5 fallos por cada combinación IP + correo
 *   · 20 fallos por correo desde cualquier IP (cubre a quien cambia de IP en cada intento)
 *   · 40 fallos por IP
 *   Todos dentro de 15 minutos. Durante el bloqueo no se acepta ni la contraseña correcta.
 *
 * Formulario de contacto: 8 mensajes por IP y 300 en total por hora.
 * Registro de administradores: 5 intentos por IP y 30 en total por hora.
 * Cambio de contraseña: 5 fallos por usuario cada 15 minutos.
 */
@Component
public class PoliticaLimites {

    private static final long QUINCE_MIN = 15L * 60_000;
    private static final long UNA_HORA = 60L * 60_000;
    private static final int MAX_CLAVES = 20_000;
    private static final String GLOBAL = "*";

    private final LimitadorVentana loginIpCorreo = new LimitadorVentana(QUINCE_MIN, MAX_CLAVES);
    private final LimitadorVentana loginCorreo = new LimitadorVentana(QUINCE_MIN, MAX_CLAVES);
    private final LimitadorVentana loginIp = new LimitadorVentana(QUINCE_MIN, MAX_CLAVES);
    private final LimitadorVentana registro = new LimitadorVentana(UNA_HORA, MAX_CLAVES);
    private final LimitadorVentana contacto = new LimitadorVentana(UNA_HORA, MAX_CLAVES);
    private final LimitadorVentana cambioClave = new LimitadorVentana(QUINCE_MIN, MAX_CLAVES);

    // ----- ingreso -----

    public void antesDeLogin(String ip, String correo) {
        String c = normalizar(correo);
        exigir(loginIpCorreo, ip + "|" + c, 5);
        exigir(loginCorreo, c, 20);
        exigir(loginIp, ip, 40);
    }

    public void loginFallido(String ip, String correo) {
        String c = normalizar(correo);
        loginIpCorreo.registrar(ip + "|" + c);
        loginCorreo.registrar(c);
        loginIp.registrar(ip);
    }

    public void loginCorrecto(String ip, String correo) {
        loginIpCorreo.olvidar(ip + "|" + normalizar(correo));
    }

    // ----- registro de administradores -----

    /** Cuenta el intento y lo rechaza si ya hay demasiados. */
    public void intentoDeRegistro(String ip) {
        exigir(registro, ip, 5);
        exigir(registro, GLOBAL, 30);
        registro.registrar(ip);
        registro.registrar(GLOBAL);
    }

    // ----- formulario de contacto -----

    /** Cuenta el envío y lo rechaza si ya hay demasiados. */
    public void envioDeContacto(String ip) {
        exigir(contacto, ip, 8);
        exigir(contacto, GLOBAL, 300);
        contacto.registrar(ip);
        contacto.registrar(GLOBAL);
    }

    // ----- cambio de contraseña -----

    public void antesDeCambiarClave(String correo) {
        exigir(cambioClave, normalizar(correo), 5);
    }

    public void cambioDeClaveFallido(String correo) {
        cambioClave.registrar(normalizar(correo));
    }

    public void cambioDeClaveCorrecto(String correo) {
        cambioClave.olvidar(normalizar(correo));
    }

    // ----- apoyo -----

    private static void exigir(LimitadorVentana limitador, String clave, int maximo) {
        if (limitador.contar(clave) >= maximo) {
            throw new ExcesoSolicitudesException(limitador.segundosParaLiberar(clave));
        }
    }

    static String normalizar(String correo) {
        if (correo == null) return "";
        String c = correo.trim().toLowerCase(Locale.ROOT);
        return c.length() > 180 ? c.substring(0, 180) : c;
    }
}
