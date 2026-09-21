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
 * Fichas completas (con imagen y especificaciones verificadas contra la
 * documentación oficial Furuno): FCV-800, CH-500, CSH-5L MARK-2 y MODEL 1815.
 * El resto queda como "ficha en preparación" (imagenUrl en null). Los datos
 * son los mismos de src/data/catalogo.js, que es lo que muestra el sitio.
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
        fcv800.setImagenUrl("/productos/furuno-fcv-800/01.webp");
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

        // --- Fichas completas verificadas contra la documentacion oficial Furuno ---
        //     (mismos datos que src/data/catalogo.js)
        productos.saveAll(List.of(
                ficha("furuno-ch-500", "CH-500", "Sonar de búsqueda", pesca, furuno,
                        "Sonar de búsqueda (searchlight) con pantalla LCD color de 12,1\" y frecuencias de 60 a 240 kHz: giro del haz ultrarrápido y ecos de alta resolución.",
                        "Sonar de búsqueda de Furuno con pantalla LCD color de 12,1\" XGA. Su motor más rápido y sus seis ángulos de paso seleccionables barren sectores de 24° a 360° en pocos segundos, y los sensores de movimiento integrados —primeros en su clase— estabilizan la imagen cuando la embarcación cabecea y rola, para no perder cardúmenes con mar gruesa.",
                        "/productos/furuno-ch-500/01.webp",
                        new String[][] {
                        { "Pantalla", "12,1\" LCD color XGA" },
                        { "Frecuencia", "60 / 88 / 150 / 180 / 240 kHz" },
                        { "Escala horizontal", "10 a 2.400 m" },
                        { "Resolución de pantalla", "1024 × 768 (XGA), brillo 0,5 a 950 cd/m²" },
                        { "Escala vertical", "10 a 600 m (15 escalas)" },
                        { "Potencia de salida", "0,8 a 1,5 kW según la frecuencia, con función de reducción de potencia" },
                        { "Longitud de pulso", "0,2 a 20,0 ms, según la escala" },
                        { "TVG", "Nivel 100 dB máx., distancia 1.000 m máx." },
                        { "Colores de eco", "32, 16 u 8 colores (seleccionable)" },
                        { "Modos de presentación", "11 modos: horizontal, horizontal ampliado, vertical, A-scope de círculo completo, ecosonda, historial y sus combinaciones" },
                        { "Barrido horizontal", "Sector de 6° a 360°; paso de giro de 6°, 12°, 15°, 18°, 21° o 24°" },
                        { "Inclinación", "−5° a +90°, en pasos de 1°" },
                        { "Barrido vertical", "Sector de 6° a 180°; paso normal 3°, rápido 6°" },
                        { "Ancho de haz (−3 dB, H / V)", "60 kHz 15°/12° · 88 kHz 12°/10° · 150 kHz 7°/7° · 180 kHz 7°/8° · 240 kHz 6°/6°" },
                        { "Estabilización", "Sensor de movimiento integrado (de serie)" },
                        { "Unidad de casco", "Carrera del transductor 400 mm (CH-504) o 250 mm (CH-505), en versión de 6\" u 8\"" },
                        { "Subida / bajada", "30 s con carrera de 400 mm; 20 s con carrera de 250 mm" },
                        { "Velocidad máxima del barco", "20 nudos (15 nudos durante la subida o bajada)" },
                        { "Interfaces", "Salida de video HDMI (XGA), 2 puertos NMEA 0183, 1 puerto NMEA 2000, 1 KP externo" },
                        { "Salida de audio", "2 W (8 Ω), 0,9 a 1,2 kHz (requiere altavoz externo)" },
                        { "Alimentación", "Pantalla, control y transceptor: 12–24 V CC (4,7–2,3 A). Unidad de casco: 12/24 V CC (2,2/1,1 A; 7,2/3,6 A al subir)" },
                        { "Protección", "Pantalla y control IP55 · Transceptor y unidad de casco IP22" },
                        { "Temperatura de operación", "Pantalla, transceptor y control −15 °C a +55 °C · Casco 0 °C a +55 °C · Transductor 0 °C a +35 °C" },
                        { "Equipo estándar", "Pantalla MU-121C, unidad de control CH-502, transceptor CH-503 y unidad de casco CH-504 o CH-505" },
                        { "Opcionales", "Control remoto CH-256, rectificador RU-1746B-2 (100–230 V CA), altavoz CA-151S-ASSY, tanque de retracción" } }),
                ficha("furuno-csh-5l-mark-2", "CSH-5L MARK-2", "Sonar de círculo completo", pesca, furuno,
                        "Sonar color de exploración multihaz en círculo completo: transmite en 360° a la vez y muestra cardúmenes y fondo alrededor del barco sin esperar el giro del haz.",
                        "Sonar de exploración en círculo completo de Furuno, con transmisor de alta potencia para detectar pesca a larga distancia y seguir los cambios del fondo. Presenta los ecos en 16 colores sobre un monitor XGA y, en una escala de 1.000 pies, actualiza los 360° cada 0,54 s, frente a unos 32 s de un sonar PPI convencional. La exploración con inclinación automática y la búsqueda por audio lo hacen especialmente apto para arrastreros pelágicos y cerqueros.",
                        "/productos/furuno-csh-5l-mark-2/01.webp",
                        new String[][] {
                        { "Pantalla", "15\" LCD MU-152HD o monitor XGA" },
                        { "Frecuencia", "55 o 68 kHz" },
                        { "Escalas", "50 a 1.600 m" },
                        { "Resolución de pantalla", "1024 × 768 (XGA)" },
                        { "Escalas disponibles", "50, 85, 100, 200, 250, 300, 350, 400, 450, 500, 600, 800, 1.000, 1.200 y 1.600 m" },
                        { "Colores", "Exploración y eco: 16 colores · marcas: 1 color" },
                        { "Modos de operación", "Exploración simple; exploración + ecosonda (requiere ecosonda); exploración + búsqueda por audio" },
                        { "Inclinación", "Manual de 0° a 55° en pasos de 1°; exploración automática de 4° a 52°" },
                        { "Actualización 360°", "Cada 0,54 s en escala de 1.000 pies (≈ 300 m)" },
                        { "Velocidad máxima del barco", "18 nudos (subida o bajada hasta 16 nudos)" },
                        { "Unidad de casco", "Carrera de 400 mm (70 kg) o 600 mm (75 kg)" },
                        { "Interfaz", "Entrada y salida NMEA 0183; salida de video RGB analógica" },
                        { "Alimentación", "115/230 V CA, 50–60 Hz, 0,4 kVA (1 kVA al subir), o 24 V CC con inversor opcional TR-2451" },
                        { "Pesos", "Procesador 3,4 kg · Control 3,5 kg · Transceptor 20 kg" },
                        { "Equipo estándar", "Procesador CSH-5210-A, control CSH-5211-A, transceptor CSH-5130-A-5L, preamplificador CSH-5020-A y unidad de casco" },
                        { "Opcionales", "Sensor de movimiento MS-100, control remoto CSH-7040, altavoz SEM-21Q, interfaz de ecosonda VI-1100A, inversor TR-2451, tanque de retracción OP10-5" } }),
                ficha("furuno-model-1815", "MODEL 1815", "Radar", nav, furuno,
                        "Radar LCD color de 8,4\" con antena radomo de 4 kW y hasta 36 MN: ganancia totalmente automática y seguimiento de blancos para embarcaciones de recreo y pesqueros pequeños.",
                        "Radar compacto de Furuno para embarcaciones de recreo y pesqueros pequeños. Sus pulsos estrechos y el doble ancho de banda de FI entregan imágenes detalladas de la costa y de los blancos a corta distancia, incluso con tormenta o niebla. Incorpora Fast Target Tracking™, estela verdadera y vista verdadera, y su pantalla estanca permite instalarlo en puentes volantes expuestos.",
                        "/productos/furuno-model-1815/01.webp",
                        new String[][] {
                        { "Pantalla", "8,4\" LCD color VGA" },
                        { "Potencia de salida", "4 kW" },
                        { "Escalas", "0,0625 a 36 MN" },
                        { "Resolución de pantalla", "480 × 640 (VGA); área útil 128,2 × 170,9 mm" },
                        { "Antena", "Radomo de 488 mm (19\"), 24 rpm" },
                        { "Frecuencia", "9.410 ± 30 MHz (banda X)" },
                        { "Ancho de haz", "Horizontal 5,2°, vertical 25°" },
                        { "Escalas disponibles", "0,0625 · 0,125 · 0,25 · 0,5 · 0,75 · 1 · 1,5 · 2 · 3 · 4 · 6 · 8 · 12 · 16 · 24 · 36 MN" },
                        { "Distancia mínima", "25 m (discriminación en distancia: 25 m)" },
                        { "Precisión", "Distancia: 1 % de la escala o 0,01 MN, lo que sea mayor · Demora: ±1°" },
                        { "Modos de presentación", "Proa arriba; rumbo arriba, norte arriba y vista verdadera (requieren dato de rumbo); movimiento verdadero (requiere rumbo y posición)" },
                        { "Seguimiento de blancos (TT)", "Hasta 10 blancos (requiere dato de rumbo)" },
                        { "AIS", "Hasta 100 blancos (requiere rumbo y posición)" },
                        { "Estelas de eco", "Verdaderas (requiere rumbo) o relativas; 15 s, 30 s, 1, 3, 6, 15 o 30 min, o continua" },
                        { "Interfaz", "NMEA 0183" },
                        { "Multiestación", "Hasta 3 pantallas RDP-157 con una sola antena, mediante hub Ethernet" },
                        { "Alimentación", "12–24 V CC, 3,2–1,6 A (38 W máx.)" },
                        { "Protección", "Pantalla IP56 · Antena IP26" },
                        { "Temperatura de operación", "Antena −25 °C a +55 °C · Pantalla −15 °C a +55 °C" },
                        { "Pesos", "Antena 6,5 kg · Pantalla 2,2 kg (con soporte) o 1,6 kg (empotrada)" },
                        { "Equipo estándar", "Pantalla RDP-157, antena RSB-127-120, cable de antena de 5, 10, 15, 20 o 30 m y cable de alimentación de 3,3 m" },
                        { "Opcionales", "Soporte de antena OP03-209, zumbador externo OP-3-21, convertidor NMEA IF-NMEA2K2, kit de empotrado, hub Ethernet HUB-101" } })));

        // --- Estructura del catalogo: fichas por completar ---
        productos.saveAll(List.of(
                pendiente("furuno-fcv-600", "FCV-600", "Sonda de pesca", pesca, furuno,
                        "Sonda de pesca a color de 5,7\" con TruEcho CHIRP."),
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

    /** Ficha completa: destacada, con imagen y especificaciones en orden. */
    private Producto ficha(String slug, String nombre, String sub, Categoria c, Marca m,
                           String resumen, String descripcion, String imagen, String[][] specs) {
        Producto p = base(slug, nombre, sub, c, m);
        p.setDestacado(true);
        p.setCompleto(true);
        p.setResumen(resumen);
        p.setDescripcion(descripcion);
        p.setImagenUrl(imagen);
        int i = 0;
        for (String[] spec : specs) {
            p.agregarEspecificacion(new Especificacion(spec[0], spec[1], i++));
        }
        return p;
    }

    private Categoria cat(String slug) {
        return categorias.findBySlug(slug).orElseThrow();
    }

    private Marca marca(String slug) {
        return marcas.findBySlug(slug).orElseThrow();
    }
}
