package cl.deepservice.config;

import cl.deepservice.repository.UsuarioRepository;
import cl.deepservice.security.CredencialesConocidas;
import cl.deepservice.service.InventarioService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Tareas de arranque que corren siempre (aunque SEED_ENABLED=false):
 * deja cada equipo con su fila de inventario y avisa si sigue vigente la credencial
 * que estuvo publicada en la primera versión del sitio.
 */
@Configuration
@Order(2)
public class ArranqueInventario implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(ArranqueInventario.class);

    private final InventarioService inventario;
    private final UsuarioRepository usuarios;
    private final PasswordEncoder encoder;

    public ArranqueInventario(InventarioService inventario, UsuarioRepository usuarios, PasswordEncoder encoder) {
        this.inventario = inventario;
        this.usuarios = usuarios;
        this.encoder = encoder;
    }

    @Override
    public void run(String... args) {
        inventario.asegurarTodos();

        usuarios.findByCorreoIgnoreCase(CredencialesConocidas.CORREO_INICIAL).ifPresent(u -> {
            if (encoder.matches(CredencialesConocidas.CLAVE_INICIAL, u.getContrasenaHash())) {
                log.error("ATENCION: la cuenta {} todavia usa la contrasena que estuvo publicada. "
                        + "Ingresa al panel y cambiala de inmediato (el panel lo exige).", u.getCorreo());
            }
        });
    }
}
