package cl.deepservice.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Date;
import java.util.Map;

@Service
public class JwtService {

    private static final Logger log = LoggerFactory.getLogger(JwtService.class);

    private final SecretKey clave;
    private final long expiracionMs;

    public JwtService(@Value("${jwt.secret:}") String secreto,
                      @Value("${jwt.expiration}") long expiracionMs) {
        this.clave = Keys.hmacShaKeyFor(bytesDeFirma(secreto));
        this.expiracionMs = expiracionMs;
    }

    /**
     * La firma de las sesiones debe ser secreta. Si no hay JWT_SECRET (o es la que venía
     * publicada en el repositorio) se usa una clave aleatoria de esta ejecución: el sitio
     * funciona, pero las sesiones se cierran cada vez que el servidor se reinicia.
     */
    private static byte[] bytesDeFirma(String secreto) {
        String s = secreto == null ? "" : secreto.trim();
        if (s.isEmpty()) {
            log.error("SEGURIDAD: JWT_SECRET no está definido. Se usa una clave temporal; "
                    + "define JWT_SECRET (openssl rand -base64 48) para que las sesiones sobrevivan a un reinicio.");
            return aleatoria();
        }
        if (s.equalsIgnoreCase(CredencialesConocidas.JWT_SECRET_PUBLICO)) {
            log.error("SEGURIDAD: JWT_SECRET es el valor de ejemplo publicado en el repositorio y se ignora. "
                    + "Define uno propio (openssl rand -base64 48).");
            return aleatoria();
        }
        byte[] bytes;
        try {
            bytes = Decoders.BASE64.decode(s);
        } catch (RuntimeException ex) {
            // No es Base64 valido (jjwt lanza DecodingException): se usa el texto tal cual.
            bytes = s.getBytes(StandardCharsets.UTF_8);
        }
        if (bytes.length < 32) {
            throw new IllegalStateException("JWT_SECRET es demasiado corto: necesita al menos 32 bytes.");
        }
        return bytes;
    }

    private static byte[] aleatoria() {
        byte[] bytes = new byte[48];
        new SecureRandom().nextBytes(bytes);
        return bytes;
    }

    public String generar(String correo, Map<String, Object> extras) {
        Date ahora = new Date();
        return Jwts.builder()
                .claims(extras)
                .subject(correo)
                .issuedAt(ahora)
                .expiration(new Date(ahora.getTime() + expiracionMs))
                .signWith(clave)
                .compact();
    }

    public String extraerCorreo(String token) {
        return parsear(token).getSubject();
    }

    /** Momento en que se emitió la sesión (precisión de segundos). */
    public Date extraerEmision(String token) {
        return parsear(token).getIssuedAt();
    }

    public boolean esValido(String token) {
        try {
            return parsear(token).getExpiration().after(new Date());
        } catch (Exception ex) {
            return false;
        }
    }

    private Claims parsear(String token) {
        return Jwts.parser().verifyWith(clave).build().parseSignedClaims(token).getPayload();
    }
}
