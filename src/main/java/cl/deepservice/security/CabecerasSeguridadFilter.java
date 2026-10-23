package cl.deepservice.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Cabeceras de seguridad en todas las respuestas, incluidas las de rechazo (401/403).
 *
 *  · La API nunca se guarda en caché (los datos del panel no quedan en el navegador ni en proxies).
 *  · La API no puede incrustarse en otras páginas ni ejecutar nada (CSP cerrada).
 *  · HTTPS obligatorio para los navegadores que ya visitaron el sitio (HSTS).
 *  · Cuerpos de más de 100 KB se rechazan antes de procesarlos.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class CabecerasSeguridadFilter extends OncePerRequestFilter {

    private static final long MAX_CUERPO_BYTES = 100_000L;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest req,
                                    @NonNull HttpServletResponse res,
                                    @NonNull FilterChain chain) throws ServletException, IOException {
        String ruta = req.getRequestURI() == null ? "" : req.getRequestURI();
        boolean api = ruta.startsWith("/api/") || ruta.startsWith("/auth/");

        res.setHeader("X-Content-Type-Options", "nosniff");
        res.setHeader("X-Frame-Options", "DENY");
        res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
        res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
        if (esHttps(req)) {
            res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
        }

        if (api) {
            res.setHeader("Cache-Control", "no-store");
            res.setHeader("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'");
            if (req.getContentLengthLong() > MAX_CUERPO_BYTES) {
                res.setStatus(413);
                res.setCharacterEncoding("UTF-8");
                res.setContentType("application/json");
                res.getWriter().write("{\"status\":413,\"mensaje\":\"La solicitud es demasiado grande\"}");
                return;
            }
        }
        chain.doFilter(req, res);
    }

    private static boolean esHttps(HttpServletRequest req) {
        if (req.isSecure()) return true;
        String proto = req.getHeader("X-Forwarded-Proto");
        return proto != null && proto.trim().equalsIgnoreCase("https");
    }
}
