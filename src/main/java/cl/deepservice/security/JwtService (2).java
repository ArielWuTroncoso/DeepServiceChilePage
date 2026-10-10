package cl.deepservice.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;

@Service
public class JwtService {

    private final SecretKey clave;
    private final long expiracionMs;

    public JwtService(@Value("${jwt.secret}") String secreto,
                      @Value("${jwt.expiration}") long expiracionMs) {
        byte[] bytes;
        try {
            bytes = Decoders.BASE64.decode(secreto);
        } catch (IllegalArgumentException ex) {
            bytes = secreto.getBytes(StandardCharsets.UTF_8);
        }
        this.clave = Keys.hmacShaKeyFor(bytes);
        this.expiracionMs = expiracionMs;
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
