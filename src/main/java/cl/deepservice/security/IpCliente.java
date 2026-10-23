package cl.deepservice.security;

import jakarta.servlet.http.HttpServletRequest;

/**
 * Dirección del visitante. Detrás del proxy de Render llega en X-Forwarded-For.
 *
 * Ese encabezado lo puede escribir el propio visitante, así que la IP se usa solo como
 * una de varias claves de los límites de intentos (ver {@link PoliticaLimites}): los
 * límites por correo y los globales siguen valiendo aunque la IP sea falsa.
 */
public final class IpCliente {

    private IpCliente() { }

    public static String de(HttpServletRequest req) {
        String cabecera = req.getHeader("X-Forwarded-For");
        if (cabecera != null && !cabecera.isBlank()) {
            String primera = cabecera.split(",")[0].trim();
            if (primera.length() <= 45 && primera.matches("[0-9A-Fa-f:.]+")) return primera;
        }
        String directa = req.getRemoteAddr();
        return directa == null || directa.isBlank() ? "desconocida" : directa;
    }
}
