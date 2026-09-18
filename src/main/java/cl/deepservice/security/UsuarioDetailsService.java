package cl.deepservice.security;

import cl.deepservice.model.Usuario;
import cl.deepservice.repository.UsuarioRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

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
