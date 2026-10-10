package cl.deepservice.service;

import cl.deepservice.dto.Dtos.RegistroAdminRequest;
import cl.deepservice.dto.Dtos.UsuarioResponse;
import cl.deepservice.exception.RecursoNoEncontradoException;
import cl.deepservice.exception.RegistroNoAutorizadoException;
import cl.deepservice.exception.ReglaNegocioException;
import cl.deepservice.model.Rol;
import cl.deepservice.model.Usuario;
import cl.deepservice.repository.RolRepository;
import cl.deepservice.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarios;
    private final RolRepository roles;
    private final PasswordEncoder encoder;
    private final String codigoRegistro;

    public UsuarioService(UsuarioRepository usuarios, RolRepository roles, PasswordEncoder encoder,
                          @Value("${app.admin.registro-codigo:}") String codigoRegistro) {
        this.usuarios = usuarios;
        this.roles = roles;
        this.encoder = encoder;
        this.codigoRegistro = codigoRegistro == null ? "" : codigoRegistro.trim();
    }

    /**
     * Da de alta a un administrador. Es la unica forma de crear cuentas desde la web:
     * exige el codigo de autorizacion configurado en ADMIN_REGISTRO_CODIGO y, si no hay
     * codigo configurado, el registro queda cerrado.
     */
    @Transactional
    public UsuarioResponse registrarAdmin(RegistroAdminRequest req) {
        // El codigo se valida antes que nada: quien no lo tiene no debe poder
        // averiguar tampoco si un correo ya esta registrado.
        if (codigoRegistro.isEmpty()) {
            throw new RegistroNoAutorizadoException("El registro de administradores no esta habilitado");
        }
        if (!iguales(codigoRegistro, req.codigo().trim())) {
            throw new RegistroNoAutorizadoException("El codigo de autorizacion no es valido");
        }
        // BCrypt solo procesa 72 bytes; con tildes u otros caracteres un texto de 72 letras puede pasarse.
        if (req.contrasena().getBytes(StandardCharsets.UTF_8).length > 72) {
            throw new ReglaNegocioException("La contrasena es demasiado larga");
        }
        if (usuarios.existsByCorreoIgnoreCase(req.correo().trim())) {
            throw new ReglaNegocioException("Ya existe una cuenta registrada con ese correo");
        }

        Usuario u = new Usuario();
        u.setNombre(req.nombre().trim());
        u.setCorreo(req.correo().trim().toLowerCase());
        u.setContrasenaHash(encoder.encode(req.contrasena()));

        Rol rol = roles.findByNombre("ADMIN")
                .orElseGet(() -> roles.save(new Rol("ADMIN")));
        u.getRoles().add(rol);

        return aDto(usuarios.save(u));
    }

    @Transactional(readOnly = true)
    public UsuarioResponse porCorreo(String correo) {
        return usuarios.findByCorreoIgnoreCase(correo)
                .map(this::aDto)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));
    }

    /** Registra que la persona ya vio la ventana de bienvenida de su perfil. */
    @Transactional
    public UsuarioResponse marcarBienvenidaVista(String correo) {
        Usuario u = usuarios.findByCorreoIgnoreCase(correo)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));
        u.setBienvenidaVista(true);
        return aDto(u);
    }

    public UsuarioResponse aDto(Usuario u) {
        List<String> nombresRoles = u.getRoles().stream().map(Rol::getNombre).toList();
        return new UsuarioResponse(u.getId(), u.getNombre(), u.getCorreo(), u.getEmpresa(), nombresRoles,
                u.getFechaCreacion(), Boolean.TRUE.equals(u.getBienvenidaVista()));
    }

    /** Comparacion en tiempo constante para no filtrar el codigo por diferencias de tiempo. */
    private static boolean iguales(String a, String b) {
        return MessageDigest.isEqual(a.getBytes(StandardCharsets.UTF_8), b.getBytes(StandardCharsets.UTF_8));
    }
}
