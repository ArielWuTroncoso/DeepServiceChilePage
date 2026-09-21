package cl.deepservice.config;

import cl.deepservice.model.*;
import cl.deepservice.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Carga inicial del catálogo.
 *
 * Deja la ESTRUCTURA lista (categorías, marcas y fichas) sin imágenes:
 * el campo imagenUrl queda en null a propósito y el frontend dibuja un marco
 * vacío. Solo el FCV-800 trae especificaciones completas, verificadas contra
 * el folleto oficial Furuno FCV-600/FCV-800 y furuno.es; el resto queda
 * marcado como "ficha en preparación" para completar con el fabricante.
 *
 * Se desactiva con SEED_ENABLED=false.
 */
@Configuration
@ConditionalOnProperty(name = "app.seed.enabled", havingValue = "true", matchIfMissing = true)
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final CategoriaRepository categorias;
    private final MarcaRepository marcas;
    private final ProductoRepository productos;
    private final RolRepository roles;
    private final UsuarioRepository usuarios;
    private final PasswordEncoder encoder;

    public DataSeeder(CategoriaRepository categorias, MarcaRepository marcas, ProductoRepository productos,
                      RolRepository roles, UsuarioRepository usuarios, PasswordEncoder encoder) {
        this.categorias = categorias;
        this.marcas = marcas;
        this.productos = productos;
        this.roles = roles;
        this.usuarios = usuarios;
        this.encoder = encoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        sembrarRoles();
        sembrarAdministrador();
        if (categorias.count() == 0) sembrarCategorias();
        if (marcas.count() == 0) sembrarMarcas();
        if (productos.count() == 0) sembrarProductos();
    }

    private void sembrarRoles() {
        for (String nombre : List.of("USUARIO", "ADMIN")) {
            roles.findByNombre(nombre).orElseGet(() -> roles.save(new Rol(nombre)));
        }
    }

    private void sembrarAdministrador() {
        String correo = "admin@deepservicechile.cl";
        if (usuarios.existsByCorreoIgnoreCase(correo)) return;

        Usuario admin = new Usuario();
        admin.setNombre("Administrador");
        admin.setCorreo(correo);
        // Credencial inicial de desarrollo: cambiar en el primer ingreso.
        admin.setContrasenaHash(encoder.encode("DeepService2026"));
        roles.findByNombre("ADMIN").ifPresent(r -> admin.getRoles().add(r));
        roles.findByNombre("USUARIO").ifPresent(r -> admin.getRoles().add(r));
        usuarios.save(admin);

        log.warn("Usuario administrador creado: {} — cambia la contrasena inicial.", correo);
    }

    private void sembrarCategorias() {
        categorias.saveAll(List.of(
                new Categoria("pesca", "Equipos de pesca",
                        "Sondas, sonares y transductores para deteccion bajo el agua.", "Fish", 1),
                new Categoria("navegacion", "Navegacion",
                        "GPS, ploters, radares, pilotos automaticos y pantallas multifuncion.", "Compass", 2),
                new Categoria("comunicaciones", "Comunicaciones",
                        "Radios VHF y HF, AIS, satelital e intercomunicadores.", "RadioTower", 3),
                new Categoria("seguridad", "Seguridad",
                        "AIS, radiobalizas, registradores y equipamiento normativo.", "LifeBuoy", 4),
                new Categoria("accesorios", "Accesorios",
                        "Transductores, antenas, cables, soportes y repuestos.", "Cable", 5)));
    }

    private void sembrarMarcas() {
        marcas.saveAll(List.of(
                new Marca("furuno", "FURUNO",
                        "Electronica marina japonesa: sonares, radares, sondas, GPS y comunicaciones. "
                                + "Es la linea sobre la que trabaja nuestro servicio tecnico.", true),
                new Marca("garmin", "GARMIN",
                        "Ploters, sondas y sistemas de navegacion con cartografia integrada "
                                + "para embarcaciones menores y de recreo.", false),
                new Marca("icom", "ICOM",
                        "Radiocomunicacion marina: equipos VHF y HF con llamada selectiva digital (LSD/DSC).", false),
                new Marca("acr", "ACR",
                        "Equipamiento de seguridad y localizacion de emergencia: radiobalizas RLS/EPIRB, PLB y SART.", false),
                new Marca("marport", "MARPORT",
                        "Sensores de monitoreo de captura y control de arte de pesca para flota industrial.", false)));
    }

    private void sembrarProductos() {
        Categoria pesca = cat("pesca");
        Categoria nav = cat("navegacion");
        Categoria com = cat("comunicaciones");
        Categoria seg = cat("seguridad");
        Categoria acc = cat("accesorios");
        Marca furuno = marca("furuno");

        // --- Ficha completa y verificada ---
        Producto fcv800 = base("furuno-fcv-800", "FCV-800", "Sonda de pesca", pesca, furuno);
        fcv800.setDestacado(true);
        fcv800.setCompleto(true);
        fcv800.setResumen("Sonda de pesca a color de 8,4\" con TruEcho CHIRP de 40 a 225 kHz: "
                + "mas detalles y una separacion de objetivos sin precedentes.");
        fcv800.setDescripcion("Combina el barrido de banda ancha TruEcho CHIRP con frecuencias CW tradicionales "
                + "y permite conectar dos transductores, de modo que ACCU-FISH y la discriminacion de fondo "
                + "trabajen simultaneamente con la imagen CHIRP.");
        int i = 0;
        for (String[] spec : new String[][] {
                { "Pantalla", "8,4\" TFT color SVGA 800 x 600" },
                { "Frecuencias CHIRP", "40 a 225 kHz" },
                { "Frecuencias CW", "50 / 200 kHz" },
                { "Alcance basico", "2 a 1.200 m" },
                { "Potencia de salida", "600 W / 1 kW" },
                { "Proteccion", "IP56" },
                { "Alimentacion", "12 - 24 V CC" },
                { "Transductores", "Capacidad de conectar 2" } }) {
            fcv800.agregarEspecificacion(new Especificacion(spec[0], spec[1], i++));
        }
        productos.save(fcv800);

        // --- Estructura del catalogo: fichas por completar ---
        productos.saveAll(List.of(
                pendiente("furuno-fcv-600", "FCV-600", "Sonda de pesca", pesca, furuno,
                        "Sonda de pesca a color de 5,7\" con TruEcho CHIRP."),
                pendiente("sonar-omnidireccional", "Sonar omnidireccional", "Sonar", pesca, furuno,
                        "Deteccion de cardumenes en 360 grados."),
                pendiente("radar-banda-x", "Radar banda X", "Radar", nav, furuno,
                        "Radar de navegacion para embarcaciones menores y mayores."),
                pendiente("gps-plotter", "GPS / Ploter", "GPS / Ploter", nav, furuno,
                        "Posicionamiento y cartografia electronica."),
                pendiente("piloto-automatico", "Piloto automatico", "Piloto automatico", nav, furuno,
                        "Gobierno automatico de rumbo."),
                pendiente("pantalla-multifuncion", "Pantalla multifuncion", "Pantalla multifuncion", nav, furuno,
                        "Integra sonda, radar y cartografia en una sola pantalla."),
                pendiente("radio-vhf", "Radio VHF", "Radiotelefono", com, marca("icom"),
                        "Comunicacion en banda marina VHF con LSD."),
                pendiente("radio-hf", "Radio HF / SSB", "Radiotelefono", com, marca("icom"),
                        "Comunicacion de largo alcance en banda marina HF."),
                pendiente("comunicacion-satelital", "Comunicacion satelital", "Satelital", com, furuno,
                        "Voz y datos fuera de cobertura costera."),
                pendiente("transponder-ais", "Transpondedor AIS", "AIS", com, furuno,
                        "Identificacion automatica de embarcaciones."),
                pendiente("radiobaliza-epirb", "Radiobaliza RLS / EPIRB", "Emergencia", seg, marca("acr"),
                        "Baliza de emergencia con posicionamiento satelital."),
                pendiente("registrador-vdr", "Registrador VDR", "VDR", seg, furuno,
                        "Registro de datos de travesia segun normativa."),
                pendiente("transductor-chirp", "Transductor CHIRP", "Transductor", acc, furuno,
                        "Transductor de banda ancha para sondas CHIRP."),
                pendiente("antena-gps", "Antena GPS", "Antena", acc, furuno,
                        "Antena receptora para sistemas de posicionamiento."),
                pendiente("cableado-conectores", "Cableado y conectores", "Instalacion", acc, furuno,
                        "Insumos de instalacion para electronica marina."),
                pendiente("sensores-captura", "Sensores de captura", "Monitoreo de arte", pesca, marca("marport"),
                        "Monitoreo en tiempo real del arte de pesca y del volumen capturado."),
                pendiente("ploter-cartografico", "Ploter cartografico", "GPS / Ploter", nav, marca("garmin"),
                        "Navegacion con cartografia integrada para embarcaciones menores.")));

        log.info("Catalogo inicial cargado: {} productos.", productos.count());
    }

    // ----- apoyo -----

    private Producto base(String slug, String nombre, String subcategoria, Categoria c, Marca m) {
        Producto p = new Producto();
        p.setSlug(slug);
        p.setNombre(nombre);
        p.setSubcategoria(subcategoria);
        p.setCategoria(c);
        p.setMarca(m);
        p.setImagenUrl(null);   // sin imagenes por ahora
        return p;
    }

    private Producto pendiente(String slug, String nombre, String sub, Categoria c, Marca m, String resumen) {
        Producto p = base(slug, nombre, sub, c, m);
        p.setResumen(resumen);
        p.setDescripcion("Ficha por completar con la informacion oficial del fabricante.");
        p.setCompleto(false);
        return p;
    }

    private Categoria cat(String slug) {
        return categorias.findBySlug(slug).orElseThrow();
    }

    private Marca marca(String slug) {
        return marcas.findBySlug(slug).orElseThrow();
    }
}
