package cl.deepservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.OffsetDateTime;
import java.util.List;

/** Contratos de entrada y salida de la API, agrupados para mantenerlos a la vista. */
public final class Dtos {

    private Dtos() { }

    // ----- Autenticacion -----
    public record LoginRequest(
            @NotBlank(message = "El correo es obligatorio") @Email(message = "Correo invalido") String correo,
            @NotBlank(message = "La contrasena es obligatoria") String contrasena) { }

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

    public record UsuarioResponse(
            Long id, String nombre, String correo, String empresa, List<String> roles,
            OffsetDateTime fechaCreacion, boolean bienvenidaVista) { }

    // ----- Catalogo -----
    public record CategoriaResponse(Long id, String slug, String nombre, String descripcion, String icono, long totalProductos) { }

    public record MarcaResponse(Long id, String slug, String nombre, String descripcion, String logoUrl, boolean destacada, long totalProductos) { }

    public record EspecificacionDto(String clave, String valor, Integer orden) { }

    public record ProductoResumen(
            Long id, String slug, String nombre, String subcategoria, String resumen,
            String categoria, String marca, String imagenUrl, boolean destacado, boolean completo) { }

    public record ProductoDetalle(
            Long id, String slug, String nombre, String subcategoria, String resumen, String descripcion,
            String categoria, String marca, String imagenUrl, boolean destacado, boolean completo,
            List<EspecificacionDto> especificaciones) { }

    public record ProductoRequest(
            @NotBlank(message = "El slug es obligatorio") String slug,
            @NotBlank(message = "El nombre es obligatorio") String nombre,
            String subcategoria, String resumen, String descripcion, String imagenUrl,
            @NotBlank(message = "La categoria es obligatoria") String categoria,
            @NotBlank(message = "La marca es obligatoria") String marca,
            Boolean destacado, Boolean completo,
            List<EspecificacionDto> especificaciones) { }

    // ----- Contacto -----
    public record ContactoRequest(
            @NotBlank(message = "El nombre es obligatorio") @Size(max = 150) String nombre,
            String empresa,
            @NotBlank(message = "El correo es obligatorio") @Email(message = "Correo invalido") String correo,
            String telefono, String embarcacion, String interes, String productoSlug,
            @NotBlank(message = "El mensaje es obligatorio")
            @Size(min = 10, message = "Cuentanos un poco mas de detalle") String mensaje) { }

    public record ContactoResponse(
            Long id, String nombre, String empresa, String correo, String telefono,
            String embarcacion, String interes, String productoSlug, String mensaje,
            boolean atendida, OffsetDateTime fechaCreacion) { }

    // ----- Errores -----
    public record ErrorResponse(OffsetDateTime fecha, int status, String mensaje, List<String> detalles) { }
}
