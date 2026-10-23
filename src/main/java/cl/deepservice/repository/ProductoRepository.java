package cl.deepservice.repository;

import cl.deepservice.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductoRepository extends JpaRepository<Producto, Long> {

    Optional<Producto> findBySlug(String slug);

    boolean existsBySlug(String slug);

    /**
     * Búsqueda del catálogo público: filtros opcionales por categoría, marca y texto.
     *
     * Los parámetros nunca llegan como null: un texto vacío ('') significa "sin filtro".
     * PostgreSQL no sabe qué tipo darle a un parámetro null dentro de LOWER/CONCAT y la
     * consulta fallaba justo en el caso más común (listar todo sin buscar nada).
     * {@code patron} llega ya en minúsculas y con los comodines puestos: "%texto%".
     */
    @Query("""
           SELECT DISTINCT p FROM Producto p
           JOIN FETCH p.categoria c
           JOIN FETCH p.marca m
           WHERE p.activo = true
             AND (:categoria = '' OR c.slug = :categoria)
             AND (:marca = '' OR m.slug = :marca)
             AND (:patron = ''
                  OR LOWER(p.nombre) LIKE :patron
                  OR LOWER(COALESCE(p.resumen, '')) LIKE :patron
                  OR LOWER(m.nombre) LIKE :patron)
           ORDER BY p.destacado DESC, p.nombre ASC
           """)
    List<Producto> buscar(@Param("categoria") String categoria,
                          @Param("marca") String marca,
                          @Param("patron") String patron);

    /** Ficha pública: solo equipos activos (un equipo dado de baja deja de verse). */
    Optional<Producto> findBySlugAndActivoTrue(String slug);

    /** Panel de administración: todos los equipos, activos o no, con su ficha completa. */
    @Query("""
           SELECT DISTINCT p FROM Producto p
           JOIN FETCH p.categoria
           JOIN FETCH p.marca
           LEFT JOIN FETCH p.especificaciones
           ORDER BY p.nombre ASC
           """)
    List<Producto> listarTodosConDetalle();

    /** Inventario: todos los equipos con su categoría y marca, sin la ficha técnica. */
    @Query("""
           SELECT p FROM Producto p
           JOIN FETCH p.categoria
           JOIN FETCH p.marca
           ORDER BY p.nombre ASC
           """)
    List<Producto> listarConClasificacion();

    /** Identificadores de los equipos dados de baja (el sitio público los oculta). */
    @Query("SELECT p.slug FROM Producto p WHERE p.activo = false ORDER BY p.slug")
    List<String> slugsInactivos();

    long countByCategoriaSlug(String slug);

    long countByMarcaSlug(String slug);
}
