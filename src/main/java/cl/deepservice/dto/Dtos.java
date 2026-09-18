package cl.deepservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
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

    public record RegistroRequest(
            @NotBlank(message = "El nombre es obligatorio") @Size(max = 150) String nombre,
            @NotBlank(message = "El correo es obligatorio") @Email(message = "Correo invalido") String correo,
            @NotBlank(message = "La contrasena es obligatoria")
            @Size(min = 8, message = "La contrasena debe tener al menos 8 caracteres") String contrasena,
            String telefono,
            String empresa) { }

    public record UsuarioResponse(Long id, String nombre, String correo, String empresa, List<String> roles) { }

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
