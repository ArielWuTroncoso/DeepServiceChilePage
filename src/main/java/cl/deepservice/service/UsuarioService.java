package cl.deepservice.service;

import cl.deepservice.dto.Dtos.RegistroRequest;
import cl.deepservice.dto.Dtos.UsuarioResponse;
import cl.deepservice.exception.RecursoNoEncontradoException;
import cl.deepservice.exception.ReglaNegocioException;
import cl.deepservice.model.Rol;
import cl.deepservice.model.Usuario;
import cl.deepservice.repository.RolRepository;
import cl.deepservice.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarios;
    private final RolRepository roles;
    private final PasswordEncoder encoder;

    public UsuarioService(UsuarioRepository usuarios, RolRepository roles, PasswordEncoder encoder) {
        this.usuarios = usuarios;
        this.roles = roles;
        this.encoder = encoder;
    }

    @Transactional
    public UsuarioResponse registrar(RegistroRequest req) {
        if (usuarios.existsByCorreoIgnoreCase(req.correo())) {
            throw new ReglaNegocioException("Ya existe una cuenta registrada con ese correo");
        }

        Usuario u = new Usuario();
        u.setNombre(req.nombre().trim());
        u.setCorreo(req.correo().trim().toLowerCase());
        u.setContrasenaHash(encoder.encode(req.contrasena()));
        u.setTelefono(req.telefono());
        u.setEmpresa(req.empresa());

        Rol rol = roles.findByNombre("USUARIO")
                .orElseGet(() -> roles.save(new Rol("USUARIO")));
        u.getRoles().add(rol);

        return aDto(usuarios.save(u));
    }

    @Transactional(readOnly = true)
    public UsuarioResponse porCorreo(String correo) {
        return usuarios.findByCorreoIgnoreCase(correo)
                .map(this::aDto)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));
    }

    public UsuarioResponse aDto(Usuario u) {
        List<String> nombresRoles = u.getRoles().stream().map(Rol::getNombre).toList();
        return new UsuarioResponse(u.getId(), u.getNombre(), u.getCorreo(), u.getEmpresa(), nombresRoles);
    }
}
