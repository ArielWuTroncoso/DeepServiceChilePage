package cl.deepservice.security;

import cl.deepservice.model.Usuario;
import cl.deepservice.repository.UsuarioRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;

@Service
public class UsuarioDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarios;

    public UsuarioDetailsService(UsuarioRepository usuarios) {
        this.usuarios = usuarios;
    }

    @Override
    public UserDetails loadUserByUsername(String correo) throws UsernameNotFoundException {
        Usuario u = usuarios.findByCorreoIgnoreCase(correo)
                .orElseThrow(() -> new UsernameNotFoundException("Credenciales incorrectas"));
        return construir(u);
    }

    /**
     * Carga al usuario de una sesión. Devuelve null si la sesión se emitió antes del último
     * cambio de contraseña: cambiar la clave cierra todas las sesiones anteriores.
     */
    public UserDetails cargarSiVigente(String correo, Date emisionSesion) {
        Usuario u = usuarios.findByCorreoIgnoreCase(correo).orElse(null);
        if (u == null) return null;
        OffsetDateTime cambio = u.getClaveCambiadaEn();
        if (cambio != null && emisionSesion != null
                && emisionSesion.toInstant().isBefore(cambio.toInstant().truncatedTo(ChronoUnit.SECONDS))) {
            return null;
        }
        return construir(u);
    }

    private UserDetails construir(Usuario u) {
        List<SimpleGrantedAuthority> permisos = u.getRoles().stream()
                .map(r -> new SimpleGrantedAuthority("ROLE_" + r.getNombre()))
                .toList();

        return User.withUsername(u.getCorreo())
                .password(u.getContrasenaHash())
                .authorities(permisos)
                .disabled(Boolean.FALSE.equals(u.getActivo()))
                .build();
    }
}
