package cl.deepservice.dto;

import cl.deepservice.model.TipoMovimiento;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.OffsetDateTime;
import java.util.List;

/** Contratos de entrada y salida de la API, agrupados para mantenerlos a la vista. */
public final class Dtos {

    private Dtos() { }

    // ----- Autenticacion -----
    public record LoginRequest(
            @NotBlank(message = "El correo es obligatorio") @Email(message = "Correo invalido")
            @Size(max = 180) String correo,
            @NotBlank(message = "La contrasena es obligatoria") @Size(max = 200) String contrasena) { }

    public record LoginResponse(String token, UsuarioResponse usuario) { }

    /**
     * Contrasena estandar: 8 a 72 caracteres (72 es el limite de BCrypt), con minuscula,
     * mayuscula, numero y simbolo, y sin espacios. Debe coincidir con src/utils/clave.js.
     */
    public static final String REGEX_CONTRASENA =
            "^(?=.*\\p{Ll})(?=.*\\p{Lu})(?=.*\\d)(?=.*[^\\p{L}\\d\\s])\\S{8,72}$";

    /** Alta de un administrador. El codigo lo entrega quien administra el sitio. */
    public record RegistroAdminRequest(
            @NotBlank(message = "El nombre es obligatorio") @Size(max = 150) String nombre,
            @NotBlank(message = "El correo es obligatorio") @Email(message = "Correo invalido")
            @Size(max = 180) String correo,
            @NotBlank(message = "La contrasena es obligatoria")
            @Pattern(regexp = REGEX_CONTRASENA,
                    message = "La contrasena debe tener entre 8 y 72 caracteres, con mayuscula, minuscula, numero y simbolo, y sin espacios")
            String contrasena,
            @NotBlank(message = "El codigo de autorizacion es obligatorio") @Size(max = 200) String codigo) { }

    /** Cambio de contrasena desde el panel: exige la actual para que una sesion robada no baste. */
    public record CambioClaveRequest(
            @NotBlank(message = "Escribe tu contrasena actual") @Size(max = 200) String actual,
            @NotBlank(message = "La contrasena nueva es obligatoria")
            @Pattern(regexp = REGEX_CONTRASENA,
                    message = "La contrasena debe tener entre 8 y 72 caracteres, con mayuscula, minuscula, numero y simbolo, y sin espacios")
            String nueva) { }

    /** {@code claveInicial}: la cuenta sigue con la contrasena publicada en la primera version del sitio. */
    public record UsuarioResponse(
            Long id, String nombre, String correo, String empresa, List<String> roles,
            OffsetDateTime fechaCreacion, boolean bienvenidaVista, boolean claveInicial) { }

    // ----- Catalogo (publico) -----
    public record CategoriaResponse(Long id, String slug, String nombre, String descripcion, String icono, long totalProductos) { }

    public record MarcaResponse(Long id, String slug, String nombre, String descripcion, String logoUrl, boolean destacada, long totalProductos) { }

    public record EspecificacionDto(
            @NotBlank(message = "La caracteristica necesita un nombre") @Size(max = 120) String clave,
            @NotBlank(message = "La caracteristica necesita un valor") @Size(max = 300) String valor,
            Integer orden) { }

    public record ProductoResumen(
            Long id, String slug, String nombre, String subcategoria, String resumen,
            String categoria, String marca, String imagenUrl, boolean destacado, boolean completo) { }

    public record ProductoDetalle(
            Long id, String slug, String nombre, String subcategoria, String resumen, String descripcion,
            String categoria, String marca, String imagenUrl, boolean destacado, boolean completo,
            List<EspecificacionDto> especificaciones) { }

    /**
     * Lo unico que el sitio publico necesita saber del panel: que equipos estan activos y cuales se
     * dieron de baja. No incluye existencias ni ningun dato interno.
     */
    public record EstadoCatalogo(List<ProductoDetalle> activos, List<String> ocultos) { }

    // ----- Catalogo (panel) -----
    public record ProductoRequest(
            @NotBlank(message = "El identificador es obligatorio") @Size(max = 140)
            @Pattern(regexp = "^[a-z0-9]+(-[a-z0-9]+)*$",
                    message = "El identificador solo admite minusculas, numeros y guiones")
            String slug,
            @NotBlank(message = "El nombre es obligatorio") @Size(max = 160) String nombre,
            @Size(max = 120) String subcategoria,
            @Size(max = 600) String resumen,
            @Size(max = 4000) String descripcion,
            @Size(max = 500)
            @Pattern(regexp = "^$|^(/|https://)[^\\s<>\"']*$",
                    message = "La imagen debe ser una ruta del sitio (/productos/...) o una direccion https")
            String imagenUrl,
            @NotBlank(message = "La categoria es obligatoria") @Size(max = 60) String categoria,
            @NotBlank(message = "La marca es obligatoria") @Size(max = 60) String marca,
            Boolean destacado, Boolean completo, Boolean activo,
            @Size(max = 60, message = "Maximo 60 caracteristicas") List<@Valid EspecificacionDto> especificaciones) { }

    public record ProductoAdmin(
            Long id, String slug, String nombre, String subcategoria, String resumen, String descripcion,
            String categoria, String marca, String imagenUrl, boolean destacado, boolean completo,
            boolean activo, List<EspecificacionDto> especificaciones) { }

    public record ActivoRequest(@NotNull(message = "Indica si el equipo queda activo") Boolean activo) { }

    // ----- Inventario (panel) -----
    public record InventarioItem(
            Long productoId, String slug, String nombre, String subcategoria, String categoria, String marca,
            boolean activo, int stock, int stockMinimo, OffsetDateTime actualizadoEn) { }

    public record MovimientoRequest(
            @NotNull(message = "Indica el tipo de movimiento") TipoMovimiento tipo,
            @NotNull(message = "Indica la cantidad") @Min(value = 0, message = "La cantidad no puede ser negativa")
            @Max(value = 1_000_000, message = "La cantidad es demasiado alta") Integer cantidad,
            @Size(max = 200, message = "El motivo admite hasta 200 caracteres") String motivo) { }

    public record MinimoRequest(
            @NotNull(message = "Indica el stock minimo") @Min(value = 0, message = "No puede ser negativo")
            @Max(value = 1_000_000, message = "El valor es demasiado alto") Integer stockMinimo) { }

    public record MovimientoResponse(
            Long id, Long productoId, String tipo, int cantidad, int stockResultante,
            String motivo, String usuario, OffsetDateTime fecha) { }

    // ----- Contacto -----
    public record ContactoRequest(
            @NotBlank(message = "El nombre es obligatorio") @Size(max = 150) String nombre,
            @Size(max = 150) String empresa,
            @NotBlank(message = "El correo es obligatorio") @Email(message = "Correo invalido")
            @Size(max = 180) String correo,
            @Size(max = 30) String telefono,
            @Size(max = 180) String embarcacion,
            @Size(max = 80) String interes,
            @Size(max = 140) String productoSlug,
            @NotBlank(message = "El mensaje es obligatorio")
            @Size(min = 10, max = 4000, message = "El mensaje debe tener entre 10 y 4000 caracteres") String mensaje) { }

    public record ContactoResponse(
            Long id, String nombre, String empresa, String correo, String telefono,
            String embarcacion, String interes, String productoSlug, String mensaje,
            boolean atendida, OffsetDateTime fechaCreacion) { }

    // ----- Errores -----
    public record ErrorResponse(OffsetDateTime fecha, int status, String mensaje, List<String> detalles) { }
}
